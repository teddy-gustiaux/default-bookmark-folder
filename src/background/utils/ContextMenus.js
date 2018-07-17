'use strict';

/*
 * ================================================================================
 * CONTEXT MENUS
 * ================================================================================
 */

class ContextMenus {
    static _createBookmarkContextMenu() {
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
        this._createBookmarkContextMenu();
    }

    static _createPageContextMenu(title) {
        browser.menus.create({
            enabled: true,
            id: CM_PAGE,
            title,
            command: '_execute_page_action',
            contexts: ['page'],
        });
    }

    static _createPageBookmarkedContextMenu(preventRemoval) {
        const title =
            preventRemoval === true
                ? null
                : browser.i18n.getMessage('context_menu_remove_bookmark');
        if (title !== null) this._createPageContextMenu(title);
    }

    static _createPageNotBookmarkedContextMenu() {
        const title = browser.i18n.getMessage('context_menu_quick_bookmark_page');
        this._createPageContextMenu(title);
    }

    static removePageContextMenu() {
        browser.menus.remove(CM_PAGE);
    }

    static updatePageContextMenuAsBookmarked(preventRemoval) {
        this.removePageContextMenu();
        this._createPageBookmarkedContextMenu(preventRemoval);
    }

    static updatePageContextMenuAsNotBookmarked() {
        this.removePageContextMenu();
        this._createPageNotBookmarkedContextMenu();
    }
}
