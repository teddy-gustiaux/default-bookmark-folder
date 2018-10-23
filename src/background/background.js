'use strict';

/*
 * =================================================================================================
 * EXTENSION LOGIC
 * =================================================================================================
 */

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
    } else {
        currentWebPage = previousWebPage;
        if (newTitle !== previousWebPage.title) currentWebPage.title = newTitle;
    }
    await currentWebPage.determineBookmarkingStatus();
    return currentWebPage;
}

function updateInterface(webPage, options, version) {
    const userInterface = new Interface(webPage, options, version);
    userInterface.updatePageAction();
    userInterface.updateContextMenus();
}

async function processUpdate() {
    // Update the extension options
    globalOptions = await getNewOptions(globalOptions);
    // Update the extension environment
    const newlyActiveTab = await Utils.getActiveTab();
    globalWebPage = await getNewEnvironment(globalWebPage, newlyActiveTab);
    // Get Firefox version
    const version = await Utils.getFirefoxMainVersion();
    // Update the extension interface
    updateInterface(globalWebPage, globalOptions, version);
}

async function onBookmarksCreated(id, bookmarkInfo) {
    const builtinBookmarking = new BuiltinBookmarking(globalOptions);
    await builtinBookmarking.move(id, bookmarkInfo);
}

async function onBookmarksMoved(id, moveInfo) {
    await globalOptions.updateLastUsedFolder(moveInfo.parentId);
}

async function onPageActionClick() {
    const quickBookmarking = new QuickBookmarking(globalWebPage, globalOptions);
    await quickBookmarking.toggle();
}

async function onShortcutUsed(command) {
    if (command === QUICK_BOOOKMARKING_COMMAND) {
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
    const update = new Update(globalOptions);
    if (details.reason === 'install') {
        update.openOptionsPage();
    } else if (details.reason === 'update') {
        if (details.previousVersion[0] === '1') update.updateFromFirstVersion();
        await update.displayReleaseNotes();
    }
}

/*
 * =================================================================================================
 * LISTENERS
 * =================================================================================================
 */

// -------------------------------------------------------------------------------------------------
// TABS
// -------------------------------------------------------------------------------------------------

// Listen to tab URL changes (if version supports it, limit to necessary events)
try {
    browser.tabs.onUpdated.addListener(processUpdate, { properties: ['status', 'title'] });
} catch (error) {
    if (error.message.includes('Incorrect argument types for tabs.onUpdated')) {
        browser.tabs.onUpdated.addListener(processUpdate);
    }
}
// Listen to tab activation and tab switching
browser.tabs.onActivated.addListener(processUpdate);

// -------------------------------------------------------------------------------------------------
// WINDOWS
// -------------------------------------------------------------------------------------------------
// Listen for window activation and window switching
browser.windows.onFocusChanged.addListener(processUpdate);

// -------------------------------------------------------------------------------------------------
// BOOKMARKS
// -------------------------------------------------------------------------------------------------
// Listen for bookmarks being created
browser.bookmarks.onCreated.addListener(onBookmarksCreated);
browser.bookmarks.onCreated.addListener(processUpdate);
// Listen for bookmarks being removed
browser.bookmarks.onRemoved.addListener(processUpdate);
// Listen for bookmarks being moved
browser.bookmarks.onMoved.addListener(onBookmarksMoved);
browser.bookmarks.onMoved.addListener(processUpdate);

// -------------------------------------------------------------------------------------------------
// PAGE ACTION
// -------------------------------------------------------------------------------------------------
// Listen for clicks on the button
browser.pageAction.onClicked.addListener(onPageActionClick);

// -------------------------------------------------------------------------------------------------
// COMMANDS
// -------------------------------------------------------------------------------------------------
// Listen for shortcuts
browser.commands.onCommand.addListener(onShortcutUsed);

// -------------------------------------------------------------------------------------------------
// MENUS
// -------------------------------------------------------------------------------------------------
// Listen for context menu click
browser.menus.onClicked.addListener(onContextMenuClick);

// -------------------------------------------------------------------------------------------------
// RUNTIME
// -------------------------------------------------------------------------------------------------
// Listen for add-on installation or update
browser.runtime.onInstalled.addListener(onAddonInstallation);

// -------------------------------------------------------------------------------------------------
// STORAGE
// -------------------------------------------------------------------------------------------------
// Listen for options being updated
browser.storage.onChanged.addListener(onOptionsUpdated);

/*
 * =================================================================================================
 * EXTENSION START
 * =================================================================================================
 */

processUpdate();
