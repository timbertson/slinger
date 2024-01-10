import '@girs/gnome-shell/ambient'
import Main from "resource:///org/gnome/shell/ui/main.js"
import Shell from 'gi://Shell'
import Meta from 'gi://Meta'
import Clutter from 'gi://Clutter';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

import { Actor, Axis, p } from './common.js'
import { Menu } from './menu.js'
import { GnomeSystem, MetaWindow, global } from './gnome_shell.js'
import { Settings } from './extension_settings.js'
import { WindowActions } from './actions.js';
import { Point } from './point.js';

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

export default class Slinger extends Extension {
	private disable_actions: Array<Function>;
	menu: Menu.Menu<MetaWindow>;

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

		const windowActions = WindowActions.Make(GnomeSystem);

		p("adding keyboard handlers for slinger");
		handle('slinger-show', this.show_ui.bind(this));

		handle('slinger-next-window', windowActions.selectWindow(1));
		handle('slinger-prev-window', windowActions.selectWindow(-1));

		handle('slinger-swap-next-window', windowActions.swapWindow(1));
		handle('slinger-swap-prev-window', windowActions.swapWindow(-1));
		handle('slinger-swap-largest-window', windowActions.swapLargestWindow());

		handle('slinger-move-right', windowActions.moveAction(1, Axis.x));
		handle('slinger-move-left', windowActions.moveAction(-1, Axis.x));
		handle('slinger-move-up', windowActions.moveAction(-1, Axis.y));
		handle('slinger-move-down', windowActions.moveAction(1, Axis.y));

		handle('slinger-grow-horizontal', windowActions.resizeAction(1, Axis.x));
		handle('slinger-shrink-horizontal', windowActions.resizeAction(-1, Axis.x));
		handle('slinger-grow-vertical', windowActions.resizeAction(1, Axis.y));
		handle('slinger-shrink-vertical', windowActions.resizeAction(-1, Axis.y));
		handle('slinger-grow', windowActions.resizeAction(1, null));
		handle('slinger-shrink', windowActions.resizeAction(-1, null));

		handle('slinger-switch-workspace-up', windowActions.switchWorkspace(-1));
		handle('slinger-switch-workspace-down', windowActions.switchWorkspace(1));

		handle('slinger-move-window-workspace-up', windowActions.moveWindowWorkspace(-1));
		handle('slinger-move-window-workspace-down', windowActions.moveWindowWorkspace(1));

		handle('slinger-toggle-maximize', windowActions.toggleMaximize);
		handle('slinger-minimize-window', windowActions.minimize);
		handle('slinger-unminimize-window', windowActions.unminimize);

		handle('slinger-distribute', windowActions.distribute);
		handle('slinger-fill-available-space', windowActions.fillAvailableSpace);
	}

	private show_ui() {
		this.hide_ui();
		const window = GnomeSystem.currentWindow();
		const self = this;

		const mousePosArray = global.get_pointer();
		const mousePos: Point = { x: mousePosArray[0], y: mousePosArray[1] };

		const workspaceOffset = GnomeSystem.workspaceOffset(window);
		p("mouse position: " + JSON.stringify(mousePos));
		p("workspace offset: " + JSON.stringify(workspaceOffset));

		this.menu = Menu.Menu.show(GnomeSystem,
			(global.window_group as Actor),
			Point.subtract(mousePos, workspaceOffset),
			window
		);

		if (!this.menu) {
			return Clutter.EVENT_PROPAGATE;
		}

		this.menu.ui.set_position(workspaceOffset.x, workspaceOffset.y);

		this.menu.ui.connect('unrealize', function() {
			p("hiding modal");
			GnomeSystem.setWindowHidden(window, false);
			self.menu = null;
			return Clutter.EVENT_PROPAGATE;
		});
		return Clutter.EVENT_STOP;
	}

	private hide_ui() {
		if (this.menu) {
			this.menu.destroy();
			this.menu = null;
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
