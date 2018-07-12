'use strict';

/*
 * =================================================================================================
 * CONSTANTS
 * =================================================================================================
 */

// List of options IDs
const OPT_RN_OPEN_NOTES = 'release-open-changelog';
const OPT_FF_FOLDER = 'builtin-folder';
const OPT_FF_TOP = 'builtin-top';
const OPT_AT_FOLDER = 'alltabs-folder';
const OPT_AT_TOP = 'alltabs-top';
const OPT_IC_ICON = 'icon-enabled';
const OPT_IC_SHORTCUT = 'icon-shortcut';
const OPT_IC_CONTEXT_MENU = 'icon-context-menu';
const OPT_IC_FOLDER = 'icon-folder';
const OPT_IC_TOP = 'icon-top';
const OPT_IC_INBOX = 'icon-inbox';
const OPT_IC_PREVENT_REMOVAL = 'icon-prevent-removal';
const OPT_IC_COLOR = 'icon-color';

// List of options query selectors
const QRY_RN_OPEN_NOTES = `#${OPT_RN_OPEN_NOTES}`;
const QRY_FF_FOLDER = `#${OPT_FF_FOLDER}`;
const QRY_FF_TOP = `#${OPT_FF_TOP}`;
const QRY_AT_FOLDER = `#${OPT_AT_FOLDER}`;
const QRY_AT_TOP = `#${OPT_AT_TOP}`;
const QRY_IC_ICON = `#${OPT_IC_ICON}`;
const QRY_IC_CONTEXT_MENU = `#${OPT_IC_CONTEXT_MENU}`;
const QRY_IC_SHORTCUT = `#${OPT_IC_SHORTCUT}`;
const QRY_IC_FOLDER = `#${OPT_IC_FOLDER}`;
const QRY_IC_TOP = `#${OPT_IC_TOP}`;
const QRY_IC_INBOX = `#${OPT_IC_INBOX}`;
const QRY_IC_PREVENT_REMOVAL = `#${OPT_IC_PREVENT_REMOVAL}`;
const QRY_IC_COLOR = `#${OPT_IC_COLOR}`;

const NOTIFICATION = 'updateNotification';

// List of tab management items
const MISC_TAB = 'tab';
const TAB_DEFAULT_NUMBER = 1;
const TAB_CONTAINER = '#tab_container';
const TAB_MENU = '.tab_menu';
const TAB_CONTAINER_ITEM = '.container_item';
const DATA_ITEM = 'data-item';
const DATA_TAB = 'data-tab';

// Miscellaneous
const UNNAMED_FOLDER = '[no name]';
const WELCOME = '#welcome';
const CLOSE_WELCOME = '#close-welcome';
const DELETE_WELCOME = '#delete-welcome';
const VERSION = '#placeholder-version';
const AUTHOR = '#placeholder-author';
