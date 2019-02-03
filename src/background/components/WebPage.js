'use strict';

/*
 * ================================================================================
 * WEB PAGE
 * ================================================================================
 */

class WebPage {
    constructor(id, url, title) {
        this._id = id;
        this._url = url;
        this._title = title;
    }

    get id() {
        return this._id;
    }

    get url() {
        return this._url;
    }

    get title() {
        return this._title;
    }

    set title(title) {
        this._title = title;
    }

    get isSupported() {
        return this._isSupported;
    }

    get isBookmarked() {
        return this._isBookmarked;
    }

    get numberOfBookmarks() {
        return this._numberOfBookmarks;
    }

    get bookmarks() {
        return this._bookmarks;
    }

    // Set values for a page not supported by the extension
    _unsupportedPage() {
        this._isBookmarked = false;
        this._numberOfBookmarks = 0;
        this._bookmarks = [];
    }

    // Set values for a page supported by the extension but not bookmarked
    _notBookmarkedPage() {
        this._isBookmarked = false;
        this._numberOfBookmarks = 0;
        this._bookmarks = [];
    }

    // Set values for a page supported by the extension and bookmarked
    _bookmarkedPage(bookmarks) {
        this._isBookmarked = true;
        this._numberOfBookmarks = bookmarks.length;
        this._bookmarks = bookmarks;
    }

    async determineSupportedStatus() {
        const isSupported = await Utils.isSupportedURL(this._url);
        this._isSupported = isSupported === true;
    }

    // Check if current page is supported and search for bookmarks if it is the case
    async determineBookmarkingStatus() {
        if (this._isSupported === false) {
            this._unsupportedPage();
        } else {
            let bookmarks;
            if (Utils.isSupportedProtocol(this._url)) {
                bookmarks = await browser.bookmarks.search({ url: this._url });
            } else if (Utils.isExtraProtocol(this._url)) {
                bookmarks = await browser.bookmarks.search(decodeURIComponent(this._url));
            }
            if (bookmarks.constructor !== Array) {
                this._unsupportedPage();
            } else if (bookmarks.length === 0) {
                this._notBookmarkedPage();
            } else {
                this._bookmarkedPage(bookmarks);
            }
        }
    }
}
