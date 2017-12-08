declare var imports: any;
declare var log: {(m: any):void};

interface Point {
	[index: string]: number
	x: number
	y: number
}

interface Rect {
	pos: Point
	size: Point
}

interface MetaRect {
	x: number
	y: number
	width: number
	height: number
}

// TODO ...
type MetaWindow = any;
type ClutterModule = any;
type Actor = any;
type ClutterColor = any;


interface Grey {
	luminance: number
	alpha: number
}
interface Color {
	r: number
	g: number
	b: number
	a: number
}

const enum MouseMode {
	MENU,
	RESIZE,
	MOVE,
	NOOP
}

const enum Anchor {
	LEFT = 0,
	TOPLEFT,
	TOP,
	TOPRIGHT,
	RIGHT,
	BOTTOMRIGHT,
	BOTTOM,
	BOTTOMLEFT,
}

// TODO: how constant are these?
const enum KeyCode {
	ESC = 9,
	SHIFT = 50,
	SPACE = 65,
	CTRL = 64,
	ALT = 133,
	TAB = 23,
}

const enum Axis {
	x = 'x',
	y = 'y'
}

