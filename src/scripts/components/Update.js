'use strict';

class Update {
	#options;

	constructor(options) {
		this.#options = options;
	}

	async openOptionsPage() {
		return browser.runtime.openOptionsPage();
	}

	async openChangelogPage() {
		return browser.tabs.create({
			url: 'https://github.com/teddy-gustiaux/default-bookmark-folder/blob/master/CHANGELOG.md',
			active: true,
		});
	}

	async displayReleaseNotes() {
		if (this.#options.isDisplayReleaseNotesEnabled()) {
			this.openChangelogPage();
		}
	}

	// Update from version 1.*
	updateFromFirstVersion() {
		browser.storage.local.remove(['override', 'icon', 'inbox', 'addtotop']);
	}

	//  Update from version 2.10.0
	updateRemovedNewReleaseOption() {
		browser.storage.local.remove('newRelease');
	}

	//  Update from version 3.1.0
	updateRemovedThemeSwitchOption() {
		browser.storage.local.remove('theme');
	}
}
