module Manipulations {
	const RESIZE_SENSITIVITY = 0.1;
	const MOVE_SENSITIVITY = 0.1;
	const EDGE_AFFINITY = 30; // px

	function axialPoint(axis: Axis, magnitude: number): Point {
		switch(axis) {
			case null: return { x: magnitude, y: magnitude };
			case Axis.x: return { x: magnitude, y: 0 };
			case Axis.y: return { x: 0, y: magnitude };
		}
	}

	function scaleForWorkspace(workArea: Point): number {
		return (workArea.x + workArea.y) / 2;
	}

	function wrap(edgeAffinity: boolean, fn: (r: Rect, scale: number) => Rect): (r: Rect, w:Point) => Rect {
		return function(rect: Rect, workArea: Point) {
			const scale = scaleForWorkspace(workArea);
			const newRect = fn(rect, scale);
			if (edgeAffinity) {
				return Rect.moveWithinAffinity({
					margin: EDGE_AFFINITY,
					original: rect,
					modified: newRect,
					bounds: workArea,
				});
			} else {
				return Rect.scaleWithin(newRect, workArea);
			}
		}
	}

	export function resize(direction: number, axis: Axis) {
		return wrap(true, function(rect: Rect, scale: number) {
			const amount = RESIZE_SENSITIVITY * scale * direction;
			const diff = axialPoint(axis, amount);
			// p("scaling diff: " + JSON.stringify(diff) + " on window rect: " + JSON.stringify(rect));
			return {
				// remove half of diff from pos to keep centered
				pos: Point.add(rect.pos, Point.scaleConstant(-0.5, diff)),
				size: Point.add(rect.size, diff)
			};
		})
	}

	export function move(direction: number, axis: Axis) {
		return wrap(false, function(rect: Rect, scale: number) {
			const amount = MOVE_SENSITIVITY * scale * direction;
			const diff = axialPoint(axis, amount);
			// p("adding diff: " + JSON.stringify(amount) + " to window rect: " + JSON.stringify(rect));
			return {
				pos: Point.add(rect.pos, diff),
				size: rect.size,
			};
		})
	}

	class RectAndArea {
		area: number;
		rect: Rect;
		constructor(rect: Rect) {
			this.rect = rect;
			this.area = Rect.area(rect);
		}

		static from(r: Rect): RectAndArea {
			return new RectAndArea(r);
		}

		intersection(other: RectAndArea): RectAndArea | null {
			let intersection = Rect.intersection(this.rect, other.rect);
			if (intersection == null) return null;
			return new RectAndArea(intersection);
		}

		static descendingSortOrder(a: RectAndArea, b: RectAndArea): number {
			return a.area - b.area;
		}
	}

	function freeRectsAround(workArea: Point, win: Rect) {
		let bottomRight = Point.add(win.pos, win.size);

		let top =    { pos: Point.ZERO, size: { x: workArea.x, y: win.pos.y } };
		let left =   { pos: Point.ZERO, size: { x: win.pos.x, y: workArea.y } };
		let bottom = { pos: { x: 0, y: bottomRight.y }, size: { x: workArea.x, y: workArea.y - bottomRight.y } };
		let right =  { pos: { x: bottomRight.x, y: 0 }, size: { x: workArea.x - bottomRight.x, y: workArea.y } };

		return ([top, left, bottom, right]
			.filter(Rect.isPositive)
			.map(RectAndArea.from)
			.sort(RectAndArea.descendingSortOrder)
		);
	}

	export function largestFreeRect(workArea: Point, windows: Array<Rect>, minArea: number): Rect | null {
		let freeWindowAreas = windows.map(win => freeRectsAround(workArea, win));
		// log("freeWindowAreas = " + JSON.stringify(freeWindowAreas));

		var largest: RectAndArea = null;
		function worthPursuing(candidate: RectAndArea) {
			if (candidate == null || candidate.area < minArea) return false;
			return largest == null || candidate.area > largest.area;
		}

		// pick one free rect per window
		function recurse(rect: RectAndArea, remaining: Array<Array<RectAndArea>>) {
			// log("recursing over rect " + JSON.stringify(rect) + ", with " + remaining.length + " windows remaining");
			if (remaining.length == 0) {
				// we've picked one free rect from each window, and the intersection is nonzero
				if (worthPursuing(rect)) {
					largest = rect;
				}
				return;
			}
			let nextSet = remaining[0];
			// TODO: we'd save allocations using indexes
			let nextRemaining = remaining.slice(1);

			nextSet.forEach(function(candidate) {
				let intersection = rect.intersection(candidate);
				// log("intersection of " + JSON.stringify(rect) + " and " + JSON.stringify(candidate) + " = " + JSON.stringify(intersection));
				if (worthPursuing(intersection)) {
					// valid intersection which isn't already smaller than our largest candidate, keep going
					recurse(intersection, nextRemaining);
				}
			})
		}
		recurse(new RectAndArea({ pos: Point.ZERO, size: workArea}), freeWindowAreas);
		if (largest == null || largest.area < minArea) return null;
		return largest.rect;
	}
}
