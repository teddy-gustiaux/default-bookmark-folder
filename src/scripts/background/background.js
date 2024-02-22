'use strict';

globalBookmarkingHistory = new BookmarkingHistory();

// TABS
// Listen to tab URL changes (limit to necessary events)
browser.tabs.onUpdated.addListener(processUpdate, { properties: ['status', 'title'] });
// Listen to tab activation and tab switching
browser.tabs.onActivated.addListener(processUpdate);

// WINDOWS
// Listen for window activation and window switching
browser.windows.onFocusChanged.addListener(processUpdate);

// BOOKMARKS
// Listen for bookmarks being created
browser.bookmarks.onCreated.addListener(onBookmarksCreated);
browser.bookmarks.onCreated.addListener(processUpdate);
// Listen for bookmarks being removed
browser.bookmarks.onRemoved.addListener(processUpdate);
// Listen for bookmarks being moved
browser.bookmarks.onMoved.addListener(onBookmarksMoved);
browser.bookmarks.onMoved.addListener(processUpdate);

// PAGE ACTION
// Listen for clicks on the button
browser.pageAction.onClicked.addListener(onPageActionClick);

// COMMANDS
// Listen for shortcuts
browser.commands.onCommand.addListener(onShortcutUsed);

// MENUS
// Listen for context menu click
browser.menus.onClicked.addListener(onContextMenuClick);

// RUNTIME
// Listen for add-on installation or update
browser.runtime.onInstalled.addListener(onAddonInstallation);

// STORAGE
// Listen for options being updated
browser.storage.onChanged.addListener(onOptionsUpdated);

processUpdate();
