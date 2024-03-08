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
		try {
			Logger.info('Processing bookmark event and updating interface')
			// Update the extension options
			await GLOBAL.updateOptions();
			// Update the extension environment
			const newlyActiveTab = await Utils.getActiveTab();
			if (newlyActiveTab) {
				GLOBAL.webPage = await Orchestrator.#getNewEnvironment(GLOBAL.webPage, newlyActiveTab);
				// Update the extension interface
				Orchestrator.#updateInterface(GLOBAL.webPage, GLOBAL.options);
			}
		} catch (e) {
			Logger.error(e);
		}
	}

	// Update the extension options after user changes
	static async onOptionsUpdated() {
		try {
			await GLOBAL.updateOptions();
		} catch (e) {
			Logger.error(e);
		}
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
		try {
			await GLOBAL.options.updateLastUsedFolder(moveInfo.parentId);
		} catch (e) {
			Logger.error(e);
		}
	}

	static async onPageActionClick() {
		try {
			const quickBookmarking = new QuickBookmarking(GLOBAL.webPage, GLOBAL.options);
			await quickBookmarking.toggle();
		} catch (e) {
			Logger.error(e);
		}
	}

	static async onShortcutUsed(command) {
		try {
			if (command === QUICK_BOOKMARKING_COMMAND) {
				const quickBookmarking = new QuickBookmarking(GLOBAL.webPage, GLOBAL.options);
				await quickBookmarking.shortcutToggle();
			}
		} catch (e) {
			Logger.error(e);
		}
	}

	static async onContextMenuClick(info, tab) {
		try {
			const quickBookmarking = new QuickBookmarking(GLOBAL.webPage, GLOBAL.options);
			if (info.menuItemId === CM_BOOKMARK) {
				await quickBookmarking.bookmarkHereViaContextMenu(info);
			} else if (info.menuItemId === CM_PAGE) {
				await quickBookmarking.bookmarkToggleViaPageContextMenu(info);
			}
		} catch (e) {
			Logger.error(e);
		}
	}

	static async onAddonInstallation(details) {
		try {
			await GLOBAL.updateOptions();
			const update = new Update(GLOBAL.options);
			if (details.reason === 'install') {
				update.openOptionsPage();
			} else if (details.reason === 'update') {
				if (details.previousVersion[0] === '1') update.updateFromFirstVersion();
				if (details.previousVersion === '2.10.0') update.updateRemovedNewReleaseOption();
				if (details.previousVersion === '3.1.0') update.updateRemovedThemeSwitchOption();
				await update.displayReleaseNotes();
			}
		} catch (e) {
			Logger.error(e);
		}
	}
}
