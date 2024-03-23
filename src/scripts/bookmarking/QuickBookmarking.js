'use strict';

class QuickBookmarking {
	#webPage;
	#options;

	constructor(webPage, options) {
		this.#webPage = webPage;
		this.#options = options;
	}

	#removeBookmarks() {
		const bookmarksToRemove = this.#webPage.bookmarks;
		bookmarksToRemove.forEach((bookmark) => {
			browser.bookmarks.remove(bookmark.id);
		});
	}

	#_createNode() {
		const bookmarkTreeNode = {
			title: `${this.#webPage.title}${DBF_INTERNAL_INDICATOR}`,
			url: this.#webPage.url,
		};

		if (this.#options.isQuickFolderSet()) {
			if (this.#options.isQuickFolderLastUsed()) {
				bookmarkTreeNode.parentId = this.#options.getLastUsedFolder();
			} else {
				bookmarkTreeNode.parentId = this.#options.getQuickFolder();
			}
		} else {
			bookmarkTreeNode.parentId = FIREFOX_FOLDER_UNFILED;
		}
		if (this.#options.addQuickBookmarksOnTop()) bookmarkTreeNode.index = 0;
		return bookmarkTreeNode;
	}

	#_nodeIsValid(bookmarkTreeNode) {
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

	async #createBookmarkFromIcon() {
		const bookmarkTreeNode = this.#_createNode();
		if (this.#_nodeIsValid(bookmarkTreeNode)) {
			await browser.bookmarks.create(bookmarkTreeNode);
			await this.#options.updateLastUsedFolder(bookmarkTreeNode.parentId);
		}
	}

	async toggle(ignoreInboxMode = false) {
		if (this.#webPage.isBookmarked) {
			if (!ignoreInboxMode && this.#options.isInboxModeEnabled()) {
				if (
					Utils.allBookmarksAreInFolder(
						this.#options.getQuickFolder(),
						this.#webPage.bookmarks,
					)
				) {
					if (!this.#options.isRemovalPreventionEnabled()) this.#removeBookmarks();
				} else {
					if (
						Utils.noBookmarksAreInFolder(
							this.#options.getQuickFolder(),
							this.#webPage.bookmarks,
						)
					) {
						await this.#createBookmarkFromIcon();
					}
				}
			} else if (!this.#options.isRemovalPreventionEnabled()) this.#removeBookmarks();
		} else {
			await this.#createBookmarkFromIcon();
		}
	}

	async shortcutToggle() {
		if (this.#options.isShortcutEnabled() && this.#webPage.isSupported) await this.toggle();
	}

	#createBookmarkHereNode(clickedBookmark) {
		const bookmarkTreeNode = {
			title:  `${this.#webPage.title}${DBF_INTERNAL_INDICATOR}`,
			url: this.#webPage.url,
		};
		if (Utils.bookmarkIsFolder(clickedBookmark)) {
			bookmarkTreeNode.parentId = clickedBookmark.id;
		} else {
			bookmarkTreeNode.parentId = clickedBookmark.parentId;
		}
		if (this.#options.addQuickBookmarksOnTop()) bookmarkTreeNode.index = 0;
		return bookmarkTreeNode;
	}

	async bookmarkHereViaContextMenu(clickData) {
		if (this.#options.areContextMenusEnabled() && this.#webPage.isSupported) {
			const bookmarks = await browser.bookmarks.get(clickData.bookmarkId);
			const bookmarkTreeNode = this.#createBookmarkHereNode(bookmarks[0]);
			if (this.#_nodeIsValid(bookmarkTreeNode)) {
				await browser.bookmarks.create(bookmarkTreeNode);
				await this.#options.updateLastUsedFolder(bookmarkTreeNode.parentId);
			}
		}
	}

	async bookmarkToggleViaPageContextMenu(clickData) {
		if (this.#options.areContextMenusEnabled() && this.#webPage.isSupported) {
			await this.toggle(true);
		}
	}
}
