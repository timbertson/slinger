/// <reference path="common.ts" />
/// <reference path="gnome_shell.ts" />

module Settings {
	var Gio = imports.gi.Gio;
	var ExtensionUtils = imports.misc.extensionUtils;
	var Ext = ExtensionUtils.getCurrentExtension();

	var SCHEMA_ROOT = 'org.gnome.shell.extensions.net.gfxmonk.slinger';
	var KEYBINDINGS = SCHEMA_ROOT + '.keybindings';

	type Gsettings = {
		list_keys(): Array<String>
	}

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
		settings: Gsettings;

		constructor() {
			this.settings = get_local_gsettings(KEYBINDINGS);
		}
	};
}
