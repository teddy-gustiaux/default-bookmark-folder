'use strict';

class Options {
	#options;

	constructor(options) {
		this.#options = options;
	}

	set options(options) {
		this.#options = options;
	}

	// GENERIC

	// Indicate if an option has been enabled or not for a specific option category
	#isOptionEnabled(optionCategory, optionName) {
		let isEnabled = false;
		if (Object.prototype.hasOwnProperty.call(this.#options, optionCategory)) {
			const category = this.#options[optionCategory];
			if (
				Object.prototype.hasOwnProperty.call(category, optionName) &&
				category[optionName] === true
			) {
				isEnabled = true;
			}
		}
		return isEnabled;
	}

	// Indicate if an option has been set or not for a specific option category
	#isOptionSet(optionCategory, optionName) {
		let isSet = false;
		if (Object.prototype.hasOwnProperty.call(this.#options, optionCategory)) {
			const category = this.#options[optionCategory];
			if (
				Object.prototype.hasOwnProperty.call(category, optionName) &&
				typeof category[optionName] !== 'undefined'
			) {
				isSet = true;
			}
			// Specific case for no folder selected for quick bookmarked
			if (category[optionName] === FOLDER_NONE) isSet = false;
		}
		return isSet;
	}

	// Get the folder which has been set for a specific option category
	#getSetFolder(optionCategory) {
		return this.#options[optionCategory][FOLDER];
	}

	// RELEASE NOTES

	isDisplayReleaseNotesEnabled() {
		return this.#isOptionEnabled(RELEASE, OPEN_NOTES);
	}

	// BUILT-IN BOOKMARKING

	isBuiltinFolderSet() {
		return this.#isOptionSet(BUILTIN, FOLDER);
	}

	isBuiltinFolderLastUsed() {
		return this.#options[BUILTIN][FOLDER] === FOLDER_LAST_USED;
	}

	getBuiltinFolder() {
		return this.#getSetFolder(BUILTIN);
	}

	addBuiltinBookmarksOnTop() {
		return this.#isOptionEnabled(BUILTIN, TOP);
	}

	// QUICK BOOKMARKING

	isIconEnabled() {
		return this.#isOptionEnabled(ICON, ENABLED);
	}

	isShortcutEnabled() {
		return this.#isOptionEnabled(ICON, SHORTCUT);
	}

	areContextMenusEnabled() {
		return this.#isOptionEnabled(ICON, CONTEXT_MENU);
	}

	isQuickFolderSet() {
		return this.#isOptionSet(ICON, FOLDER);
	}

	isQuickFolderLastUsed() {
		return this.#options[ICON][FOLDER] === FOLDER_LAST_USED;
	}

	getQuickFolder() {
		if (this.isQuickFolderLastUsed()) return this.getLastUsedFolder();
		const folder = this.#getSetFolder(ICON);
		return folder === FOLDER_NONE ? FIREFOX_FOLDER_UNFILED : folder;
	}

	addQuickBookmarksOnTop() {
		return this.#isOptionEnabled(ICON, TOP);
	}

	isInboxModeEnabled() {
		return this.#isOptionEnabled(ICON, INBOX);
	}

	isRemovalPreventionEnabled() {
		return this.#isOptionEnabled(ICON, PREVENT_REMOVAL);
	}

	getIconColor() {
		let color = ICON_DEFAULT_COLOR;
		if (this.#isOptionSet(ICON, COLOR)) {
			color = this.#options[ICON][COLOR];
		}
		return color;
	}

	// "ALL TABS" BOOKMARKING

	isAllTabsFolderSet() {
		return this.#isOptionSet(ALLTABS, FOLDER);
	}

	isAllTabsFolderLastUsed() {
		return this.#options[ALLTABS][FOLDER] === FOLDER_LAST_USED;
	}

	getAllTabsFolder() {
		return this.#getSetFolder(ALLTABS);
	}

	addAllTabsBookmarksOnTop() {
		return this.#isOptionEnabled(ALLTABS, TOP);
	}

	// MISCELLANEOUS

	async updateLastUsedFolder(folderId) {
		if (!folderId) return;
		const object = { [LAST_USED_FOLDER]: folderId };
		await browser.storage.local.set({ [MISC]: object });
		const folderDetails = await browser.bookmarks.get(folderId);
		Logger.info(`Updated last used folder to: [${folderId}] / [${folderDetails[0].title}]`);
	}

	getLastUsedFolder() {
		let folderId = FIREFOX_FOLDER_UNFILED;
		if (this.#isOptionSet(MISC, LAST_USED_FOLDER)) {
			folderId = this.#options[MISC][LAST_USED_FOLDER];
		}
		return folderId;
	}
}
