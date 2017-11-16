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

const QUERY_FOLDER = "#" + OPTIONS_FOLDER;
const QUERY_OVERRIDE = "#" + OPTIONS_OVERRIDE;
const QUERY_ICON = "#" + OPTIONS_ICON;
const QUERY_INBOX = "#" + OPTIONS_INBOX;
const QUERY_ADDTOTOP = "#" + OPTIONS_ADDTOTOP;

const UNNAMED_FOLDER = "[no name]";

const OPTIONS_ARRAY = [ OPTIONS_FOLDER, OPTIONS_OVERRIDE, OPTIONS_ICON, OPTIONS_INBOX, OPTIONS_ADDTOTOP ];

/*
 * ================================================================================
 * FUNCTIONS
 * ================================================================================
 */

/*
 * Sets the selection option in a <select> element
 */
function setOption(selectElement, value) {
    return [...selectElement.options].some((option, index) => {
        if (option.value === value) {
            selectElement.selectedIndex = index;
            return true;
        }
    });
}

/*
 * Saves the options form
 */
function saveOptions(e) {
    browser.storage.local.set({
        folder: document.querySelector(QUERY_FOLDER).value,
        override: document.querySelector(QUERY_OVERRIDE).checked,
        icon: document.querySelector(QUERY_ICON).checked,
        inbox: document.querySelector(QUERY_INBOX).checked,
        addtotop: document.querySelector(QUERY_ADDTOTOP).checked
    });
    e.preventDefault();
}

/*
 * Restores the extension options
 */
function restoreOptions() {

    function updateOptions(bookmarkItems) {
        buildTree(bookmarkItems);
        var gettingOptions= browser.storage.local.get(OPTIONS_ARRAY);
        gettingOptions.then((res) => {
            if (res[OPTIONS_FOLDER] !== undefined) {
                setOption(document.querySelector(QUERY_FOLDER), res[OPTIONS_FOLDER]);
            }
            if (res[OPTIONS_OVERRIDE] !== undefined) document.querySelector(QUERY_OVERRIDE).checked =  res[OPTIONS_OVERRIDE];
            if (res[OPTIONS_ICON] !== undefined) document.querySelector(QUERY_ICON).checked =  res[OPTIONS_ICON];
            if (res[OPTIONS_INBOX] !== undefined) document.querySelector(QUERY_INBOX).checked =  res[OPTIONS_INBOX];
            if (res[OPTIONS_ADDTOTOP] !== undefined) document.querySelector(QUERY_ADDTOTOP).checked =  res[OPTIONS_ADDTOTOP];
        });
    }

    var gettingTree = browser.bookmarks.getTree();
    gettingTree.then(updateOptions, onRejected);

}

/*
 * Adds an unbreakable space for indentation
 */
function makeIndent(indentLength) {
    return "\xA0\xA0".repeat(indentLength);
}

/*
 * Builds the <select> options from the bookmarks tree
 */
function buildItems(bookmarkItem, indent) {
    if (!bookmarkItem.url) {
        if (!bookmarkItem.title && indent === 0) {
            // Root of the bookmark tree
        } else {
            var select = document.querySelector(QUERY_FOLDER);
            var displayName;
            if (!bookmarkItem.title) {
                displayName = UNNAMED_FOLDER;
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

/*
 * Builds the bookmarks tree
 */
function buildTree(bookmarkItems) {
    buildItems(bookmarkItems[0], 0);
}

/*
 * Logs errors to the console
 */
function onRejected(error) {
    console.log(`An error occurred: ${error}`);
}

// Listen for loading of the options page
document.addEventListener('DOMContentLoaded', restoreOptions);

// Listen for saving of the options page
document.querySelector("form").addEventListener("submit", saveOptions);