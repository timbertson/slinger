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
type ClutterMouseEvent = {
	get_coords(): Array<number>
};
type ClutterKeyEvent = {
	get_key_code(): number
};
type ClutterCanvas = {
	invalidate(): void
}
type ClutterContext = {
	restore(): void
	fill(): void
	stroke(): void
	clip(): void
	save(): void
	paint(): void
	restore(): void
	resetClip(): void
	setOperator(op: number): void
	setLineWidth(width: number): void
	rectangle(x: number, y: number, w: number, h: number): void
	arc(x: number, y: number, radius: number, start: number, end: number): void
	rotate(radians: number): void
	translate(x: number, y: number): void
	setSourceRGBA(r: number, g: number, b: number, a: number): void
}


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

