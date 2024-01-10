import { assert } from './common.js'
import {
	ClutterModule, ClutterEventResponse, ClutterGrab,
	CairoModule, CairoOperator,
	Actor,
} from './common.js'
import { WindowActions } from './actions.js'
import { Point } from './point.js'
import { System } from './system.js'
import { Menu } from './menu.js'

module Wrapper {
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
				EVENT_PROPAGATE: ((get.prop('EVENT_PROPAGATE') as any) as ClutterEventResponse),
				ModifierType: {
					SHIFT_MASK: (get.prop('SHIFT_MASK') as number),
				},
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

				// TODO
				pushModal: function(_: Actor): ClutterGrab { return {} as ClutterGrab; },
				popModal: function(_: ClutterGrab) {},

				// events are already sent in workspace coordinate system
				translateEventCoordinates: function(point: Point, _win: any) { return point; },

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

// expose as global property, entrypoint for JSCore
(window as any).makeExtension = function(system: any) {
	return new Extension(Wrapper.toSystem(system));
}
