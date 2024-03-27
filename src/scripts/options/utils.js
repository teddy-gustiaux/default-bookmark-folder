'use strict';

// DOM GENERIC MANIPULATION

// Build a selector for a specific option
function buildSelector(key, subkey) {
	return `#${OPTIONS_IDS[key][subkey]}`;
}

function disableItem(selector) {
	document.querySelector(selector).setAttribute('disabled', '');
}

function disableItemLabel(itemSelector) {
	const selector = itemSelector.replace('#', '');
	document.querySelector(`label[for=${selector}]`).classList.add('disabled-item');
}

function enableItem(selector) {
	document.querySelector(selector).removeAttribute('disabled');
}

function enableItemLabel(itemSelector) {
	const selector = itemSelector.replace('#', '');
	document.querySelector(`label[for=${selector}]`).classList.remove('disabled-item');
}

function enableAllItemsAndLabels() {
	Array.from(document.querySelectorAll(':disabled')).forEach((item) => {
		item.removeAttribute('disabled');
	});
	Array.from(document.querySelectorAll('.disabled-item')).forEach((item) => {
		item.classList.remove('disabled-item');
	});
}

// OPTIONS

// Indicate if an option has been enabled or not for a specific option category
function isOptionEnabled(options, optionCategory, optionName) {
	let isEnabled = false;
	if (Object.prototype.hasOwnProperty.call(options, optionCategory)) {
		const category = options[optionCategory];
		if (
			Object.prototype.hasOwnProperty.call(category, optionName) &&
			category[optionName] === true
		) {
			isEnabled = true;
		}
	}
	return isEnabled;
}

// Get the set value of a specific option
function getOptionValue(selector, type) {
	const element = document.querySelector(selector);
	let result;
	if (type === 'boolean') result = element.checked;
	if (type === 'string') result = element.value;
	return result;
}

// Get all extension settings from the DOM
function getOptionsFromDOM() {
	const userPreferences = {};
	Object.keys(OPTIONS_IDS).forEach((key) => {
		if (!Object.prototype.hasOwnProperty.call(userPreferences, key)) userPreferences[key] = {};
		Object.keys(OPTIONS_IDS[key]).forEach((subkey) => {
			userPreferences[key][subkey] = getOptionValue(
				buildSelector(key, subkey),
				OPTIONS_BOILERPLATE[key][subkey],
			);
		});
	});
	return userPreferences;
}

// MISCELLANEOUS

// Add an unbreakable space for indentation
function makeIndent(indentLength) {
	return '\xA0\xA0'.repeat(indentLength);
}
