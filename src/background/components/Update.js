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

    async openChangelogPage() {
        return browser.tabs.create({
            url:
                'https://github.com/teddy-gustiaux/default-bookmark-folder/blob/master/CHANGELOG.md',
            active: true,
        });
    }

    async displayReleaseNotes() {
        if (this._options.isDisplayReleaseNotesEnabled()) {
            this.openChangelogPage();
        }
    }

    // Update from version 1.*
    updateFromFirstVersion() {
        browser.storage.local.remove(['override', 'icon', 'inbox', 'addtotop']);
    }

    //  Update from version 2.10.0
    updateRemovedNewReleaseOption() {
        browser.storage.local.remove('newRelease');
    }
}
