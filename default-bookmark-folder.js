/*
 * ================================================================================
 * CONSTANTS
 * ================================================================================
 */

const OPTIONS_FOLDER = "folder";
const OPTIONS_OVERRIDE = "override";
const OPTIONS_ICON = "icon";
const OPTIONS_INBOX = "inbox";

const FOLDER_NONE = "none";

/*
 * ================================================================================
 * OVERRIDING DEFAULT BOOKMARK FOLDER
 * ================================================================================
 */

/*
 * Moves the bookmark to the specified folder (if option activated)
 */
function handleCreated(id, bookmarkInfo) {
    // Only process bookmarks (not folders)
    if (bookmarkInfo.hasOwnProperty("url") && bookmarkInfo.url !== undefined) {
        var gettingOverride = browser.storage.local.get([OPTIONS_OVERRIDE, OPTIONS_FOLDER]);
        gettingOverride.then((res) => {
            if (res.hasOwnProperty(OPTIONS_OVERRIDE) && res[OPTIONS_OVERRIDE] === true) {
                if (res[OPTIONS_FOLDER] !== undefined && res[OPTIONS_FOLDER] !== FOLDER_NONE) {
                    browser.bookmarks.move(id, {parentId: res[OPTIONS_FOLDER]});
                }
            }
        });
    }
}

// Listen for bookmarks being created
browser.bookmarks.onCreated.addListener(handleCreated);

/*
 * ================================================================================
 * CREATING ANOTHER BOOKMARKING ICON
 * ================================================================================
 */

var currentTab;
var currentBookmark;

/*
 * Updates the browserAction icon to reflect whether the current page
 * is already bookmarked.
 */
function updateIcon(iconEnabled) {
    if (iconEnabled === true) {
        browser.pageAction.setIcon({
            path: currentBookmark ? {
                32: "icons/star-button-32.png",
                48: "icons/star-button-48.png"
            } : {
                32: "icons/star-button-empty-32.png",
                48: "icons/star-button-empty-48.png"
            },
            tabId: currentTab.id
        });
        browser.pageAction.setTitle({
            // Screen readers can see the title
            title: currentBookmark ? 'Unbookmark it!' : 'Bookmark it!',
            tabId: currentTab.id
        });
    } else {
        browser.pageAction.setIcon({
            path: {
                32: "icons/cross-32.png",
                48: "icons/cross-48.png"
            },
            tabId: currentTab.id
        });
        browser.pageAction.setTitle({
            // Screen readers can see the title
            title: 'The icon is disabled. Enable it in the add-on settings.',
            tabId: currentTab.id
        });
    }
}

/*
 * Add or remove the bookmark on the current page.
 */
function toggleBookmark(tab) {
    if (currentBookmark) {
        browser.bookmarks.remove(currentBookmark.id);
    } else {
        var gettingFolder = browser.storage.local.get(OPTIONS_FOLDER);
        gettingFolder.then((res) => {
            if (res[OPTIONS_FOLDER] !== undefined && res[OPTIONS_FOLDER] !== FOLDER_NONE) {
                browser.bookmarks.create({title: currentTab.title, url: currentTab.url, parentId: res[OPTIONS_FOLDER]});
            } else {
                browser.bookmarks.create({title: currentTab.title, url: currentTab.url});
            }
        });
    }
}

/*
 * Switches currentTab and currentBookmark to reflect the currently active tab
 */
function updateActiveTab() {

    function isSupportedProtocol(urlString) {
        var supportedProtocols = ["https:", "http:", "ftp:", "file:"];
        var url = document.createElement('a');
        url.href = urlString;
        return supportedProtocols.indexOf(url.protocol) != -1;
    }

    function updateTab(tabs) {
        var gettingIcon = browser.storage.local.get([OPTIONS_ICON, OPTIONS_FOLDER, OPTIONS_INBOX]);
        gettingIcon.then((res) => {
            if (tabs[0]) {
                currentTab = tabs[0];
                if (res.hasOwnProperty(OPTIONS_ICON) && res[OPTIONS_ICON] === true) {
                    browser.pageAction.show(currentTab.id);
                    var searching;
                    if (isSupportedProtocol(currentTab.url)) {
                        searching = browser.bookmarks.search({url: currentTab.url});
                    } else {
                        searching = browser.bookmarks.search(currentTab.url);
                    }
                    searching.then((bookmarks) => {
                        if (bookmarks.length === 1) {
                            currentBookmark = bookmarks[0];
                            // Only proceed if bookmark matches current tab address
                            if (currentBookmark.url === currentTab.url) {
                                if (res.hasOwnProperty(OPTIONS_INBOX) && res[OPTIONS_INBOX] === true) {
                                    // Only keep current bookmark if it is in the default location
                                    if (res[OPTIONS_FOLDER] === undefined || currentBookmark.parentId !== res[OPTIONS_FOLDER]) {
                                        currentBookmark = undefined;
                                    }
                                }
                            } else {
                                currentBookmark = undefined;
                            }
                        } else if (bookmarks.length === 0) {
                            // No bookmarks
                            currentBookmark = undefined;
                        } else if (bookmarks.length > 1) {
                            // Duplicate bookmarks
                            currentBookmark = undefined;
                            browser.pageAction.hide(currentTab.id);
                        }
                        updateIcon(true);
                    });
                } else {
                    currentBookmark = undefined;
                    browser.pageAction.hide(currentTab.id);
                    updateIcon(false);
                }
            }
        });
    }

    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then(updateTab);
}

// Listen for clicks on the button
browser.pageAction.onClicked.addListener(toggleBookmark);

// Listen for bookmarks being created
browser.bookmarks.onCreated.addListener(updateActiveTab);

// Listen for bookmarks being removed
browser.bookmarks.onRemoved.addListener(updateActiveTab);

// Listen for bookmarks being moved
browser.bookmarks.onMoved.addListener(updateActiveTab);

// Listen to tab URL changes
browser.tabs.onUpdated.addListener(updateActiveTab);

// Listen to tab switching
browser.tabs.onActivated.addListener(updateActiveTab);

// Listen for window switching
browser.windows.onFocusChanged.addListener(updateActiveTab);

// Update when the extension loads initially
updateActiveTab();