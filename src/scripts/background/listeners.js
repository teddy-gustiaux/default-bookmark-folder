'use strict';

// Get the new extension options (if necessary)
async function getNewOptions(previousOptions) {
	let currentOptions;
	if (previousOptions === null) {
		const extensionsSettings = await Utils.getOptions();
		currentOptions = new Options(extensionsSettings);
	} else {
		currentOptions = previousOptions;
	}
	return currentOptions;
}

// Update the extension options after user changes
async function onOptionsUpdated() {
	globalOptions = await getNewOptions(null);
}

// Get the new web page environment (if necessary) for the new currently active tab
async function getNewEnvironment(previousWebPage, newlyActiveTab) {
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

function updateInterface(webPage, options) {
	const userInterface = new Interface(webPage, options);
	userInterface.updatePageAction();
	userInterface.updateBrowserAction();
	userInterface.updateContextMenus();
}

async function processUpdate() {
	// Update the extension options
	globalOptions = await getNewOptions(globalOptions);
	// Update the extension environment
	const newlyActiveTab = await Utils.getActiveTab();
	globalWebPage = await getNewEnvironment(globalWebPage, newlyActiveTab);
	// Update the extension interface
	updateInterface(globalWebPage, globalOptions);
}

async function onBookmarksCreated(id, bookmarkInfo) {
	try {
		const gatekeeper = new BookmarkingGatekeeper(globalOptions, globalBookmarkingHistory);
		gatekeeper.onBookmarksCreated(id, bookmarkInfo);
	} catch (e) {
		Logger.error(e);
	}
}

async function onBookmarksMoved(id, moveInfo) {
	await globalOptions.updateLastUsedFolder(moveInfo.parentId);
}

async function onPageActionClick() {
	const quickBookmarking = new QuickBookmarking(globalWebPage, globalOptions);
	await quickBookmarking.toggle();
}

async function onShortcutUsed(command) {
	if (command === QUICK_BOOKMARKING_COMMAND) {
		const quickBookmarking = new QuickBookmarking(globalWebPage, globalOptions);
		await quickBookmarking.shortcutToggle();
	}
}

async function onContextMenuClick(info, tab) {
	const quickBookmarking = new QuickBookmarking(globalWebPage, globalOptions);
	if (info.menuItemId === CM_BOOKMARK) {
		await quickBookmarking.bookmarkHereViaContextMenu(info);
	} else if (info.menuItemId === CM_PAGE) {
		await quickBookmarking.bookmarkToggleViaPageContextMenu(info);
	}
}

async function onAddonInstallation(details) {
	globalOptions = await getNewOptions(globalOptions);
	const update = new Update(globalOptions);
	if (details.reason === 'install') {
		update.openOptionsPage();
	} else if (details.reason === 'update') {
		if (details.previousVersion[0] === '1') update.updateFromFirstVersion();
		if (details.previousVersion === '2.10.0') update.updateRemovedNewReleaseOption();
		if (details.previousVersion === '3.1.0') update.updateRemovedThemeSwitchOption();
		await update.displayReleaseNotes();
	}
}
