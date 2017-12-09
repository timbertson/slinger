module Manipulations {
	const RESIZE_SENSITIVITY = 0.1;
	const MOVE_SENSITIVITY = 0.1;

	function axialPoint(axis: Axis, magnitude: number): Point {
		switch(axis) {
			case null: return { x: magnitude, y: magnitude };
			case Axis.x: return { x: magnitude, y: 0 };
			case Axis.y: return { x: 0, y: magnitude };
		}
	}

	function scaleForWorkspace(workArea: Rect): number {
		return (workArea.size.x + workArea.size.y) / 2;
	}

	function wrap(fn: (r: Rect, scale: number) => Rect): (r: Rect, w:Rect) => Rect {
		return function(rect: Rect, workArea: Rect) {
			const scale = scaleForWorkspace(workArea);
			const newRect = fn(rect, scale);
			return Rect.moveWithin(newRect, workArea);
		}
	}

	export function resize(direction: number, axis: Axis) {
		return wrap(function(rect: Rect, scale: number) {
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
		return wrap(function(rect: Rect, scale: number) {
			const amount = MOVE_SENSITIVITY * scale * direction;
			const diff = axialPoint(axis, amount);
			// p("adding diff: " + JSON.stringify(amount) + " to window rect: " + JSON.stringify(rect));
			return {
				pos: Point.add(rect.pos, diff),
				size: rect.size,
			};
		})
	}
}
