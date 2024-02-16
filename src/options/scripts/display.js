'use strict';

/*
 * =================================================================================================
 * DISPLAY
 * =================================================================================================
 */

// -------------------------------------------------------------------------------------------------
// DATA
// -------------------------------------------------------------------------------------------------

// Build the <select> options from the bookmarks tree
function buildItems(bookmarkItem, indent, selectors) {
	let indentProgress = indent;
	if (bookmarkIsFolder(bookmarkItem) && bookmarkItem.id !== FIREFOX_ROOT_BOOKMARK_FOLDER) {
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
			buildItems(child, indentProgress, selectors),
		);
	}
}

// Build the bookmarks tree
function buildTree(bookmarkItems, selectors) {
	buildItems(bookmarkItems[0], 0, selectors);
}

// Insert data from the locales into the options page
function insertDataFromLocales() {
	document.title = browser.i18n.getMessage('options_title');
	const elementsWithLocale = document.querySelectorAll('[data-locale]');
	Array.from(elementsWithLocale).forEach((elementWithLocale) => {
		// eslint-disable-next-line no-param-reassign
		elementWithLocale.textContent = browser.i18n.getMessage(elementWithLocale.dataset.locale);
	});
}

// Inserts data from the manifest into the options page
function insertDataFromManifest() {
	const manifest = browser.runtime.getManifest();
	document.querySelectorAll(VERSION).forEach(element => element.textContent = manifest.version);
}

// Inserts SVG icons inline
function insertSvgIcons() {
	const parser = new DOMParser();
	const elementsWithSvgIcon = document.querySelectorAll('[data-svg]');
	Array.from(elementsWithSvgIcon).forEach(async (elementWithSvgIcon) => {
		const svgUrl = browser.runtime.getURL(`options/${elementWithSvgIcon.dataset.svg}`);
		const response = await fetch(svgUrl);
		const responseData = await response.text();
		const svgImageElement = parser.parseFromString(responseData, 'image/svg+xml');
		const svgInline = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svgInline.setAttribute('viewBox', svgImageElement.firstChild.getAttribute('viewBox'));
		Array.from(svgImageElement.children).forEach((child) => svgInline.appendChild(child));
		elementWithSvgIcon.appendChild(svgInline);
	});
}

// -------------------------------------------------------------------------------------------------
// TABS
// -------------------------------------------------------------------------------------------------

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

// -------------------------------------------------------------------------------------------------
// OPTIONS
// -------------------------------------------------------------------------------------------------

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
	tags.forEach(element => element.classList.add(classToApply));
}
