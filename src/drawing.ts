/// <reference path="common.ts" />
/// <reference path="logging.ts" />
module Drawing {
	// const St = imports.gi.St;
	// const Cogl = imports.gi.Cogl;
	const Clutter = imports.gi.Clutter;
	const Cairo = imports.cairo;
	// const Shell = imports.gi.Shell;
	const PI = Math.PI;
	const TAO = 2 * PI;
	const floor = Math.floor;

	interface Grey {
		luminance: number
		alpha: number
	}
	interface Color {
		r: number
		g: number
		b: number
		a: number
	}

	export const enum Action {
		CANCEL,
		MINIMIZE,
		RESIZE
	}

	const enum MouseMode {
		MENU,
		RESIZE,
		MOVE,
		NOOP
	}

	const enum Location {
		LEFT = 0,
		TOPLEFT,
		TOP,
		TOPRIGHT,
		RIGHT,
		BOTTOMRIGHT,
		BOTTOM,
		BOTTOMLEFT,
	}

	// function stringOfLocation(loc: Location): string {
	// 	switch(loc) {
	// 		case Location.LEFT: return 'LEFT';
	// 		case Location.TOPLEFT: return 'TOPLEFT';
	// 		case Location.TOP: return 'TOP';
	// 		case Location.TOPRIGHT: return 'TOPRIGHT';
	// 		case Location.RIGHT: return 'RIGHT';
	// 		case Location.BOTTOMRIGHT: return 'BOTTOMRIGHT';
	// 		case Location.BOTTOM: return 'BOTTOM';
	// 		case Location.BOTTOMLEFT: return 'BOTTOMLEFT';
	// 		default: return '<unknown>';
	// 	}
	// }

	export function oppose(loc: Location): Location {
		return (loc + 4) % 8; // Magic!
	}

	const enum InnerSelection {
		MAXIMIZE = 0,
		MINIMIZE
	}

	const enum Ring {
		NONE = 0,
		INNER,
		OUTER
	}

	const enum Axis {
		x = 'x',
		y = 'y'
	}

	interface Selection {
		ring: Ring
		index: number
	}

	module Point {
		export function scale(scale: Point, p: Point): Point {
			return {
				x: floor(p.x * scale.x),
				y: floor(p.y * scale.y)
			}
		}

		export function scaleConstant(scale: number, p: Point): Point {
			return {
				x: floor(p.x * scale),
				y: floor(p.y * scale)
			}
		}

		export function copy(p: Point): Point {
			return { x: p.x, y: p.y };
		}

		export function add(a: Point, b: Point): Point {
			return {
				x: a.x + b.x,
				y: a.y + b.y
			}
		}

		export function scaleAxis(axis: Axis, scale: number, p: Point): Point {
			const ret = copy(p);
			ret[axis] = floor(p[axis] * scale);
			return ret;
		}

		export function subtract(a: Point, b: Point): Point {
			return {
				x: a.x - b.x,
				y: a.y- b.y
			}
		}

		export const ZERO = { x: 0, y: 0 };

		export function ofEvent(event: any, origin: Point): Point {
			const [absx,absy] = event.get_coords();
			if (origin == null) {
				return { x: absx, y: absy };
			} else {
				const x = absx - origin.x;
				const y = absy - origin.y;
				return { x, y };
			}
		}
	}

	module Rect {
		export function copy(r: Rect): Rect {
			return { pos: Point.copy(r.pos), size: Point.copy(r.size) };
		}

		export function closestCorner(r: Rect, p: Point): Location {
			const pow = Math.pow;
			const sqrt = Math.sqrt;
			const near = r.pos;
			const far = { x: r.pos.x + r.size.x, y: r.pos.y + r.size.y };
			const tl = sqrt(pow(p.x - near.x, 2) + pow(p.y - near.y, 2));
			const tr = sqrt(pow(p.x -  far.x, 2) + pow(p.y - near.y, 2));
			const br = sqrt(pow(p.x -  far.x, 2) + pow(p.y -  far.y, 2));
			const bl = sqrt(pow(p.x - near.x, 2) + pow(p.y -  far.y, 2));
			const corners = [tl, tr, bl, br];
			log("Closest corners: " + JSON.stringify(corners));
			corners.sort(function(a,b) { return a - b });
			log("Closest corners (sorted): " + JSON.stringify(corners));
			const min = corners[0];
			if (min == tl) return Location.TOPLEFT;
			if (min == tr) return Location.TOPRIGHT;
			if (min == br) return Location.BOTTOMRIGHT;
			return Location.BOTTOMLEFT;
		}
	}

	module Selection {
		export const None: Selection = { ring: Ring.NONE, index: 0 }

		export function eq(a: Selection, b: Selection) {
			return a.ring == b.ring && a.index == b.index;
		}
		export function eqTo(a: Selection, ring: Ring, location: number) {
			return a.ring == ring && a.index == location;
		}
	}

	function floatColor(c: Color): Color {
		return {
			r: c.r / 255,
			g: c.g / 255,
			b: c.b / 255,
			a: c.a / 255,
		}
	}

	class MenuHandlers {
		draw: Function
		onMouseMove: (mode: MouseMode, event: any) => void
		private origin: Point
		private currentMouseRelative: Point
		private selection: Selection

		constructor(menuSize: Point, origin: Point, canvas: any, preview: LayoutPreview) {
			this.currentMouseRelative = Point.ZERO;
			this.origin = origin;

			const HALF : Point = Point.scaleConstant(0.5, menuSize);
			const BORDER_WIDTH = floor(menuSize.x * 0.03);
			const OUTER_RADIUS = floor(menuSize.x / 2) - BORDER_WIDTH;
			const MID_RADIUS = floor(OUTER_RADIUS * 0.3);
			const INNER_RADIUS = floor(OUTER_RADIUS * 0.1);
			const GAP_WIDTH = floor(OUTER_RADIUS * 0.05);
			const HALF_GAP_WIDTH = floor(GAP_WIDTH / 2);
			const EDGE_WIDTH = floor(OUTER_RADIUS * 0.34);
			const CORNER_WIDTH = floor(OUTER_RADIUS * 0.4);
			const CORNER_DISTANCE = floor(OUTER_RADIUS * 0.8);
			const GLYPH_WIDTH = floor(OUTER_RADIUS * 0.09);
			const GLYPH_THICKNESS = floor(OUTER_RADIUS * 0.03);
			const DARK = floatColor({ r: 18, g: 36, b: 48, a: 200 });
			const LIGHT = floatColor({ r: 66, g: 79, b: 92, a: 237 });
			const BG = { luminance: 0.7, alpha: 0.7 };
			// const ACTIVE = floatColor({ r: 123, g: 189, b: 226, a: 255 });
			const ACTIVE = floatColor({ r: 45, g: 155, b: 203, a: 255 });

			const ANGLE_HALF = PI;
			const ANGLE_QUARTER = ANGLE_HALF / 2;
			const ANGLE_EIGHTH = ANGLE_QUARTER / 2;
			const ANGLE_SIXTEENTH = ANGLE_EIGHTH / 2;

			const UNSELECTED = { ring: 0, index: 0 }

			this.selection = Selection.None;
			const self = this;

			function setGrey(cr: any, grey: Grey) {
				cr.setSourceRGBA(grey.luminance, grey.luminance, grey.luminance, grey.alpha);
			}
			function setColor(cr: any, c: Color) {
				cr.setSourceRGBA(c.r, c.g, c.b, c.a);
			}

			function activeColor(cr: any, selection: Selection, ring: Ring, location: number) {
				if (Selection.eqTo(selection, ring, location)) {
					setColor(cr, ACTIVE);
				} else {
					setColor(cr, DARK);
				}
			}

			function activeColorInner(cr: any, selection: Selection, location: InnerSelection) {
				activeColor(cr, selection, Ring.INNER, location)
			}

			function activeColorOuter(cr: any, selection: Selection, location: Location) {
				activeColor(cr, selection, Ring.OUTER, location)
			}

			this.draw = function draw(_canvas: any, cr: any, _width: number, _height: number) {
				const selection = self.selection;
				// reset surface
				cr.save();
				cr.setOperator(Cairo.Operator.CLEAR);
				cr.paint();
				cr.restore();

				// log("drawing! (radius = " + OUTER_RADIUS + ", selection = " + JSON.stringify(self.selection) + ")"); cr.save();
				// border (/backing fill)
				cr.arc(HALF.x, HALF.y, OUTER_RADIUS + BORDER_WIDTH, 0, TAO);
				setGrey(cr, BG);
				cr.fill();


				cr.save();
				cr.rectangle(0, 0, menuSize.x, menuSize.y);

				// draw everything (from now on) around the origin
				cr.translate(HALF.x, HALF.y);

				// horizontal clips: just keep drawing the same rect and rotating it..
				cr.rotate(ANGLE_SIXTEENTH);
				cr.rectangle(HALF.x, - HALF_GAP_WIDTH, - menuSize.x, GAP_WIDTH);
				cr.rotate(ANGLE_EIGHTH);
				cr.rectangle(HALF.x, - HALF_GAP_WIDTH, - menuSize.x, GAP_WIDTH);
				cr.rotate(ANGLE_EIGHTH);
				cr.rectangle(HALF.x, - HALF_GAP_WIDTH, - menuSize.x, GAP_WIDTH);
				cr.rotate(ANGLE_EIGHTH);
				cr.rectangle(HALF.x, - HALF_GAP_WIDTH, - menuSize.x, GAP_WIDTH);
				cr.rotate(ANGLE_SIXTEENTH);
				cr.clip();

				// reset rotation
				cr.rotate(PI);


				// outer fill
				cr.arc(0, 0, OUTER_RADIUS - ((OUTER_RADIUS - MID_RADIUS) / 2), 0, TAO);
				setColor(cr, LIGHT);
				cr.setLineWidth(OUTER_RADIUS - MID_RADIUS - (GAP_WIDTH/2));
				cr.stroke();

				cr.arc(0, 0, OUTER_RADIUS, 0, TAO);
				cr.clip();


				// outer edge fills (top / left / right / bottom)
				cr.setLineWidth(EDGE_WIDTH);

				// right edge
				cr.arc(0, 0, OUTER_RADIUS - (EDGE_WIDTH/2), -ANGLE_SIXTEENTH, ANGLE_SIXTEENTH);
				activeColorOuter(cr, selection, Location.RIGHT);
				cr.stroke();

				// left edge
				cr.arc(0, 0, OUTER_RADIUS - (EDGE_WIDTH/2), ANGLE_HALF - ANGLE_SIXTEENTH, ANGLE_HALF + ANGLE_SIXTEENTH);
				activeColorOuter(cr, selection, Location.LEFT);
				cr.stroke();

				// bottom edge
				cr.arc(0, 0, OUTER_RADIUS - (EDGE_WIDTH/2), ANGLE_QUARTER - ANGLE_SIXTEENTH, ANGLE_QUARTER + ANGLE_SIXTEENTH);
				activeColorOuter(cr, selection, Location.BOTTOM);
				cr.stroke();

				// top edge
				cr.arc(0, 0, OUTER_RADIUS - (EDGE_WIDTH/2), -ANGLE_QUARTER - ANGLE_SIXTEENTH, -ANGLE_QUARTER + ANGLE_SIXTEENTH);
				activeColorOuter(cr, selection, Location.TOP);
				cr.stroke();


				// corner shades:
				cr.arc(CORNER_DISTANCE, CORNER_DISTANCE, CORNER_WIDTH, 0, TAO);
				activeColorOuter(cr, selection, Location.BOTTOMRIGHT);
				cr.fill();

				cr.arc(-CORNER_DISTANCE, CORNER_DISTANCE, CORNER_WIDTH, 0, TAO);
				activeColorOuter(cr, selection, Location.BOTTOMLEFT);
				cr.fill();

				cr.arc(-CORNER_DISTANCE, -CORNER_DISTANCE, CORNER_WIDTH, 0, TAO);
				activeColorOuter(cr, selection, Location.TOPLEFT);
				cr.fill();

				cr.arc(CORNER_DISTANCE, -CORNER_DISTANCE, CORNER_WIDTH, 0, TAO);
				activeColorOuter(cr, selection, Location.TOPRIGHT);
				cr.fill();

				// mid buttons:
				cr.resetClip()
				cr.rectangle(-HALF.x, -HALF.y, menuSize.x, menuSize.y);
				cr.rectangle(HALF.x, - HALF_GAP_WIDTH, - menuSize.x, GAP_WIDTH);
				cr.clip();

				cr.setLineWidth(MID_RADIUS - INNER_RADIUS - HALF_GAP_WIDTH);
				cr.arc(0, 0, MID_RADIUS - ((MID_RADIUS - INNER_RADIUS) / 2) - HALF_GAP_WIDTH, 0, TAO);
				setColor(cr, LIGHT);
				cr.stroke();

				cr.arc(0, 0, MID_RADIUS - ((MID_RADIUS - INNER_RADIUS) / 2) - HALF_GAP_WIDTH, PI, TAO);
				activeColorInner(cr, selection, InnerSelection.MAXIMIZE);
				cr.stroke();

				cr.arc(0, 0, MID_RADIUS - ((MID_RADIUS - INNER_RADIUS) / 2) - HALF_GAP_WIDTH, 0, PI);
				activeColorInner(cr, selection, InnerSelection.MINIMIZE);
				cr.stroke();

				const glyphOffset = MID_RADIUS - ((MID_RADIUS-INNER_RADIUS + GAP_WIDTH)/2)
				cr.rectangle(-(GLYPH_WIDTH/2), -glyphOffset - (GLYPH_THICKNESS/2), GLYPH_WIDTH, GLYPH_THICKNESS);
				cr.rectangle(-(GLYPH_THICKNESS/2), -glyphOffset - (GLYPH_WIDTH/2), GLYPH_THICKNESS, GLYPH_WIDTH);
				cr.rectangle(-(GLYPH_WIDTH/2), glyphOffset - (GLYPH_THICKNESS/2), GLYPH_WIDTH, GLYPH_THICKNESS);
				setGrey(cr, BG);
				cr.fill();

				cr.restore();
				return Clutter.EVENT_STOP;
			}

			function updateSelection(newSelection: Selection) {
				if (!Selection.eq(self.selection, newSelection)) {
					p("updateSelection(" + JSON.stringify(newSelection) + ")");
					self.selection = newSelection;
					canvas.invalidate();
					preview.updateSelection(newSelection);
				}
			}

			function circularIndex(sections: number, offset: number) {
				const span = TAO / sections;
				return function(angle: number) {
					return floor((angle + PI + offset) / span) % sections;
				}
			}

			const innerIndex = circularIndex(2, 0);
			const outerIndex = circularIndex(8, ANGLE_SIXTEENTH);

			this.onMouseMove = function(mode: MouseMode, event: any) {
				const point = this.currentMouseRelative = Point.ofEvent(event, origin);
				if (mode !== MouseMode.MENU) {
					return;
				}
				const { x, y } = point;
				const radius = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
				const angle = Math.atan2(y, x);
				// log("radius = " + radius);
				// log("angle = " + angle);

				if (radius <= INNER_RADIUS) {
					updateSelection(UNSELECTED);
				} else if (radius < MID_RADIUS) {
					updateSelection({
						ring: Ring.INNER,
						index: innerIndex(angle),
					});
				} else {
					updateSelection({
						ring: Ring.OUTER,
						index: outerIndex(angle),
					});
				}
				return Clutter.EVENT_STOP;
			}

		}

		getSelection(): Selection {
			return this.selection;
		}

		getMousePosition(): Point {
			return Point.add(this.origin, this.currentMouseRelative);
		}
	}

	class LayoutPreview {
		private size: Point
		private bounds: Rect
		private base: Rect
		private preview: Rect
		private selection: Selection;
		private windowRect: Rect;
		ui: any
		resizeCorner: Location;
		trackingOrigin: Point;

		constructor(size: Point, windowRect: Rect) {
			this.size = size;
			this.ui = new Clutter.Actor();
			this.ui.set_background_color(new Clutter.Color({
				red: 80,
				green: 158,
				blue: 255,
				alpha: 125
			}));
			this.resizeCorner = null;
			this.selection = Selection.None;
			this.windowRect = windowRect;
			this.ui.hide();
		}

		private selectOuter(loc: Location): Rect {
			const size = this.size;
			switch (loc) {
				case Location.LEFT:
					return {
						pos: Point.ZERO,
						size: Point.scale({ x: 0.5, y: 1 }, size),
					}
				case Location.TOPLEFT:
					return {
						pos: Point.ZERO,
						size: Point.scaleConstant(0.5, size),
					}
				case Location.TOP:
					return {
						pos: Point.ZERO,
						size: Point.scale({ x: 1, y: 0.5 }, size),
					}
				case Location.TOPRIGHT:
					return {
						pos: Point.scale({ x: 0.5, y: 0 }, size),
						size: Point.scaleConstant(0.5, size),
					}
				case Location.RIGHT:
					return {
						pos: Point.scale({ x: 0.5, y: 0 }, size),
						size: Point.scale({ x: 0.5, y: 1 }, size),
					}
				case Location.BOTTOMRIGHT:
					return {
						pos: Point.scaleConstant(0.5, size),
						size: Point.scaleConstant(0.5, size),
					}
				case Location.BOTTOM:
					return {
						pos: Point.scale({ x: 0, y: 0.5 }, size),
						size: Point.scale({ x: 1, y: 0.5 }, size),
					}
				case Location.BOTTOMLEFT:
					return {
						pos: Point.scale({ x: 0, y: 0.5}, size),
						size: Point.scaleConstant(0.5, size),
					}
			}
			return null;
		}

		private selectInner(sel: InnerSelection): Rect {
			switch (sel) {
				case InnerSelection.MAXIMIZE:
					return {
						pos: Point.ZERO,
						size: this.size,
					}

				case InnerSelection.MINIMIZE:
				default:
					return null;
			}
		}

		trackMouse(_mode: MouseMode, origin: Point): boolean {
			switch (this.selection.ring) {
				case Ring.INNER:
					return false;

				case Ring.OUTER:
					this.resizeCorner = oppose(this.selection.index);
					break;

				case Ring.NONE:
					if (this.preview == null) {
						this.preview = this.windowRect;
					}
					this.updateUi();
					this.resizeCorner = Rect.closestCorner(this.preview, origin);
					break;
			}

			this.bounds = { pos: Point.ZERO, size: this.size };
			this.trackingOrigin = origin;
			this.base = this.preview; // capture whatever we have as a base
			return true;
		}

		resumeTracking(origin: Point) {
			this.base = this.preview;
			this.resizeCorner = Rect.closestCorner(this.preview, origin);
			this.trackingOrigin = origin;
		}

		onMouseMove(mode: MouseMode, event: any) {
			switch (mode) {
				case MouseMode.RESIZE:
					if (this.resizeCorner === null) {
						return;
					}
					var diff = Point.ofEvent(event, this.trackingOrigin);
					this.preview = LayoutPreview.applyResize(this.resizeCorner, diff, this.base, this.bounds);
					// p('move diff ' + JSON.stringify(diff)
					// 	+ ' (from origin ' + JSON.stringify(this.trackingOrigin) + ')'
					// 	+ ' turned base ' + JSON.stringify(this.base)
					// 	+ ' into rect ' + JSON.stringify(this.preview)
					// );
				break;

				case MouseMode.MOVE:
					var diff = Point.ofEvent(event, this.trackingOrigin);
					this.preview = LayoutPreview.applyMove(diff, this.base, this.bounds);
					// p('move diff ' + JSON.stringify(diff)
					// 	+ ' (from origin ' + JSON.stringify(this.trackingOrigin) + ')'
					// 	+ ' turned base ' + JSON.stringify(this.base)
					// 	+ ' into rect ' + JSON.stringify(this.preview)
					// );
				break;

				default:
					return;
			}
			this.updateUi();
		}

		static applyMove(diff: Point, base: Rect, bounds: Rect): Rect {
			const ret = Rect.copy(base);
			const scaled = Point.scaleConstant(MANIPULATION_SCALE, diff);
			// Note: this doesn't consider bounds.pos, it's assumed to be (0,0)
			ret.pos.x = Math.max(0, Math.min(ret.pos.x + scaled.x, bounds.size.x - ret.size.x));
			ret.pos.y = Math.max(0, Math.min(ret.pos.y + scaled.y, bounds.size.y - ret.size.y));
			return ret;
		}

		static applyResize(location: Location, diff: Point, base: Rect, bounds: Rect): Rect {
			const ret = Rect.copy(base);
			const scaled = Point.scaleConstant(MANIPULATION_SCALE, diff);
			function between(min: number, x: number, max: number): number {
				// p('between('+min+', '+x+', '+max+')');
				if (min > x) return min;
				if (max < x) return max;
				return x;
			}

			function moveNear(axis: Axis) {
				// minimum diff is enough to bring this edge to 0 (i.e. invert the current pos)
				// maximum diff is enough to bring this edge to ther other side of this rect, minus MINIMUM_SIZE
				// p('moveNear['+axis+']');
				const diff = between(-ret.pos[axis], scaled[axis], ret.size[axis] - MINIMUM_SIZE);
				ret.pos[axis] += diff;
				ret.size[axis] -= diff;
			}

			function moveFar(axis: Axis) {
				// minimum diff is enough to bring this edge to the other side of this rect, plus MINIMUM_SIZE
				// maximum diff is enough to bring this edge to the right bounds
				// p('moveFar['+axis+']');
				const diff = between(MINIMUM_SIZE - ret.size[axis], scaled[axis], bounds.size[axis] - ret.pos[axis] - ret.size[axis]);
				ret.size[axis] += diff;
			}

			switch (location) {
				case Location.LEFT:
					moveNear(Axis.x);
				break;

				case Location.TOPLEFT:
					moveNear(Axis.x);
					moveNear(Axis.y);
				break;
	
				case Location.TOP:
					moveNear(Axis.y);
				break;

				case Location.TOPRIGHT:
					moveNear(Axis.y);
					moveFar(Axis.x);
				break;

				case Location.RIGHT:
					moveFar(Axis.x);
				break;
					
				case Location.BOTTOMRIGHT:
					moveFar(Axis.x);
					moveFar(Axis.y);
				break;

				case Location.BOTTOM:
					moveFar(Axis.y);
				break;

				case Location.BOTTOMLEFT:
					moveNear(Axis.x);
					moveFar(Axis.y);
				break;

				default:
					throw new Error("unknown location: " + location);
			}

			return ret;
		}

		updateSelection(sel: Selection) {
			this.selection = sel;
			switch (sel.ring) {
				case Ring.OUTER:
					this.base = this.selectOuter(sel.index);
				break;

				case Ring.INNER:
					this.base = this.selectInner(sel.index);
				break;

				case Ring.NONE:
				default:
					this.base = null;
				break;
			}
			this.resetPreview();
		}

		private updateUi() {
			if (this.preview == null) {
				this.ui.hide();
			} else {
				this.ui.set_position(this.preview.pos.x, this.preview.pos.y);
				this.ui.set_size(this.preview.size.x, this.preview.size.y);
				this.ui.show();
			}
		}

		private resetPreview() {
			if (this.base == null) {
				this.preview = null;
			} else {
				this.preview = Rect.copy(this.base);
			}
			this.updateUi();
		}

		getRect():Rect { return this.preview; }
	}

	type FunctionActionRectVoid = (action:Action, rect:Rect) => void

	const MANIPULATION_SCALE = 2.2;
	const MINIMUM_SIZE = 20;

	export class Menu {
		ui: any;
		private parent: any;
		private preview: LayoutPreview;
		private onSelect: FunctionActionRectVoid;
		private menuHandlers: MenuHandlers;
		private mouseMode: MouseMode;

		constructor(parent: any, screen: Rect, origin: Point, windowRect: Rect, onSelect: FunctionActionRectVoid) {
			p("creating menu at " + JSON.stringify(origin) + " with bounds " + JSON.stringify(screen));
			const self = this;
			this.parent = parent;
			this.mouseMode = MouseMode.MENU;
			this.onSelect = onSelect;
			const backgroundActor = new Clutter.Actor();
			backgroundActor.set_size(screen.size.x, screen.size.y);

			const menu = new Clutter.Actor();

			const menuSize: Point = { x: 200, y: 200 };
			menu.set_size(menuSize.x, menuSize.y);

			const canvas = new Clutter.Canvas();
			canvas.set_size(menuSize.x, menuSize.y);
			menu.set_content(canvas);

			const position: Point = Point.subtract(Point.subtract(origin, screen.pos), Point.scaleConstant(0.5, menuSize));
			menu.set_position(position.x, position.y);

			const preview = this.preview = new LayoutPreview(screen.size, windowRect);
			const handlers = this.menuHandlers = new MenuHandlers(menuSize, origin, canvas, preview);
			canvas.connect('draw', handlers.draw);
			backgroundActor.connect('motion-event', function(_actor: any, event: any) {
				self.menuHandlers.onMouseMove(self.mouseMode, event);
				self.preview.onMouseMove(self.mouseMode, event);
				return Clutter.EVENT_STOP;
			});

			// XXX shouldn't be necessary. Take grab?
			backgroundActor.connect('button-press-event', function() {
				backgroundActor.grab_key_focus();
			});

			Clutter.grab_pointer(backgroundActor);
			Clutter.grab_keyboard(backgroundActor);

			var suspendedMouseMode = MouseMode.NOOP;
			backgroundActor.connect('key-press-event', function(_actor: any, event: any) {
				// p('keypress: ' + event.get_key_code());
				const code: number = event.get_key_code();
				if (code == 9) {
					self.complete(false);
					return Clutter.EVENT_STOP;
				} else if (code == 50 && self.mouseMode !== MouseMode.RESIZE) { // shift
					if (self.preview.trackMouse(MouseMode.RESIZE, handlers.getMousePosition())) {
						self.mouseMode = MouseMode.RESIZE;
						menu.hide();
					}
					return Clutter.EVENT_STOP;
				} else if (code == 65 && self.mouseMode !== MouseMode.MOVE) { // space
					if (self.preview.trackMouse(MouseMode.MOVE, handlers.getMousePosition())) {
						self.mouseMode = MouseMode.MOVE;
						menu.hide();
					}
				} else if (code == 64) { // ctrl
					if (self.mouseMode != MouseMode.NOOP) {
						suspendedMouseMode = self.mouseMode;
						self.mouseMode = MouseMode.NOOP;
						menu.hide();
					}
				}
			});

			backgroundActor.connect('key-release-event', function(_actor: any, event: any) {
				// p('keyup: ' + event.get_key_code());
				const code: number = event.get_key_code();
				if (code == 64) { // ctrl
					if (suspendedMouseMode != MouseMode.NOOP) {
						self.mouseMode = suspendedMouseMode;
						self.preview.resumeTracking(handlers.getMousePosition());
						suspendedMouseMode = MouseMode.NOOP;
					}
					return Clutter.EVENT_STOP;
				}
			});

			backgroundActor.connect('button-press-event', function() {
				self.complete(true);
				return Clutter.EVENT_STOP;
			});

			const coverPane = new Clutter.Actor({ reactive: true });
			coverPane.set_reactive(true);
			coverPane.connect('event', function () {
				p("catching event..");
				return Clutter.EVENT_STOP;
			});

			this.ui = coverPane;
			backgroundActor.set_reactive(true);
			backgroundActor.add_actor(menu);
			coverPane.add_actor(this.preview.ui);
			coverPane.add_actor(backgroundActor);

			this.parent.insert_child_above(this.ui, null);
			backgroundActor.grab_key_focus();
			canvas.invalidate();
		}

		destroy() {
			p("hiding menu")
			if (this.displayed()) {
				Clutter.ungrab_pointer();
				Clutter.ungrab_keyboard();
				this.parent.remove_child(this.ui);
				this.parent = null;
			}
		}

		private complete(accept: boolean) {
			if (!accept) {
				this.onSelect(Action.CANCEL, null);
			} else {
				const selection = this.menuHandlers.getSelection();
				if (Selection.eq({ ring: Ring.INNER, index: InnerSelection.MINIMIZE }, selection)) {
					this.onSelect(Action.MINIMIZE, null);
				} else {
					const rect = this.preview.getRect()
					if (rect !== null) {
						this.onSelect(Action.RESIZE, rect);
					}
				}
			}
			this.destroy();
		}

		private displayed() {
			return (this.parent !== null);
		}
	}
}

