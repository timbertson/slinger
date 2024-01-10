// implemented by gnome_shell.ts and cocoa injected object

import { Actor, ClutterGrab, ClutterModule, CairoModule, ClutterCanvas, ClutterColor } from "./common.js"
import { Point } from "./point.js"
import { Rect } from "./rect.js"

export interface System<WindowType> {
	// workspace
	workspaceArea(win: WindowType): Point
	currentWindow(): WindowType
	visibleWindows(): [WindowType, Array<WindowType>]
	minimizedWindows(): Array<WindowType>
	workspaceIndex(): number
	numWorkspaces(): number
	activateWorkspace(index: number): void
	moveWindowToWorkspace(win: WindowType, index: number): void

	// window
	windowRect(win: WindowType): Rect
	moveResize(win: WindowType, rect: Rect): void
	maximize(win: WindowType): void
	unmaximize(win: WindowType): void
	getMaximized(win: WindowType): boolean
	activate(win: WindowType): void
	minimize(win: WindowType): void
	unminimize(win: WindowType): void
	activateLater(win: WindowType): void
	setWindowHidden(win: WindowType, hidden: boolean): void
	stableSequence(win: WindowType): number
	windowTitle(win: WindowType): string // only used for debugging

	pushModal(actor: Actor): ClutterGrab
	popModal(grab: ClutterGrab): void

	Clutter: ClutterModule
	Cairo: CairoModule

	newClutterActor(): Actor
	newClutterCanvas(): ClutterCanvas
	newClutterColor(components: { red: number, green: number, blue: number, alpha: number}): ClutterColor
	translateEventCoordinates(point: Point, win: WindowType): Point
}
