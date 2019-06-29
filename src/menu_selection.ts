/// <reference path="menu.ts" />

const enum Ring {
	NONE = 0,
	INNER,
	OUTER
}

interface MenuSelection {
	ring: Ring
	index: number
	mode: Menu.SplitMode
}

module MenuSelection {
	export const None: MenuSelection = { ring: Ring.NONE, index: 0, mode: Menu.SplitMode.FOUR }

	export function eq(a: MenuSelection, b: MenuSelection) {
		return a.ring == b.ring && a.index == b.index && a.mode == b.mode;
	}
	export function eqTo(a: MenuSelection, ring: Ring, location: number, mode: Menu.SplitMode) {
		return a.ring == ring && a.index == location && a.mode == mode;
	}

	export function Inner(sel: Anchor, mode: Menu.SplitMode): MenuSelection {
		return { ring: Ring.INNER, index: sel, mode: mode };
	}
	export function Outer(sel: Anchor, mode: Menu.SplitMode): MenuSelection {
		return { ring: Ring.OUTER, index: sel, mode: mode };
	}
}
