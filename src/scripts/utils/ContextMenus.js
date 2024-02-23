'use strict';

class ContextMenus {
	static #createBookmarkContextMenu() {
		browser.menus.create({
			enabled: true,
			id: CM_BOOKMARK,
			title: browser.i18n.getMessage('context_menu_quick_bookmark_bookmark'),
			contexts: ['bookmark'],
		});
	}

	static removeBookmarkContextMenu() {
		browser.menus.remove(CM_BOOKMARK);
	}

	static updateBookmarkContextMenu() {
		this.removeBookmarkContextMenu();
		this.#createBookmarkContextMenu();
	}

	static #createPageContextMenu(title) {
		browser.menus.create({
			enabled: true,
			id: CM_PAGE,
			title,
			contexts: ['page'],
		});
	}

	static #createPageBookmarkedContextMenu(preventRemoval) {
		const title =
			preventRemoval === true
				? null
				: browser.i18n.getMessage('context_menu_remove_bookmark');
		if (title !== null) this.#createPageContextMenu(title);
	}

	static #createPageNotBookmarkedContextMenu() {
		const title = browser.i18n.getMessage('context_menu_quick_bookmark_page');
		this.#createPageContextMenu(title);
	}

	static removePageContextMenu() {
		browser.menus.remove(CM_PAGE);
	}

	static updatePageContextMenuAsBookmarked(preventRemoval) {
		this.removePageContextMenu();
		this.#createPageBookmarkedContextMenu(preventRemoval);
	}

	static updatePageContextMenuAsNotBookmarked() {
		this.removePageContextMenu();
		this.#createPageNotBookmarkedContextMenu();
	}
}
