export module MathUtil {
	export function between(min: number, x: number, max: number): number {
		// p('between('+min+', '+x+', '+max+')');
		if (min > x) return min;
		if (max < x) return max;
		return x;
	}
}
