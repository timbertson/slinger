/// <reference path="common.ts" />
/// <reference path="assert.ts" />
/// <reference path="logging.ts" />
/// <reference path="preview.ts" />
/// <reference path="point.ts" />
/// <reference path="rect.ts" />
/// <reference path="manipulations.ts" />
/// <reference path="menu_selection.ts" />
/// <reference path="menu_handlers.ts" />

module Menu {
	export const enum Action {
		CANCEL,
		MINIMIZE,
		RESIZE
	}

	// function stringOfLocation(loc: Anchor): string {
	// 	switch(loc) {
	// 		case Anchor.LEFT: return 'LEFT';
	// 		case Anchor.TOPLEFT: return 'TOPLEFT';
	// 		case Anchor.TOP: return 'TOP';
	// 		case Anchor.TOPRIGHT: return 'TOPRIGHT';
	// 		case Anchor.RIGHT: return 'RIGHT';
	// 		case Anchor.BOTTOMRIGHT: return 'BOTTOMRIGHT';
	// 		case Anchor.BOTTOM: return 'BOTTOM';
	// 		case Anchor.BOTTOMLEFT: return 'BOTTOMLEFT';
	// 		default: return '<unknown>';
	// 	}
	// }

	// TODO: how constant are these?
	const enum KeyCode {
		ESC = 9,
		SHIFT = 50,
		SPACE = 65,
		CTRL = 64,
		ALT = 133,
		TAB = 23,
		U = 30,
		I = 31,
		O = 32,
		A = 38,
		H = 43,
		J = 44,
		K = 45,
		L = 46,
		UP = 111,
		DOWN = 116,
		LEFT = 113,
		RIGHT = 114,
		MINUS = 20,
		EQUAL = 21,
		RETURN = 36,
	}

	function modeForKey(key: KeyCode): MouseMode {
		switch(key) {
			case KeyCode.CTRL: return MouseMode.MOVE;
			case KeyCode.ALT: return MouseMode.RESIZE;
			case KeyCode.SPACE: case KeyCode.TAB: return MouseMode.NOOP;
			default: return null;
		}
	}

	function directionForKey(key: KeyCode): Direction {
		switch(key) {
			case KeyCode.K: case KeyCode.UP: return Direction.UP;
			case KeyCode.J: case KeyCode.DOWN: return Direction.DOWN;
			case KeyCode.H: case KeyCode.LEFT: return Direction.LEFT;
			case KeyCode.L: case KeyCode.RIGHT: return Direction.RIGHT;
			default: return null;
		}
	}

	function selectionForKey(key: KeyCode, splitMode: SplitMode): MenuSelection {
		switch(splitMode) {
			case (SplitMode.FOUR):
				switch(key) {
					case KeyCode.EQUAL:
						return MenuSelection.Inner(Anchor.TOP, splitMode);
					case KeyCode.MINUS:
						return MenuSelection.Inner(Anchor.BOTTOM, splitMode);
				}
				break;

			case (SplitMode.SIX):
				switch(key) {
					case KeyCode.U:
						return MenuSelection.Inner(Anchor.TOPLEFT, splitMode);
					case KeyCode.I:
						return MenuSelection.Inner(Anchor.BOTTOM, splitMode);
					case KeyCode.O:
						return MenuSelection.Inner(Anchor.TOPRIGHT, splitMode);
				}
				break;

		}
		return null;
	}

	export class Menu<WindowType> {
		ui: Actor;
		private parent: Actor;
		private preview: Preview.LayoutPreview<WindowType>;
		private menuHandlers: MenuHandlers.Handlers;
		private menu: Actor;
		private mouseMode: MouseMode;
		private Sys: System<WindowType>;
		private win: WindowType;
		private splitMode: SplitMode;

		static show<WindowType>(Sys: System<WindowType>,
				parent: Actor,
				origin: Point,
				win: WindowType)
		{
			if (!win) {
				p("no active window; ignoring")
				return null;
			}
			return new Menu<WindowType>(Sys, parent, origin, win);
		}

		constructor(Sys: System<WindowType>,
				parent: Actor,
				origin: Point,
				win: WindowType)
		{
			const screen: Point = Sys.workspaceArea(win);
			log("getting windowRect of win " + win);
			const windowRect = Sys.windowRect(win);
			assert(windowRect, "windowRect()");

			this.Sys = Sys;
			p("creating menu at " + JSON.stringify(origin) + " with bounds " + JSON.stringify(screen));
			const self = this;
			this.parent = parent;
			this.win = win;
			this.mouseMode = MouseMode.MENU;

			const backgroundActor = Sys.newClutterActor();
			backgroundActor.set_size(screen.x, screen.y);

			const menu = this.menu = Sys.newClutterActor();

			const menuSize: Point = { x: 200, y: 200 };
			menu.set_size(menuSize.x, menuSize.y);

			const canvas = Sys.newClutterCanvas();
			canvas.set_size(menuSize.x, menuSize.y);
			menu.set_content(canvas);

			const position: Point = Point.subtract(origin, Point.scaleConstant(0.5, menuSize));
			menu.set_position(position.x, position.y);

			this.splitMode = SplitMode.FOUR;

			const preview = this.preview = new Preview.LayoutPreview(Sys, screen, windowRect, win);
			const handlers = this.menuHandlers = new MenuHandlers.Handlers(Sys, self.splitMode, menuSize, origin, canvas, preview);
			canvas.connect('draw', handlers.draw);
			backgroundActor.connect('motion-event', function(_actor: Actor, event: ClutterMouseEvent) {
				let position = Sys.translateEventCoordinates(Point.ofEvent(event), win);
				self.menuHandlers.onMouseMove(self.mouseMode, self.splitMode, position);
				return Sys.Clutter.EVENT_STOP;
			});

			Sys.Clutter.grab_pointer(backgroundActor);
			Sys.Clutter.grab_keyboard(backgroundActor);

			// var suspendedMouseMode = MouseMode.NOOP;
			backgroundActor.connect('key-press-event', function(_actor: Actor, event: ClutterKeyEvent) {
				self.onKeyPress(event);
				return Sys.Clutter.EVENT_STOP;
			});

			backgroundActor.connect('key-release-event', function(_actor: Actor, event: ClutterKeyEvent) {
				self.onKeyRelease(event);
				return Sys.Clutter.EVENT_STOP;
			});

			backgroundActor.connect('button-press-event', function() {
				self.complete(true);
				return Sys.Clutter.EVENT_STOP;
			});

			const coverPane = Sys.newClutterActor();
			coverPane.set_reactive(true);
			coverPane.connect('event', function () {
				return Sys.Clutter.EVENT_STOP;
			});

			this.ui = coverPane;
			backgroundActor.set_reactive(true);
			backgroundActor.add_actor(menu);
			coverPane.add_actor(this.preview.ui);
			coverPane.add_actor(backgroundActor);

			this.parent.insert_child_above(this.ui, null);
			backgroundActor.grab_key_focus();
			canvas.invalidate();
		}

		onKeyPress(event: ClutterKeyEvent) {
			const code: number = event.get_key_code();
			// p('keypress: ' + code);
			if (code == KeyCode.ESC) {
				this.complete(false);
			} else if (code == KeyCode.RETURN) {
				this.complete(true);
			} else if (code == KeyCode.A && this.mouseMode == MouseMode.MENU) {
				if (this.splitMode == SplitMode.FOUR) {
					this.splitMode = SplitMode.SIX;
				} else {
					this.splitMode = SplitMode.FOUR;
				}
				this.menuHandlers.updateMenuSelection(this.splitMode);
			} else {
				const newMode = modeForKey(code);
				if (newMode !== null) {
					if (this.mouseMode !== newMode) {
						if (this.menuHandlers.trackMouse(this.mouseMode)) {
							p("entering mode " + newMode);
							this.mouseMode = newMode;
							this.menu.hide();
						} else {
							p("not entering " + newMode + " due to current menu selection");
						}
					}
				} else if (this.mouseMode == MouseMode.MENU) {
					const direction = directionForKey(code);
					const selection = selectionForKey(code, this.splitMode);
					if (direction !== null) {
						this.menuHandlers.applyDirection(direction);
					} else if (selection !== null) {
						this.menuHandlers.updateSelection(selection);
					}
				} else {
					this.onManipulationKeyPress(code, event.get_state());
				}
			}
		}

		onManipulationKeyPress(code: KeyCode, modifiers: number) {
			// p("keycode: " + code);
			// p("Modifiers: " + modifiers);
			if (modifiers & this.Sys.Clutter.ModifierType.SHIFT_MASK) {
				switch (code) {
					case KeyCode.H: case KeyCode.LEFT:  return this.preview.applyManipulator(Manipulations.resize(-1, Axis.x));
					case KeyCode.U: case KeyCode.J: case KeyCode.DOWN:  return this.preview.applyManipulator(Manipulations.resize(1, Axis.y));
					case KeyCode.I: case KeyCode.K: case KeyCode.UP:    return this.preview.applyManipulator(Manipulations.resize(-1, Axis.y));
					case KeyCode.L: case KeyCode.RIGHT: return this.preview.applyManipulator(Manipulations.resize(1, Axis.x));
				}
			} else {
				switch (code) {
					case KeyCode.H: case KeyCode.LEFT:  return this.preview.applyManipulator(Manipulations.move(-1, Axis.x));
					case KeyCode.U: case KeyCode.J: case KeyCode.DOWN:  return this.preview.applyManipulator(Manipulations.move(1, Axis.y));
					case KeyCode.I: case KeyCode.K: case KeyCode.UP:    return this.preview.applyManipulator(Manipulations.move(-1, Axis.y));
					case KeyCode.L: case KeyCode.RIGHT: return this.preview.applyManipulator(Manipulations.move(1, Axis.x));

					case KeyCode.MINUS: return this.preview.applyManipulator(Manipulations.resize(-1, null));
					case KeyCode.EQUAL: return this.preview.applyManipulator(Manipulations.resize(1, null));
				}
			}
		}

		onKeyRelease(event: ClutterKeyEvent) {
			const code: number = event.get_key_code();
			const fromState = modeForKey(code);
			if (fromState != null && this.mouseMode == fromState) {
				p("ending mode " + fromState);
				this.mouseMode = MouseMode.NOOP;
			}
		}

		onSelect(action: Action, rect: Rect) {
			switch (action) {
				case Action.MINIMIZE:
					this.Sys.minimize(this.win);
				return;
				
				case Action.RESIZE:
					this.Sys.moveResize(this.win, rect);
				break;

				case Action.CANCEL:
				break;
			}
			this.Sys.activate(this.win);
		}

		destroy() {
			p("hiding menu")
			if (this.displayed()) {
				this.Sys.Clutter.ungrab_pointer();
				this.Sys.Clutter.ungrab_keyboard();
				this.parent.remove_child(this.ui);
				this.parent = null;
			}
		}

		private complete(accept: boolean) {
			if (!accept) {
				this.onSelect(Action.CANCEL, null);
			} else {
				const selection = this.menuHandlers.getSelection();
				if (selection.eqTo(Ring.INNER, Anchor.BOTTOM, SplitMode.FOUR)) {
					this.onSelect(Action.MINIMIZE, null);
				} else {
					const rect = this.preview.getRect()
					if (rect !== null) {
						this.onSelect(Action.RESIZE, rect);
					}
				}
			}
			this.destroy();
		}

		private displayed() {
			return (this.parent !== null);
		}
	}
}

