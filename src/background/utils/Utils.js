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
        const url = new URL(urlString);
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
        const extraProtocols = ['file:', 'about:'];
        const url = new URL(urlString);
        return extraProtocols.indexOf(url.protocol) !== -1;
    }

    // Check if provided URL can be supported by the add-on
    static async isSupportedURL(urlString) {
        if (Utils.isSupportedProtocol(urlString)) return true;
        return await Utils.isExtraProtocol(urlString);
    }

    // -------------------------------------------------------------------------------------------------
    // BOOKMARKS
    // -------------------------------------------------------------------------------------------------

    // Indicate if a bookmark object is a web page
    static bookmarkIsWebPage(bookmarkInfo) {
        let isWebPage = false;
        if (
            Object.prototype.hasOwnProperty.call(bookmarkInfo, 'type') &&
            bookmarkInfo.type === 'bookmark'
        ) {
            isWebPage = true;
        } else if (
            Object.prototype.hasOwnProperty.call(bookmarkInfo, 'url') &&
            bookmarkInfo.url !== null &&
            bookmarkInfo.url !== undefined
        )
            isWebPage = true;
        return isWebPage;
    }

    // Indicate if a bookmark object is a folder
    static bookmarkIsFolder(bookmarkInfo) {
        let isFolder = false;
        if (
            Object.prototype.hasOwnProperty.call(bookmarkInfo, 'type') &&
            bookmarkInfo.type === 'folder'
        ) {
            isFolder = true;
        } else if (
            !Object.prototype.hasOwnProperty.call(bookmarkInfo, 'url') ||
            bookmarkInfo.url === null ||
            bookmarkInfo.url === undefined
        )
            isFolder = true;
        return isFolder;
    }

    // Indicate if the provided bookmarks are all in the specified folder
    static allBookmarksAreInFolder(folderId, bookmarks) {
        let result = true;
        const filtered = bookmarks.filter(
            bookmark =>
                !Object.prototype.hasOwnProperty.call(bookmark, 'parentId') ||
                bookmark.parentId !== folderId,
        );
        if (filtered.length > 0) result = false;
        return result;
    }

    // -------------------------------------------------------------------------------------------------
    // FIREFOX
    // -------------------------------------------------------------------------------------------------

    // Get Firefox main version number
    static async getFirefoxMainVersion() {
        const info = await browser.runtime.getBrowserInfo();
        return info.version.split('.')[0];
    }
}
