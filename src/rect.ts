/// <reference path="common.ts" />
/// <reference path="point.ts" />
module Rect {
	export function copy(r: Rect): Rect {
		return { pos: Point.copy(r.pos), size: Point.copy(r.size) };
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
		log("Closest corners: " + JSON.stringify(corners));
		corners.sort(function(a,b) { return a - b });
		log("Closest corners (sorted): " + JSON.stringify(corners));
		const min = corners[0];
		if (min == tl) return Anchor.TOPLEFT;
		if (min == tr) return Anchor.TOPRIGHT;
		if (min == br) return Anchor.BOTTOMRIGHT;
		return Anchor.BOTTOMLEFT;
	}
}
