'use strict';

/*
 * =================================================================================================
 * ADD-ON OPTIONS PAGE
 * =================================================================================================
 */

// Restore and display the extension saved options
async function restoreOptions() {
    const bookmarkTree = await browser.bookmarks.getTree();
    const options = await getOptions();

    buildTree(bookmarkTree, [QRY_FF_FOLDER, QRY_AT_FOLDER, QRY_IC_FOLDER]);
}

function insertData() {
    insertDataFromLocales();
    insertDataFromManifest();
}

function tabManagement() {
    const menuTabs = document.querySelectorAll(TAB_MENU);
    Array.from(menuTabs).forEach(link => {
        link.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
}

/*
 * =================================================================================================
 * LISTENERS
 * =================================================================================================
 */

// Listen for loading of the options page
document.addEventListener('DOMContentLoaded', restoreOptions);
document.addEventListener('DOMContentLoaded', insertData);
document.addEventListener('DOMContentLoaded', tabManagement);
