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

    _createMovingPropertiesForBookmark(bookmarkInfo) {
        const bookmarkTreeNode = {};
        if (this._options.isBuiltinFolderSet()) {
            if (this._options.isBuiltinFolderLastUsed()) {
                bookmarkTreeNode.parentId = this._options.getLastUsedFolder();
            } else {
                bookmarkTreeNode.parentId = this._options.getBuiltinFolder();
            }
        }
        if (this._options.addBuiltinBookmarksOnTop()) {
            bookmarkTreeNode.index = 0;
        } else {
            if (bookmarkInfo.index) bookmarkTreeNode.index = bookmarkInfo.index;
        }
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
            if (await Utils.bookmarkIsPartOfAllTabsFolder(bookmarkInfo)) return;
            bookmarkTreeNode = this._createMovingPropertiesForBookmark(bookmarkInfo);
        } else if (Utils.bookmarkIsFolder(bookmarkInfo)) {
            if (!Utils.bookmarkIsAllTabsSystemCreatedFolder(bookmarkInfo)) return;
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
            if (Utils.bookmarkIsSeparator(bookmarkInfo)) return;
            if (Utils.bookmarkIsBlankWebPage(bookmarkInfo)) return;
            if (Utils.bookmarkIsRegularFolder(bookmarkInfo)) return;
            await this._moveBookmarkToDefinedLocation(bookmarkInfo);
        }
    }
}
