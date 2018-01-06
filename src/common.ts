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

// opaque types (cannot be directly implemented)
interface CairoOperator { __CairoOperator: null };
interface ClutterEventResponse { __ClutterEventResponse: null };
interface ClutterColor { __ClutterColor: null };

type Actor = Connectable & {
	set_position(x: number, y: number): void
	set_opacity(n: number): void
	set_size(x: number, y: number): void
	set_reactive(x: boolean): void
	add_actor(a: Actor): void
	remove_child(a: Actor): void
	set_background_color(c: ClutterColor): void
	insert_child_above(a: Actor, target: Actor): void
	set_content(canvas: ClutterCanvas): void
	grab_key_focus(): void
	hide(): void
	show(): void
};
interface ClutterModule {
	EVENT_STOP: ClutterEventResponse
	grab_pointer(actor: Actor): void
	ungrab_pointer(): void
	grab_keyboard(actor: Actor): void
	ungrab_keyboard(): void
	ModifierType: {
		SHIFT_MASK: number
	}
};

interface Connectable {
	connect(signal: String, handler: Function): void
}

interface ClutterMouseEvent {
	get_coords(): Array<number>
};
interface ClutterKeyEvent {
	get_key_code(): number
	get_state(): number // XXX property modifier_state doesn' seem to work
};
type ClutterCanvas = Connectable & {
	invalidate(): void
	set_size(w: number, h: number): void
}

interface CairoModule {
	Operator: {
		CLEAR: CairoOperator
	}
};
interface CairoContext {
	fill(): void
	stroke(): void
	clip(): void
	save(): void
	paint(): void
	restore(): void
	resetClip(): void
	setOperator(op: CairoOperator): void
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

const enum Direction {
	LEFT = 0,
	UP,
	RIGHT,
	DOWN,
}

const enum Axis {
	x = 'x',
	y = 'y'
}

