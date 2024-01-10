/// <reference types="@girs/gnome-shell/ambient"/>
import Gio from 'gi://Gio'
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js'

export module Settings {
	var SCHEMA_ROOT = 'org.gnome.shell.extensions.net.gfxmonk.slinger';
	var KEYBINDINGS = SCHEMA_ROOT + '.keybindings';

	function get_local_gsettings(schema_path: string) {
		var Ext = Extension.lookupByURL(import.meta.url)
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
		settings: Gio.Settings;

		constructor() {
			this.settings = get_local_gsettings(KEYBINDINGS);
		}
	};
}
