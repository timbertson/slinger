/// <reference path="common.ts" />
/// <reference path="drawing.ts" />

const Clutter = imports.gi.Clutter;
Clutter.init(null);
let stage = new Clutter.Stage();
stage.connect("destroy", function() { Clutter.main_quit() });
stage.title = "Test";
// stage.set_background_color(new Clutter.Color({
//     red : 60,
//     green : 60,
//     blue : 65,
//     alpha : 255
// }));

const menu = new Drawing.Menu({ x: 640, y: 480 }, { x: 320, y: 240 });
stage.add_actor(menu.actor);
stage.show_all();
Clutter.main();

