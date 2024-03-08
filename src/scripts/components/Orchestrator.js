'use strict';

class Orchestrator {

	// Get the new web page environment (if necessary) for the new currently active tab
	static async #getNewEnvironment(previousWebPage, newlyActiveTab) {
		const newURL = newlyActiveTab.url;
		const newTitle = newlyActiveTab.title;
		let currentWebPage = null;
		// Checking if URL or title have changed
		if (previousWebPage === null || newURL !== previousWebPage.url) {
			currentWebPage = new WebPage(newlyActiveTab.id, newURL, newTitle);
			await currentWebPage.determineSupportedStatus();
		} else {
			currentWebPage = previousWebPage;
			if (newTitle !== previousWebPage.title) currentWebPage.title = newTitle;
		}
		await currentWebPage.determineBookmarkingStatus();
		return currentWebPage;
	}

	static #updateInterface(webPage, options) {
		const userInterface = new Interface(webPage, options);
		userInterface.updatePageAction();
		userInterface.updateBrowserAction();
		userInterface.updateContextMenus();
	}


	static async processBookmarkEvent() {
		Logger.info('Processing bookmark event')
		// Update the extension options
		GLOBAL.updateOptions();
		// Update the extension environment
		const newlyActiveTab = await Utils.getActiveTab();
		if (newlyActiveTab) {
			GLOBAL.webPage = await Orchestrator.#getNewEnvironment(GLOBAL.webPage, newlyActiveTab);
			// Update the extension interface
			Orchestrator.#updateInterface(GLOBAL.webPage, GLOBAL.options);
		}
	}

	// Update the extension options after user changes
	static async onOptionsUpdated() {
		GLOBAL.updateOptions();
	}

	static async onBookmarksCreated(id, bookmarkInfo) {
		try {
			const gatekeeper = new BookmarkingGatekeeper(GLOBAL.options, GLOBAL.bookmarkingHistory);
			gatekeeper.onBookmarksCreated(id, bookmarkInfo);
		} catch (e) {
			Logger.error(e);
		}
	}

	static async onBookmarksMoved(id, moveInfo) {
		await GLOBAL.options.updateLastUsedFolder(moveInfo.parentId);
	}

	static async onPageActionClick() {
		const quickBookmarking = new QuickBookmarking(GLOBAL.webPage, GLOBAL.options);
		await quickBookmarking.toggle();
	}

	static async onShortcutUsed(command) {
		if (command === QUICK_BOOKMARKING_COMMAND) {
			const quickBookmarking = new QuickBookmarking(GLOBAL.webPage, GLOBAL.options);
			await quickBookmarking.shortcutToggle();
		}
	}

	static async onContextMenuClick(info, tab) {
		const quickBookmarking = new QuickBookmarking(GLOBAL.webPage, GLOBAL.options);
		if (info.menuItemId === CM_BOOKMARK) {
			await quickBookmarking.bookmarkHereViaContextMenu(info);
		} else if (info.menuItemId === CM_PAGE) {
			await quickBookmarking.bookmarkToggleViaPageContextMenu(info);
		}
	}

	static async onAddonInstallation(details) {
		GLOBAL.updateOptions();
		const update = new Update(GLOBAL.options);
		if (details.reason === 'install') {
			update.openOptionsPage();
		} else if (details.reason === 'update') {
			if (details.previousVersion[0] === '1') update.updateFromFirstVersion();
			if (details.previousVersion === '2.10.0') update.updateRemovedNewReleaseOption();
			if (details.previousVersion === '3.1.0') update.updateRemovedThemeSwitchOption();
			await update.displayReleaseNotes();
		}
	}
}
