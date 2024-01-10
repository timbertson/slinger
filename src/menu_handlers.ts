import { Anchor, CairoContext, ClutterCanvas, ClutterEventResponse, Color, Direction, Grey, MouseMode, p } from "./common.js";
import { MenuSelection, SplitMode, Ring } from "./menu_selection.js";
import { Point } from "./point.js";
import { Preview } from "./preview.js";
import { System } from "./system.js";

export module MenuHandlers {
	const PI = Math.PI;
	const TAO = 2 * PI;
	const floor = Math.floor;

	const ANGLE_HALF = PI;
	const ANGLE_QUARTER = ANGLE_HALF / 2;
	const ANGLE_EIGHTH = ANGLE_QUARTER / 2;
	const ANGLE_SIXTEENTH = ANGLE_EIGHTH / 2;
	const ANGLE_TWELFTH = TAO / 12.0;

	function circularIndex(sections: number, offset: number, mapFn: (_: number) => number) {
		const span = TAO / sections;
		return function(angle: number) {
			return mapFn(floor((angle + PI + offset) / span) % sections);
		}
	}

	function selectionOfIndex(selections: number[]) {
		return function(index: number) {
			return selections[index];
		}
	}

	const identity = function(x: any) { return x; };
	const outerSelection = circularIndex(8, ANGLE_SIXTEENTH, identity);
	const innerSelectionFour = circularIndex(2, 0,
		selectionOfIndex([Anchor.TOP, Anchor.BOTTOM]));
	const innerSelectionSix = circularIndex(3, ANGLE_TWELFTH,
		selectionOfIndex([Anchor.TOPLEFT, Anchor.TOPRIGHT, Anchor.BOTTOM]));

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

		constructor(Sys: System<any>, splitMode: SplitMode, menuSize: Point, origin: Point, canvas: ClutterCanvas, preview: Preview.LayoutPreview<any>) {
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
			const CORNER_DISTANCE = floor(OUTER_RADIUS * 0.78);
			const EDGE_ARC_DISTANCE = floor(OUTER_RADIUS * 1.1);
			const GLYPH_WIDTH = floor(OUTER_RADIUS * 0.09);
			const GLYPH_THICKNESS = floor(OUTER_RADIUS * 0.03);
			const DARK = floatColor({ r: 18, g: 36, b: 48, a: 200 });
			const LIGHT = floatColor({ r: 66, g: 79, b: 92, a: 237 });
			const BG = { luminance: 0.7, alpha: 0.7 };
			const ACTIVE = floatColor({ r: 0, g: 155, b: 203, a: 255 });

			this.selection = MenuSelection.None(splitMode);

			function setGrey(cr: CairoContext, grey: Grey) {
				cr.setSourceRGBA(grey.luminance, grey.luminance, grey.luminance, grey.alpha);
			}
			function setColor(cr: CairoContext, c: Color) {
				cr.setSourceRGBA(c.r, c.g, c.b, c.a);
			}

			function activeColor(cr: CairoContext, selection: MenuSelection, ring: Ring, location: number) {
				if (selection.eqPosition(ring, location)) {
					setColor(cr, ACTIVE);
				} else {
					setColor(cr, DARK);
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

				switch (selection.splitMode) {
					case SplitMode.FOUR:
						// bottom edge
						cr.arc(0, 0, OUTER_RADIUS - (EDGE_WIDTH/2), ANGLE_QUARTER - ANGLE_SIXTEENTH, ANGLE_QUARTER + ANGLE_SIXTEENTH);
						activeColorOuter(cr, selection, Anchor.BOTTOM);
						cr.stroke();

						// top edge
						cr.arc(0, 0, OUTER_RADIUS - (EDGE_WIDTH/2), -ANGLE_QUARTER - ANGLE_SIXTEENTH, -ANGLE_QUARTER + ANGLE_SIXTEENTH);
						activeColorOuter(cr, selection, Anchor.TOP);
						cr.stroke();
						break;

					case SplitMode.SIX:
						// bottom middle
						cr.arc(0, EDGE_ARC_DISTANCE, CORNER_WIDTH, 0, TAO);
						activeColorOuter(cr, selection, Anchor.BOTTOM);
						cr.fill();

						// top middle
						cr.arc(0, -EDGE_ARC_DISTANCE, CORNER_WIDTH, 0, TAO);
						activeColorOuter(cr, selection, Anchor.TOP);
						cr.fill();
						break;
				}

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
				switch (selection.splitMode) {
					case SplitMode.FOUR:
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
					case SplitMode.SIX:
						cr.rotate(ANGLE_TWELFTH);
						cr.rectangle(HALF.x, - HALF_GAP_WIDTH, - menuSize.x / 2, GAP_WIDTH);
						cr.rotate(ANGLE_TWELFTH * 4.0);
						cr.rectangle(HALF.x, - HALF_GAP_WIDTH, - menuSize.x / 2, GAP_WIDTH);
						cr.rotate(ANGLE_TWELFTH * 4.0);
						cr.rectangle(HALF.x, - HALF_GAP_WIDTH, - menuSize.x / 2, GAP_WIDTH);
						cr.clip();
						cr.rotate(ANGLE_TWELFTH * 3.0);

						cr.arc(0, 0, MID_RADIUS - ((MID_RADIUS - INNER_RADIUS) / 2) - HALF_GAP_WIDTH, 1.5 * ANGLE_TWELFTH, 4.5 * ANGLE_TWELFTH);
						activeColorInner(cr, selection, Anchor.BOTTOM);
						cr.stroke();

						cr.arc(0, 0, MID_RADIUS - ((MID_RADIUS - INNER_RADIUS) / 2) - HALF_GAP_WIDTH, 5.0 * ANGLE_TWELFTH, 9.0 * ANGLE_TWELFTH);
						activeColorInner(cr, selection, Anchor.TOPLEFT);
						cr.stroke();

						cr.arc(0, 0, MID_RADIUS - ((MID_RADIUS - INNER_RADIUS) / 2) - HALF_GAP_WIDTH, 9.0 * ANGLE_TWELFTH, 1.0 * ANGLE_TWELFTH);
						activeColorInner(cr, selection, Anchor.TOPRIGHT);
						cr.stroke();
						break;
				}

				cr.restore();
				return Sys.Clutter.EVENT_STOP;
			}
		}

		updateMenuSelection(splitMode: SplitMode) {
			const { x, y } = this.currentMouseRelative;
			const radius = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
			const angle = Math.atan2(y, x);
			// log("radius = " + radius);
			// log("angle = " + angle);a
			var selection;
			if (radius <= this.INNER_RADIUS) {
				selection = MenuSelection.None(splitMode);
			} else if (radius < this.MID_RADIUS) {
				let innerSelection =
					(splitMode == SplitMode.FOUR) ? innerSelectionFour : innerSelectionSix;
				selection = MenuSelection.Inner(innerSelection(angle), splitMode);
			} else {
				selection = MenuSelection.Outer(outerSelection(angle), splitMode);
			}
			this.updateSelection(selection);
		}

		onMouseMove(mode: MouseMode, splitMode: SplitMode, eventPoint: Point): ClutterEventResponse {
			this.currentMouseRelative = Point.subtract(eventPoint, this.origin);
			if (mode === MouseMode.MENU) {
				this.updateMenuSelection(splitMode);
			}
			this.preview.onMouseMove(mode, eventPoint);
			return this.Sys.Clutter.EVENT_STOP;
		}

		trackMouse(prevMode: MouseMode): boolean {
			return this.preview.trackMouse(prevMode, this.getMousePosition());
		}

		updateSelection(newSelection: MenuSelection): void {
			if (!newSelection.eq(this.selection)) {
				p("updateSelection(" + JSON.stringify(newSelection) + ")");
				this.selection = newSelection;
				this.canvas.invalidate();
				this.preview.updateSelection(newSelection);
			}
		}

		applyDirection(direction: Direction) {
			const currentLocation = this.selection.index as Anchor;
			const selection = this.selection;
			switch (this.selection.ring) {
				case Ring.NONE:
				case Ring.INNER:
					switch (direction) {
						case Direction.UP: this.updateSelection(selection.Outer(Anchor.TOP)); break;
						case Direction.DOWN: this.updateSelection(selection.Outer(Anchor.BOTTOM)); break;
						case Direction.LEFT: this.updateSelection(selection.Outer(Anchor.LEFT)); break;
						case Direction.RIGHT: this.updateSelection(selection.Outer(Anchor.RIGHT)); break;
					}
				break;

				case Ring.OUTER:
					switch (direction) {
						case Direction.UP:
							switch (currentLocation) {
								case Anchor.LEFT: this.updateSelection(selection.Outer(Anchor.TOPLEFT)); break;
								case Anchor.RIGHT: this.updateSelection(selection.Outer(Anchor.TOPRIGHT)); break;
								default: this.updateSelection(selection.Outer(Anchor.TOP)); break;
							}
						break;

						case Direction.DOWN:
							switch (currentLocation) {
								case Anchor.LEFT: this.updateSelection(selection.Outer(Anchor.BOTTOMLEFT)); break;
								case Anchor.RIGHT: this.updateSelection(selection.Outer(Anchor.BOTTOMRIGHT)); break;
								default: this.updateSelection(selection.Outer(Anchor.BOTTOM)); break;
							}
						break;

						case Direction.LEFT:
							switch (currentLocation) {
								case Anchor.TOP: this.updateSelection(selection.Outer(Anchor.TOPLEFT)); break;
								case Anchor.BOTTOM: this.updateSelection(selection.Outer(Anchor.BOTTOMLEFT)); break;
								default: this.updateSelection(selection.Outer(Anchor.LEFT)); break;
							}
						break;

						case Direction.RIGHT:
							switch (currentLocation) {
								case Anchor.TOP: this.updateSelection(selection.Outer(Anchor.TOPRIGHT)); break;
								case Anchor.BOTTOM: this.updateSelection(selection.Outer(Anchor.BOTTOMRIGHT)); break;
								default: this.updateSelection(selection.Outer(Anchor.RIGHT)); break;
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
