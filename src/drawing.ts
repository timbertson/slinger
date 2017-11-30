/// <reference path="common.ts" />
module Drawing {
	// const St = imports.gi.St;
	// const Cogl = imports.gi.Cogl;
	const Clutter = imports.gi.Clutter;
	const Cairo = imports.cairo;
	const PI = Math.PI;
	const TAO = 2 * PI;
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

	interface Selection {
		ring: number
		index: number
	}

	module Point {
		export function scale(scale: number, p: Point2d): Point2d {
			return {
				x: Math.floor(p.x * scale),
				y: Math.floor(p.y * scale)
			}
		}

		export function subtract(a: Point2d, b: Point2d): Point2d {
			return {
				x: a.x - b.x,
				y: a.y- b.y
			}
		}
	}

	module Selection {
		export function eq(a: Selection, b: Selection) {
			return a.ring == b.ring && a.index == b.index;
		}
	}

	class MenuHandlers {
		draw: Function;
		onMouseMove: Function;
		selection: Selection;

		constructor(menuSize: Point2d, origin: Point2d, canvas: any) {
			const HALF : Point2d = Point.scale(0.5, menuSize);
			const OUTER_RADIUS = Math.floor(menuSize.x / 2);
			const MID_RADIUS = Math.floor(OUTER_RADIUS * 0.3);
			const INNER_RADIUS = Math.floor(OUTER_RADIUS * 0.1);
			const GAP_WIDTH = Math.floor(OUTER_RADIUS * 0.05);
			const HALF_GAP_WIDTH = Math.floor(GAP_WIDTH / 2);
			const EDGE_WIDTH = Math.floor(OUTER_RADIUS * 0.34);
			const CORNER_WIDTH = Math.floor(OUTER_RADIUS * 0.4);
			const CORNER_DISTANCE = Math.floor(OUTER_RADIUS * 0.8);
			const DARK = { luminance: 0.5, alpha: 0.5 };
			const LIGHT = { luminance: 0.8, alpha: 0.6 };
			const ACTIVE = { r: 0.1, g: 0.6, b: 0.8, a: 0.8 };

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
			function activeColor(cr: any, selection: Selection, item: Selection) {
				if (Selection.eq(selection, item)) {
					setColor(cr, ACTIVE);
				} else {
					setGrey(cr, DARK);
				}
			}

			this.draw = function draw(_canvas: any, cr: any, _width: number, _height: number) {
				const selection = self.selection;
				// reset surface
				cr.save();
				cr.setOperator(Cairo.Operator.CLEAR);
				cr.paint();
				cr.restore();

				// log("drawing! (radius = " + OUTER_RADIUS + ", selection = " + JSON.stringify(self.selection) + ")"); cr.save();

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

				cr.arc(0, 0, OUTER_RADIUS, 0, TAO);
				cr.clip();

				// reset rotation
				cr.rotate(PI);

				// outer fill
				cr.arc(0, 0, OUTER_RADIUS - ((OUTER_RADIUS - MID_RADIUS - GAP_WIDTH) / 2) - HALF_GAP_WIDTH, 0, TAO);
				setGrey(cr, LIGHT);
				cr.setLineWidth(OUTER_RADIUS - MID_RADIUS);
				cr.stroke();

				// outer edge fills (top / left / right / bottom)
				cr.setLineWidth(EDGE_WIDTH);

				// right edge
				cr.arc(0, 0, OUTER_RADIUS - (EDGE_WIDTH/2), -ANGLE_SIXTEENTH, ANGLE_SIXTEENTH);
				activeColor(cr, selection, { ring: 2, index: 4 });
				cr.stroke();

				// left edge
				cr.arc(0, 0, OUTER_RADIUS - (EDGE_WIDTH/2), ANGLE_HALF - ANGLE_SIXTEENTH, ANGLE_HALF + ANGLE_SIXTEENTH);
				activeColor(cr, selection, { ring: 2, index: 0 });
				cr.stroke();

				// bottom edge
				cr.arc(0, 0, OUTER_RADIUS - (EDGE_WIDTH/2), ANGLE_QUARTER - ANGLE_SIXTEENTH, ANGLE_QUARTER + ANGLE_SIXTEENTH);
				activeColor(cr, selection, { ring: 2, index: 6 });
				cr.stroke();

				// top edge
				cr.arc(0, 0, OUTER_RADIUS - (EDGE_WIDTH/2), -ANGLE_QUARTER - ANGLE_SIXTEENTH, -ANGLE_QUARTER + ANGLE_SIXTEENTH);
				activeColor(cr, selection, { ring: 2, index: 2 });
				cr.stroke();


				// corner shades:
				cr.arc(CORNER_DISTANCE, CORNER_DISTANCE, CORNER_WIDTH, 0, TAO);
				activeColor(cr, selection, { ring: 2, index: 5 });
				cr.fill();

				cr.arc(-CORNER_DISTANCE, CORNER_DISTANCE, CORNER_WIDTH, 0, TAO);
				activeColor(cr, selection, { ring: 2, index: 7 });
				cr.fill();

				cr.arc(-CORNER_DISTANCE, -CORNER_DISTANCE, CORNER_WIDTH, 0, TAO);
				activeColor(cr, selection, { ring: 2, index: 1 });
				cr.fill();

				cr.arc(CORNER_DISTANCE, -CORNER_DISTANCE, CORNER_WIDTH, 0, TAO);
				activeColor(cr, selection, { ring: 2, index: 3 });
				cr.fill();

				// mid buttons:
				cr.resetClip()
				cr.rectangle(-HALF.x, -HALF.y, menuSize.x, menuSize.y);
				cr.rectangle(HALF.x, - HALF_GAP_WIDTH, - menuSize.x, GAP_WIDTH);
				cr.clip();

				cr.setLineWidth(MID_RADIUS - INNER_RADIUS - HALF_GAP_WIDTH);
				cr.arc(0, 0, MID_RADIUS - ((MID_RADIUS - INNER_RADIUS) / 2) - HALF_GAP_WIDTH, 0, TAO);
				setGrey(cr, LIGHT);
				cr.stroke();

				cr.arc(0, 0, MID_RADIUS - ((MID_RADIUS - INNER_RADIUS) / 2) - HALF_GAP_WIDTH, PI, TAO);
				activeColor(cr, selection, { ring: 1, index: 0 });
				cr.stroke();

				cr.arc(0, 0, MID_RADIUS - ((MID_RADIUS - INNER_RADIUS) / 2) - HALF_GAP_WIDTH, 0, PI);
				activeColor(cr, selection, { ring: 1, index: 1 });
				cr.stroke();

				cr.restore();
				return false;
			}

			function updateSelection(newSelection: Selection) {
				log("updateSelection(" + JSON.stringify(newSelection) + ")");
				if (!Selection.eq(self.selection, newSelection)) {
					self.selection = newSelection;
					canvas.invalidate();
				}
			}

			function circularIndex(sections: number, offset: number) {
				const span = TAO / sections;
				return function(angle: number) {
					return Math.floor((angle + PI + offset) / span) % sections;
				}
			}

			const innerIndex = circularIndex(2, 0);
			const outerIndex = circularIndex(8, ANGLE_SIXTEENTH);

			this.onMouseMove = function(_actor: any, event: any) {
				const [absx,absy] = event.get_coords();
				const mousePos = Point.subtract({x: absx, y: absy}, origin);
				const { x, y } = mousePos;
				log(JSON.stringify(mousePos));

				const radius = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
				const angle = Math.atan2(y, x);
				// log("radius = " + radius);
				// log("angle = " + angle);

				if (radius <= INNER_RADIUS) {
					updateSelection(UNSELECTED);
				} else if (radius < MID_RADIUS) {
					updateSelection({
						ring: 1,
						index: innerIndex(angle),
					});
				} else {
					updateSelection({
						ring: 2,
						index: outerIndex(angle),
					});
				}
			}
		}
	}

	export class Menu {
		actor: any;
		canvas: any;
		selected: Selection;

		constructor(size: Point2d, _center: Point2d) {
			const actor = this.actor = new Clutter.Actor();
			actor.set_size(size.x, size.y);

			const menu = new Clutter.Actor();
			menu.set_background_color(new Clutter.Color({
				red: 128,
				green: 128,
				blue: 128,
				alpha: 128
			}));
			const menu_size: Point2d = { x: 200, y: 200 };
			menu.set_size(menu_size.x, menu_size.y);

			const canvas = this.canvas = new Clutter.Canvas();
			canvas.set_size(menu_size.x, menu_size.y);
			menu.set_content(canvas);
			actor.set_reactive(true);

			actor.connect('button-press-event', function(_actor: any, event: any) {
				const [x, y] = event.get_coords();
				const menu_origin = { x, y };
				const menu_position: Point2d = Point.subtract(menu_origin, Point.scale(0.5, menu_size));
				menu.set_position(menu_position.x, menu_position.y);

				const handlers = new MenuHandlers(menu_size, menu_origin, canvas);
				canvas.connect('draw', handlers.draw);
				actor.connect('motion-event', handlers.onMouseMove);

				actor.add_child(menu);
				canvas.invalidate();
			});
		}
	}
}



