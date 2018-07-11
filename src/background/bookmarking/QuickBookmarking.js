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
                bookmarkTreeNode.parentId = this._options.getLastUsedFolder();
            } else {
                bookmarkTreeNode.parentId = this._options.getQuickFolder();
            }
        }
        if (this._options.addQuickBookmarksOnTop()) bookmarkTreeNode.index = 0;
        return bookmarkTreeNode;
    }

    _nodeIsValid(bookmarkTreeNode) {
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

    _removeBookmarkCreationListener() {
        browser.bookmarks.onCreated.removeListener(onBookmarksCreated);
    }

    _addBookmarkCreationListener() {
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
                await this._options.updateLastUsedFolder(bookmarkTreeNode.parentId);
            }
        }
    }

    async shortcutToggle() {
        if (this._options.isShortcutEnabled() && this._webPage.isSupported) await this.toggle();
    }

    _createBookmarkHereNode(clickedBookmark) {
        const bookmarkTreeNode = {
            title: this._webPage.title,
            url: this._webPage.url,
        };
        if (Utils.bookmarkIsFolder(clickedBookmark)) {
            bookmarkTreeNode.parentId = clickedBookmark.id;
        } else {
            bookmarkTreeNode.parentId = clickedBookmark.parentId;
        }
        if (this._options.addQuickBookmarksOnTop()) bookmarkTreeNode.index = 0;
        return bookmarkTreeNode;
    }

    async bookmarkHereViaContextMenu(clickData) {
        if (this._options.areContextMenusEnabled() && this._webPage.isSupported) {
            const bookmarks = await browser.bookmarks.get(clickData.bookmarkId);
            const bookmarkTreeNode = this._createBookmarkHereNode(bookmarks[0]);
            if (this._nodeIsValid(bookmarkTreeNode)) {
                this._removeBookmarkCreationListener();
                await browser.bookmarks.create(bookmarkTreeNode);
                this._addBookmarkCreationListener();
                await this._options.updateLastUsedFolder(bookmarkTreeNode.parentId);
            }
        }
    }
}
