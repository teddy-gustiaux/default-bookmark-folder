'use strict';

/*
 * =================================================================================================
 * EXTENSION USER INTERFACE
 * =================================================================================================
 */

class Interface {
    constructor(webPage, options) {
        this._webPage = webPage;
        this._options = options;
    }

    updatePageAction() {
        if (this._options.isIconEnabled()) {
            if (this._webPage.isSupported) {
                if (this._webPage.isBookmarked) {
                    if (this._options.isInboxModeEnabled()) {
                        if (
                            Utils.allBookmarksAreInFolder(
                                this._options.getQuickFolder(),
                                this._webPage.bookmarks,
                            )
                        ) {
                            PageAction.enableBookmarked(
                                this._webPage.id,
                                this._options.getIconColor(),
                                this._options.isRemovalPreventionEnabled(),
                            );
                        } else {
                            PageAction.enableNotBookmarked(this._webPage.id);
                        }
                    } else {
                        PageAction.enableBookmarked(
                            this._webPage.id,
                            this._options.getIconColor(),
                            this._options.isRemovalPreventionEnabled(),
                        );
                    }
                } else {
                    PageAction.enableNotBookmarked(this._webPage.id);
                }
            } else {
                PageAction.disable(this._webPage.id);
                PageAction.hide(this._webPage.id);
            }
        } else {
            PageAction.disable(this._webPage.id);
            PageAction.hide(this._webPage.id);
        }
    }

    updateContextMenus() {
        if (this._options.areContextMenusEnabled()) {
            if (this._webPage.isSupported) {
                if (this._webPage.isBookmarked) {
                    ContextMenus.updatePageContextMenuAsBookmarked();
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
}
