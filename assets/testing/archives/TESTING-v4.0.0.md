# Testing scenarios to validate

Round 1
- Testing started: 2024-03-17.
- Testing finished: 2024-03-23.

Round 2
- Testing started: 2024-03-23.
- Testing finished: 2024-03-26.

## Firefox built-in bookmarking

### Bookmarking icon

- [x] Bookmarking the current page creates a bookmark in the expected location and position.
  - [x] For Firefox's default bookmark location.
  - [x] For last used folder.
  - [x] For selected location.
  - [x] For the top position.
  - [x] For the bottom position.
- [x] Creating a bookmark updates the latest used folder.

### Bookmarking selected tabs

- [x] Selecting multiple tabs, and drag and dropping them creates a bookmark in the "dropped" location and position.
- [x] Selecting multiple tabs and bookmarking them creates a folder in the expected location and position.
  - [x] For Firefox's default bookmark location.
  - [x] For last used folder.
  - [x] For selected location.
  - [x] For the top position.
  - [x] For the bottom position.
- [x] Creating a multi-tabs bookmark folder updates the latest used folder.

### Drag and drop

- [x] Drag and dropping existing bookmark moves it in the "dropped" location and position.
- [x] Drag and dropping current tab creates a bookmark in the "dropped" location and position.
  - Except for known issue with latest index in a folder.
- [x] Drag and dropping non-current tab creates a bookmark in the "dropped" location and position.
- [x] Drag and dropping a file from the system creates a bookmark in the "dropped" location and position.
- [x] Creating a bookmark updates the latest used folder.
- [x] Moving a bookmark updates the latest used folder.

### Importing

- [x] Importing bookmarks (via HTML) places them in the expected location.
- [x] Importing bookmarks (via the "restore" feature) places them in the expected location.
- [x] Importing bookmarks does not update the latest used folder.

## Quick bookmarking

- [x] Clicking the icon creates a bookmark in the expected location and position.
  - [x] For Firefox's default bookmark location.
  - [x] For last used folder.
  - [x] For selected location.
  - [x] For the top position.
  - [x] For the bottom position.
- [x] Clicking the icon for an already bookmarked page will delete the bookmark.
- [x] Clicking the icon for an already bookmarked page will not delete the bookmark if bookmark deletion prevention is enabled.
- [x] "Inbox Mode" is working as expected.
  - [x] Clicking the icon creates a bookmark in the expected location and position if there is no existing bookmarks for the page.
    - [x] For Firefox's default bookmark location.
    - [x] For last used folder.
    - [x] For selected location.
    - [x] For the top position.
    - [x] For the bottom position.
  - [x] Clicking the icon for an already bookmarked page only in the "inbox" folder will delete the bookmark.
  - [x] Clicking the icon for an already bookmarked page only not in the "inbox" folder will create a bookmark in the "inbox" folder (only once).
  - [x] Clicking the icon for an already bookmarked page both in and not in the "inbox" folder will do nothing.
- [x] Creating a bookmark updates the latest used folder.

## Quick bookmarking shortcut (Alt+Shift+D)

- [x] Triggering the shortcut creates a bookmark in the expected location and position.
  - [x] For Firefox's default bookmark location.
  - [x] For last used folder.
  - [x] For selected location.
  - [x] For the top position.
  - [x] For the bottom position.
- [x] Triggering the shortcut for an already bookmarked page will delete the bookmark.
- [x] Triggering the shortcut for an already bookmarked page will not delete the bookmark if bookmark deletion prevention is enabled.
- [x] "Inbox Mode" is working as expected.
  - [x] Triggering the shortcut creates a bookmark in the expected location and position if there is no existing bookmarks for the page.
    - [x] For Firefox's default bookmark location.
    - [x] For last used folder.
    - [x] For selected location.
    - [x] For the top position.
    - [x] For the bottom position.
  - [x] Triggering the shortcut for an already bookmarked page only in the "inbox" folder will delete the bookmark.
  - [x] Triggering the shortcut for an already bookmarked page only not in the "inbox" folder will create a bookmark in the "inbox" folder (only once).
  - [x] Triggering the shortcut for an already bookmarked page both in and not in the "inbox" folder will do nothing.
- [x] Creating a bookmark updates the latest used folder.

## Quick bookmarking context menu

- [x] Using the page context menu will create a bookmark in the expected location and position.
  - [x] For Firefox's default bookmark location.
  - [x] For last used folder.
  - [x] For selected location.
  - [x] For the top position.
  - [x] For the bottom position.
- [x] Using the page context menu for already bookmarked page(s) will delete the bookmark(s).
- [x] Using the page context menu for already bookmarked page(s) will delete the bookmark(s) even if inbox mode is enabled (and if bookmarks are in different locations).
- [x] The page context menu will not be visible for an already bookmarked page if bookmark deletion prevention is enabled.
- [x] Using the folder context menu will create a bookmark in the expected location and position.
  - [x] For the top position.
  - [x] For the bottom position.
- [x] Creating a bookmark updates the latest used folder.

## Quick bookmarking to folder

- [x] The settings button opens the settings page.
- [x] Searching for exact match returns the expected result.
- [x] Searching for partial match returns the expected result.
- [x] Selecting search result creates a bookmark in the selected location (at the bottom).
- [x] Keyboard navigation works as expected.
- [x] Using the shortcut (Alt+Shift+M) opens the modal.
- [x] Creating a bookmark updates the latest used folder.

## Options

- [x] Option to open changelog on update.
- [ ] Links are going to the correct places.
- [x] Bookmark folder tree refreshes when a folder is added.
- [x] Bookmark folder tree refreshes when a folder is deleted.
- [x] Bookmark folder tree refreshes when a folder is moved.
- [x] Bookmark folder tree refreshes when a folder is updated.
