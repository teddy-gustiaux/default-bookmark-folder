'use strict';

class BuiltinBookmarking {
	#options;

	constructor(options) {
		this.#options = options;
	}

	_createMovingPropertiesForBookmark() {
		const bookmarkTreeNode = {};
		if (this.#options.isBuiltinFolderSet()) {
			if (this.#options.isBuiltinFolderLastUsed()) {
				bookmarkTreeNode.parentId = this.#options.getLastUsedFolder();
			} else {
				bookmarkTreeNode.parentId = this.#options.getBuiltinFolder();
			}
		}
		if (this.#options.addBuiltinBookmarksOnTop()) bookmarkTreeNode.index = 0;
		return bookmarkTreeNode;
	}

	_createMovingPropertiesForAllTabsFolder() {
		const bookmarkTreeNode = {};
		if (this.#options.isAllTabsFolderSet()) {
			if (this.#options.isAllTabsFolderLastUsed()) {
				bookmarkTreeNode.parentId = this.#options.getLastUsedFolder();
			} else {
				bookmarkTreeNode.parentId = this.#options.getAllTabsFolder();
			}
		}
		if (this.#options.addAllTabsBookmarksOnTop()) bookmarkTreeNode.index = 0;
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

	async _moveBookmarkToDefinedLocation(bookmarkInfo) {
		Logger.debug('Processing this bookmark', bookmarkInfo);
		let bookmarkTreeNode;
		if (Utils.bookmarkIsWebPage(bookmarkInfo)) {
			if (await Utils.bookmarkIsPartOfMultiTabsFolder(bookmarkInfo)) return;
			bookmarkTreeNode = this._createMovingPropertiesForBookmark();
		} else if (Utils.bookmarkIsFolder(bookmarkInfo)) {
			if (!await Utils.bookmarkIsMultiTabsSystemCreatedFolder(bookmarkInfo)) return;
			bookmarkTreeNode = this._createMovingPropertiesForAllTabsFolder();
		}
		if (!Object.prototype.hasOwnProperty.call(bookmarkTreeNode, 'parentId')) {
			bookmarkTreeNode.parentId = bookmarkInfo.parentId;
		}
		if (this._nodeIsValidForMoving(bookmarkTreeNode)) {
			browser.bookmarks.move(bookmarkInfo.id, bookmarkTreeNode);
			await this.#options.updateLastUsedFolder(bookmarkTreeNode.parentId);
		}
	}

	async renameBookmark(bookmarkInfo) {
		await browser.bookmarks.update(bookmarkInfo.id, {
			title: bookmarkInfo.title.replace(DBF_INTERNAL_INDICATOR, ''),
		});
	}

	async move(id, bookmarkInfo, skipChecks) {
		if (!skipChecks) {
			if (Utils.bookmarkIsSeparator(bookmarkInfo)) return;
			if (Utils.bookmarkIsBlankWebPage(bookmarkInfo)) return;
			if (await Utils.bookmarkIsRegularFolder(bookmarkInfo)) return;
			if (!await Utils.bookmarkIsMultiTabsSystemCreatedFolder(bookmarkInfo)) {
				const bookmarkIsCurrentPage = await Utils.bookmarkIsCurrentPage(bookmarkInfo);
				if (!bookmarkIsCurrentPage) return;
			}
		}
		await this._moveBookmarkToDefinedLocation(bookmarkInfo);
	}
}
