/// <reference path="manipulations.ts" />

module MetaUtil {
	const Meta = imports.gi.Meta;
	const Main = imports.ui.main;
	const Mainloop = imports.mainloop;

	export function rect(metaRect: MetaRect): Rect {
		return {
			pos: { x: metaRect.x, y: metaRect.y },
			size: { x: metaRect.width, y: metaRect.height },
		};
	}

	export function moveResize(win: MetaWindow, rect: Rect) {
		if(win.get_maximized() !== MaximizeFlags.Neither) {
			unmaximize(win);
		}
		win.move_resize_frame(true,
			rect.pos.x,
			rect.pos.y,
			rect.size.x,
			rect.size.y);
	}

	export function currentWindow(): MetaWindow {
		return global.screen.get_display()['focus-window'];
	}

	export function workspaceArea(win: MetaWindow): Rect {
		return MetaUtil.rect(win.get_work_area_current_monitor());
	}

	export function unmaximize(win: MetaWindow) {
		win.unmaximize(Meta.MaximizeFlags.VERTICAL | Meta.MaximizeFlags.HORIZONTAL);
	}

	export function maximize(win: MetaWindow) {
		win.maximize(Meta.MaximizeFlags.VERTICAL | Meta.MaximizeFlags.HORIZONTAL);
	}

	const VISIBLE_WINDOW_TYPES = [
		Meta.WindowType.NORMAL,
		Meta.WindowType.DIALOG,
		Meta.WindowType.UTILITY,
	];

	function listWindows(win?: MetaWindow): Array<MetaWindow> {
		// XXX is this multi-monitor compatible?
		const screen = (win == null) ? global.screen : win.get_screen();
		const screenNo = screen.get_screen_number();
		return screen.get_active_workspace().list_windows().filter(function(w: MetaWindow) {
			return (
				w.get_screen().get_screen_number() == screenNo
				&& VISIBLE_WINDOW_TYPES.indexOf(w.get_window_type()) !== -1
			);
		});
	}

	export function visibleWindows(win: MetaWindow): Array<MetaWindow> {
		return listWindows(win).filter(function(w: MetaWindow) {
			return !w.minimized;
		});
	}

	export function minimizedWindows(): Array<MetaWindow> {
		return listWindows().filter(function(w: MetaWindow) {
			return w.minimized;
		});
	}

	export function activate(win: MetaWindow): void {
		Main.activateWindow(win, global.get_current_time());
	}

	export function activateLater(win: MetaWindow): void {
		Mainloop.idle_add(function() {
			Main.activateWindow(win, global.get_current_time());
			return false;
		});
	}
}


module WindowActions {
	function assert(x: any) {
		if (!x) throw new Error("Assertion failed");
	}

	function windowManipulator(fn: (r: Rect, bounds: Rect) => Rect): Function {
		return function() {
			const win = MetaUtil.currentWindow();
			if (win == null) {
				p("no current window");
				return;
			}
			const newRect = fn(
				MetaUtil.rect(win.get_frame_rect()),
				MetaUtil.workspaceArea(win));
			MetaUtil.moveResize(win, newRect);
			MetaUtil.activateLater(win);
		}
	}

	export function moveAction(direction: number, axis: Axis): Function {
		return windowManipulator(Manipulations.move(direction, axis));
	}

	export function resizeAction(direction: number, axis: Axis): Function {
		return windowManipulator(Manipulations.resize(direction, axis));
	}

	function withWorkspaceDiff(diff: number, fn: (ws: MetaWorkspace, idx: number) => void): void {
		const workspaceIdx = global.screen.get_active_workspace_index();
		const numWorkspaces = global.screen.get_n_workspaces();
		const newIdx = workspaceIdx + diff;
		if (newIdx < 0 || newIdx >= numWorkspaces) return;
		fn(global.screen.get_workspace_by_index(newIdx), newIdx);
	}

	export function switchWorkspace(diff: number) {
		return function() {
			withWorkspaceDiff(diff, function(ws: MetaWorkspace, _idx: number) {
				ws.activate(global.get_current_time());
			});
		}
	}

	export function moveWindowWorkspace(diff: number) {
		return function() {
			const win = MetaUtil.currentWindow();
			if (win === null) return;
			withWorkspaceDiff(diff, function(ws: MetaWorkspace, idx: number) {
				win.move_to_workspace(idx);
				ws.activate_with_focus(win, global.get_current_time())
			})
		}
	}

	export function toggleMaximize() {
		const win = MetaUtil.currentWindow();
		if (win === null) return;
		if (win.get_maximized() === MaximizeFlags.Neither) {
			MetaUtil.maximize(win);
		} else {
			MetaUtil.unmaximize(win);
		}
		MetaUtil.activateLater(win);
	}

	export function minimize() {
		const win = MetaUtil.currentWindow();
		if (win === null) return;
		win.minimize();
	}

	export function unminimize() {
		const minimized = MetaUtil.minimizedWindows();
		// TODO: sort by last minimized?
		const win = minimized[0];
		if (!win) return;
		win.unminimize();
	}

	function radialSortOrder(rect: Rect, screenMidpoint: Point) {
		const midpoint = Rect.midpoint(rect);
		const vector = Point.subtract(screenMidpoint, midpoint);
		const half_pi = Math.PI / 2;
		const tao = Math.PI * 2;

		var angle;
		if (Point.eqTo(vector, 0, 0)) {
			angle = -half_pi;
		} else {
			// atan2 gives angles in the range -PI (pointing due left) through to +PI, anti-clockwise
			angle = Math.atan2(vector.y, vector.x);
		}

		// shift angles to all be negative, then negate them to make clockwise
		angle = (angle + Math.PI);

		// take a slice on the left, just below horizontal and shift it into negative
		// so that it's ordered first
		if (angle > ((31/32) * tao)) {
			angle -= tao;
		}

		// p("sort order for window " + item + ":")
		// p("sort order window rect = " + JSON.stringify(item.desired_rect()) + ", midpoint = " + JSON.stringify(midpoint));
		// p("sort order angle = " + angle + ", vector = " + JSON.stringify(vector));
		// p("sort order ...");

		return angle;
	}

	class SortableWindow {
		win: MetaWindow
		order: number

		constructor(win: MetaWindow, midpoint: Point) {
			this.win = win;
			this.order = radialSortOrder(MetaUtil.rect(win.get_frame_rect()), midpoint);
		}
	}

	function withWindowPair(diff: number, fn: (a: MetaWindow, b: MetaWindow) => void): void {
		const win = MetaUtil.currentWindow();
		if (win === null) return;

		const workArea = MetaUtil.workspaceArea(win);
		const screenMidpoint = Rect.midpoint(workArea);

		const windows = (MetaUtil.visibleWindows(win)
			.map(function(w: MetaWindow) { return new SortableWindow(w, screenMidpoint); })
			.sort(function(a: SortableWindow, b: SortableWindow) {
				if (a.order === b.order) {
					// ensure a stable sort by using index position for equivalent windows
					return a.win.get_stable_sequence() - b.win.get_stable_sequence();
				} else {
					return a.order - b.order;
				}
			})
		);

		if (windows.length <= 1) return;

		const windowIds = windows.map(function(w: SortableWindow) {
			return w.win.get_stable_sequence()
		});
		const windowIdx = windowIds.indexOf(win.get_stable_sequence());
		if (windowIdx === -1) {
			p("current window not found in visible windows")
			return;
		}

		// p("windows: " + JSON.stringify(windows.map(function(w: SortableWindow) {
		// 	return w.win.get_window_type() + "::" + w.win.get_title();
		// })));

		let newIdx = (windowIdx + diff) % windows.length;
		if (newIdx < 0) newIdx += windows.length;
		fn(win, windows[newIdx].win);
	}

	export function selectWindow(diff: number) {
		return function() {
			withWindowPair(diff, function(_a: MetaWindow, b: MetaWindow) {
				MetaUtil.activate(b);
			})
		}
	}

	export function swapWindow(diff: number) {
		return function() {
			withWindowPair(diff, function(a: MetaWindow, b: MetaWindow) {
				const ar = MetaUtil.rect(a.get_frame_rect());
				const br = MetaUtil.rect(b.get_frame_rect());
				MetaUtil.moveResize(b, ar);
				MetaUtil.moveResize(a, br);
				MetaUtil.activateLater(a); // necessary?
			})
		}
	}

	class RectMetrics {
		rect: Rect
		midpoint: Point
		size: number

		constructor(rect: Rect) {
			this.rect = rect;
			this.midpoint = Rect.midpoint(rect);
			this.size = rect.size.x * rect.size.y;
		}

		diff(other: RectMetrics) {
			const posDiff = Point.magnitude(Point.subtract(this.midpoint, other.midpoint));
			const sizeDiff = Math.abs(this.size - other.size);
			// positional jumps are more jarring than size ones, so prioritize
			// close positions over sizes
			return (posDiff * 2) + sizeDiff;
		}
	}

	class WindowMetrics {
		win: MetaWindow
		metrics: RectMetrics

		constructor(win: MetaWindow) {
			this.win = win;
			this.metrics = new RectMetrics(MetaUtil.rect(win.get_frame_rect()));
		}
	}

	class TileCandidate {
		match: WindowMetrics
		diff: number
		rect: Rect

		constructor(wins: Array<WindowMetrics>, rect: Rect) {
			this.rect = rect;
			const rectMetrics = new RectMetrics(rect);
			this.match = null;
			for (let i=0; i<wins.length; i++) {
				const win = wins[i];
				const diff = win.metrics.diff(rectMetrics);
				if (this.match === null || this.diff > diff) {
					this.diff = diff;
					this.match = win;
				}
			}
		}
	}

	export function distribute() {
		const win = MetaUtil.currentWindow();
		const windows = MetaUtil.visibleWindows(win);
		if (windows.length === 0) return;
		const bounds = MetaUtil.workspaceArea(windows[0]);

		if (windows.length === 1) {
			MetaUtil.maximize(win);
		} else {
			// TODO: scatter windows by selecting the closest matches for position+size
			// instead of just distributing by index

			const leftCount = Math.floor(windows.length / 2);
			const rightCount = windows.length - leftCount;
			const width = bounds.size.x / 2;
			const leftHeight = Math.floor(bounds.size.y / leftCount);
			const rightHeight = Math.floor(bounds.size.y / rightCount);

			const tiles = windows.map(function(_w: MetaWindow, i: number) {
				if (i < leftCount) {
					return {
						pos: {
							x: 0,
							y: i*leftHeight
						},
						size: { x: width, y: leftHeight },
					}
				} else {
					return {
						pos: {
							x: width,
							y: (i-leftCount)*rightHeight
						},
						size: { x: width, y: rightHeight },
					}
				}
			});

			const windowMetrics = windows.map(function(w: MetaWindow) {
				return new WindowMetrics(w);
			});

			const remainingTiles = tiles.slice();
			const remainingWindows = windowMetrics.slice();
			while(remainingTiles.length > 0) {
				// at each step, find the best match and apply it. Then remove that window & tile from
				// candidates, and repeat
				const candidates = remainingTiles.map(function(tile: Rect) {
					return new TileCandidate(remainingWindows, tile);
				});
				const bestCandidate = candidates.sort(function(a: TileCandidate, b: TileCandidate) {
					return a.diff - b.diff;
				})[0];

				p("out of " + remainingWindows.length + ", the best candidate was '" +
					bestCandidate.match.win.get_title() + "' for rect " +
					JSON.stringify(bestCandidate.rect));

				const windowIdx = remainingWindows.indexOf(bestCandidate.match);
				const tileIdx = remainingTiles.indexOf(bestCandidate.rect);
				assert(windowIdx !== -1);
				assert(tileIdx !== -1);
				remainingWindows.splice(windowIdx, 1);
				remainingTiles.splice(tileIdx, 1);

				MetaUtil.moveResize(bestCandidate.match.win, bestCandidate.rect);
			}
		}
		if (win !== null) MetaUtil.activateLater(win);
	}
}
