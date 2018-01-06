const enum InnerSelection {
	MAXIMIZE = 0,
	MINIMIZE
}

const enum Ring {
	NONE = 0,
	INNER,
	OUTER
}

interface MenuSelection {
	ring: Ring
	index: number
}

module MenuSelection {
	export const None: MenuSelection = { ring: Ring.NONE, index: 0 }

	export function eq(a: MenuSelection, b: MenuSelection) {
		return a.ring == b.ring && a.index == b.index;
	}
	export function eqTo(a: MenuSelection, ring: Ring, location: number) {
		return a.ring == ring && a.index == location;
	}

	export function Inner(sel: InnerSelection): MenuSelection {
		return { ring: Ring.INNER, index: sel };
	}
	export function Outer(sel: Anchor): MenuSelection {
		return { ring: Ring.OUTER, index: sel };
	}
}
