'use strict';

/*
 * =================================================================================================
 * GLOBAL VARIABLES
 * =================================================================================================
 */

const gobalBookmarkFolderTreeInformation = [];

/*
 * =================================================================================================
 * EXTENSION LOGIC
 * =================================================================================================
 */

// -------------------------------------------------------------------------------------------------
// BOOKMARK TREE MANIPULATION
// -------------------------------------------------------------------------------------------------

function buildItems(bookmarkItem, indent) {
    let indentProgress = indent;
    if (Utils.bookmarkIsFolder(bookmarkItem) && bookmarkItem.id !== FIREFOX_ROOT_BOOKMARK_FOLDER) {
        if (Object.prototype.hasOwnProperty.call(bookmarkItem, 'title') || indent !== 0) {
            const folderInformation = {
                title: !bookmarkItem.title ? UNNAMED_FOLDER : bookmarkItem.title,
                id: bookmarkItem.id,
            };
            gobalBookmarkFolderTreeInformation.push(folderInformation);
            indentProgress += 1;
        }
    }
    if (
        Object.prototype.hasOwnProperty.call(bookmarkItem, 'children') &&
        bookmarkItem.children.length !== 0
    ) {
        Array.from(bookmarkItem.children).forEach(child => buildItems(child, indentProgress));
    }
}

function buildTree(bookmarkItems) {
    buildItems(bookmarkItems[0], 0);
}

// -------------------------------------------------------------------------------------------------
// BOOKMARK CREATION
// -------------------------------------------------------------------------------------------------

function nodeIsValid(bookmarkTreeNode) {
    let isValid = false;
    if (Object.keys(bookmarkTreeNode).length !== 0 && bookmarkTreeNode.constructor === Object) {
        if (
            Object.prototype.hasOwnProperty.call(bookmarkTreeNode, 'url') &&
            typeof bookmarkTreeNode.url !== 'undefined'
        ) {
            isValid = true;
        }
    }
    return isValid;
}

async function saveBookmarkTo(info) {
    const activeTab = await Utils.getActiveTab();
    const bookmarkTreeNode = {
        title: activeTab.title,
        url: activeTab.url,
        parentId: info.originalTarget.dataset.folderId,
    };
    if (nodeIsValid(bookmarkTreeNode)) {
        await browser.bookmarks.create(bookmarkTreeNode);
        const extensionsSettings = await Utils.getOptions();
        const currentOptions = new Options(extensionsSettings);
        await currentOptions.updateLastUsedFolder(bookmarkTreeNode.parentId);
        window.close();
    }
}

// -------------------------------------------------------------------------------------------------
// SEARCH LOGIC
// -------------------------------------------------------------------------------------------------

function performSearch(input) {
    // Empty the list of results
    const message = document.getElementById('not-found');
    message.style.display = 'none';
    const displayedResults = document.getElementById('search-results');
    while (displayedResults.firstChild) {
        displayedResults.removeChild(displayedResults.firstChild);
    }
    // Perform search based on user input
    const searchFilter = input.originalTarget.value.toLowerCase();
    if (searchFilter.length > 0) {
        const results = gobalBookmarkFolderTreeInformation.filter(bookmarkFolder =>
            bookmarkFolder.title.toLowerCase().includes(searchFilter),
        );
        // Add each result to the displayed list or display information message
        if (results.length > 0) {
            let index = 1;
            results.forEach(result => {
                const node = document.createElement('li');
                const link = document.createElement('a');
                const textnode = document.createTextNode(result.title);
                link.appendChild(textnode);
                link.dataset.folderId = result.id;
                node.appendChild(link);
                node.addEventListener('click', saveBookmarkTo);
                node.setAttribute('tabindex', index);
                displayedResults.appendChild(node);
                index += 1;
            });
        } else {
            message.style.display = 'block';
        }
    }
}

// -------------------------------------------------------------------------------------------------
// TRANSLATION LOGIC
// -------------------------------------------------------------------------------------------------
function insertDataFromLocales() {
    const elementsWithLocale = document.querySelectorAll('[data-locale]');
    Array.from(elementsWithLocale).forEach(element => {
        if (typeof element.placeholder !== 'undefined') {
            // eslint-disable-next-line no-param-reassign
            element.placeholder = browser.i18n.getMessage(element.dataset.locale);
        } else {
            // eslint-disable-next-line no-param-reassign
            element.textContent = browser.i18n.getMessage(element.dataset.locale);
        }
    });
}

// -------------------------------------------------------------------------------------------------
// START LOGIC
// -------------------------------------------------------------------------------------------------

async function popupOpened() {
    // Build the list of bookmark folders
    const bookmarkTree = await browser.bookmarks.getTree();
    buildTree(bookmarkTree);
    // Listen for search input key strokes
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keyup', performSearch);
    // Focus on the search field
    searchInput.focus();
    // Listeners for banner buttons
    const settingsButton = document.getElementById('open-settings');
    settingsButton.addEventListener('click', () => browser.runtime.openOptionsPage());
}

/*
 * =================================================================================================
 * LISTENERS
 * =================================================================================================
 */
document.addEventListener('DOMContentLoaded', insertDataFromLocales);
document.addEventListener('DOMContentLoaded', popupOpened);
