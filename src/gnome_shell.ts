interface MetaRect {
	x: number
	y: number
	width: number
	height: number
}

type MetaScreen = {
	get_display(): {
		'focus-window': MetaWindow
	}
	get_screen_number(): number
	get_active_workspace_index(): number
	get_active_workspace(): MetaWorkspace
	get_n_workspaces(): number
	get_workspace_by_index(i: number): MetaWorkspace
}

type Global = {
	screen: MetaScreen
	window_group: {}
	get_current_time: () => number
}
declare var global: Global;

type MetaWorkspace = {
	get_work_area_for_monitor(i: number): MetaRect
	list_windows(): Array<MetaWindow>
	activate(time: number): void
	activate_with_focus(win: MetaWindow, time: number): void
}

enum MaximizeFlags {
	Neither = 0
}

type MetaWindow = {
	get_title(): string
	get_window_type(): number
	get_frame_rect(): MetaRect
	get_screen(): MetaScreen
	get_compositor_private(): Actor
	minimize(): void
	unminimize(): void
	minimized: boolean
	get_maximized(): MaximizeFlags
	get_stable_sequence(): number
	unmaximize(flags: number): void
	maximize(flags: number): void
	get_work_area_current_monitor(): MetaRect
	move_to_workspace(idx: number): void
	change_workspace_by_index(newIdx: number, append: boolean): void;
	move_resize_frame(userAction: boolean,
		x: number,
		y: number,
		w: number,
		h: number): void
	get_monitor(): number
};

