'use strict';

class BrowserAction {
	// Disable the browser action
	static disable(tabId) {
		browser.browserAction.disable(tabId);
	}

	// Enable the browser action
	static enable(tabId) {
		browser.browserAction.enable(tabId);
	}
}
