/*
 * ================================================================================
 * CONSTANTS
 * ================================================================================
 */

const OPTIONS_FOLDER = "folder";
const OPTIONS_OVERRIDE = "override";
const OPTIONS_ICON = "icon";
const OPTIONS_INBOX = "inbox";
const OPTIONS_ADDTOTOP = "addtotop";

const FOLDER_NONE = "none";

const OPTIONS_ARRAY = [ OPTIONS_FOLDER, OPTIONS_OVERRIDE, OPTIONS_ICON, OPTIONS_INBOX, OPTIONS_ADDTOTOP ];

/*
 * ================================================================================
 * UTILITIES
 * ================================================================================
 */

/*
 * Indicates if the override settings has been enabled and a folder selected
 */
function isNewLocationSet(options) {
    var isSet = false;
    if (options.hasOwnProperty(OPTIONS_OVERRIDE) && options[OPTIONS_OVERRIDE] === true) {
        if (options[OPTIONS_FOLDER] !== undefined && options[OPTIONS_FOLDER] !== FOLDER_NONE) {
            isSet = true;
        }
    }
    return isSet;
}

/*
 * Indicates if the "quick bookmark" icon has been enabled
 */
function quickBookmarkMode(options) {
    var isEnabled = false;
    if (options.hasOwnProperty(OPTIONS_ICON) && options[OPTIONS_ICON] === true) {
        isEnabled = true;
    }
    return isEnabled;
}

/*
 * Indicates if the "inbox mode" has been enabled
 */
function inboxMode(options) {
    var isEnabled = false;
    if (options.hasOwnProperty(OPTIONS_INBOX) && options[OPTIONS_INBOX] === true) {
        isEnabled = true;
    }
    return isEnabled;
}

/*
 * Indicates if the "add to top of folder mode" has been enabled
 */
function addToTopMode(options) {
    var isEnabled = false;
    if (options.hasOwnProperty(OPTIONS_ADDTOTOP) && options[OPTIONS_ADDTOTOP] === true) {
        isEnabled = true;
    }
    return isEnabled;
}

/*
 * ================================================================================
 * OVERRIDING DEFAULT BOOKMARK FOLDER
 * ================================================================================
 */

/*
 * Moves the bookmark to the specified folder (if option activated)
 */
function handleCreated(id, bookmarkInfo) {
    // Only process bookmarks (not folders or separators) with an actual URL
    if (bookmarkInfo.type === "bookmark" && bookmarkInfo.hasOwnProperty("url")) {
        if (bookmarkInfo.url !== undefined && bookmarkInfo.url !== "about:blank") {

            var gettingOptions = browser.storage.local.get(OPTIONS_ARRAY);
            gettingOptions.then((options) => {

                var bookmarkTreeNode = {};

                if (isNewLocationSet(options)) {
                    bookmarkTreeNode.parentId = options[OPTIONS_FOLDER];
                }
                if (addToTopMode(options)) {
                    bookmarkTreeNode.index = 0;
                }

                browser.bookmarks.move(id, bookmarkTreeNode);
            });
        }
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
        // Create the bookmark (will toggle the handleCreated listener callback function)
        browser.bookmarks.create({title: currentTab.title, url: currentTab.url});
    }
}

/*
 * Switches currentTab and currentBookmark to reflect the currently active tab
 */
function updateActiveTab() {

    function isSupportedProtocol(urlString) {
        var supportedProtocols = ["https:", "http:"];
        var url = document.createElement('a');
        url.href = urlString;
        return supportedProtocols.indexOf(url.protocol) != -1;
    }

    function updateTab(tabs) {
        var gettingOptions = browser.storage.local.get(OPTIONS_ARRAY);
        gettingOptions.then((options) => {
            if (tabs[0]) {
                currentTab = tabs[0];
                if (quickBookmarkMode(options)) {
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
                                if (inboxMode(options)) {
                                    // Only keep current bookmark if it is in the default location
                                    if (options[OPTIONS_FOLDER] === undefined || currentBookmark.parentId !== options[OPTIONS_FOLDER]) {
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