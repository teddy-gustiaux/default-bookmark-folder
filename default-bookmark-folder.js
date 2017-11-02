function onMoved(bookmarkItem) {
}

function onRejected(error) {
    console.log(`An error occurred: ${error}`);
}

function handleCreated(id, bookmarkInfo) {
    var gettingFolder = browser.storage.sync.get("folder");
    gettingFolder.then((res) => {
        if (res.folder !== undefined) {
            var movingBookmark = browser.bookmarks.move(id, {parentId: res.folder});
            movingBookmark.then(onMoved, onRejected);
        }
    });
}

browser.bookmarks.onCreated.addListener(handleCreated);