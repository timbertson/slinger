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
