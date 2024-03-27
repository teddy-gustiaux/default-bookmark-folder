'use strict';

class WebPage {
	#id;
	#url;
	#title;
	#isSupported;
	#isBookmarked;
	#numberOfBookmarks;
	#bookmarks;

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
		return this.#isSupported;
	}

	get isBookmarked() {
		return this.#isBookmarked;
	}

	get numberOfBookmarks() {
		return this.#numberOfBookmarks;
	}

	get bookmarks() {
		return this.#bookmarks;
	}

	// Set values for a page not supported by the extension
	#unsupportedPage() {
		this.#isBookmarked = false;
		this.#numberOfBookmarks = 0;
		this.#bookmarks = [];
	}

	// Set values for a page supported by the extension but not bookmarked
	#notBookmarkedPage() {
		this.#isBookmarked = false;
		this.#numberOfBookmarks = 0;
		this.#bookmarks = [];
	}

	// Set values for a page supported by the extension and bookmarked
	#bookmarkedPage(bookmarks) {
		this.#isBookmarked = true;
		this.#numberOfBookmarks = bookmarks.length;
		this.#bookmarks = bookmarks;
	}

	async determineSupportedStatus() {
		const isSupported = await Utils.isSupportedURL(this.#url);
		this.#isSupported = isSupported === true;
	}

	// Check if current page is supported and search for bookmarks if it is the case
	async determineBookmarkingStatus() {
		if (this.#isSupported === false) {
			this.#unsupportedPage();
		} else {
			let bookmarks;
			if (Utils.isSupportedProtocol(this.#url)) {
				bookmarks = await browser.bookmarks.search({ url: this.#url });
			} else if (Utils.isExtraProtocol(this.#url)) {
				bookmarks = await browser.bookmarks.search(decodeURIComponent(this.#url));
			}
			if (bookmarks.constructor !== Array) {
				this.#unsupportedPage();
			} else if (bookmarks.length === 0) {
				this.#notBookmarkedPage();
			} else {
				this.#bookmarkedPage(bookmarks);
			}
		}
	}
}
