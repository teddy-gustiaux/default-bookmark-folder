'use strict';

/*
 * =================================================================================================
 * UTILITIES
 * =================================================================================================
 */

// Get all extension settings
async function getOptions() {
    return browser.storage.local.get();
}

// Indicate if a bookmark object is a folder
function bookmarkIsFolder(bookmarkInfo) {
    let isFolder = false;
    if (
        Object.prototype.hasOwnProperty.call(bookmarkInfo, 'type') &&
        bookmarkInfo.type === 'folder'
    ) {
        isFolder = true;
    } else if (!Object.prototype.hasOwnProperty.call(bookmarkInfo, 'url')) isFolder = true;
    return isFolder;
}

// Set the selection option in a <select> element
function setOption(selector, value) {
    const selectElement = document.querySelector(selector);
    return [...selectElement.options].some((option, index) => {
        if (option.value === value) {
            selectElement.selectedIndex = index;
            return true;
        }
        return false;
    });
}

// Add an unbreakable space for indentation
function makeIndent(indentLength) {
    return '\xA0\xA0'.repeat(indentLength);
}

// Build the <select> options from the bookmarks tree
function buildItems(bookmarkItem, indent, selectors) {
    // TODO: better check of existing properties
    let indentProgress = indent;
    if (bookmarkIsFolder(bookmarkItem)) {
        if (bookmarkItem.title || indent !== 0) {
            const displayName = !bookmarkItem.title ? UNNAMED_FOLDER : bookmarkItem.title;
            const key = makeIndent(indent) + displayName;
            Array.from(selectors).forEach(selector => {
                const select = document.querySelector(selector);
                select.options[select.options.length] = new Option(key, bookmarkItem.id);
            });
            indentProgress += 1;
        }
    }
    if (bookmarkItem.children) {
        Array.from(bookmarkItem.children).forEach(child =>
            buildItems(child, indentProgress, selectors),
        );
    }
}

// Build the bookmarks tree
function buildTree(bookmarkItems, selectors) {
    buildItems(bookmarkItems[0], 0, selectors);
}
