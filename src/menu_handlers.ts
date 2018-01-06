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

	function circularIndex(sections: number, offset: number) {
		const span = TAO / sections;
		return function(angle: number) {
			return floor((angle + PI + offset) / span) % sections;
		}
	}

	const innerIndex = circularIndex(2, 0);
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

		constructor(Sys: System<any>, menuSize: Point, origin: Point, canvas: ClutterCanvas, preview: Preview.LayoutPreview<any>) {
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
			const DARK = floatColor({ r: 18, g: 36, b: 48, a: 200 });
			const LIGHT = floatColor({ r: 66, g: 79, b: 92, a: 237 });
			const BG = { luminance: 0.7, alpha: 0.7 };
			const ACTIVE = floatColor({ r: 45, g: 155, b: 203, a: 255 });

			this.selection = MenuSelection.None;

			function setGrey(cr: CairoContext, grey: Grey) {
				cr.setSourceRGBA(grey.luminance, grey.luminance, grey.luminance, grey.alpha);
			}
			function setColor(cr: CairoContext, c: Color) {
				cr.setSourceRGBA(c.r, c.g, c.b, c.a);
			}

			function activeColor(cr: CairoContext, selection: MenuSelection, ring: Ring, location: number) {
				if (MenuSelection.eqTo(selection, ring, location)) {
					setColor(cr, ACTIVE);
				} else {
					setColor(cr, DARK);
				}
			}

			function activeColorInner(cr: CairoContext, selection: MenuSelection, location: InnerSelection) {
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
				return Sys.Clutter.EVENT_STOP;
			}
		}

		onMouseMove(mode: MouseMode, event: ClutterMouseEvent): ClutterEventResponse {
			const point = this.currentMouseRelative = Point.ofEvent(event, this.origin);
			if (mode === MouseMode.MENU) {
				const { x, y } = point;
				const radius = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
				const angle = Math.atan2(y, x);
				// log("radius = " + radius);
				// log("angle = " + angle);

				if (radius <= this.INNER_RADIUS) {
					this.updateSelection(MenuSelection.None);
				} else if (radius < this.MID_RADIUS) {
					this.updateSelection(MenuSelection.Inner(innerIndex(angle)));
				} else {
					this.updateSelection(MenuSelection.Outer(outerIndex(angle)));
				}
			}
			this.preview.onMouseMove(mode, event);
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
			switch (this.selection.ring) {
				case Ring.NONE:
					switch (direction) {
						case Direction.UP: this.updateSelection(MenuSelection.Outer(Anchor.TOP)); break;
						case Direction.DOWN: this.updateSelection(MenuSelection.Outer(Anchor.BOTTOM)); break;
						case Direction.LEFT: this.updateSelection(MenuSelection.Outer(Anchor.LEFT)); break;
						case Direction.RIGHT: this.updateSelection(MenuSelection.Outer(Anchor.RIGHT)); break;
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
								case Anchor.LEFT: this.updateSelection(MenuSelection.Outer(Anchor.TOPLEFT)); break;
								case Anchor.RIGHT: this.updateSelection(MenuSelection.Outer(Anchor.TOPRIGHT)); break;
								default: this.updateSelection(MenuSelection.Outer(Anchor.TOP)); break;
							}
						break;

						case Direction.DOWN:
							switch (currentLocation) {
								case Anchor.LEFT: this.updateSelection(MenuSelection.Outer(Anchor.BOTTOMLEFT)); break;
								case Anchor.RIGHT: this.updateSelection(MenuSelection.Outer(Anchor.BOTTOMRIGHT)); break;
								default: this.updateSelection(MenuSelection.Outer(Anchor.BOTTOM)); break;
							}
						break;

						case Direction.LEFT:
							switch (currentLocation) {
								case Anchor.TOP: this.updateSelection(MenuSelection.Outer(Anchor.TOPLEFT)); break;
								case Anchor.BOTTOM: this.updateSelection(MenuSelection.Outer(Anchor.BOTTOMLEFT)); break;
								default: this.updateSelection(MenuSelection.Outer(Anchor.LEFT)); break;
							}
						break;

						case Direction.RIGHT:
							switch (currentLocation) {
								case Anchor.TOP: this.updateSelection(MenuSelection.Outer(Anchor.TOPRIGHT)); break;
								case Anchor.BOTTOM: this.updateSelection(MenuSelection.Outer(Anchor.BOTTOMRIGHT)); break;
								default: this.updateSelection(MenuSelection.Outer(Anchor.RIGHT)); break;
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
