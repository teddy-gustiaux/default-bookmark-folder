function setOption(selectElement, value) {
    return [...selectElement.options].some((option, index) => {
        if (option.value === value) {
            selectElement.selectedIndex = index;
            return true;
        }
    });
}

function saveOptions(e) {
    browser.storage.sync.set({
        folder: document.querySelector("#folder").value,
        override: document.querySelector("#override").checked,
        icon: document.querySelector("#icon").checked,
        inbox: document.querySelector("#inbox").checked
    });
    e.preventDefault();
}

function restoreOptions() {
    var gettingTree = browser.bookmarks.getTree();
    gettingTree.then(buildTree, onRejected);
    var gettingFolder= browser.storage.sync.get("folder");
    gettingFolder.then((res) => {
        if (res.folder !== undefined) setOption(document.querySelector("#folder"), res.folder);
    });
    var gettingOverride = browser.storage.sync.get("override");
    gettingOverride.then((res) => {
        if (res.override !== undefined) document.querySelector("#override").checked =  res.override;
    });
    var gettingIcon = browser.storage.sync.get("icon");
    gettingIcon.then((res) => {
        if (res.icon !== undefined) document.querySelector("#icon").checked =  res.icon;
    });
    var gettingInbox= browser.storage.sync.get("inbox");
    gettingInbox.then((res) => {
        if (res.inbox !== undefined) document.querySelector("#inbox").checked =  res.inbox;
    });
}

function makeIndent(indentLength) {
    return "\xA0\xA0".repeat(indentLength);
}

function buildItems(bookmarkItem, indent) {
    if (!bookmarkItem.url) {
        if (!bookmarkItem.title && indent === 0) {
            // Root of the bookmark tree
        } else {
            var select = document.querySelector("#folder");
            var displayName;
            if (!bookmarkItem.title) {
                displayName = "(no name)";
            } else {
                displayName = bookmarkItem.title;
            }
            var key = makeIndent(indent) + displayName;
            select.options[select.options.length] = new Option(key, bookmarkItem.id);
            indent++;
        }
    }
    if (bookmarkItem.children) {
        for (var child of bookmarkItem.children) {
            buildItems(child, indent);
        }
    }
    indent--;
}


function buildTree(bookmarkItems) {
    buildItems(bookmarkItems[0], 0);
}

function onRejected(error) {
    console.log(`An error occurred: ${error}`);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);