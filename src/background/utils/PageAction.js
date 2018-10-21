'use strict';

/*
 * ================================================================================
 * PAGE ACTION
 * ================================================================================
 */

class PageAction {
    // A reducer callback function that builds a dictionary of icon files
    static _iconPathBuilder(path) {
        return (accumulator, currentValue) => {
            accumulator[currentValue] = `${path}-${currentValue}.png`;
            return accumulator;
        };
    }

    // Set the title of the page action
    static _setTitle(tabId, title) {
        browser.pageAction.setTitle({
            title,
            tabId,
        });
    }

    // Set the icon of the page action
    static _setIcon(tabId, iconPath) {
        browser.pageAction.setIcon({
            path: ICON_SIZES.reduce(this._iconPathBuilder(iconPath), {}),
            tabId,
        });
    }

    // Set a disabled page action
    static disable(tabId) {
        this._setIcon(tabId, 'icons/cross/cross');
        this._setTitle(tabId, browser.i18n.getMessage('icon_quick_bookmark_disabled'));
    }

    // Hide completely the page action
    static hide(tabId) {
        browser.pageAction.hide(tabId);
    }

    // Show the page action for a bookmarked page
    static enableBookmarked(tabId, color, removalPrevention) {
        this._setIcon(tabId, `icons/star/star-${color}`);
        const title =
            removalPrevention === true
                ? browser.i18n.getMessage('icon_prevent_removal_bookmark')
                : browser.i18n.getMessage('icon_remove_bookmark');
        this._setTitle(tabId, title);
        browser.pageAction.show(tabId);
    }

    // Show the page action for a non-bookmarked page
    static enableNotBookmarked(tabId) {
        this._setIcon(tabId, 'icons/empty/empty');
        this._setTitle(tabId, browser.i18n.getMessage('icon_quick_bookmark_page'));
        browser.pageAction.show(tabId);
    }
}
