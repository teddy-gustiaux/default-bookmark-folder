'use strict';

class Utils {
	// OPTIONS

	// Get all extension settings
	static async getOptions() {
		return browser.storage.local.get();
	}

	// MISCELLANEOUS

	// Wait for a minimum of time (beware of limitations of setTimeout)
	static async wait(milliseconds){
		return new Promise(resolve => {
			setTimeout(resolve, milliseconds);
		});
	}

	// TABS

	// Get the current tab information
	static async getActiveTab() {
		try {
			const tabs = await browser.tabs.query({ active: true, currentWindow: true });
			if (typeof tabs !== 'undefined' && tabs.length > 0) {
				return tabs[0];
			}
			return null;
		} catch {
			return null;
		}
	}

	// URLS

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
		const extraProtocols = ['file:', 'about:', 'moz-extension:', 'chrome:'];
		const url = new URL(urlString);
		return extraProtocols.indexOf(url.protocol) !== -1;
	}

	// Check if provided URL can be supported by the add-on
	static async isSupportedURL(urlString) {
		if (Utils.isSupportedProtocol(urlString)) return true;
		return Utils.isExtraProtocol(urlString);
	}

	// BOOKMARKS

	// Indicate if a bookmark object is a separator
	static bookmarkIsSeparator(bookmarkInfo) {
		let isSeparator = false;
		if (
			Object.prototype.hasOwnProperty.call(bookmarkInfo, 'type') &&
			bookmarkInfo.type === 'separator'
		) {
			isSeparator = true;
		}
		return isSeparator;
	}

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

	// Indicate if a bookmark object is a 'about:blank' web page
	static bookmarkIsBlankWebPage(bookmarkInfo) {
		let isBlankWebPage = false;
		if (
			Utils.bookmarkIsWebPage(bookmarkInfo) &&
			bookmarkInfo.url === FIREFOX_BOOKMARK_DEFAULT_MANUAL_URL
		)
			isBlankWebPage = true;
		return isBlankWebPage;
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

	static async bookmarkIsMultiTabsSystemCreatedFolder(bookmarkInfo) {
		const children = await browser.bookmarks.getChildren(bookmarkInfo.id);
		if (children.length === 0) return false;
		return children.every(child => {
			return (Utils.bookmarkIsWebPage(child) && child.dateAdded === bookmarkInfo.dateAdded);
		});
	}

	static async bookmarkIsPartOfMultiTabsFolder(bookmarkInfo) {
		let result = false;
		const parents = await browser.bookmarks.get(bookmarkInfo.parentId);
		if (parents[0]) {
			result =
				await Utils.bookmarkIsMultiTabsSystemCreatedFolder(parents[0]) &&
				bookmarkInfo.dateAdded === parents[0].dateAdded;
		}
		return result;
	}

	// Indicate if a bookmark object is a regular folder (not created under special conditions)
	static async bookmarkIsRegularFolder(bookmarkInfo) {
		let isRegularFolder = false;
		if (Utils.bookmarkIsFolder(bookmarkInfo)) {
			isRegularFolder = !await Utils.bookmarkIsMultiTabsSystemCreatedFolder(bookmarkInfo);
		}
		return isRegularFolder;
	}

	// Indicate if a bookmark object is for the current page
	static async bookmarkIsCurrentPage(bookmarkInfo) {
		let isCurrentPage = false;
		if (Utils.bookmarkIsWebPage(bookmarkInfo)) {
			const newlyActiveTab = await Utils.getActiveTab();
			isCurrentPage = bookmarkInfo.url === newlyActiveTab.url;
		}
		return isCurrentPage;
	}

	// Indicate if the provided bookmarks are all in the specified folder
	static allBookmarksAreInFolder(folderId, bookmarks) {
		let result = true;
		const filtered = bookmarks.filter(
			(bookmark) =>
				!Object.prototype.hasOwnProperty.call(bookmark, 'parentId') ||
				bookmark.parentId !== folderId,
		);
		if (filtered.length > 0) result = false;
		return result;
	}

	// Indicate if the provided bookmarks are all not in the specified folder
	static noBookmarksAreInFolder(folderId, bookmarks) {
		return bookmarks.every(
			(bookmark) =>
				Object.prototype.hasOwnProperty.call(bookmark, 'parentId') &&
				bookmark.parentId !== folderId,
		);
	}

	// Indicate if a bookmark object has been created internally by the add-on.
	// This is done in order to perform specific business logic.
	static bookmarkIsAddonInternal(bookmarkInfo) {
		let isInternal = false;
		if (
			Object.prototype.hasOwnProperty.call(bookmarkInfo, 'title') &&
			bookmarkInfo.title.length > 0
		) {
			const indexStart = bookmarkInfo.title.length - DBF_INTERNAL_INDICATOR.length;
			isInternal = bookmarkInfo.title.substring(indexStart) === DBF_INTERNAL_INDICATOR;
		}
		return isInternal;
	}
}
