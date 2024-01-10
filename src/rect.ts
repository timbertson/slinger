import { Axis, Anchor } from "./common.js";
import { MathUtil } from './math.js'
import { Point } from "./point.js";

export module Rect {
	export function copy(r: Rect): Rect {
		return { pos: Point.copy(r.pos), size: Point.copy(r.size) };
	}

	export function area(r: Rect): number {
		return r.size.x * r.size.y;
	}

	export function isPositive(r: Rect): boolean {
		return Point.isPositive(r.size);
	}

	export function closestCorner(r: Rect, p: Point): Anchor {
		const pow = Math.pow;
		const sqrt = Math.sqrt;
		const near = r.pos;
		const far = { x: r.pos.x + r.size.x, y: r.pos.y + r.size.y };
		const tl = sqrt(pow(p.x - near.x, 2) + pow(p.y - near.y, 2));
		const tr = sqrt(pow(p.x -  far.x, 2) + pow(p.y - near.y, 2));
		const br = sqrt(pow(p.x -  far.x, 2) + pow(p.y -  far.y, 2));
		const bl = sqrt(pow(p.x - near.x, 2) + pow(p.y -  far.y, 2));
		const corners = [tl, tr, bl, br];
		// log("Closest corners: " + JSON.stringify(corners));
		corners.sort(function(a,b) { return a - b });
		// log("Closest corners (sorted): " + JSON.stringify(corners));
		const min = corners[0];
		if (min == tl) return Anchor.TOPLEFT;
		if (min == tr) return Anchor.TOPRIGHT;
		if (min == br) return Anchor.BOTTOMRIGHT;
		return Anchor.BOTTOMLEFT;
	}

	export function move(r: Rect, p: Point): Rect {
		return {
			pos: Point.add(r.pos, p),
			size: r.size
		}
	}

	export function moveWithin(rect: Rect, bounds: Rect): Rect {
		const r = copy(rect);
		if (r.size.x > bounds.size.x) r.size.x = bounds.size.x;
		if (r.size.y > bounds.size.y) r.size.y = bounds.size.y;

		r.pos.x = MathUtil.between(bounds.pos.x, r.pos.x, (bounds.pos.x + bounds.size.x - r.size.x));
		r.pos.y = MathUtil.between(bounds.pos.y, r.pos.y, (bounds.pos.y + bounds.size.y - r.size.y));
		return r;
	}

	export function scaleWithin(rect: Rect, size: Point): Rect {
		return moveWithin(rect, { pos: Point.ZERO, size: size });
	}

	export function midpoint(rect: Rect): Point {
		return Point.add(rect.pos, Point.scaleConstant(0.5, rect.size));
	}

	export function moveWithinAffinity(opts: {
		margin: number
		original: Rect
		modified: Rect
		bounds: Point
	}): Rect {
		const abs = Math.abs;
		const { original, bounds } = opts;
		const modified = scaleWithin(opts.modified, bounds);

		function close(a: number, b: number) {
			return abs(a - b) < opts.margin;
		}

		function axisDiff(axis: Axis): number {
			const near = close(0, original.pos[axis]);
			const far = close((bounds[axis]), (original.pos[axis] + original.size[axis]));

			// p("near affinity["+axis+"] = "+near);
			// p("far affinity["+axis+"] = "+far);
			if (near && far) return 0; // can't do anything for a window attached to both edges
			if (near) {
				// p("maintaining near affinity");
				return -modified.pos[axis];
			} else if (far) {
				// p("maintaining far affinity");
				return (bounds[axis]) - (modified.pos[axis] + modified.size[axis]);
			}
			return 0;
		}

		return move(modified, {
			x: axisDiff(Axis.x),
			y: axisDiff(Axis.y),
		});
	}

	export function intersection(a: Rect, b: Rect): Rect {
		let pos = {
			x: Math.max(a.pos.x, b.pos.x),
			y: Math.max(a.pos.y, b.pos.y),
		}
		let bottomRightA = Point.add(a.pos, a.size);
		let bottomRightB = Point.add(b.pos, b.size);
		let bottomRight = {
			x: Math.min(bottomRightA.x, bottomRightB.x),
			y: Math.min(bottomRightA.y, bottomRightB.y),
		}
		let size = Point.subtract(bottomRight, pos);
		if (Point.isPositive(size)) {
			return { pos, size };
		} else {
			return null;
		}
	}
}

export interface Rect {
	pos: Point
	size: Point
}
