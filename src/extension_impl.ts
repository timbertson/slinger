/// <reference path="common.ts" />
/// <reference path="extension_settings.ts" />
/// <reference path="menu.ts" />
/// <reference path="logging.ts" />
/// <reference path="gnome_shell.ts" />
/// <reference path="actions.ts" />

const Main = imports.ui.main;
const Shell = imports.gi.Shell;
const Meta = imports.gi.Meta;
const Gdk = imports.gi.Gdk;
const Clutter = imports.gi.Clutter;

function failsafe(fn: Function, desc?: string) {
	return function(this: any) {
		try {
			if (desc) p("Running: " + desc);
			fn.apply(this, arguments)
		} catch(e) {
			p('Error: ' + e);
		}
	}
}

module WindowFilter {
	// export function visible(w: MetaWindow) {
	// 	return w.get_minimized() !== CBoolean.True;
	// }
}

class Extension {
	private disable_actions: Array<Function>;
	menu: Menu.Menu;

	constructor() {
	}

	private init_keybindings() {
		p("initializing keybindings");
		const self = this;
		var gsettings = new Settings.Keybindings().settings;
		var valid_keys = gsettings.list_keys();

		// Utility method that binds a callback to a named keypress-action.
		function handle(name: string, func: Function) {
			if (valid_keys.indexOf(name) === -1) {
				// paranoia prevents a gnome shell crash
				throw(new Error("invalid key binding: " + name));
			}
			var flags = Meta.KeyBindingFlags.NONE;

			p("binding key " + name);

			var added = Main.wm.addKeybinding(
				name,
				gsettings,
				flags,
				Shell.ActionMode.NORMAL,
				failsafe(func, name));

			if(!added) {
				throw(new Error("failed to add keybinding handler for: " + name));
			}

			self.disable_actions.push(function() {
				p("unbinding key " + name);
				Main.wm.removeKeybinding(name);
			});
		};

		p("adding keyboard handlers for slinger");
		handle('slinger-show', this.show_ui.bind(this));

		handle('slinger-next-window', WindowActions.selectWindow(1));
		handle('slinger-prev-window', WindowActions.selectWindow(-1));

		handle('slinger-swap-next-window', WindowActions.swapWindow(1));
		handle('slinger-swap-prev-window', WindowActions.swapWindow(-1));

		handle('slinger-move-right', WindowActions.moveAction(1, Axis.x));
		handle('slinger-move-left', WindowActions.moveAction(-1, Axis.x));
		handle('slinger-move-up', WindowActions.moveAction(-1, Axis.y));
		handle('slinger-move-down', WindowActions.moveAction(1, Axis.y));

		handle('slinger-grow-horizontal', WindowActions.resizeAction(1, Axis.x));
		handle('slinger-shrink-horizontal', WindowActions.resizeAction(-1, Axis.x));
		handle('slinger-grow-vertical', WindowActions.resizeAction(1, Axis.y));
		handle('slinger-shrink-vertical', WindowActions.resizeAction(-1, Axis.y));
		handle('slinger-grow', WindowActions.resizeAction(1, null));
		handle('slinger-shrink', WindowActions.resizeAction(-1, null));

		handle('slinger-switch-workspace-up', WindowActions.switchWorkspace(-1));
		handle('slinger-switch-workspace-down', WindowActions.switchWorkspace(1));

		handle('slinger-move-window-workspace-up', WindowActions.moveWindowWorkspace(-1));
		handle('slinger-move-window-workspace-down', WindowActions.moveWindowWorkspace(1));

		handle('slinger-toggle-maximize', WindowActions.toggleMaximize);
		handle('slinger-minimize-window', WindowActions.minimize);
		handle('slinger-unminimize-window', WindowActions.unminimize);

		handle('slinger-distribute', WindowActions.distribute);
	}

	private show_ui() {
		this.hide_ui();
		const display = Gdk.Display.get_default();
		const window = MetaUtil.currentWindow();
		if(!window) {
			p("no active window; ignoring")
			return;
		}
		p("showing UI")
		const self = this;

		const pointer = display.get_device_manager().get_client_pointer();
		const mousePos = pointer.get_position();
		const metaRect: MetaRect = window.get_frame_rect();

		// const monitorIdx = global.screen.get_primary_monitor();
		const workArea: Rect = MetaUtil.workspaceArea(window);
		const pos = workArea.pos;
		const windowRect = MetaUtil.rect(metaRect);
		windowRect.pos = Point.subtract(windowRect.pos, workArea.pos);

		const windowActor = window.get_compositor_private();

		this.menu = new Menu.Menu(
			global.window_group,
			workArea,
			{ x: mousePos[1], y: mousePos[2]},
			windowRect,
			windowActor,
			this.onLayoutSelect(window, pos)
		);
		this.menu.ui.set_position(pos.x, pos.y);
		Main.pushModal(this.menu.ui);
		this.menu.ui.connect('unrealize', function() {
			p("hiding modal");
			windowActor.set_opacity(255);
			Main.popModal(self.menu.ui);
			self.menu = null;
			return Clutter.EVENT_PROPAGATE;
		});
// this.menu.ui.set_background_color(new Clutter.Color({
// 	red: 40,
// 	green: 40,
// 	blue: 40,
// 	alpha: 20
// }));
	}

	private hide_ui() {
		if (this.menu) {
			this.menu.destroy();
		}
	}

	onLayoutSelect(window: MetaWindow, offset: Point) {
		return function(action: Menu.Action, rect: Rect) {
			switch (action) {
				case Menu.Action.MINIMIZE:
					window.minimize();
				break;
				
				case Menu.Action.RESIZE:
					MetaUtil.moveResize(window, Rect.move(rect, offset));
				case Menu.Action.CANCEL: // fallthrough
					MetaUtil.activate(window);
				break;
			}
		}
	}

	enable() {
		const self = this;
		failsafe(function() {
			self.disable_actions = [];
			self.init_keybindings();
			p("enabled");
		})();
	}

	disable() {
		const self = this;
		failsafe(function() {
			self.hide_ui();
			self.disable_actions.forEach(function(fn) {
				try {
					fn();
				} catch(e) {
					p('ERROR: ' + e);
				}
			});
			self.disable_actions = [];
			p("disabled");
		})();
	}
}

function init() {
	return new Extension();
}
