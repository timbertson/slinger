module Point {
	const floor = Math.floor;
	export function scale(scale: Point, p: Point): Point {
		return {
			x: floor(p.x * scale.x),
			y: floor(p.y * scale.y)
		}
	}

	export function scaleConstant(scale: number, p: Point): Point {
		return {
			x: floor(p.x * scale),
			y: floor(p.y * scale)
		}
	}

	export function scaleAxis(axis: Axis, scale: number, p: Point): Point {
		const ret = copy(p);
		ret[axis] = floor(p[axis] * scale);
		return ret;
	}

	export function copy(p: Point): Point {
		return { x: p.x, y: p.y };
	}

	export function add(a: Point, b: Point): Point {
		return {
			x: a.x + b.x,
			y: a.y + b.y
		}
	}

	export function subtract(a: Point, b: Point): Point {
		return {
			x: a.x - b.x,
			y: a.y- b.y
		}
	}

	export const ZERO = { x: 0, y: 0 };

	export function eqTo(p: Point, x: number, y: number) {
		return p.x === x && p.y === y;
	}

	export function ofEvent(event: ClutterMouseEvent): Point {
		const [absx,absy] = event.get_coords();
		return { x: absx, y: absy };
	}

	export function magnitude(p: Point) {
		return Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2));
	}
}

