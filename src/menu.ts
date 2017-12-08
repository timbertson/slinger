/// <reference path="common.ts" />
/// <reference path="logging.ts" />
/// <reference path="preview.ts" />
/// <reference path="point.ts" />
/// <reference path="rect.ts" />

module Menu {
	const Clutter = imports.gi.Clutter;
	const Cairo = imports.cairo;
	const PI = Math.PI;
	const TAO = 2 * PI;
	const floor = Math.floor;

	export const enum Action {
		CANCEL,
		MINIMIZE,
		RESIZE
	}

	// function stringOfLocation(loc: Anchor): string {
	// 	switch(loc) {
	// 		case Anchor.LEFT: return 'LEFT';
	// 		case Anchor.TOPLEFT: return 'TOPLEFT';
	// 		case Anchor.TOP: return 'TOP';
	// 		case Anchor.TOPRIGHT: return 'TOPRIGHT';
	// 		case Anchor.RIGHT: return 'RIGHT';
	// 		case Anchor.BOTTOMRIGHT: return 'BOTTOMRIGHT';
	// 		case Anchor.BOTTOM: return 'BOTTOM';
	// 		case Anchor.BOTTOMLEFT: return 'BOTTOMLEFT';
	// 		default: return '<unknown>';
	// 	}
	// }

	export const enum InnerSelection {
		MAXIMIZE = 0,
		MINIMIZE
	}

	export const enum Ring {
		NONE = 0,
		INNER,
		OUTER
	}

	export interface Selection {
		ring: Ring
		index: number
	}

	export module Selection {
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
		updateSelection: (selection: Selection) => void
		private origin: Point
		private currentMouseRelative: Point
		private selection: Selection

		constructor(menuSize: Point, origin: Point, canvas: any, preview: Preview.LayoutPreview) {
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

			function activeColorOuter(cr: any, selection: Selection, location: Anchor) {
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
				activeColorOuter(cr, selection, Anchor.RIGHT);
				cr.stroke();

				// left edge
				cr.arc(0, 0, OUTER_RADIUS - (EDGE_WIDTH/2), ANGLE_HALF - ANGLE_SIXTEENTH, ANGLE_HALF + ANGLE_SIXTEENTH);
				activeColorOuter(cr, selection, Anchor.LEFT);
				cr.stroke();

				// bottom edge
				cr.arc(0, 0, OUTER_RADIUS - (EDGE_WIDTH/2), ANGLE_QUARTER - ANGLE_SIXTEENTH, ANGLE_QUARTER + ANGLE_SIXTEENTH);
				activeColorOuter(cr, selection, Anchor.BOTTOM);
				cr.stroke();

				// top edge
				cr.arc(0, 0, OUTER_RADIUS - (EDGE_WIDTH/2), -ANGLE_QUARTER - ANGLE_SIXTEENTH, -ANGLE_QUARTER + ANGLE_SIXTEENTH);
				activeColorOuter(cr, selection, Anchor.TOP);
				cr.stroke();


				// corner shades:
				cr.arc(CORNER_DISTANCE, CORNER_DISTANCE, CORNER_WIDTH, 0, TAO);
				activeColorOuter(cr, selection, Anchor.BOTTOMRIGHT);
				cr.fill();

				cr.arc(-CORNER_DISTANCE, CORNER_DISTANCE, CORNER_WIDTH, 0, TAO);
				activeColorOuter(cr, selection, Anchor.BOTTOMLEFT);
				cr.fill();

				cr.arc(-CORNER_DISTANCE, -CORNER_DISTANCE, CORNER_WIDTH, 0, TAO);
				activeColorOuter(cr, selection, Anchor.TOPLEFT);
				cr.fill();

				cr.arc(CORNER_DISTANCE, -CORNER_DISTANCE, CORNER_WIDTH, 0, TAO);
				activeColorOuter(cr, selection, Anchor.TOPRIGHT);
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

			this.updateSelection = function(newSelection: Menu.Selection) {
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
					this.updateSelection(UNSELECTED);
				} else if (radius < MID_RADIUS) {
					this.updateSelection({
						ring: Ring.INNER,
						index: innerIndex(angle),
					});
				} else {
					this.updateSelection({
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


	type FunctionActionRectVoid = (action:Action, rect:Rect) => void

	export class Menu {
		ui: any;
		private parent: any;
		private preview: Preview.LayoutPreview;
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

			const preview = this.preview = new Preview.LayoutPreview(screen.size, windowRect);
			const handlers = this.menuHandlers = new MenuHandlers(menuSize, origin, canvas, preview);
			canvas.connect('draw', handlers.draw);
			backgroundActor.connect('motion-event', function(_actor: any, event: any) {
				// p("mouseMove with mode = " + self.mouseMode);
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

			function modeForKey(key: KeyCode) {
				switch(key) {
					case KeyCode.SHIFT: return MouseMode.MOVE;
					case KeyCode.ALT: return MouseMode.RESIZE;
					default: return null;
				}
			}

			// var suspendedMouseMode = MouseMode.NOOP;
			backgroundActor.connect('key-press-event', function(_actor: any, event: any) {
				const code: number = event.get_key_code();
				// p('keypress: ' + code);
				if (code == KeyCode.ESC) {
					self.complete(false);
				} else if (code == KeyCode.SPACE || code == KeyCode.TAB) {
					p("entering NOOP(drag) mode");
					handlers.updateSelection(Selection.None);
					self.preview.resetTracking(handlers.getMousePosition());
					self.mouseMode = MouseMode.NOOP;
					menu.hide();
				} else {
					const newMode = modeForKey(code);
					if (newMode != null && self.mouseMode !== newMode) {
						if (self.preview.trackMouse(self.mouseMode, handlers.getMousePosition())) {
							p("entering mode " + newMode);
							self.mouseMode = newMode;
							menu.hide();
						} else {
							p("not entering " + newMode + " due to current menu selection");
						}
					}
				}
				return Clutter.EVENT_STOP;
			});

			backgroundActor.connect('key-release-event', function(_actor: any, event: any) {
				const code: number = event.get_key_code();
				const fromState = modeForKey(code);
				if (fromState != null && self.mouseMode == fromState) {
					p("ending mode " + fromState);
					self.mouseMode = MouseMode.NOOP;
				}
				return Clutter.EVENT_STOP;
			});

			backgroundActor.connect('button-press-event', function() {
				self.complete(true);
				return Clutter.EVENT_STOP;
			});

			const coverPane = new Clutter.Actor({ reactive: true });
			coverPane.set_reactive(true);
			coverPane.connect('event', function () {
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

