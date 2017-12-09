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

	// TODO: how constant are these?
	const enum KeyCode {
		ESC = 9,
		SHIFT = 50,
		SPACE = 65,
		CTRL = 64,
		ALT = 133,
		TAB = 23,
		H = 43,
		J = 44,
		K = 45,
		L = 46,
		UP = 111,
		DOWN = 116,
		LEFT = 113,
		RIGHT = 114,
		MINUS = 20,
		EQUAL = 21,
		RETURN = 36,
	}

	export module Selection {
		export const None: Selection = { ring: Ring.NONE, index: 0 }

		export function eq(a: Selection, b: Selection) {
			return a.ring == b.ring && a.index == b.index;
		}
		export function eqTo(a: Selection, ring: Ring, location: number) {
			return a.ring == ring && a.index == location;
		}

		export function Inner(sel: InnerSelection): Selection {
			return { ring: Ring.INNER, index: sel };
		}
		export function Outer(sel: Anchor): Selection {
			return { ring: Ring.OUTER, index: sel };
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

	function circularIndex(sections: number, offset: number) {
		const span = TAO / sections;
		return function(angle: number) {
			return floor((angle + PI + offset) / span) % sections;
		}
	}

	const ANGLE_HALF = PI;
	const ANGLE_QUARTER = ANGLE_HALF / 2;
	const ANGLE_EIGHTH = ANGLE_QUARTER / 2;
	const ANGLE_SIXTEENTH = ANGLE_EIGHTH / 2;

	const innerIndex = circularIndex(2, 0);
	const outerIndex = circularIndex(8, ANGLE_SIXTEENTH);

	class MenuHandlers {
		draw: Function
		private origin: Point
		private currentMouseRelative: Point
		private selection: Selection
		private INNER_RADIUS: number;
		private MID_RADIUS: number;
		private preview: Preview.LayoutPreview;
		private canvas: ClutterCanvas;

		constructor(menuSize: Point, origin: Point, canvas: ClutterCanvas, preview: Preview.LayoutPreview) {
			this.currentMouseRelative = Point.ZERO;
			this.origin = origin;
			this.preview = preview;
			this.canvas = canvas;

			const HALF : Point = Point.scaleConstant(0.5, menuSize);
			const BORDER_WIDTH = floor(menuSize.x * 0.03);
			const OUTER_RADIUS = floor(menuSize.x / 2) - BORDER_WIDTH;
			const MID_RADIUS = this.MID_RADIUS = floor(OUTER_RADIUS * 0.3);
			const INNER_RADIUS = this.INNER_RADIUS = floor(OUTER_RADIUS * 0.1);
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

			this.selection = Selection.None;

			function setGrey(cr: ClutterContext, grey: Grey) {
				cr.setSourceRGBA(grey.luminance, grey.luminance, grey.luminance, grey.alpha);
			}
			function setColor(cr: ClutterContext, c: Color) {
				cr.setSourceRGBA(c.r, c.g, c.b, c.a);
			}

			function activeColor(cr: ClutterContext, selection: Selection, ring: Ring, location: number) {
				if (Selection.eqTo(selection, ring, location)) {
					setColor(cr, ACTIVE);
				} else {
					setColor(cr, DARK);
				}
			}

			function activeColorInner(cr: ClutterContext, selection: Selection, location: InnerSelection) {
				activeColor(cr, selection, Ring.INNER, location)
			}

			function activeColorOuter(cr: ClutterContext, selection: Selection, location: Anchor) {
				activeColor(cr, selection, Ring.OUTER, location)
			}

			const self = this;
			this.draw = function draw(_canvas: ClutterCanvas, cr: ClutterContext, _width: number, _height: number) {
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
		}

		onMouseMove(mode: MouseMode, event: ClutterMouseEvent): void {
			const point = this.currentMouseRelative = Point.ofEvent(event, this.origin);
			if (mode === MouseMode.MENU) {
				const { x, y } = point;
				const radius = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
				const angle = Math.atan2(y, x);
				// log("radius = " + radius);
				// log("angle = " + angle);

				if (radius <= this.INNER_RADIUS) {
					this.updateSelection(Selection.None);
				} else if (radius < this.MID_RADIUS) {
					this.updateSelection(Selection.Inner(innerIndex(angle)));
				} else {
					this.updateSelection(Selection.Outer(outerIndex(angle)));
				}
			}
			this.preview.onMouseMove(mode, event);
			return Clutter.EVENT_STOP;
		}

		resetTracking() {
			this.updateSelection(Selection.None);
			this.preview.resetTracking(this.getMousePosition());
		}

		trackMouse(prevMode: MouseMode): boolean {
			return this.preview.trackMouse(prevMode, this.getMousePosition());
		}

		updateSelection(newSelection: Menu.Selection): void {
			if (!Selection.eq(this.selection, newSelection)) {
				p("updateSelection(" + JSON.stringify(newSelection) + ")");
				this.selection = newSelection;
				this.canvas.invalidate();
				this.preview.updateSelection(newSelection);
			}
		}

		applyDirection(direction: Direction) {
			switch (this.selection.ring) {
				case Ring.NONE:
					switch (direction) {
						case Direction.UP: this.updateSelection(Selection.Outer(Anchor.TOP)); break;
						case Direction.DOWN: this.updateSelection(Selection.Outer(Anchor.BOTTOM)); break;
						case Direction.LEFT: this.updateSelection(Selection.Outer(Anchor.LEFT)); break;
						case Direction.RIGHT: this.updateSelection(Selection.Outer(Anchor.RIGHT)); break;
					}
				break;

				case Ring.INNER:
					// noop
				break;

				case Ring.OUTER:
					const currentLocation = this.selection.index as Anchor;
					switch (direction) {
						case Direction.UP:
							switch (currentLocation) {
								case Anchor.LEFT: this.updateSelection(Selection.Outer(Anchor.TOPLEFT)); break;
								case Anchor.RIGHT: this.updateSelection(Selection.Outer(Anchor.TOPRIGHT)); break;
								default: this.updateSelection(Selection.Outer(Anchor.TOP)); break;
							}
						break;

						case Direction.DOWN:
							switch (currentLocation) {
								case Anchor.LEFT: this.updateSelection(Selection.Outer(Anchor.BOTTOMLEFT)); break;
								case Anchor.RIGHT: this.updateSelection(Selection.Outer(Anchor.BOTTOMRIGHT)); break;
								default: this.updateSelection(Selection.Outer(Anchor.BOTTOM)); break;
							}
						break;

						case Direction.LEFT:
							switch (currentLocation) {
								case Anchor.TOP: this.updateSelection(Selection.Outer(Anchor.TOPLEFT)); break;
								case Anchor.BOTTOM: this.updateSelection(Selection.Outer(Anchor.BOTTOMLEFT)); break;
								default: this.updateSelection(Selection.Outer(Anchor.LEFT)); break;
							}
						break;

						case Direction.RIGHT:
							switch (currentLocation) {
								case Anchor.TOP: this.updateSelection(Selection.Outer(Anchor.TOPRIGHT)); break;
								case Anchor.BOTTOM: this.updateSelection(Selection.Outer(Anchor.BOTTOMRIGHT)); break;
								default: this.updateSelection(Selection.Outer(Anchor.RIGHT)); break;
							}
						break;
					}
				break;
			}
		}

		getSelection(): Selection {
			return this.selection;
		}

		private getMousePosition(): Point {
			return Point.add(this.origin, this.currentMouseRelative);
		}
	}

	type FunctionActionRectVoid = (action:Action, rect:Rect) => void

	function modeForKey(key: KeyCode): MouseMode {
		switch(key) {
			case KeyCode.SHIFT: return MouseMode.MOVE;
			case KeyCode.ALT: return MouseMode.RESIZE;
			default: return null;
		}
	}

	function directionForKey(key: KeyCode): Direction {
		switch(key) {
			case KeyCode.K: case KeyCode.UP: return Direction.UP;
			case KeyCode.J: case KeyCode.DOWN: return Direction.DOWN;
			case KeyCode.H: case KeyCode.LEFT: return Direction.LEFT;
			case KeyCode.L: case KeyCode.RIGHT: return Direction.RIGHT;
			default: return null;
		}
	}

	function selectionForKey(key: KeyCode): Selection {
		switch(key) {
			case KeyCode.EQUAL:
				return Selection.Inner(InnerSelection.MAXIMIZE);

			default: return null;
		}
	}

	export class Menu {
		ui: Actor;
		private parent: Actor;
		private preview: Preview.LayoutPreview;
		private onSelect: FunctionActionRectVoid;
		private menuHandlers: MenuHandlers;
		private menu: Actor;
		private mouseMode: MouseMode;

		constructor(parent: Actor, screen: Rect, origin: Point, windowRect: Rect, windowActor: Actor, onSelect: FunctionActionRectVoid) {
			p("creating menu at " + JSON.stringify(origin) + " with bounds " + JSON.stringify(screen));
			const self = this;
			this.parent = parent;
			this.mouseMode = MouseMode.MENU;
			this.onSelect = onSelect;
			const backgroundActor = new Clutter.Actor();
			backgroundActor.set_size(screen.size.x, screen.size.y);

			const menu = this.menu = new Clutter.Actor();

			const menuSize: Point = { x: 200, y: 200 };
			menu.set_size(menuSize.x, menuSize.y);

			const canvas = new Clutter.Canvas();
			canvas.set_size(menuSize.x, menuSize.y);
			menu.set_content(canvas);

			const position: Point = Point.subtract(Point.subtract(origin, screen.pos), Point.scaleConstant(0.5, menuSize));
			menu.set_position(position.x, position.y);

			const preview = this.preview = new Preview.LayoutPreview(screen.size, windowRect, windowActor);
			const handlers = this.menuHandlers = new MenuHandlers(menuSize, origin, canvas, preview);
			canvas.connect('draw', handlers.draw);
			backgroundActor.connect('motion-event', function(_actor: Actor, event: ClutterMouseEvent) {
				self.menuHandlers.onMouseMove(self.mouseMode, event);
				return Clutter.EVENT_STOP;
			});

			Clutter.grab_pointer(backgroundActor);
			Clutter.grab_keyboard(backgroundActor);

			// var suspendedMouseMode = MouseMode.NOOP;
			backgroundActor.connect('key-press-event', function(_actor: Actor, event: ClutterKeyEvent) {
				self.onKeyPress(event);
				return Clutter.EVENT_STOP;
			});

			backgroundActor.connect('key-release-event', function(_actor: Actor, event: ClutterKeyEvent) {
				self.onKeyRelease(event);
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

		onKeyPress(event: ClutterKeyEvent) {
			const code: number = event.get_key_code();
			// p('keypress: ' + code);
			if (code == KeyCode.ESC) {
				this.complete(false);
			} else if (code == KeyCode.RETURN) {
				this.complete(true);
			} else if (code == KeyCode.SPACE || code == KeyCode.TAB) {
				p("entering NOOP(drag) mode");
				this.menuHandlers.resetTracking();
				this.mouseMode = MouseMode.NOOP;
				this.menu.hide();
			} else {
				const newMode = modeForKey(code);

				if (newMode !== null) {
					if (this.mouseMode !== newMode) {
						if (this.menuHandlers.trackMouse(this.mouseMode)) {
							p("entering mode " + newMode);
							this.mouseMode = newMode;
							this.menu.hide();
						} else {
							p("not entering " + newMode + " due to current menu selection");
						}
					}
				} else if (this.mouseMode == MouseMode.MENU) {
					const direction = directionForKey(code);
					const selection = selectionForKey(code);
					if (direction !== null) {
						this.menuHandlers.applyDirection(direction);
					} else if (selection !== null) {
						this.menuHandlers.updateSelection(selection);
					}
				}
			}
		}

		onKeyRelease(event: ClutterKeyEvent) {
			const code: number = event.get_key_code();
			const fromState = modeForKey(code);
			if (fromState != null && this.mouseMode == fromState) {
				p("ending mode " + fromState);
				this.mouseMode = MouseMode.NOOP;
			}
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
				if (Selection.eqTo(selection, Ring.INNER, InnerSelection.MINIMIZE)) {
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

