'use strict';

/*
 * =================================================================================================
 * ADD-ON OPTIONS PAGE
 * =================================================================================================
 */

// Restore and display the extension saved options
async function restoreOptions() {
    const bookmarkTree = await browser.bookmarks.getTree();
    const folderSelections = [];
    folderSelections.push(buildSelector(BUILTIN, FOLDER));
    folderSelections.push(buildSelector(ALLTABS, FOLDER));
    folderSelections.push(buildSelector(ICON, FOLDER));
    buildTree(bookmarkTree, folderSelections);

    const options = await getOptions();
    Object.keys(OPTIONS_IDS).forEach(key => {
        if (typeof options[key] !== 'undefined') {
            Object.keys(options[key]).forEach(subkey => {
                if (typeof options[key][subkey] !== 'undefined') {
                    setOptionValue(buildSelector(key, subkey), options[key][subkey]);
                }
            });
        }
    });

    toggleIconOptions(options);
    const tabNumber = typeof options[TAB] !== 'undefined' ? options[TAB] : TAB_DEFAULT_NUMBER;
    switchTab(tabNumber);
}

// Save the options
function saveOptions() {
    const userPreferences = getOptionsFromDOM();
    browser.storage.local.set(userPreferences);
    toggleIconOptions(userPreferences);
}

function insertData() {
    insertDataFromLocales();
    insertDataFromManifest();
}

function tabManagement() {
    const menuTabs = document.querySelectorAll(TAB_MENU);
    Array.from(menuTabs).forEach(link => {
        // eslint-disable-next-line func-names
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
document.addEventListener('DOMContentLoaded', welcomeMessage);
document.addEventListener('DOMContentLoaded', restoreOptions);
document.addEventListener('DOMContentLoaded', insertData);
document.addEventListener('DOMContentLoaded', tabManagement);
// Listen for saving of the options page
document.querySelector(TAB_CONTAINER).addEventListener('change', saveOptions);
