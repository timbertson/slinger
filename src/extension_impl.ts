/// <reference path="common.ts" />
/// <reference path="extension_settings.ts" />
/// <reference path="drawing.ts" />

const Main = imports.ui.main;
const Shell = imports.gi.Shell;
const Meta = imports.gi.Meta;

declare var log: {(m: String):void};

function p(msg: String) {
	log('[throwy]:' + msg);
}

function failsafe(fn: Function) {
	return function() {
		try {
			fn()
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
				Shell.ActionMode.NORMAL | Shell.ActionMode.MESSAGE_TRAY,
				failsafe(func));

			if(!added) {
				throw(new Error("failed to add keybinding handler for: " + name));
			}

			self.disable_actions.push(function() {
				p("unbinding key " + name);
				Main.wm.removeKeybinding(name);
			});
		};

		p("adding keyboard handlers for throwy");
		handle('throwy-show', self.show_ui);
	}

	private show_ui() {
		if (this.menu != null) {
			return;
		}
		p("showing UI")
		this.menu = new Drawing.Menu();
		Main.uiGroup.add_actor(menu.actor);
	}

	private hide_ui() {
		p("hiding UI")
		if (this.menu) {
			Main.uiGroup.remove_actor(menu.actor);
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

function init() {
	return new Extension();
}
