'use strict';

/*
 * =================================================================================================
 * ADD-ON OPTIONS PAGE
 * =================================================================================================
 */

// Restore and display the extension saved options
async function restoreOptions() {
	const bookmarkTree = await browser.bookmarks.getTree();
	const folderSelections = [];
	folderSelections.push(buildSelector(BUILTIN, FOLDER));
	folderSelections.push(buildSelector(ALLTABS, FOLDER));
	folderSelections.push(buildSelector(ICON, FOLDER));
	buildTree(bookmarkTree, folderSelections);

	const options = await getOptions();
	Object.keys(OPTIONS_IDS).forEach((key) => {
		if (typeof options[key] !== 'undefined') {
			Object.keys(options[key]).forEach((subkey) => {
				if (typeof options[key][subkey] !== 'undefined') {
					setOptionValue(buildSelector(key, subkey), options[key][subkey]);
				}
			});
		}
	});

	toggleIconOptions(options);
	toggleThemeHandling();
	const tabNumber = typeof options[TAB] !== 'undefined' ? options[TAB] : TAB_DEFAULT_NUMBER;
	switchTab(tabNumber);
}

// Save the options
function saveOptions() {
	const userPreferences = getOptionsFromDOM();
	browser.storage.local.set(userPreferences);
	toggleIconOptions(userPreferences);
}

function insertData() {
	insertDataFromLocales();
	insertSvgIcons();
	insertDataFromManifest();
}

function tabManagement() {
	const menuTabs = document.querySelectorAll(TAB_MENU);
	Array.from(menuTabs).forEach((link) => {
		// eslint-disable-next-line func-names
		link.addEventListener('click', function () {
			switchTab(this.dataset.tab);
		});
	});
}

function mobileMenuManagement() {
	// Get all "navbar-burger" elements
	const navbarBurgers = Array.prototype.slice.call(
		document.querySelectorAll('.navbar-burger'),
		0,
	);
	// Check if there are any navbar burgers
	if (navbarBurgers.length > 0) {
		// Add a click event on each of them
		navbarBurgers.forEach((navbarBurger) => {
			navbarBurger.addEventListener('click', () => {
				// Get the target from the "data-target" attribute
				const target = document.getElementById(navbarBurger.dataset.target);
				// Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
				navbarBurger.classList.toggle('is-active');
				target.classList.toggle('is-active');
			});
		});
	}
}

/*
 * =================================================================================================
 * LISTENERS
 * =================================================================================================
 */

// Listen for loading of the options page
document.addEventListener('DOMContentLoaded', welcomeMessage);
document.addEventListener('DOMContentLoaded', restoreOptions);
document.addEventListener('DOMContentLoaded', insertData);
document.addEventListener('DOMContentLoaded', tabManagement);
document.addEventListener('DOMContentLoaded', mobileMenuManagement);
// Listen for saving of the options page
document.querySelector(CONTENT_WRAPPER).addEventListener('change', saveOptions);
