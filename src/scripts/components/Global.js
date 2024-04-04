'use strict';

class Global {
	#bookmarkingHistory = null;
	#webPage = null;
	#options = null;
	#isDevelopment = false;

	constructor() {
		const manifest = browser.runtime.getManifest();
		this.#isDevelopment = manifest.name.includes('[DEV]');
		this.#bookmarkingHistory = new BookmarkingHistory();
	}

	get bookmarkingHistory() {
		return this.#bookmarkingHistory;
	}

	get webPage() {
		return this.#webPage;
	}

	get options() {
		return this.#options;
	}

	get isDevelopment() {
		return this.#isDevelopment;
	}

	set webPage(webPage) {
		this.#webPage = webPage;
	}

	async updateOptions() {
		const extensionsSettings = await Utils.getOptions();
		this.#options = new Options(extensionsSettings);
	}
}
