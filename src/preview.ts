/// <reference path="common.ts" />
/// <reference path="logging.ts" />
/// <reference path="menu.ts" />
/// <reference path="menu_selection.ts" />
/// <reference path="math.ts" />

module Preview {
	const MANIPULATION_SCALE = 2.2;
	const MINIMUM_SIZE = 20;

	const ONE_THIRD = 1.0 / 3.0;
	const TWO_THIRD = 2.0 / 3.0;

	export function oppose(loc: Anchor): Anchor {
		return (loc + 4) % 8; // Magic!
	}

	export class LayoutPreview<WindowType> {
		private Sys: System<WindowType>
		private size: Point
		private base: Rect
		private preview: Rect = null
		private selection: MenuSelection;
		private windowRect: Rect;
		private win: WindowType;
		private visible: boolean;
		ui: Actor
		resizeCorner: Anchor;
		trackingOrigin: Point;

		constructor(Sys: System<WindowType>,
				size: Point, windowRect: Rect,
				win: WindowType)
		{
			this.Sys = Sys;
			this.size = size;
			this.ui = Sys.newClutterActor();
			this.ui.set_background_color(Sys.newClutterColor({
				red: 80,
				green: 158,
				blue: 255,
				alpha: 125
			}));
			this.resizeCorner = null;
			this.selection = MenuSelection.None(null);
			this.windowRect = windowRect;
			this.win = win;
			this.ui.hide();
			this.visible = false;
		}

		private selectOuter(loc: Anchor, splitMode: SplitMode): Rect {
			const size = this.size;
			switch (splitMode) {
				case SplitMode.FOUR:
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
			case SplitMode.SIX:
				switch (loc) {
					case Anchor.LEFT:
						return {
							pos: Point.ZERO,
							size: Point.scale({ x: ONE_THIRD, y: 1 }, size),
						}
					case Anchor.TOPLEFT:
						return {
							pos: Point.ZERO,
							size: Point.scale({ x: ONE_THIRD, y: 0.5 }, size),
						}
					case Anchor.TOP:
						return {
							pos: Point.scale({ x: ONE_THIRD, y: 0 }, size),
							size: Point.scale({ x: ONE_THIRD, y: 0.5 }, size),
						}
					case Anchor.TOPRIGHT:
						return {
							pos: Point.scale({ x: TWO_THIRD, y: 0 }, size),
							size: Point.scale({ x: ONE_THIRD, y: 0.5 }, size),
						}
					case Anchor.RIGHT:
						return {
							pos: Point.scale({ x: TWO_THIRD, y: 0 }, size),
							size: Point.scale({ x: ONE_THIRD, y: 1 }, size),
						}
					case Anchor.BOTTOMRIGHT:
						return {
							pos: Point.scale({ x: TWO_THIRD, y: 0.5 }, size),
							size: Point.scale({ x: ONE_THIRD, y: 0.5 }, size),
						}
					case Anchor.BOTTOM:
						return {
							pos: Point.scale({ x: ONE_THIRD, y: 0.5 }, size),
							size: Point.scale({ x: ONE_THIRD, y: 0.5 }, size),
						}
					case Anchor.BOTTOMLEFT:
						return {
							pos: Point.scale({ x: 0, y: 0.5 }, size),
							size: Point.scale({ x: ONE_THIRD, y: 0.5 }, size),
						}
				}
			}
			return null;
		}

		private selectInner(sel: Anchor, splitMode: SplitMode): Rect {
			switch (splitMode) {
				case SplitMode.FOUR:
					switch (sel) {
						case Anchor.TOP:
							return {
								pos: Point.ZERO,
								size: this.size,
							}
						case Anchor.BOTTOM:
							return null;

					}
					break;

				case SplitMode.SIX:
					switch (sel) {
						case Anchor.TOPLEFT:
							return {
								pos: Point.ZERO,
								size: Point.scale({ x: TWO_THIRD, y: 1 }, this.size),
							}
						case Anchor.TOPRIGHT:
							return {
								pos: Point.scale({ x: ONE_THIRD, y: 0 }, this.size),
								size: Point.scale({ x: TWO_THIRD, y: 1 }, this.size),
							}
						case Anchor.BOTTOM:
							return {
								pos: Point.scale({ x: ONE_THIRD, y: 0 }, this.size),
								size: Point.scale({ x: ONE_THIRD, y: 1 }, this.size),
							}
					}
					break;
			}
			return null;
		}

		trackMouse(prevMode: MouseMode, origin: Point): boolean {
			if (prevMode == MouseMode.MENU) {
				switch (this.selection.ring) {
					case Ring.INNER:
						return false;

					case Ring.OUTER:
						this.resizeCorner = oppose(this.selection.index);
						this.trackingOrigin = origin;
						break;

					case Ring.NONE:
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

		onMouseMove(mode: MouseMode, point: Point) {
			switch (mode) {
				case MouseMode.RESIZE:
					if (this.resizeCorner === null) {
						return;
					}
					var diff = Point.subtract(point, this.trackingOrigin);
					this.preview = LayoutPreview.applyResize(this.resizeCorner, diff, this.base, this.size);
					// p('move diff ' + JSON.stringify(diff)
					// 	+ ' (from origin ' + JSON.stringify(this.trackingOrigin) + ')'
					// 	+ ' turned base ' + JSON.stringify(this.base)
					// 	+ ' into rect ' + JSON.stringify(this.preview)
					// );
				break;

				case MouseMode.MOVE:
					var diff = Point.subtract(point, this.trackingOrigin);
					this.preview = LayoutPreview.applyMove(diff, this.base, this.size);
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

		public applyManipulator(fn: (r: Rect, bounds: Point) => Rect): void {
			if (this.preview === null) return;
			this.preview = fn(this.preview, this.size);
			this.updateUi();
		}

		static applyMove(diff: Point, base: Rect, bounds: Point): Rect {
			const ret = Rect.copy(base);
			const scaled = Point.scaleConstant(MANIPULATION_SCALE, diff);
			ret.pos.x = Math.max(0, Math.min(ret.pos.x + scaled.x, bounds.x - ret.size.x));
			ret.pos.y = Math.max(0, Math.min(ret.pos.y + scaled.y, bounds.y - ret.size.y));
			return ret;
		}

		static applyResize(location: Anchor, diff: Point, base: Rect, bounds: Point): Rect {
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
				const diff = MathUtil.between(MINIMUM_SIZE - ret.size[axis], scaled[axis], bounds[axis] - ret.pos[axis] - ret.size[axis]);
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

		updateSelection(sel: MenuSelection) {
			this.selection = sel;
			switch (sel.ring) {
				case Ring.OUTER:
					this.base = this.selectOuter(sel.index, sel.splitMode);
				break;

				case Ring.INNER:
					this.base = this.selectInner(sel.index, sel.splitMode);
				break;

				case Ring.NONE:
				default:
					this.base = null;
				break;
			}
			this.resetPreview();
		}

		private setVisible(visible: boolean) {
			// Whenever the preview is visible, the window is hidden
			if (this.visible == visible) {
				return
			}
			// p('setting visible to: ' + visible)
			if (this.win !== null) {
				this.Sys.setWindowHidden(this.win, visible);
			}
			if (visible) {
				this.ui.show();
			} else {
				this.ui.hide();
			}
			this.visible = visible;
		}

		private updateUi() {
			if (this.preview == null) {
				this.setVisible(false);
			} else {
				this.ui.set_size(this.preview.size.x, this.preview.size.y);
				this.ui.set_position(this.preview.pos.x, this.preview.pos.y);
				this.setVisible(true);
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
