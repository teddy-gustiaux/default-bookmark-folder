'use strict';

/*
 * =================================================================================================
 * EXTENSION USER INTERFACE
 * =================================================================================================
 */

class Interface {
    constructor(webPage, options, firefoxVersion) {
        this._webPage = webPage;
        this._options = options;
        this._firefoxVersion = firefoxVersion;
        this._isBookmarkContextMenuSupported = firefoxVersion >= '59';
    }

    updatePageAction() {
        if (this._options.isIconEnabled()) {
            if (this._webPage.isSupported) {
                if (this._webPage.isBookmarked) {
                    PageAction.enableBookmarked(
                        this._webPage.id,
                        this._options.getIconColor(),
                        this._options.isRemovalPreventionEnabled(),
                    );
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
                if (this._isBookmarkContextMenuSupported) ContextMenus.updateBookmarkContextMenu();
            } else {
                if (this._isBookmarkContextMenuSupported) ContextMenus.removeBookmarkContextMenu();
                ContextMenus.removePageContextMenu();
            }
        } else {
            if (this._isBookmarkContextMenuSupported) ContextMenus.removeBookmarkContextMenu();
            ContextMenus.removePageContextMenu();
        }
    }
}
