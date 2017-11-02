/*
 * ================================================================================
 * OVERRIDING DEFAULT BOOKMARK FOLDER
 * ================================================================================
 */

function handleCreated(id, bookmarkInfo) {
    var gettingOverride = browser.storage.sync.get("override");
    gettingOverride.then((res) => {
        if (res.override === true) {
            var gettingFolder = browser.storage.sync.get("folder");
            gettingFolder.then((res) => {
                if (res.folder !== undefined) {
                    browser.bookmarks.move(id, {parentId: res.folder});
                }
            });
        }
    });
}

browser.bookmarks.onCreated.addListener(handleCreated);