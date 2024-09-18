/// <reference types="@girs/gnome-shell/ambient"/>
import Gio from 'gi://Gio'
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js'

export module Settings {
	const SCHEMA_ROOT = 'org.gnome.shell.extensions.net.gfxmonk.slinger';
	const KEYBINDINGS = SCHEMA_ROOT + '.keybindings';

	function get_local_gsettings(ext: Extension, schema_path: string) {
		const GioSSS = Gio.SettingsSchemaSource;

		const schemaDir = ext.dir.get_child('schemas');
		const schemaSource = GioSSS.new_from_directory(
			schemaDir.get_path(),
			GioSSS.get_default(),
			false);

		const schemaObj = schemaSource.lookup(schema_path, true);
		if (!schemaObj) {
			throw new Error(
				'Schema ' + schema_path +
				' could not be found for extension ' +
				ext.metadata.uuid
			);
		}
		return new Gio.Settings({ settings_schema: schemaObj });
	}

	export class Keybindings {
		settings: Gio.Settings;

		constructor(ext: Extension) {
			this.settings = get_local_gsettings(ext, KEYBINDINGS);
		}
	}
}
