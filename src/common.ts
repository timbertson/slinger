declare global {
	var log: {(m: any):void};
}

export var log = window.log

export function p(msg: String) {
	log('[slinger]:' + msg);
}
export function dump(obj: any) {
	p(JSON.stringify(obj));
}

export function assert<T>(x: T, msg?: string):T {
	if(!x) {
		throw new Error(msg ? ("Assertion failed: " + msg) : "Assertion failed");
	}
	return x;
}

// opaque types (cannot be directly implemented)
export interface CairoOperator { __CairoOperator: null };
export interface ClutterEventResponse { __ClutterEventResponse: null };
export interface ClutterColor { __ClutterColor: null };
export interface ClutterGrab { __ClutterGrab: null };

export type Actor = Connectable & {
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

export interface ClutterModule {
	EVENT_STOP: ClutterEventResponse
	EVENT_PROPAGATE: ClutterEventResponse
	ModifierType: {
		SHIFT_MASK: number
	}
};

export interface Connectable {
	connect(signal: String, handler: Function): void
}

export interface ClutterMouseEvent {
	get_coords(): Array<number>
};
export interface ClutterKeyEvent {
	get_key_code(): number
	get_state(): number // XXX property modifier_state doesn' seem to work
};
export type ClutterCanvas = Connectable & {
	invalidate(): void
	set_size(w: number, h: number): void
}

export interface CairoModule {
	Operator: {
		CLEAR: CairoOperator
	}
};
export interface CairoContext {
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


export interface Grey {
	luminance: number
	alpha: number
}
export interface Color {
	r: number
	g: number
	b: number
	a: number
}

export const enum MouseMode {
	MENU,
	RESIZE,
	MOVE,
	NOOP
}

export const enum Anchor {
	LEFT = 0,
	TOPLEFT,
	TOP,
	TOPRIGHT,
	RIGHT,
	BOTTOMRIGHT,
	BOTTOM,
	BOTTOMLEFT,
}

export const enum Direction {
	LEFT = 0,
	UP,
	RIGHT,
	DOWN,
}

export const enum Axis {
	x = 'x',
	y = 'y'
}

