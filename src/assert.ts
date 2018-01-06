function assert<T>(x: T, msg?: string):T {
	if(!x) {
		throw new Error(msg ? ("Assertion failed: " + msg) : "Assertion failed");
	}
	return x;
}
