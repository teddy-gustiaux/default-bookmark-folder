'use strict';

/*
 * =================================================================================================
 * GLOBAL VARIABLES
 * =================================================================================================
 */

const globalBookmarkFolderTreeInformation = [];

/*
 * =================================================================================================
 * EXTENSION LOGIC
 * =================================================================================================
 */

// -------------------------------------------------------------------------------------------------
// BOOKMARK TREE MANIPULATION
// -------------------------------------------------------------------------------------------------

async function buildItems(bookmarkItem, indent) {
    let indentProgress = indent;
    if (Utils.bookmarkIsFolder(bookmarkItem) && bookmarkItem.id !== FIREFOX_ROOT_BOOKMARK_FOLDER) {
        if (Object.prototype.hasOwnProperty.call(bookmarkItem, 'title') || indent !== 0) {
            const folderInformation = {
                title: !bookmarkItem.title ? UNNAMED_FOLDER : bookmarkItem.title,
                id: bookmarkItem.id,
            };
            const parentBookmarkInfo = await browser.bookmarks.get(bookmarkItem.parentId);
            folderInformation.parentTitle = parentBookmarkInfo[0].title;

            globalBookmarkFolderTreeInformation.push(folderInformation);
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

async function buildTree(bookmarkItems) {
    await buildItems(bookmarkItems[0], 0);
}

// -------------------------------------------------------------------------------------------------
// BOOKMARK CREATION
// -------------------------------------------------------------------------------------------------

function nodeIsValid(bookmarkTreeNode) {
    let isValid = false;
    if (Object.keys(bookmarkTreeNode).length !== 0 && bookmarkTreeNode.constructor === Object) {
        if (
            Object.prototype.hasOwnProperty.call(bookmarkTreeNode, 'url') &&
            typeof bookmarkTreeNode.url !== 'undefined' &&
            Object.prototype.hasOwnProperty.call(bookmarkTreeNode, 'parentId') &&
            typeof bookmarkTreeNode.parentId !== 'undefined'
        ) {
            isValid = true;
        }
    }
    return isValid;
}

async function saveBookmarkTo(info) {
    // Must be captured first
    const { folderId } = info.currentTarget.dataset;
    const activeTab = await Utils.getActiveTab();
    const bookmarkTreeNode = {
        title: `${activeTab.title}${DBF_INTERAL_INDICATOR}`,
        url: activeTab.url,
        parentId: folderId,
    };
    if (nodeIsValid(bookmarkTreeNode)) {
        await browser.bookmarks.create(bookmarkTreeNode);
        const extensionsSettings = await Utils.getOptions();
        const currentOptions = new Options(extensionsSettings);
        await currentOptions.updateLastUsedFolder(bookmarkTreeNode.parentId);
        window.close();
    } else {
        const errorMessage = document.getElementById('save-error');
        errorMessage.style.display = 'block';
        const displayedResults = document.getElementById('search-results');
        displayedResults.className = 'disabled';
    }
}

// -------------------------------------------------------------------------------------------------
// KEYBOARD NAVIGATION LOGIC
// -------------------------------------------------------------------------------------------------

async function handleBookmarkKeyboardInput(event) {
    if (event.code === 'Enter') {
        event.preventDefault();
        event.originalTarget.click();
    } else if (event.code === 'ArrowDown') {
        const nextIndex = parseInt(event.originalTarget.dataset.index, 10) + 1;
        const nextResult = document.getElementById(`search-result-${nextIndex}`);
        if (nextResult) nextResult.focus();
    } else if (event.code === 'ArrowUp') {
        const previousIndex = parseInt(event.originalTarget.dataset.index, 10) - 1;
        const previousResult = document.getElementById(`search-result-${previousIndex}`);
        if (previousResult) {
            previousResult.focus();
        } else {
            const searchInput = document.getElementById('search-input');
            if (searchInput) searchInput.focus();
        }
    }
}

// -------------------------------------------------------------------------------------------------
// SEARCH LOGIC
// -------------------------------------------------------------------------------------------------

function performSearch(event) {
    if (event.code === 'Enter' || event.code === 'ArrowDown') {
        const firstSearchResult = document.getElementById('search-result-1');
        if (firstSearchResult) firstSearchResult.focus();
        return;
    }
    // Empty the list of results
    const message = document.getElementById('not-found');
    message.style.display = 'none';
    const errorMessage = document.getElementById('save-error');
    errorMessage.style.display = 'none';
    const displayedResults = document.getElementById('search-results');
    displayedResults.className = '';
    while (displayedResults.firstChild) {
        displayedResults.removeChild(displayedResults.firstChild);
    }
    // Perform search based on user input
    const searchFilter = event.originalTarget.value.toLowerCase();
    if (searchFilter.length > 0) {
        const results = globalBookmarkFolderTreeInformation.filter(bookmarkFolder =>
            bookmarkFolder.title.toLowerCase().includes(searchFilter),
        );
        // Add each result to the displayed list or display information message
        if (results.length > 0) {
            let index = 1;
            results.forEach(result => {
                const node = document.createElement('li');
                const link = document.createElement('a');
                const folder = document.createElement('strong');
                const folderParentTitle = document.createTextNode(`${result.parentTitle}/`);
                const folderTitle = document.createTextNode(result.title);
                folder.appendChild(folderTitle);
                link.appendChild(folderParentTitle);
                link.appendChild(folder);
                node.appendChild(link);
                node.dataset.folderId = result.id;
                node.addEventListener('click', info => saveBookmarkTo(info));
                node.addEventListener('keyup', handleBookmarkKeyboardInput);
                node.setAttribute('tabindex', 0);
                node.setAttribute('data-index', index);
                node.setAttribute('id', `search-result-${index}`);
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
    await buildTree(bookmarkTree);
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
document.addEventListener('DOMContentLoaded', () => popupOpened());
