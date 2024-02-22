'use strict';

function isDevelopment() {
	const manifest = browser.runtime.getManifest();
	return manifest.name.includes('[DEV]');
}

const globalIsDevelopment = isDevelopment();

Logger.clear();
Logger.info('Extension starting');

// eslint-disable-next-line prefer-const
let globalBookmarkingHistory = null;
// eslint-disable-next-line prefer-const
let globalWebPage = null;
// eslint-disable-next-line prefer-const
let globalOptions = null;
