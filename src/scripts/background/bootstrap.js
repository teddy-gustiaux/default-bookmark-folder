'use strict';

let GLOBAL = null;

try {
	GLOBAL = new Global();
	Logger.clear();
} catch (e) {
	Logger.error(e);
} finally {
	Logger.info('Extension starting');
}
