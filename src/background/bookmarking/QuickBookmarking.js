'use strict';

/*
 * =================================================================================================
 * QUICK BOOKMARKING
 * =================================================================================================
 */

class QuickBookmarking {
    constructor(webPage, options) {
        this._webPage = webPage;
        this._options = options;
    }

    _removeBookmarks() {
        const bookmarksToRemove = this._webPage.bookmarks;
        bookmarksToRemove.forEach(bookmark => {
            browser.bookmarks.remove(bookmark.id);
        });
    }

    _createNode() {
        const bookmarkTreeNode = {
            title: this._webPage.title,
            url: this._webPage.url,
        };
        if (this._options.isQuickFolderSet()) {
            if (this._options.isQuickFolderLastUsed()) {
                // bookmarkTreeNode.parentId = lastUsedFolderId
            } else {
                bookmarkTreeNode.parentId = this._options.getQuickFolder();
            }
        }
        if (this._options.addQuickBookmarksOnTop()) bookmarkTreeNode.index = 0;
        return bookmarkTreeNode;
    }

    static _nodeIsValid(bookmarkTreeNode) {
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

    static _removeBookmarkCreationListener() {
        browser.bookmarks.onCreated.removeListener(onBookmarksCreated);
    }

    static _addBookmarkCreationListener() {
        browser.bookmarks.onCreated.addListener(onBookmarksCreated);
    }

    async toggle() {
        if (this._webPage.isBookmarked) {
            if (!this._options.isRemovalPreventionEnabled()) this._removeBookmarks();
        } else {
            const bookmarkTreeNode = this._createNode();
            if (this._nodeIsValid(bookmarkTreeNode)) {
                this._removeBookmarkCreationListener();
                await browser.bookmarks.create(bookmarkTreeNode);
                this._addBookmarkCreationListener();
                // lastUsedFolderId = bookmarkTreeNode.parentId
            }
        }
    }

    async shortcutToggle() {
        if (this._options.isShortcutEnabled() && this._webPage.isSupported) await this.toggle();
    }
}
