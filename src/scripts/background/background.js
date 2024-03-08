'use strict';

// TABS
// Listen to tab URL changes (limit to necessary events)
browser.tabs.onUpdated.addListener(Orchestrator.processBookmarkEvent, { properties: ['status', 'title'] });
// Listen to tab activation and tab switching
browser.tabs.onActivated.addListener(Orchestrator.processBookmarkEvent);

// WINDOWS
// Listen for window activation and window switching
browser.windows.onFocusChanged.addListener(Orchestrator.processBookmarkEvent);

// BOOKMARKS
// Listen for bookmarks being created
browser.bookmarks.onCreated.addListener(Orchestrator.onBookmarksCreated);
// Listen for bookmarks being removed
browser.bookmarks.onRemoved.addListener(Orchestrator.processBookmarkEvent);
// Listen for bookmarks being moved
browser.bookmarks.onMoved.addListener(Orchestrator.onBookmarksMoved);
browser.bookmarks.onMoved.addListener(Orchestrator.processBookmarkEvent);

// PAGE ACTION
// Listen for clicks on the button
browser.pageAction.onClicked.addListener(Orchestrator.onPageActionClick);

// COMMANDS
// Listen for shortcuts
browser.commands.onCommand.addListener(Orchestrator.onShortcutUsed);

// MENUS
// Listen for context menu click
browser.menus.onClicked.addListener(Orchestrator.onContextMenuClick);

// RUNTIME
// Listen for add-on installation or update
browser.runtime.onInstalled.addListener(Orchestrator.onAddonInstallation);

// STORAGE
// Listen for options being updated
browser.storage.onChanged.addListener(Orchestrator.onOptionsUpdated);

Orchestrator.processBookmarkEvent();
