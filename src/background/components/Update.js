'use strict';

/*
 * =================================================================================================
 * EXTENSION UPDATE
 * =================================================================================================
 */

class Update {
    constructor(options) {
        this._options = options;
    }

    openOptionsPage() {
        browser.runtime.openOptionsPage();
    }

    async displayReleaseNotes() {
        if (this._options.isDisplayReleaseNotesEnabled()) {
            await browser.storage.local.set({ newRelease: true });
            this.openOptionsPage();
        }
    }

    // Update from version 1.*
    updateFromFirstVersion() {
        browser.storage.local.remove(['override', 'icon', 'inbox', 'addtotop']);
    }
}
