'use strict';

/*
 * =================================================================================================
 * FUNCTION GLOBAL DEFINITIONS FOR ESLINT
 * =================================================================================================
 */

/* global getActiveTab */

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

function updateInterface(webPage, options) {
    if (options.isIconEnabled()) {
        if (webPage.isSupported) {
            if (webPage.isBookmarked) {
                if (options.isInboxModeEnabled()) {
                    // TODO: manage inbox mode (including multiple bookmarks)
                } else {
                    PageAction.enableBookmarked(
                        webPage.id,
                        options.getIconColor(),
                        options.isRemovalPreventionEnabled(),
                    );
                }
            } else {
                PageAction.enableNotBookmarked(webPage.id);
            }
        } else {
            // TODO: create not supported page use case
            PageAction.disable(webPage.id);
            PageAction.hide(webPage.id);
        }
    } else {
        PageAction.disable(webPage.id);
        PageAction.hide(webPage.id);
    }
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

function onBookmarksCreated(id, bookmarkInfo) {
    const builtinBookmarking = new BuiltinBookmarking(globalOptions);
    builtinBookmarking.move(id, bookmarkInfo);
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

/*
 * =================================================================================================
 * LISTENERS
 * =================================================================================================
 */

// -------------------------------------------------------------------------------------------------
// TABS
// -------------------------------------------------------------------------------------------------

// Listen to tab URL changes
browser.tabs.onUpdated.addListener(processUpdate, { properties: ['status', 'title'] });
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
