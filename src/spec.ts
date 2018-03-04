/// <reference path="rect.ts" />

declare var require: any;
declare var describe: any;
declare var it: any;


var assert = require('assert');

describe('Rect', function() {
	it('intersects', function() {
		assert.deepEqual({
				pos: {x: 50, y: 25},
				size: {x: 200, y: 100},
			},
			Rect.intersection({
				pos: { x: 50, y: 0 },
				size: { x: 300, y: 125 },
			}, {
				pos: { x: 0, y: 25 },
				size: { x: 250, y: 300 },
			})
		);
	});
});
