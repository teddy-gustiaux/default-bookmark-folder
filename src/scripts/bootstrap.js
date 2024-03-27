'use strict';

let GLOBAL = null;

try {
	GLOBAL = new Global();
	Logger.clear();
	Logger.info('Extension starting');
} catch (e) {
	console.error(e);
}
