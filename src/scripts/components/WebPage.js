'use strict';

class WebPage {
	#id;
	#url;
	#title;

	constructor(id, url, title) {
		this.#id = id;
		this.#url = url;
		this.#title = title;
	}

	get id() {
		return this.#id;
	}

	get url() {
		return this.#url;
	}

	get title() {
		return this.#title;
	}

	set title(title) {
		this.#title = title;
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
		const isSupported = await Utils.isSupportedURL(this.#url);
		this._isSupported = isSupported === true;
	}

	// Check if current page is supported and search for bookmarks if it is the case
	async determineBookmarkingStatus() {
		if (this._isSupported === false) {
			this._unsupportedPage();
		} else {
			let bookmarks;
			if (Utils.isSupportedProtocol(this.#url)) {
				bookmarks = await browser.bookmarks.search({ url: this.#url });
			} else if (Utils.isExtraProtocol(this.#url)) {
				bookmarks = await browser.bookmarks.search(decodeURIComponent(this.#url));
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
