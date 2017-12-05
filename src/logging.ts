function p(msg: String) {
	log('[slinger]:' + msg);
}
function dump(obj: any) {
	p(JSON.stringify(obj));
}
