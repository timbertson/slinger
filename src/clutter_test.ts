/// <reference path="common.ts" />
/// <reference path="menu.ts" />
/// <reference path="gnome_shell.ts" />

// class FakeScreen implements MetaScreen {
// 	get_display() {
// 		return {
// 			'focus-window': null
// 		}
// 	}
// 	get_screen_number() { return 0 }
// 	get_active_workspace_index() { return 0 }
// 	get_n_workspaces() { return 3 }
// 	get_active_workspace() { return null }
// 	get_workspace_by_index(_i: number) { return null }
// }
//
// class FakeMetaWindow implements MetaWindow {
// 	private rect: Rect
// 	private actor: Actor
// 	minimized: boolean
//
// 	constructor(rect: Rect, actor: Actor) {
// 		this.rect = rect
// 		this.actor = actor
// 		this.minimized = false
// 	}
// 	get_title() { return "Window!" }
// 	get_window_type() { return 1; }
// 	get_frame_rect() { return this.rect }
// 	get_screen() { return new FakeScreen() }
// 	get_compositor_private() { return this.actor }
// 	minimize() { }
// 	unminimize() { }
// 	get_maximized() { return MaximizeFlags.Neither }
// 	get_stable_sequence() { return 0 }
// 	unmaximize(flags: number) { }
// 	maximize(flags: number) {}
// 	get_work_area_current_monitor() { return this.screen
// 	move_to_workspace(idx: number): void
// 	change_workspace_by_index(newIdx: number, append: boolean): void;
// 	move_resize_frame(userAction: boolean,
// 		x: number,
// 		y: number,
// 		w: number,
// 		h: number): void
// 	get_monitor(): number
// }

type ActorExt = Actor & {
	get_position(): Array<number>;
	get_size(): Array<number>;
}

class ClutterSystem implements System<ActorExt> {
	private stage: ActorExt
	private win: ActorExt

	Clutter = imports.gi.Clutter
	Cairo = imports.cairo

	newClutterActor = GnomeSystem.newClutterActor;
	newClutterCanvas = GnomeSystem.newClutterCanvas;
	newClutterColor = GnomeSystem.newClutterColor;

	constructor(stage: Actor, win: Actor) {
		this.stage = (stage as ActorExt)
		this.win = (win as ActorExt)
	}

	windowRect(win: ActorExt): Rect {
		let [x,y] = win.get_position();
		let [w,h] = win.get_size();
		return {
			pos: { x, y },
			size: { x:w, y:h },
		}
	}
	moveResize(win: ActorExt, rect: Rect): void {
		let { size, pos } = rect
		win.set_size(size.x, size.y);
		win.set_position(pos.x, pos.y);
	}
	currentWindow() {
		return this.win;
	}
	workspaceArea(_win: ActorExt) {
		return this.windowRect(this.stage);
	}
	unmaximize(_win: ActorExt): void {}
	maximize(_win: ActorExt): void {}
	visibleWindows(): Array<ActorExt> {
		return [this.win, [this.win]];
	}
	minimizedWindows(): Array<ActorExt> {
		return []
	}
	activate(_win: ActorExt): void {}
	minimize(_win: ActorExt): void {}
	activateLater(_win: ActorExt): void {}
	setWindowHidden(win: ActorExt, hidden: boolean): void {
		win.set_opacity(hidden ? 0 : 255);
	}
}

module ClutterTest {
	const Clutter = imports.gi.Clutter;
	Clutter.init(null);
	let stage = new Clutter.Stage();
	stage.connect("destroy", function() { Clutter.main_quit() });
	stage.title = "Test";

	const win = new Clutter.Actor();
	const Sys: System<ActorExt> = new ClutterSystem(stage, win);
	win.set_size(200, 200);
	win.set_position(50, 50);
	win.set_background_color(Sys.newClutterColor({
		red: 90,
		green: 200,
		blue: 90,
		alpha: 255
	}));
	stage.add_actor(win);

	function newMenu(origin: Point): Menu.Menu<MetaWindow> {
		return new Menu.Menu(Sys, stage, origin, win);
	}
	var menu = newMenu({x: 320, y: 320});
	menu.ui.set_background_color(Sys.newClutterColor({
		red: 128,
		green: 128,
		blue: 128,
		alpha: 255
	}));

	function rand() { return Math.floor(Math.random() * 255); }

	stage.connect('button-press-event', function(_actor: Actor, event: ClutterMouseEvent) {
		menu.destroy();
		const [x, y] = event.get_coords();
		menu = newMenu({x, y});
		menu.ui.set_background_color(Sys.newClutterColor({
			red: rand(),
			green: rand(),
			blue: rand(),
			alpha: 255
		}));
		// show();
	});

	stage.show_all();
	Clutter.main();
}
