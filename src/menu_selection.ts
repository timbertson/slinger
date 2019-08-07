const enum Ring {
	NONE = 0,
	INNER,
	OUTER
}

const enum SplitMode {
	FOUR,
	SIX
}

class MenuSelection {
	ring: Ring
	index: number
	splitMode: SplitMode

	constructor(ring: Ring, index: number, splitMode: SplitMode) {
		this.ring = ring;
		this.index = index;
		this.splitMode = splitMode;
	}

	eq(b: MenuSelection) {
		return this.ring == b.ring && this.index == b.index && this.splitMode == b.splitMode;
	}

	// like eqTo, but ignores splitMode
	eqPosition(ring: Ring, location: number) {
		return this.eqTo(ring, location, this.splitMode);
	}

	eqTo(ring: Ring, location: number, splitMode: SplitMode) {
		return this.ring == ring && this.index == location && this.splitMode == splitMode;
	}

	Inner(sel: Anchor): MenuSelection {
		return MenuSelection.Inner(sel, this.splitMode);
	}

	Outer(sel: Anchor): MenuSelection {
		return MenuSelection.Outer(sel, this.splitMode);
	}
}

module MenuSelection {
	export function None(splitMode: SplitMode): MenuSelection {
		return new MenuSelection(Ring.NONE, 0, splitMode);
	}

	export function Inner(sel: Anchor, splitMode: SplitMode): MenuSelection {
		return new MenuSelection(Ring.INNER, sel, splitMode);
	}

	export function Outer(sel: Anchor, splitMode: SplitMode): MenuSelection {
		return new MenuSelection(Ring.OUTER, sel, splitMode);
	}
}
