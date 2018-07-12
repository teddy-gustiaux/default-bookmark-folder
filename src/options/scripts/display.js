'use strict';

/*
 * =================================================================================================
 * DISPLAY
 * =================================================================================================
 */

// -------------------------------------------------------------------------------------------------
// DATA
// -------------------------------------------------------------------------------------------------

// Insert data from the locales into the options page
function insertDataFromLocales() {
    document.title = browser.i18n.getMessage('options_title');
    const elementsWithLocale = document.querySelectorAll('[data-locale]');
    Array.from(elementsWithLocale).forEach(elementWithLocale => {
        elementWithLocale.textContent = browser.i18n.getMessage(elementWithLocale.dataset.locale);
    });
}

// Inserts data from the manifest into the options page
function insertDataFromManifest() {
    const manifest = browser.runtime.getManifest();
    document.querySelector(VERSION).textContent = manifest.version;
    document.querySelector(AUTHOR).textContent = manifest.author;
}

// -------------------------------------------------------------------------------------------------
// TABS
// -------------------------------------------------------------------------------------------------

function switchTab(number) {
    const tabs = document.querySelectorAll(TAB_MENU);
    Array.from(tabs).forEach(tabItem => {
        tabItem.classList.remove('is-active');
    });
    document.querySelector(`[${DATA_TAB}='${number}']`).classList.add('is-active');
    const containers = document.querySelectorAll(TAB_CONTAINER_ITEM);
    Array.from(containers).forEach(containerItem => {
        containerItem.classList.remove('is-active');
    });
    document.querySelector(`[${DATA_ITEM}='${number}']`).classList.add('is-active');
    browser.storage.local.set({ [MISC_TAB]: number });
}
