declare var imports: any;
declare var log: {(m: any):void};

interface Point2d {
	x: number
	y: number
}

interface Rect {
	pos: Point2d
	size: Point2d
}

interface MetaRect {
	x: number
	y: number
	width: number
	height: number
}
