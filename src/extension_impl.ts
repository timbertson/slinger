/// <reference path="common.ts" />
/// <reference path="extension_settings.ts" />
/// <reference path="drawing.ts" />
/// <reference path="logging.ts" />

const Main = imports.ui.main;
const Shell = imports.gi.Shell;
const Meta = imports.gi.Meta;
const Gdk = imports.gi.Gdk;
const Clutter = imports.gi.Clutter;

interface Global {
	screen: any
	window_group: any
	get_current_time: () => number
}
declare var global: Global;

function failsafe(fn: Function) {
	return function(this: any) {
		try {
			fn.apply(this, arguments)
		} catch(e) {
			p('Error: ' + e);
		}
	}
}

class Extension {
	private disable_actions: Array<Function>;
	menu: Drawing.Menu;

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
				failsafe(func));

			if(!added) {
				throw(new Error("failed to add keybinding handler for: " + name));
			}

			self.disable_actions.push(function() {
				p("unbinding key " + name);
				Main.wm.removeKeybinding(name);
			});
		};

		p("adding keyboard handlers for slinger");
		handle('slinger-show', self.show_ui.bind(this));
	}

	private show_ui(a:any, b: any, c: any, d: any) {
		p(a);
		p(b);
		p(c);
		p(d);
		this.hide_ui();
		const display = Gdk.Display.get_default();
		const window: MetaWindow = global.screen.get_display()['focus-window'];
		if(!window) {
			p("no active window; ignoring")
			return;
		}
		p("showing UI")
		const self = this;

		const pointer = display.get_device_manager().get_client_pointer();
		const mousePos = pointer.get_position();
		const screenIdx = mousePos[0];
		const metaRect: MetaRect = window.get_frame_rect();

		// const monitorIdx = global.screen.get_primary_monitor();
		const screen: MetaRect = global.screen.get_workspace_by_index(0).get_work_area_for_monitor(screenIdx);
		const pos: Point = {
			x: screen.x,
			y: screen.y
		};
		const size: Point = {
			x: screen.width,
			y: screen.height
		};
		const windowRect: Rect = {
			pos: { x: metaRect.x - pos.x, y: metaRect.y - pos.y },
			size: { x: metaRect.width, y: metaRect.height },
		};

		this.menu = new Drawing.Menu(
			global.window_group,
			{ size, pos },
			{ x: mousePos[1], y: mousePos[2]},
			windowRect,
			this.onLayoutSelect(window, pos)
		);
		this.menu.ui.set_position(pos.x, pos.y);
		Main.pushModal(this.menu.ui);
		this.menu.ui.connect('unrealize', function() {
			p("hiding modal");
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
		return function(action: Drawing.Action, rect: Rect) {
			switch (action) {
				case Drawing.Action.MINIMIZE:
					window.minimize();
				break;
				
				case Drawing.Action.RESIZE:
					if(window.get_maximized() !== 0) {
						window.unmaximize(Meta.MaximizeFlags.VERTICAL | Meta.MaximizeFlags.HORIZONTAL);
					}

					window.move_resize_frame(true,
						rect.pos.x + offset.x,
						rect.pos.y + offset.y,
						rect.size.x,
						rect.size.y);
				case Drawing.Action.CANCEL: // fallthrough
					Main.activateWindow(window, global.get_current_time());
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
