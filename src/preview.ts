/// <reference path="common.ts" />
/// <reference path="logging.ts" />
/// <reference path="menu.ts" />
/// <reference path="math.ts" />

module Preview {
	const Clutter = imports.gi.Clutter;

	const MANIPULATION_SCALE = 2.2;
	const MINIMUM_SIZE = 20;

	export function oppose(loc: Anchor): Anchor {
		return (loc + 4) % 8; // Magic!
	}

	export class LayoutPreview {
		private size: Point
		private bounds: Rect
		private base: Rect
		private preview: Rect
		private selection: Menu.Selection;
		private windowRect: Rect;
		private windowActor: Actor;
		ui: Actor
		resizeCorner: Anchor;
		trackingOrigin: Point;

		constructor(size: Point, windowRect: Rect, windowActor: Actor) {
			this.size = size;
			this.bounds = { pos: Point.ZERO, size: this.size };
			this.ui = new Clutter.Actor();
			this.ui.set_background_color(new Clutter.Color({
				red: 80,
				green: 158,
				blue: 255,
				alpha: 125
			}));
			this.resizeCorner = null;
			this.selection = Menu.Selection.None;
			this.windowRect = windowRect;
			this.windowActor = windowActor;
			this.ui.hide();
		}

		private selectOuter(loc: Anchor): Rect {
			const size = this.size;
			switch (loc) {
				case Anchor.LEFT:
					return {
						pos: Point.ZERO,
						size: Point.scale({ x: 0.5, y: 1 }, size),
					}
				case Anchor.TOPLEFT:
					return {
						pos: Point.ZERO,
						size: Point.scaleConstant(0.5, size),
					}
				case Anchor.TOP:
					return {
						pos: Point.ZERO,
						size: Point.scale({ x: 1, y: 0.5 }, size),
					}
				case Anchor.TOPRIGHT:
					return {
						pos: Point.scale({ x: 0.5, y: 0 }, size),
						size: Point.scaleConstant(0.5, size),
					}
				case Anchor.RIGHT:
					return {
						pos: Point.scale({ x: 0.5, y: 0 }, size),
						size: Point.scale({ x: 0.5, y: 1 }, size),
					}
				case Anchor.BOTTOMRIGHT:
					return {
						pos: Point.scaleConstant(0.5, size),
						size: Point.scaleConstant(0.5, size),
					}
				case Anchor.BOTTOM:
					return {
						pos: Point.scale({ x: 0, y: 0.5 }, size),
						size: Point.scale({ x: 1, y: 0.5 }, size),
					}
				case Anchor.BOTTOMLEFT:
					return {
						pos: Point.scale({ x: 0, y: 0.5}, size),
						size: Point.scaleConstant(0.5, size),
					}
			}
			return null;
		}

		private selectInner(sel: Menu.InnerSelection): Rect {
			switch (sel) {
				case Menu.InnerSelection.MAXIMIZE:
					return {
						pos: Point.ZERO,
						size: this.size,
					}

				case Menu.InnerSelection.MINIMIZE:
				default:
					return null;
			}
		}

		trackMouse(prevMode: MouseMode, origin: Point): boolean {
			if (prevMode == MouseMode.MENU) {
				switch (this.selection.ring) {
					case Menu.Ring.INNER:
						return false;

					case Menu.Ring.OUTER:
						this.resizeCorner = oppose(this.selection.index);
						this.trackingOrigin = origin;
						break;

					case Menu.Ring.NONE:
						this.resetTracking(origin);
						break;
				}
			} else {
				this.resetTracking(origin);
			}

			this.base = this.preview; // capture whatever we have as a base
			this.updateUi();
			return true;
		}

		resetTracking(origin: Point) {
			if (this.preview == null) {
				this.preview = this.windowRect;
			}
			this.base = this.preview;
			this.resizeCorner = Rect.closestCorner(this.preview, origin);
			this.trackingOrigin = origin;
			this.updateUi();
		}

		onMouseMove(mode: MouseMode, event: ClutterMouseEvent) {
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

		public applyManipulator(fn: (r: Rect, bounds: Rect) => Rect): void {
			if (this.preview === null) return;
			this.preview = fn(this.preview, this.bounds);
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

		static applyResize(location: Anchor, diff: Point, base: Rect, bounds: Rect): Rect {
			const ret = Rect.copy(base);
			const scaled = Point.scaleConstant(MANIPULATION_SCALE, diff);

			function moveNear(axis: Axis) {
				// minimum diff is enough to bring this edge to 0 (i.e. invert the current pos)
				// maximum diff is enough to bring this edge to ther other side of this rect, minus MINIMUM_SIZE
				// p('moveNear['+axis+']');
				const diff = MathUtil.between(-ret.pos[axis], scaled[axis], ret.size[axis] - MINIMUM_SIZE);
				ret.pos[axis] += diff;
				ret.size[axis] -= diff;
			}

			function moveFar(axis: Axis) {
				// minimum diff is enough to bring this edge to the other side of this rect, plus MINIMUM_SIZE
				// maximum diff is enough to bring this edge to the right bounds
				// p('moveFar['+axis+']');
				const diff = MathUtil.between(MINIMUM_SIZE - ret.size[axis], scaled[axis], bounds.size[axis] - ret.pos[axis] - ret.size[axis]);
				ret.size[axis] += diff;
			}

			switch (location) {
				case Anchor.LEFT:
					moveNear(Axis.x);
				break;

				case Anchor.TOPLEFT:
					moveNear(Axis.x);
					moveNear(Axis.y);
				break;

				case Anchor.TOP:
					moveNear(Axis.y);
				break;

				case Anchor.TOPRIGHT:
					moveNear(Axis.y);
					moveFar(Axis.x);
				break;

				case Anchor.RIGHT:
					moveFar(Axis.x);
				break;
					
				case Anchor.BOTTOMRIGHT:
					moveFar(Axis.x);
					moveFar(Axis.y);
				break;

				case Anchor.BOTTOM:
					moveFar(Axis.y);
				break;

				case Anchor.BOTTOMLEFT:
					moveNear(Axis.x);
					moveFar(Axis.y);
				break;

				default:
					throw new Error("unknown location: " + location);
			}

			return ret;
		}

		updateSelection(sel: Menu.Selection) {
			this.selection = sel;
			switch (sel.ring) {
				case Menu.Ring.OUTER:
					this.base = this.selectOuter(sel.index);
				break;

				case Menu.Ring.INNER:
					this.base = this.selectInner(sel.index);
				break;

				case Menu.Ring.NONE:
				default:
					this.base = null;
				break;
			}
			this.resetPreview();
		}

		private setWindowHidden(hidden: boolean) {
			if (this.windowActor !== null) {
				this.windowActor.set_opacity(hidden ? 0 : 255);
			}
		}

		private updateUi() {
			if (this.preview == null) {
				this.ui.hide();
				this.setWindowHidden(false);
			} else {
				this.ui.set_position(this.preview.pos.x, this.preview.pos.y);
				this.ui.set_size(this.preview.size.x, this.preview.size.y);
				this.setWindowHidden(true);
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
}
