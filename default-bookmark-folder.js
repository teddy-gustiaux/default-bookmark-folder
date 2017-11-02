/*
 * ================================================================================
 * OVERRIDING DEFAULT BOOKMARK FOLDER
 * ================================================================================
 */

/*
 * Moves the bookmark to the specified folder (if option activated)
 */
function handleCreated(id, bookmarkInfo) {
    var gettingOverride = browser.storage.sync.get("override");
    gettingOverride.then((res) => {
        if (res.hasOwnProperty('override') && res.override === true) {
            var gettingFolder = browser.storage.sync.get("folder");
            gettingFolder.then((res) => {
                if (res.folder !== undefined) {
                    browser.bookmarks.move(id, {parentId: res.folder});
                }
            });
        }
    });
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
function updateIcon() {
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
}

/*
 * Add or remove the bookmark on the current page.
 */
function toggleBookmark(tab) {
    if (currentBookmark) {
        browser.bookmarks.remove(currentBookmark.id);
    } else {
        var gettingFolder = browser.storage.sync.get("folder");
        gettingFolder.then((res) => {
            if (res.folder !== undefined) {
                browser.bookmarks.create({title: currentTab.title, url: currentTab.url, parentId: res.folder});
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
        if (tabs[0]) {
            currentTab = tabs[0];
            browser.pageAction.show(currentTab.id);
            var searching;
            if (isSupportedProtocol(currentTab.url)) {
                searching = browser.bookmarks.search({url: currentTab.url});
            } else {
                searching = browser.bookmarks.search(currentTab.url);
            }
            searching.then((bookmarks) => {
                // Only proceed if exactly one match
                if (bookmarks.length === 1) {
                    currentBookmark = bookmarks[0];
                    if (currentBookmark.url === currentTab.url) {
                    } else {
                        currentBookmark = undefined;
                    }
                } else {
                    currentBookmark = undefined;
                }
                updateIcon();
            });
        }
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

// Listen to tab URL changes
browser.tabs.onUpdated.addListener(updateActiveTab);

// Listen to tab switching
browser.tabs.onActivated.addListener(updateActiveTab);

// Listen for window switching
browser.windows.onFocusChanged.addListener(updateActiveTab);

// Update when the extension loads initially
updateActiveTab();