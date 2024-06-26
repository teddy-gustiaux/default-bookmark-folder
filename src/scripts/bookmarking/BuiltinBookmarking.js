'use strict';

class BuiltinBookmarking {
	#options;

	constructor(options) {
		this.#options = options;
	}

	#createMovingPropertiesForBookmark() {
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

	#createMovingPropertiesForAllTabsFolder() {
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

	#nodeIsValidForMoving(bookmarkTreeNode) {
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

	async #moveBookmarkToDefinedLocation(bookmarkInfo, reason = '') {
		const details = reason ? ` (reason: ${reason})` : '';
		Logger.debug(`Processing this bookmark${details}`, bookmarkInfo);
		let bookmarkTreeNode;
		if (Utils.bookmarkIsWebPage(bookmarkInfo)) {
			if (await Utils.bookmarkIsPartOfMultiTabsFolder(bookmarkInfo)) return;
			bookmarkTreeNode = this.#createMovingPropertiesForBookmark();
		} else if (Utils.bookmarkIsFolder(bookmarkInfo)) {
			if (!await Utils.bookmarkIsMultiTabsSystemCreatedFolder(bookmarkInfo)) return;
			bookmarkTreeNode = this.#createMovingPropertiesForAllTabsFolder();
		}
		if (!Object.prototype.hasOwnProperty.call(bookmarkTreeNode, 'parentId')) {
			bookmarkTreeNode.parentId = bookmarkInfo.parentId;
		}
		if (this.#nodeIsValidForMoving(bookmarkTreeNode)) {
			browser.bookmarks.move(bookmarkInfo.id, bookmarkTreeNode);
			await this.#options.updateLastUsedFolder(bookmarkTreeNode.parentId);
			await Orchestrator.processUpdateEvent();
		}
	}

	async renameBookmark(bookmarkInfo) {
		await browser.bookmarks.update(bookmarkInfo.id, {
			title: bookmarkInfo.title.replace(DBF_INTERNAL_INDICATOR, ''),
		});
		await Orchestrator.processUpdateEvent();
	}

	async skipBookmark(bookmarkInfo, reason) {
		Logger.debug(`Skipping this bookmark (reason: ${reason})`);
	}

	async move(id, bookmarkInfo, skipChecks, reason = '') {
		if (!skipChecks) {

			if (Utils.bookmarkIsSeparator(bookmarkInfo)) {
				Logger.debug('Skipping this bookmark (reason: separator)');
				return;
			}

			if (Utils.bookmarkIsBlankWebPage(bookmarkInfo)) {
				Logger.debug('Skipping this bookmark (reason: blank web page)');
				return;
			}

			if (await Utils.bookmarkIsRegularFolder(bookmarkInfo)) {
				Logger.debug('Skipping this bookmark (reason: regular folder)');
				return;
			}

			if (!await Utils.bookmarkIsMultiTabsSystemCreatedFolder(bookmarkInfo)) {
				const bookmarkIsCurrentPage = await Utils.bookmarkIsCurrentPage(bookmarkInfo);
				if (!bookmarkIsCurrentPage) {
					Logger.debug('Skipping this bookmark (reason: drag-and-drop other URL)');
					await this.#options.updateLastUsedFolder(bookmarkInfo.parentId);
					return;
				} else {
					const children = await browser.bookmarks.getChildren(bookmarkInfo.parentId);
					if (bookmarkInfo.index !== children.length - 1) {
						Logger.debug('Skipping this bookmark (reason: drag-and-drop current URL)');
						await this.#options.updateLastUsedFolder(bookmarkInfo.parentId);
						return;
					}
				}
			}
		}

		await this.#moveBookmarkToDefinedLocation(bookmarkInfo, reason);
	}
}
