/// <reference path="common.ts" />
module Drawing {
	// const St = imports.gi.St;
	// const Cogl = imports.gi.Cogl;
	const Clutter = imports.gi.Clutter;
	// const Cairo = imports.cairo;
	const TAO = 2 * Math.PI;
	interface Grey {
		luminance: number
		alpha: number
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

	export class Menu {
		actor: any;
		canvas: any;

		constructor(size: Point2d, center: Point2d) {
			const self = this;
			const actor = this.actor = new Clutter.Actor();
			actor.set_size(size.x, size.y);

			const menu = new Clutter.Actor();
			// menu.set_background_color(new Clutter.Color({
			// 	red: 255,
			// 	green: 0,
			// 	blue: 0,
			// 	alpha: 255
			// }));
			const menu_size: Point2d = { x: 200, y: 200 };
			const menu_origin: Point2d = Point.subtract(center, Point.scale(0.5, menu_size));
			menu.set_position(menu_origin.x, menu_origin.y);
			menu.set_size(menu_size.x, menu_size.y);

			const canvas = this.canvas = new Clutter.Canvas();
			canvas.set_size(menu_size.x, menu_size.y);
			menu.set_content(canvas);
			menu.set_reactive(true);

			function delegate(prop:string) {
				return function():void {
					(self as any)[prop].apply(self, arguments);
				}
			};
			canvas.connect('draw', this.makeDraw(menu_size));
			menu.connect('motion-event', delegate('onMouseMove'));
			canvas.invalidate();

			actor.add_child(menu);
		}

		onMouseMove(_actor: any, event: any) {
			log("move!" + event);
			const [x,y] = event.get_coords();
			log(x);
			log(y);
			log(JSON.stringify(event.get_coords()));
			// this.canvas.invalidate();
		}

		makeDraw(size: Point2d) {
			const HALF : Point2d = Point.scale(0.5, size);
			const OUTER_RADIUS = Math.floor(size.x / 2);
			const MID_RADIUS = Math.floor(OUTER_RADIUS * 0.3);
			const INNER_RADIUS = Math.floor(OUTER_RADIUS * 0.1);
			const GAP_WIDTH = Math.floor(OUTER_RADIUS * 0.05);
			const HALF_GAP_WIDTH = Math.floor(GAP_WIDTH / 2);
			const EDGE_WIDTH = Math.floor(OUTER_RADIUS * 0.34);
			const CORNER_WIDTH = Math.floor(OUTER_RADIUS * 0.4);
			const CORNER_DISTANCE = Math.floor(OUTER_RADIUS * 0.8);
			const DARK = { luminance: 0.5, alpha: 0.8 };
			const LIGHT = { luminance: 0.4, alpha: 0.5 };

			const ANGLE_HALF = Math.PI;
			const ANGLE_QUARTER = ANGLE_HALF / 2;
			const ANGLE_EIGHTH = ANGLE_QUARTER / 2;
			const ANGLE_SIXTEENTH = ANGLE_EIGHTH / 2;

			function setGrey(cr: any, grey: Grey) {
				cr.setSourceRGBA(grey.luminance, grey.luminance, grey.luminance, grey.alpha);
			}

			return function draw(_canvas: any, cr: any, _width: number, _height: number) {
				log("drawing! (radius = " + OUTER_RADIUS + ")");
				cr.save();

				cr.rectangle(0, 0, size.x, size.y);

				// draw everything (from now on) around the origin
				cr.translate(HALF.x, HALF.y);

				// horizontal clips: just keep drawing the same rect and rotating it..
				cr.rotate(ANGLE_SIXTEENTH);
				cr.rectangle(HALF.x, - HALF_GAP_WIDTH, - size.x, GAP_WIDTH);
				cr.rotate(ANGLE_EIGHTH);
				cr.rectangle(HALF.x, - HALF_GAP_WIDTH, - size.x, GAP_WIDTH);
				cr.rotate(ANGLE_EIGHTH);
				cr.rectangle(HALF.x, - HALF_GAP_WIDTH, - size.x, GAP_WIDTH);
				cr.rotate(ANGLE_EIGHTH);
				cr.rectangle(HALF.x, - HALF_GAP_WIDTH, - size.x, GAP_WIDTH);
				cr.rotate(ANGLE_SIXTEENTH);
				cr.clip();

				cr.arc(0, 0, OUTER_RADIUS, 0, TAO);
				cr.clip();

				// reset rotation
				cr.rotate(Math.PI);

				// outer fill
				cr.arc(0, 0, OUTER_RADIUS - ((OUTER_RADIUS - MID_RADIUS - GAP_WIDTH) / 2) - HALF_GAP_WIDTH, 0, TAO);
				setGrey(cr, LIGHT);
				cr.setLineWidth(OUTER_RADIUS - MID_RADIUS - HALF_GAP_WIDTH);
				cr.stroke();

				// outer edge fills (top / left / right / bottom)
				setGrey(cr, DARK);
				// right edge
				cr.arc(0, 0, OUTER_RADIUS - (EDGE_WIDTH/2), -ANGLE_SIXTEENTH, ANGLE_SIXTEENTH);
				// left edge
				cr.newSubPath();
				cr.arc(0, 0, OUTER_RADIUS - (EDGE_WIDTH/2), ANGLE_HALF - ANGLE_SIXTEENTH, ANGLE_HALF + ANGLE_SIXTEENTH);

				// top edge
				cr.newSubPath();
				cr.arc(0, 0, OUTER_RADIUS - (EDGE_WIDTH/2), ANGLE_QUARTER - ANGLE_SIXTEENTH, ANGLE_QUARTER + ANGLE_SIXTEENTH);

				// bottom edge
				cr.newSubPath();
				cr.arc(0, 0, OUTER_RADIUS - (EDGE_WIDTH/2), -ANGLE_QUARTER - ANGLE_SIXTEENTH, -ANGLE_QUARTER + ANGLE_SIXTEENTH);

				cr.setLineWidth(EDGE_WIDTH);
				cr.stroke();


				// corner shades:
				cr.arc(CORNER_DISTANCE, CORNER_DISTANCE, CORNER_WIDTH, 0, TAO); cr.newSubPath();
				cr.arc(-CORNER_DISTANCE, CORNER_DISTANCE, CORNER_WIDTH, 0, TAO); cr.newSubPath();
				cr.arc(-CORNER_DISTANCE, -CORNER_DISTANCE, CORNER_WIDTH, 0, TAO); cr.newSubPath();
				cr.arc(CORNER_DISTANCE, -CORNER_DISTANCE, CORNER_WIDTH, 0, TAO); cr.newSubPath();
				cr.fill()


				// mid buttons:
				cr.resetClip()
				cr.rectangle(-HALF.x, -HALF.y, size.x, size.y);
				cr.rectangle(HALF.x, - HALF_GAP_WIDTH, - size.x, GAP_WIDTH);
				cr.clip();

				cr.arc(0, 0, MID_RADIUS - ((MID_RADIUS - INNER_RADIUS) / 2) - HALF_GAP_WIDTH, 0, TAO);
				cr.setLineWidth(MID_RADIUS - INNER_RADIUS - HALF_GAP_WIDTH);
				setGrey(cr, LIGHT);
				cr.strokePreserve();
				setGrey(cr, DARK);
				cr.stroke();

				cr.restore();
				return false;
			}
		}
	}
}



