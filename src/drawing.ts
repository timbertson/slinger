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

		export function zero(): Point {
			return { x: 0, y: 0 };
		}
	}

	module Rect {
		export function copy(r: Rect): Rect {
			return { pos: Point.copy(r.pos), size: Point.copy(r.size) };
		}
	}

	module Selection {
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
		draw: Function;
		onMouseMove: Function;
		private selection: Selection;

		constructor(menuSize: Point, origin: Point, canvas: any, preview: LayoutPreview) {
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

			this.selection = UNSELECTED;
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

			this.onMouseMove = function(_actor: any, event: any) {
				const [absx,absy] = event.get_coords();
				const x = absx - origin.x;
				const y = absy - origin.y;

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
	}

	class LayoutPreview {
		private size: Point
		private base: Rect
		private preview: Rect
		ui: any
		constructor(size: Point) {
			this.size = size
			this.ui = new Clutter.Actor();
			this.ui.set_background_color(new Clutter.Color({
				red: 80,
				green: 158,
				blue: 255,
				alpha: 125
			}));
			this.ui.hide();
		}

		private selectOuter(loc: Location): Rect {
			switch (loc) {
				case Location.LEFT:
					return {
						pos: Point.zero(),
						size: Point.scale({ x: 0.5, y: 1 }, this.size),
					}
				case Location.TOPLEFT:
					return {
						pos: Point.zero(),
						size: Point.scaleConstant(0.5, this.size),
					}
				case Location.TOP:
					return {
						pos: Point.zero(),
						size: Point.scale({ x: 1, y: 0.5 }, this.size),
					}
				case Location.TOPRIGHT:
					return {
						pos: Point.scale({ x: 0.5, y: 0 }, this.size),
						size: Point.scaleConstant(0.5, this.size),
					}
				case Location.RIGHT:
					return {
						pos: Point.scale({ x: 0.5, y: 0 }, this.size),
						size: Point.scale({ x: 0.5, y: 1 }, this.size),
					}
				case Location.BOTTOMRIGHT:
					return {
						pos: Point.scaleConstant(0.5, this.size),
						size: Point.scaleConstant(0.5, this.size),
					}
				case Location.BOTTOM:
					return {
						pos: Point.scale({ x: 0, y: 0.5 }, this.size),
						size: Point.scale({ x: 1, y: 0.5 }, this.size),
					}
				case Location.BOTTOMLEFT:
					return {
						pos: Point.scale({ x: 0, y: 0.5}, this.size),
						size: Point.scaleConstant(0.5, this.size),
					}
			}
			return null;
		}

		private selectInner(sel: InnerSelection): Rect {
			switch (sel) {
				case InnerSelection.MAXIMIZE:
					return {
						pos: Point.zero(),
						size: this.size,
					}

				case InnerSelection.MINIMIZE:
				default:
					return null;
			}
		}

		updateSelection(sel: Selection) {
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

	export class Menu {
		ui: any;
		private parent: any;
		private preview: LayoutPreview;
		private onSelect: FunctionActionRectVoid;
		private menuHandlers: MenuHandlers;

		constructor(parent: any, screen: Rect, origin: Point, onSelect: FunctionActionRectVoid) {
			p("creating menu at " + JSON.stringify(origin) + " with bounds " + JSON.stringify(screen));
			const self = this;
			this.parent = parent;
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

			const preview = this.preview = new LayoutPreview(screen.size);
			const handlers = this.menuHandlers = new MenuHandlers(menuSize, origin, canvas, preview);
			canvas.connect('draw', handlers.draw);
			backgroundActor.connect('motion-event', handlers.onMouseMove);

			// XXX shouldn't be necessary. Take grab?
			backgroundActor.connect('button-press-event', function() {
				backgroundActor.grab_key_focus();
			});

			Clutter.grab_pointer(backgroundActor);
			Clutter.grab_keyboard(backgroundActor);

			backgroundActor.connect('key-press-event', function(_actor: any, event: any) {
				p('keypress: ' + event.get_key_code());
				if (event.get_key_code() == 9) {
					self.complete(false);
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

