/// <reference path="common.ts" />
/// <reference path="assert.ts" />
/// <reference path="menu.ts" />
/// <reference path="system.ts" />
/// <reference path="actions.ts" />

module Wrapper {
	// function ignore(_: any): void {
	// }

	function makeGetters(obj: any) {
		function stubFn(name: string) {
			return function() {
				log("WARN: stub implementation for `" + name + "` called");
			}
		}

		function prop<T>(name: string, dfl: T): T {
			let p = obj[name];
			// TODO: strict mode
			// assert(p, "no such property: System["+name+"]");
			if (!p) {
				log("WARN: missing property: `" + name + "`");
				return dfl;
			}
			return p;
		}

		return {
			prop: function(name: string) {
				return prop(name, null);
			},
			fn: function(name: string) {
				let fn = prop(name, stubFn(name));
				assert(fn instanceof Function, name + " is not a Function");
				return fn.bind(obj);
			}
		}
	}

	export function toSystem(obj: any): System<any> {
		function makeClutter(obj: any): ClutterModule {
			let get = makeGetters(obj);
			return {
				EVENT_STOP: ((get.prop('EVENT_STOP') as any) as ClutterEventResponse),
				grab_pointer: get.fn('grab_pointer'),
				grab_keyboard: get.fn('grab_keyboard'),
				ungrab_pointer: get.fn('ungrab_pointer'),
				ungrab_keyboard: get.fn('ungrab_keyboard'),
				ModifierType: {
					SHIFT_MASK: (get.prop('SHIFT_MASK') as number),
				}
			}
		}

		function makeCairo(obj: any): CairoModule {
			let get = makeGetters(obj);
			return {
				Operator: {
					CLEAR: (get.prop('CLEAR') as CairoOperator)
				}
			}
		}

		return (function() {
			let get = makeGetters(obj);
			return {
				windowRect: get.fn('windowRect'),
				moveResize: get.fn('moveResize'),
				currentWindow: get.fn('currentWindow'),
				workspaceArea: get.fn('workspaceArea'),
				workspaceIndex: get.fn('workspaceIndex'),
				activateWorkspace: get.fn('activateWorkspace'),
				moveWindowToWorkspace: get.fn('moveWindowToWorkspace'),
				numWorkspaces: get.fn('numWorkspaces'),
				maximize: get.fn('maximize'),
				getMaximized: get.fn('getMaximized'),
				minimize: get.fn('minimize'),
				unmaximize: get.fn('unmaximize'),
				unminimize: get.fn('unminimize'),
				visibleWindows: get.fn('visibleWindows'),
				minimizedWindows: get.fn('minimizedWindows'),
				activate: get.fn('activate'),
				activateLater: get.fn('activate'),
				setWindowHidden: get.fn('setWindowHidden'),
				stableSequence: get.fn('stableSequence'),
				windowTitle: get.fn('windowTitle'),
				Clutter: makeClutter(get.prop('Clutter')),
				Cairo: makeCairo(get.prop('Cairo')),

				newClutterActor: get.fn('newClutterActor'),
				newClutterCanvas: get.fn('newClutterCanvas'),
				newClutterColor: get.fn('newClutterColor'),
			}
		})();
	}
}

class Extension<Win> {
	sys: System<Win>
	menu: Menu.Menu<Win>
	actions: WindowActions

	constructor(sys: System<Win>) {
		this.sys = sys;
		this.actions = WindowActions.Make(sys);
	}

	show_ui(parent: Actor, origin: Point): Menu.Menu<Win> {
		this.menu = null;
		let win = this.sys.currentWindow();
		this.menu = Menu.Menu.show(
			this.sys,
			parent,
			origin,
			win
		);
		return this.menu;
	}
}

function makeExtension(system: any) {
	return new Extension(Wrapper.toSystem(system));
}
