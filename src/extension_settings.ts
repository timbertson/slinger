/// <reference path="common.ts" />

module Settings {
	var Gio = imports.gi.Gio;
	var ExtensionUtils = imports.misc.extensionUtils;
	var Ext = ExtensionUtils.getCurrentExtension();

	var SCHEMA_ROOT = 'org.gnome.shell.extensions.net.gfxmonk.throwy';
	var KEYBINDINGS = SCHEMA_ROOT + '.keybindings';

	function get_local_gsettings(schema_path: string) {
		var GioSSS = Gio.SettingsSchemaSource;

		var schemaDir = Ext.dir.get_child('schemas');
		var schemaSource = GioSSS.new_from_directory(
			schemaDir.get_path(),
			GioSSS.get_default(),
			false);

		var schemaObj = schemaSource.lookup(schema_path, true);
		if (!schemaObj) {
			throw new Error(
				'Schema ' + schema_path +
				' could not be found for extension ' +
				Ext.metadata.uuid
			);
		}
		return new Gio.Settings({ settings_schema: schemaObj });
	};

	export class Keybindings {
		settings: any

		constructor() {
			this.settings = get_local_gsettings(KEYBINDINGS);
			// this.each = function(fn, ctx) {
			// 	var keys = settings.list_children();
			// 	for (var i=0; i < keys.length; i++) {
			// 		var key = keys[i];
			// 		var setting = {
			// 			key: key,
			// 			get: function() { return settings.get_string_array(key); },
			// 			set: function(v) { settings.set_string_array(key, v); },
			// 		};
			// 		fn.call(ctx, setting);
			// 	}
			// };
		}
	};
}
