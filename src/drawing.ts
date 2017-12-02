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

	enum Location {
		LEFT = 0,
		TOPLEFT,
		TOP,
		TOPRIGHT,
		RIGHT,
		BOTTOMRIGHT,
		BOTTOM,
		BOTTOMLEFT,
	}

	enum InnerSelection {
		MAXIMIZE = 0,
		MINIMIZE
	}

	enum Ring {
		NONE = 0,
		INNER,
		OUTER
	}

	interface Selection {
		ring: Ring
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
		export function eqTo(a: Selection, ring: Ring, location: number) {
			return a.ring == ring && a.index == location;
		}
	}

	class MenuHandlers {
		draw: Function;
		onMouseMove: Function;
		selection: Selection;

		constructor(menuSize: Point2d, origin: Point2d, canvas: any) {
			const HALF : Point2d = Point.scale(0.5, menuSize);
			const BORDER_WIDTH = Math.floor(menuSize.x * 0.03);
			const OUTER_RADIUS = Math.floor(menuSize.x / 2) - BORDER_WIDTH;
			const MID_RADIUS = Math.floor(OUTER_RADIUS * 0.3);
			const INNER_RADIUS = Math.floor(OUTER_RADIUS * 0.1);
			const GAP_WIDTH = Math.floor(OUTER_RADIUS * 0.05);
			const HALF_GAP_WIDTH = Math.floor(GAP_WIDTH / 2);
			const EDGE_WIDTH = Math.floor(OUTER_RADIUS * 0.34);
			const CORNER_WIDTH = Math.floor(OUTER_RADIUS * 0.4);
			const CORNER_DISTANCE = Math.floor(OUTER_RADIUS * 0.8);
			const DARK = { luminance: 0.05, alpha: 0.6 };
			const LIGHT = { luminance: 0.8, alpha: 0.2 };
			const BG = { luminance: 1, alpha: 0.2 };
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

			function activeColor(cr: any, selection: Selection, ring: Ring, location: number) {
				if (Selection.eqTo(selection, ring, location)) {
					setColor(cr, ACTIVE);
				} else {
					setGrey(cr, DARK);
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
				setGrey(cr, LIGHT);
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
				setGrey(cr, LIGHT);
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
						ring: 1,
						index: innerIndex(angle),
					});
				} else {
					updateSelection({
						ring: 2,
						index: outerIndex(angle),
					});
				}
				return Clutter.EVENT_STOP;
			}
		}
	}

	// class LayoutPreview {
	// 	bounds: Rect
	// 	preview: Rect
	// 	constructor(bounds: Point2d) {
	// 	}
  //
	// 	setSelection(sel: Selection) {
  //
	// 	}
	// }

	export class Menu {
		ui: any;
		private parent: any;
		// private selected: Selection;

		constructor(parent: any, screen: Rect, origin: Point2d) {
			p("creating menu at " + JSON.stringify(origin) + " with bounds " + JSON.stringify(screen));
			const self = this;
			this.parent = parent;
			const backgroundActor = new Clutter.Actor();
			backgroundActor.set_size(screen.size.x, screen.size.y);

			const menu = new Clutter.Actor();

			const menuSize: Point2d = { x: 200, y: 200 };
			menu.set_size(menuSize.x, menuSize.y);

			const canvas = new Clutter.Canvas();
			canvas.set_size(menuSize.x, menuSize.y);
			menu.set_content(canvas);

			const position: Point2d = Point.subtract(Point.subtract(origin, screen.pos), Point.scale(0.5, menuSize));
			menu.set_position(position.x, position.y);

			const handlers = new MenuHandlers(menuSize, origin, canvas);
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
					self.destroy();
					return Clutter.EVENT_STOP;
				}
			});

			const coverPane = new Clutter.Actor({ reactive: true });
			coverPane.set_reactive(true);
			// coverPane.set_size(screen.size.x, screen.size.y);
	// coverPane.set_background_color(new Clutter.Color({
	// 	red: 255,
	// 	green: 128,
	// 	blue: 128,
	// 	alpha: 255
	// }));
			coverPane.connect('event', function () {
				p("catching event..");
				return Clutter.EVENT_STOP;
			});

			this.ui = coverPane;
			backgroundActor.set_reactive(true);
			backgroundActor.add_actor(menu);
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

		private displayed() {
			return (this.parent !== null);
		}
	}
}

