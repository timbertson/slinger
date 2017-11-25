/// <reference path="common.ts" />
/// <reference path="extension_settings.ts" />

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
	keybindings: any;
	private disable_actions: Array<Function>;

	constructor() {
	}

	private init_keybindings() {
		const self = this;
		var gsettings = new Settings.Keybindings().settings;

		// Utility method that binds a callback to a named keypress-action.
		function handle(name: string, func: Function) {
			var flags = Meta.KeyBindingFlags.NONE;

			// API for 3.8+ only
			var added = Main.wm.addKeybinding(
				name,
				gsettings,
				flags,
				Shell.ActionMode.NORMAL | Shell.ActionMode.MESSAGE_TRAY,
				failsafe(func));
			if(!added) {
				throw("failed to add keybinding handler for: " + name);
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
		p("showing UI")
	}

	private hide_ui() {
		p("hiding UI")
	}

	enable() {
		const self = this;
		failsafe(function() {
			self.disable_actions = [];
			self.init_keybindings();
			p("enabled");
		});
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
		});
	}
}

function init() {
	return new Extension();
}
