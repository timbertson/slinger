/// <reference path="common.ts" />
/// <reference path="logging.ts" />
/// <reference path="preview.ts" />
/// <reference path="point.ts" />
/// <reference path="rect.ts" />
/// <reference path="menu.ts" />
/// <reference path="menu_selection.ts" />

module MenuHandlers {
	const PI = Math.PI;
	const TAO = 2 * PI;
	const floor = Math.floor;

	const ANGLE_HALF = PI;
	const ANGLE_QUARTER = ANGLE_HALF / 2;
	const ANGLE_EIGHTH = ANGLE_QUARTER / 2;
	const ANGLE_SIXTEENTH = ANGLE_EIGHTH / 2;
	const ANGLE_TWELFTH = TAO / 12.0;

	function circularIndex(sections: number, offset: number) {
		const span = TAO / sections;
		return function(angle: number) {
			return floor((angle + PI + offset) / span) % sections;
		}
	}

	const outerIndex = circularIndex(8, ANGLE_SIXTEENTH);

	function floatColor(c: Color): Color {
		return {
			r: c.r / 255,
			g: c.g / 255,
			b: c.b / 255,
			a: c.a / 255,
		}
	}

	export class Handlers {
		draw: Function
		private origin: Point
		private currentMouseRelative: Point
		private selection: MenuSelection
		private INNER_RADIUS: number;
		private MID_RADIUS: number;
		private preview: Preview.LayoutPreview<any>;
		private canvas: ClutterCanvas;
		private Sys: System<any>;
		private menu: Menu.Menu<any>;

		constructor(menu: Menu.Menu<any>, Sys: System<any>, menuSize: Point, origin: Point, canvas: ClutterCanvas, preview: Preview.LayoutPreview<any>) {
			this.menu = menu;
			this.Sys = Sys;
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
			const DARK_FOUR = floatColor({ r: 0, g: 77, b: 101, a: 200 });
			const DARK_SIX = floatColor({ r: 128, g: 77, b: 0, a: 200 });
			const LIGHT = floatColor({ r: 66, g: 79, b: 92, a: 237 });
			const BG = { luminance: 0.7, alpha: 0.7 };
			const ACTIVE_FOUR = floatColor({ r: 0, g: 155, b: 203, a: 255 });
			const ACTIVE_SIX = floatColor({ r: 255, g: 155, b: 0, a: 255 });

			this.selection = MenuSelection.None;

			function setGrey(cr: CairoContext, grey: Grey) {
				cr.setSourceRGBA(grey.luminance, grey.luminance, grey.luminance, grey.alpha);
			}
			function setColor(cr: CairoContext, c: Color) {
				cr.setSourceRGBA(c.r, c.g, c.b, c.a);
			}

			function activeColor(cr: CairoContext, selection: MenuSelection, ring: Ring, location: number) {
				var active, dark;
				let state = self.menu.getSplitState();
				switch (state) {
					case Menu.SplitMode.FOUR:
						active = ACTIVE_FOUR;
						dark = DARK_FOUR;
						break;
					case Menu.SplitMode.SIX:
						active = ACTIVE_SIX;
						dark = DARK_SIX;
						break;
				}
				if (MenuSelection.eqTo(selection, ring, location, state)) {
					setColor(cr, active);
				} else {
					setColor(cr, dark);
				}
			}

			function activeColorInner(cr: CairoContext, selection: MenuSelection, location: Anchor) {
				activeColor(cr, selection, Ring.INNER, location)
			}

			function activeColorOuter(cr: CairoContext, selection: MenuSelection, location: Anchor) {
				activeColor(cr, selection, Ring.OUTER, location)
			}

			const self = this;
			this.draw = function draw(_canvas: ClutterCanvas, cr: CairoContext, _width: number, _height: number) {
				const selection = self.selection;
				// reset surface
				cr.save();
				cr.setOperator(Sys.Cairo.Operator.CLEAR);
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
				cr.setLineWidth(MID_RADIUS - INNER_RADIUS - HALF_GAP_WIDTH);
				cr.resetClip()
				cr.rectangle(-HALF.x, -HALF.y, menuSize.x, menuSize.y);
				switch (self.menu.getSplitState()) {
					case Menu.SplitMode.FOUR:
						cr.rectangle(HALF.x, - HALF_GAP_WIDTH, - menuSize.x, GAP_WIDTH);
						cr.clip();

						cr.arc(0, 0, MID_RADIUS - ((MID_RADIUS - INNER_RADIUS) / 2) - HALF_GAP_WIDTH, PI, TAO);
						activeColorInner(cr, selection, Anchor.TOP);
						cr.stroke();

						cr.arc(0, 0, MID_RADIUS - ((MID_RADIUS - INNER_RADIUS) / 2) - HALF_GAP_WIDTH, 0, PI);
						activeColorInner(cr, selection, Anchor.BOTTOM);
						cr.stroke();

						const glyphOffset = MID_RADIUS - ((MID_RADIUS-INNER_RADIUS + GAP_WIDTH) / 2)
						cr.rectangle(-(GLYPH_WIDTH / 2), -glyphOffset - (GLYPH_THICKNESS / 2), GLYPH_WIDTH, GLYPH_THICKNESS);
						cr.rectangle(-(GLYPH_THICKNESS / 2), -glyphOffset - (GLYPH_WIDTH / 2), GLYPH_THICKNESS, GLYPH_WIDTH);
						cr.rectangle(-(GLYPH_WIDTH / 2), glyphOffset - (GLYPH_THICKNESS / 2), GLYPH_WIDTH, GLYPH_THICKNESS);
						setGrey(cr, BG);
						cr.fill();
						break;
					case Menu.SplitMode.SIX:
						cr.rotate(ANGLE_TWELFTH);
						cr.rectangle(HALF.x, - HALF_GAP_WIDTH, - menuSize.x / 2, GAP_WIDTH);
						cr.rotate(ANGLE_TWELFTH * 4.0);
						cr.rectangle(HALF.x, - HALF_GAP_WIDTH, - menuSize.x / 2, GAP_WIDTH);
						cr.rotate(ANGLE_TWELFTH * 4.0);
						cr.rectangle(HALF.x, - HALF_GAP_WIDTH, - menuSize.x / 2, GAP_WIDTH);
						cr.clip();
						cr.rotate(ANGLE_TWELFTH * 3.0);

						cr.arc(0, 0, MID_RADIUS - ((MID_RADIUS - INNER_RADIUS) / 2) - HALF_GAP_WIDTH, 1.0 * ANGLE_TWELFTH, 5.0 * ANGLE_TWELFTH);
						activeColorInner(cr, selection, Anchor.BOTTOM);
						cr.stroke();

						cr.arc(0, 0, MID_RADIUS - ((MID_RADIUS - INNER_RADIUS) / 2) - HALF_GAP_WIDTH, 5.0 * ANGLE_TWELFTH, 9.0 * ANGLE_TWELFTH);
						activeColorInner(cr, selection, Anchor.LEFT);
						cr.stroke();

						cr.arc(0, 0, MID_RADIUS - ((MID_RADIUS - INNER_RADIUS) / 2) - HALF_GAP_WIDTH, 9.0 * ANGLE_TWELFTH, 1.0 * ANGLE_TWELFTH);
						activeColorInner(cr, selection, Anchor.RIGHT);
						cr.stroke();
						break;
				}

				cr.restore();
				return Sys.Clutter.EVENT_STOP;
			}
		}

		updateMouseSelection() {
			const { x, y } = this.currentMouseRelative;
			const radius = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
			const angle = Math.atan2(y, x);
			// log("radius = " + radius);
			// log("angle = " + angle);a
			let state = this.menu.getSplitState();
			if (radius <= this.INNER_RADIUS) {
				this.updateSelection(MenuSelection.None);
			} else if (radius < this.MID_RADIUS) {
				var index;
				if (state == Menu.SplitMode.FOUR) {
					let slice = circularIndex(2, 0)(angle);
					index = [Anchor.TOP, Anchor.BOTTOM][slice];
				} else {
					let slice = circularIndex(3, ANGLE_TWELFTH)(angle);
					index = [Anchor.LEFT, Anchor.RIGHT, Anchor.BOTTOM][slice];
				}
				this.updateSelection(MenuSelection.Inner(index, state));
			} else {
				this.updateSelection(MenuSelection.Outer(outerIndex(angle), state));
			}
		}

		onMouseMove(mode: MouseMode, eventPoint: Point): ClutterEventResponse {
			this.currentMouseRelative = Point.subtract(eventPoint, this.origin);
			if (mode === MouseMode.MENU) {
				this.updateMouseSelection();
			}
			this.preview.onMouseMove(mode, eventPoint);
			return this.Sys.Clutter.EVENT_STOP;
		}

		trackMouse(prevMode: MouseMode): boolean {
			return this.preview.trackMouse(prevMode, this.getMousePosition());
		}

		updateSelection(newSelection: MenuSelection): void {
			if (!MenuSelection.eq(this.selection, newSelection)) {
				p("updateSelection(" + JSON.stringify(newSelection) + ")");
				this.selection = newSelection;
				this.canvas.invalidate();
				this.preview.updateSelection(newSelection);
			}
		}

		applyDirection(direction: Direction) {
			const currentLocation = this.selection.index as Anchor;
			const state = this.menu.getSplitState();
			switch (this.selection.ring) {
				case Ring.NONE:
					switch (direction) {
						case Direction.UP: this.updateSelection(MenuSelection.Outer(Anchor.TOP, state)); break;
						case Direction.DOWN: this.updateSelection(MenuSelection.Outer(Anchor.BOTTOM, state)); break;
						case Direction.LEFT: this.updateSelection(MenuSelection.Outer(Anchor.LEFT, state)); break;
						case Direction.RIGHT: this.updateSelection(MenuSelection.Outer(Anchor.RIGHT, state)); break;
					}
				break;

				case Ring.INNER:
					if (state == Menu.SplitMode.SIX) {
						switch (direction) {
							case Direction.LEFT:
								switch (currentLocation) {
									case Anchor.RIGHT: this.updateSelection(MenuSelection.Inner(Anchor.BOTTOM, state)); break;
									case Anchor.BOTTOM: this.updateSelection(MenuSelection.Inner(Anchor.LEFT, state)); break;
									case Anchor.LEFT: this.updateSelection(MenuSelection.Outer(Anchor.LEFT, state)); break;
								}
								break;
							case Direction.RIGHT:
								switch (currentLocation) {
									case Anchor.LEFT: this.updateSelection(MenuSelection.Inner(Anchor.BOTTOM, state)); break;
									case Anchor.BOTTOM: this.updateSelection(MenuSelection.Inner(Anchor.RIGHT, state)); break;
									case Anchor.RIGHT: this.updateSelection(MenuSelection.Outer(Anchor.RIGHT, state)); break;
								}
								break;
							case Direction.UP: this.updateSelection(MenuSelection.Outer(Anchor.TOP, state)); break;
							case Direction.DOWN: this.updateSelection(MenuSelection.Outer(Anchor.BOTTOM, state)); break;
						}
					}
				break;

				case Ring.OUTER:
					switch (direction) {
						case Direction.UP:
							switch (currentLocation) {
								case Anchor.BOTTOMLEFT: this.updateSelection(MenuSelection.Outer(Anchor.LEFT, state)); break;
								case Anchor.LEFT: this.updateSelection(MenuSelection.Outer(Anchor.TOPLEFT, state)); break;
								case Anchor.BOTTOMRIGHT: this.updateSelection(MenuSelection.Outer(Anchor.RIGHT, state)); break;
								case Anchor.RIGHT: this.updateSelection(MenuSelection.Outer(Anchor.TOPRIGHT, state)); break;
								default: this.updateSelection(MenuSelection.Outer(Anchor.TOP, state)); break;
							}
						break;

						case Direction.DOWN:
							switch (currentLocation) {
								case Anchor.TOPLEFT: this.updateSelection(MenuSelection.Outer(Anchor.LEFT, state)); break;
								case Anchor.LEFT: this.updateSelection(MenuSelection.Outer(Anchor.BOTTOMLEFT, state)); break;
								case Anchor.TOPRIGHT: this.updateSelection(MenuSelection.Outer(Anchor.RIGHT, state)); break;
								case Anchor.RIGHT: this.updateSelection(MenuSelection.Outer(Anchor.BOTTOMRIGHT, state)); break;
								default: this.updateSelection(MenuSelection.Outer(Anchor.BOTTOM, state)); break;
							}
						break;

						case Direction.LEFT:
							switch (currentLocation) {
								case Anchor.TOP: this.updateSelection(MenuSelection.Outer(Anchor.TOPLEFT, state)); break;
								case Anchor.BOTTOM: this.updateSelection(MenuSelection.Outer(Anchor.BOTTOMLEFT, state)); break;
								case Anchor.RIGHT:
									if (state == Menu.SplitMode.SIX) {
										this.updateSelection(MenuSelection.Inner(Anchor.RIGHT, state));
										break;
									}
								default: this.updateSelection(MenuSelection.Outer(Anchor.LEFT, state)); break;
							}
						break;

						case Direction.RIGHT:
							switch (currentLocation) {
								case Anchor.TOP: this.updateSelection(MenuSelection.Outer(Anchor.TOPRIGHT, state)); break;
								case Anchor.BOTTOM: this.updateSelection(MenuSelection.Outer(Anchor.BOTTOMRIGHT, state)); break;
								case Anchor.LEFT:
									if (state == Menu.SplitMode.SIX) {
										this.updateSelection(MenuSelection.Inner(Anchor.LEFT, state));
										break;
									}
								default: this.updateSelection(MenuSelection.Outer(Anchor.RIGHT, state)); break;
							}
						break;
					}
				break;
			}
		}

		getSelection(): MenuSelection {
			return this.selection;
		}

		private getMousePosition(): Point {
			return Point.add(this.origin, this.currentMouseRelative);
		}
	}
}
