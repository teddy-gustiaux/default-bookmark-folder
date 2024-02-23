'use strict';

class QuickBookmarking {
	#webPage;
	#options;

	constructor(webPage, options) {
		this.#webPage = webPage;
		this.#options = options;
	}

	_removeBookmarks() {
		const bookmarksToRemove = this.#webPage.bookmarks;
		bookmarksToRemove.forEach((bookmark) => {
			browser.bookmarks.remove(bookmark.id);
		});
	}

	_createNode() {
		const bookmarkTreeNode = {
			title: this.#webPage.title,
			url: this.#webPage.url,
		};
		if (this.#options.isQuickFolderSet()) {
			if (this.#options.isQuickFolderLastUsed()) {
				bookmarkTreeNode.parentId = this.#options.getLastUsedFolder();
			} else {
				bookmarkTreeNode.parentId = this.#options.getQuickFolder();
			}
		}
		if (this.#options.addQuickBookmarksOnTop()) bookmarkTreeNode.index = 0;
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

	async #createBookmarkFromIcon() {
		const bookmarkTreeNode = this._createNode();
		if (this._nodeIsValid(bookmarkTreeNode)) {
			this._removeBookmarkCreationListener();
			await browser.bookmarks.create(bookmarkTreeNode);
			this._addBookmarkCreationListener();
			await this.#options.updateLastUsedFolder(bookmarkTreeNode.parentId);
		}
	}

	async toggle() {
		if (this.#webPage.isBookmarked) {
			if (this.#options.isInboxModeEnabled()) {
				if (
					Utils.allBookmarksAreInFolder(
						this.#options.getQuickFolder(),
						this.#webPage.bookmarks,
					)
				) {
					if (!this.#options.isRemovalPreventionEnabled()) this._removeBookmarks();
				} else {
					await this.#createBookmarkFromIcon();
				}
			} else if (!this.#options.isRemovalPreventionEnabled()) this._removeBookmarks();
		} else {
			await this.#createBookmarkFromIcon();
		}
	}

	async shortcutToggle() {
		if (this.#options.isShortcutEnabled() && this.#webPage.isSupported) await this.toggle();
	}

	_createBookmarkHereNode(clickedBookmark) {
		const bookmarkTreeNode = {
			title: this.#webPage.title,
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
			const bookmarkTreeNode = this._createBookmarkHereNode(bookmarks[0]);
			if (this._nodeIsValid(bookmarkTreeNode)) {
				this._removeBookmarkCreationListener();
				await browser.bookmarks.create(bookmarkTreeNode);
				this._addBookmarkCreationListener();
				await this.#options.updateLastUsedFolder(bookmarkTreeNode.parentId);
			}
		}
	}

	async bookmarkToggleViaPageContextMenu(clickData) {
		if (this.#options.areContextMenusEnabled() && this.#webPage.isSupported) {
			await this.toggle();
		}
	}
}
