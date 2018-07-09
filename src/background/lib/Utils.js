'use strict';

/*
 * =================================================================================================
 * UTILITIES
 * =================================================================================================
 */

class Utils {
    // -------------------------------------------------------------------------------------------------
    // OPTIONS
    // -------------------------------------------------------------------------------------------------

    // Get all extension settings
    static async getOptions() {
        return browser.storage.local.get();
    }

    // -------------------------------------------------------------------------------------------------
    // TABS
    // -------------------------------------------------------------------------------------------------

    // Get the current tab information
    static async getActiveTab() {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (typeof tabs !== 'undefined' && tabs.length > 0) {
            return tabs[0];
        }
        return null;
    }

    // -------------------------------------------------------------------------------------------------
    // URLS
    // -------------------------------------------------------------------------------------------------

    // Check if provided URL is using supported protocols
    static isSupportedProtocol(urlString) {
        const supportedProtocols = ['https:', 'http:'];
        const url = document.createElement('a');
        url.href = urlString;
        return supportedProtocols.indexOf(url.protocol) !== -1;
    }

    // Check if provided URL is using one of the extra supported protocols
    static async isExtraProtocol(urlString) {
        const activeTab = await Utils.getActiveTab();
        if (
            Object.prototype.hasOwnProperty.call(activeTab, 'isInReaderMode') &&
            activeTab.isInReaderMode
        ) {
            return true;
        }
        const extraProtocols = ['file:'];
        const url = document.createElement('a');
        url.href = urlString;
        return extraProtocols.indexOf(url.protocol) !== -1;
    }

    // Check if provided URL can be supported by the add-on
    static isSupportedURL(urlString) {
        let valid = false;
        if (Utils.isSupportedProtocol(urlString) || Utils.isExtraProtocol(urlString)) valid = true;
        return valid;
    }

    // -------------------------------------------------------------------------------------------------
    // BOOKMARKS
    // -------------------------------------------------------------------------------------------------

    // Indicate if a bookmark object is a web page
    static bookmarkIsWebPage(bookmarkInfo) {
        let isWebPage = false;
        if (Object.prototype.hasOwnProperty.call(bookmarkInfo, 'type')) {
            if (bookmarkInfo.type === 'bookmark') isWebPage = true;
        } else {
            if (Object.prototype.hasOwnProperty.call(bookmarkInfo, 'url')) isWebPage = true;
        }
        return isWebPage;
    }

    // Indicate if a bookmark object is a folder
    static bookmarkIsFolder(bookmarkInfo) {
        let isFolder = false;
        if (Object.prototype.hasOwnProperty.call(bookmarkInfo, 'type')) {
            if (bookmarkInfo.type === 'folder') isFolder = true;
        } else {
            if (!Object.prototype.hasOwnProperty.call(bookmarkInfo, 'url')) isFolder = true;
        }
        return isFolder;
    }
}
