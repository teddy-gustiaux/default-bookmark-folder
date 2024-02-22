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
	_isOptionEnabled(optionCategory, optionName) {
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
	_isOptionSet(optionCategory, optionName) {
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
	_getSetFolder(optionCategory) {
		return this.#options[optionCategory][FOLDER];
	}

	// RELEASE NOTES

	isDisplayReleaseNotesEnabled() {
		return this._isOptionEnabled(RELEASE, OPEN_NOTES);
	}

	// BUILT-IN BOOKMARKING

	isBuiltinFolderSet() {
		return this._isOptionSet(BUILTIN, FOLDER);
	}

	isBuiltinFolderLastUsed() {
		return this.#options[BUILTIN][FOLDER] === FOLDER_LAST_USED;
	}

	getBuiltinFolder() {
		return this._getSetFolder(BUILTIN);
	}

	addBuiltinBookmarksOnTop() {
		return this._isOptionEnabled(BUILTIN, TOP);
	}

	// QUICK BOOKMARKING

	isIconEnabled() {
		return this._isOptionEnabled(ICON, ENABLED);
	}

	isShortcutEnabled() {
		return this._isOptionEnabled(ICON, SHORTCUT);
	}

	areContextMenusEnabled() {
		return this._isOptionEnabled(ICON, CONTEXT_MENU);
	}

	isQuickFolderSet() {
		return this._isOptionSet(ICON, FOLDER);
	}

	isQuickFolderLastUsed() {
		return this.#options[ICON][FOLDER] === FOLDER_LAST_USED;
	}

	getQuickFolder() {
		return this._getSetFolder(ICON);
	}

	addQuickBookmarksOnTop() {
		return this._isOptionEnabled(ICON, TOP);
	}

	isInboxModeEnabled() {
		return this._isOptionEnabled(ICON, INBOX);
	}

	isRemovalPreventionEnabled() {
		return this._isOptionEnabled(ICON, PREVENT_REMOVAL);
	}

	getIconColor() {
		let color = ICON_DEFAULT_COLOR;
		if (this._isOptionSet(ICON, COLOR)) {
			color = this.#options[ICON][COLOR];
		}
		return color;
	}

	// "ALL TABS" BOOKMARKING

	isAllTabsFolderSet() {
		return this._isOptionSet(ALLTABS, FOLDER);
	}

	isAllTabsFolderLastUsed() {
		return this.#options[ALLTABS][FOLDER] === FOLDER_LAST_USED;
	}

	getAllTabsFolder() {
		return this._getSetFolder(ALLTABS);
	}

	addAllTabsBookmarksOnTop() {
		return this._isOptionEnabled(ALLTABS, TOP);
	}

	// MISCELLANEOUS

	async updateLastUsedFolder(folderId) {
		const object = { [LAST_USED_FOLDER]: folderId };
		await browser.storage.local.set({ [MISC]: object });
	}

	getLastUsedFolder() {
		let folderId = FIREFOX_FOLDER_UNFILED;
		if (this._isOptionSet(MISC, LAST_USED_FOLDER)) {
			folderId = this.#options[MISC][LAST_USED_FOLDER];
		}
		return folderId;
	}
}
