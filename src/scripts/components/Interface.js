'use strict';

class Interface {
	#webPage;
	#options;

	constructor(webPage, options) {
		this.#webPage = webPage;
		this.#options = options;
	}

	updatePageAction() {
		if (this.#options.isIconEnabled()) {
			if (this.#webPage.isSupported) {
				if (this.#webPage.isBookmarked) {
					if (this.#options.isInboxModeEnabled()) {
						if (
							Utils.allBookmarksAreInFolder(
								this.#options.getQuickFolder(),
								this.#webPage.bookmarks,
							)
						) {
							PageAction.enableBookmarked(
								this.#webPage.id,
								this.#options.getIconColor(),
								this.#options.isRemovalPreventionEnabled(),
							);
						} else {
							PageAction.enableNotBookmarked(this.#webPage.id);
						}
					} else {
						PageAction.enableBookmarked(
							this.#webPage.id,
							this.#options.getIconColor(),
							this.#options.isRemovalPreventionEnabled(),
						);
					}
				} else {
					PageAction.enableNotBookmarked(this.#webPage.id);
				}
			} else {
				PageAction.disable(this.#webPage.id);
				PageAction.hide(this.#webPage.id);
			}
		} else {
			PageAction.disable(this.#webPage.id);
			PageAction.hide(this.#webPage.id);
		}
	}

	updateContextMenus() {
		if (this.#options.areContextMenusEnabled()) {
			if (this.#webPage.isSupported) {
				if (this.#webPage.isBookmarked) {
					ContextMenus.updatePageContextMenuAsBookmarked(
						this.#options.isRemovalPreventionEnabled(),
					);
				} else {
					ContextMenus.updatePageContextMenuAsNotBookmarked();
				}
				ContextMenus.updateBookmarkContextMenu();
			} else {
				ContextMenus.removeBookmarkContextMenu();
				ContextMenus.removePageContextMenu();
			}
		} else {
			ContextMenus.removeBookmarkContextMenu();
			ContextMenus.removePageContextMenu();
		}
	}

	updateBrowserAction() {
		if (this.#webPage.isSupported) {
			BrowserAction.enable(this.#webPage.id);
		} else {
			BrowserAction.disable(this.#webPage.id);
		}
	}
}
