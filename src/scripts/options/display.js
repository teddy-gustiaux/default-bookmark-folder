'use strict';

// DATA

// Build the <select> options from the bookmarks tree
function buildBookmarkFolderItems(bookmarkItem, indent, selectors) {
	let indentProgress = indent;
	if (Utils.bookmarkIsFolder(bookmarkItem) && bookmarkItem.id !== FIREFOX_ROOT_BOOKMARK_FOLDER) {
		if (Object.prototype.hasOwnProperty.call(bookmarkItem, 'title') || indent !== 0) {
			const displayName = !bookmarkItem.title ? UNNAMED_FOLDER : bookmarkItem.title;
			const key = makeIndent(indent) + displayName;
			Array.from(selectors).forEach((selector) => {
				const select = document.querySelector(selector);
				select.options[select.options.length] = new Option(key, bookmarkItem.id);
			});
			indentProgress += 1;
		}
	}
	if (
		Object.prototype.hasOwnProperty.call(bookmarkItem, 'children') &&
		bookmarkItem.children.length !== 0
	) {
		Array.from(bookmarkItem.children).forEach((child) =>
			buildBookmarkFolderItems(child, indentProgress, selectors),
		);
	}
}

function buildBookmarkFolderTree(bookmarkItems, selectors) {
	resetBookmarkFolderTree(selectors);
	buildBookmarkFolderItems(bookmarkItems[0], 0, selectors);
}

function resetBookmarkFolderTree(selectors) {
	Array.from(selectors).forEach((selector) => {
		const select = document.querySelector(selector);
		for (let i = select.options.length; i >= 0; i--) {
			const item = select.item(i);
			if (item !== null && !BOOKMARK_TREE_FIXED_OPTIONS.includes(item.value)) {
				select.remove(i);
			}
		}
	});
}

// Inserts data from the manifest into the options page
function insertDataFromManifest() {
	const manifest = browser.runtime.getManifest();
	document
		.querySelectorAll(VERSION)
		.forEach((element) => (element.textContent = manifest.version));
	document
		.querySelectorAll(NAME)
		.forEach((element) => (element.childNodes[0].textContent = manifest.name));
}

// TABS

function switchTab(number) {
	const tabNumber = number < 1 || number > 3 ? TAB_DEFAULT_NUMBER : number;
	const tabs = document.querySelectorAll(TAB_MENU);
	Array.from(tabs).forEach((tabItem) => {
		tabItem.classList.remove('is-active');
	});
	document.querySelector(`[${DATA_TAB}='${tabNumber}']`).classList.add('is-active');
	const containers = document.querySelectorAll(TAB_CONTAINER_ITEM);
	Array.from(containers).forEach((containerItem) => {
		containerItem.classList.remove('is-active');
	});
	document.querySelector(`[${DATA_ITEM}='${tabNumber}']`).classList.add('is-active');
	browser.storage.local.set({ [TAB]: tabNumber });
}

// OPTIONS

// Set the selection option in a <select> element
function setSelectOption(selector, value) {
	const selectElement = document.querySelector(selector);
	return [...selectElement.options].some((option, index) => {
		if (option.value === value) {
			selectElement.selectedIndex = index;
			return true;
		}
		return false;
	});
}

// Set the value of a specific option
function setOptionValue(selector, value) {
	const element = document.querySelector(selector);
	if (typeof value === 'boolean' && element) element.checked = value;
	if (typeof value === 'string') setSelectOption(selector, value);
}

function toggleFeatures(on, items, itemLabels) {
	const fnForItems = on === true ? enableItem : disableItem;
	const fnForLabels = on === true ? enableItemLabel : disableItemLabel;
	items.map((element) => fnForItems(buildSelector(ICON, element)));
	itemLabels.map((element) => fnForLabels(buildSelector(ICON, element)));
}

// Toggles quick bookmark icon, shortcut or context menu options depending on the feature status
function toggleIconOptions(options) {
	if (isOptionEnabled(options, ICON, ENABLED)) {
		enableAllItemsAndLabels();
	} else if (
		isOptionEnabled(options, ICON, SHORTCUT) ||
		isOptionEnabled(options, ICON, CONTEXT_MENU)
	) {
		const itemsToEnable = [FOLDER, TOP, PREVENT_REMOVAL];
		const itemLabelsToEnable = [FOLDER];
		toggleFeatures(true, itemsToEnable, itemLabelsToEnable);
		const itemsToDisable = [INBOX, COLOR];
		const itemLabelsToDisable = [COLOR];
		toggleFeatures(false, itemsToDisable, itemLabelsToDisable);
	} else {
		const itemsToDisable = [FOLDER, TOP, INBOX, PREVENT_REMOVAL, COLOR];
		const itemLabelsToDisable = [FOLDER, COLOR];
		toggleFeatures(false, itemsToDisable, itemLabelsToDisable);
	}
}

function isDarkThemeEnabled() {
	return window && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function toggleThemeHandling() {
	const tags = document.querySelectorAll('.tags');
	const classToApply = isDarkThemeEnabled() ? 'is-dark' : 'is-light';
	tags.forEach((element) => element.classList.add(classToApply));
}
