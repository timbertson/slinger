function p(msg: String) {
	log('[throwy]:' + msg);
}
function dump(obj: any) {
	p(JSON.stringify(obj));
}
