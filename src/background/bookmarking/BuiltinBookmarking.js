'use strict';

/*
 * =================================================================================================
 * FIREFOX BUILT-IN BOOKMARKING
 * =================================================================================================
 */

class BuiltinBookmarking {
    constructor(options) {
        this._options = options;
    }

    // Check if the bookmark has been created by an automatic built-in method
    _isSystemCreated(bookmarkInfo) {
        let isSystemCreated = false;
        if (
            Object.prototype.hasOwnProperty.call(bookmarkInfo, 'parentId') &&
            FIREFOX_DEFAULT_FOLDERS.includes(bookmarkInfo.parentId) &&
            bookmarkInfo.url !== FIREFOX_BOOKMARK_DEFAULT_MANUAL_URL
        ) {
            isSystemCreated = true;
        }
        return isSystemCreated;
    }

    // The default name template is "[Folder Name]", but is language-specific
    _isAllTabsSystemCreatedFolder(bookmarkInfo) {
        if (bookmarkInfo.title.length < 3) return false;
        const firstLetter = bookmarkInfo.title[0];
        const lastLetter = bookmarkInfo.title[bookmarkInfo.title.length - 1];
        return firstLetter === '[' && lastLetter === ']';
    }

    _createMovingPropertiesForBookmark() {
        const bookmarkTreeNode = {};
        if (this._options.isBuiltinFolderSet()) {
            if (this._options.isBuiltinFolderLastUsed()) {
                bookmarkTreeNode.parentId = this._options.getLastUsedFolder();
            } else {
                bookmarkTreeNode.parentId = this._options.getBuiltinFolder();
            }
        }
        if (this._options.addBuiltinBookmarksOnTop()) bookmarkTreeNode.index = 0;
        return bookmarkTreeNode;
    }

    _createMovingPropertiesForAllTabsFolder() {
        const bookmarkTreeNode = {};
        if (this._options.isAllTabsFolderSet()) {
            if (this._options.isAllTabsFolderLastUsed()) {
                bookmarkTreeNode.parentId = this._options.getLastUsedFolder();
            } else {
                bookmarkTreeNode.parentId = this._options.getAllTabsFolder();
            }
        }
        if (this._options.addAllTabsBookmarksOnTop()) bookmarkTreeNode.index = 0;
        return bookmarkTreeNode;
    }

    _nodeIsValidForMoving(bookmarkTreeNode) {
        let isValid = false;
        if (Object.keys(bookmarkTreeNode).length !== 0 && bookmarkTreeNode.constructor === Object) {
            if (
                Object.prototype.hasOwnProperty.call(bookmarkTreeNode, 'parentId') &&
                typeof bookmarkTreeNode.parentId !== 'undefined'
            ) {
                isValid = true;
            }
        }
        return isValid;
    }

    async _renameBookmark(bookmarkInfo) {
        await browser.bookmarks.update(bookmarkInfo.id, {
            title: bookmarkInfo.title.replace(DBF_INTERAL_INDICATOR, ''),
        });
    }

    async _moveBookmarkToDefinedLocation(bookmarkInfo) {
        let bookmarkTreeNode;
        if (Utils.bookmarkIsWebPage(bookmarkInfo)) {
            bookmarkTreeNode = this._createMovingPropertiesForBookmark();
        } else if (Utils.bookmarkIsFolder(bookmarkInfo)) {
            if (!this._isAllTabsSystemCreatedFolder(bookmarkInfo)) return;
            bookmarkTreeNode = this._createMovingPropertiesForAllTabsFolder();
        }
        if (!Object.prototype.hasOwnProperty.call(bookmarkTreeNode, 'parentId')) {
            bookmarkTreeNode.parentId = bookmarkInfo.parentId;
        }
        if (this._nodeIsValidForMoving(bookmarkTreeNode)) {
            browser.bookmarks.move(bookmarkInfo.id, bookmarkTreeNode);
            await this._options.updateLastUsedFolder(bookmarkTreeNode.parentId);
        }
    }

    async move(id, bookmarkInfo) {
        if (Utils.bookmarkIsAddonInternal(bookmarkInfo)) {
            await this._renameBookmark(bookmarkInfo);
        } else {
            if (!this._isSystemCreated(bookmarkInfo)) return;
            if (Utils.bookmarkIsSeparator(bookmarkInfo)) return;
            await this._moveBookmarkToDefinedLocation(bookmarkInfo);
        }
    }
}
