/// <reference path="common.ts" />
/// <reference path="menu.ts" />

module ClutterTest {
	const Clutter = imports.gi.Clutter;
	Clutter.init(null);
	let stage = new Clutter.Stage();
	stage.connect("destroy", function() { Clutter.main_quit() });
	stage.title = "Test";

	const screen: Rect = { pos: {x:0,y:0}, size: { x: 640, y: 480 } };
	const windowRect: Rect = { pos: {x:50,y:50}, size: { x: 200, y: 300 } };
	const onSelect = function(_action: Menu.Action, _rect:Rect) {};
	var menu = new Menu.Menu(stage, screen, {x: 320, y: 320}, windowRect, onSelect);
	menu.ui.set_background_color(new Clutter.Color({
		red: 128,
		green: 128,
		blue: 128,
		alpha: 255
	}));

	function rand() { return Math.floor(Math.random() * 255); }

	stage.connect('button-press-event', function(_actor: Actor, event: ClutterMouseEvent) {
		menu.destroy();
		const [x, y] = event.get_coords();
		menu = new Menu.Menu(stage, screen, {x, y}, windowRect, onSelect);
		menu.ui.set_background_color(new Clutter.Color({
			red: rand(),
			green: rand(),
			blue: rand(),
			alpha: 255
		}));
		// show();
	});

	stage.show_all();
	Clutter.main();
}
