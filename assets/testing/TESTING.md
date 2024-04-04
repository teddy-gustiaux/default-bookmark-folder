# Testing scenarios to validate

## Firefox built-in bookmarking

### Bookmarking icon

- [ ] Bookmarking the current page creates a bookmark in the expected location and position.
  - [ ] For Firefox's default bookmark location.
  - [ ] For last used folder.
  - [ ] For selected location.
  - [ ] For the top position.
  - [ ] For the bottom position.
- [ ] Creating a bookmark updates the latest used folder.

### Bookmarking selected tabs

- [ ] Selecting multiple tabs, and drag and dropping them creates a bookmark in the "dropped" location and position.
- [ ] Selecting multiple tabs and bookmarking them creates a folder in the expected location and position.
  - [ ] For Firefox's default bookmark location.
  - [ ] For last used folder.
  - [ ] For selected location.
  - [ ] For the top position.
  - [ ] For the bottom position.
- [ ] Creating a multi-tabs bookmark folder updates the latest used folder.

### Drag and drop

- [ ] Drag and dropping existing bookmark moves it in the "dropped" location and position.
- [ ] Drag and dropping current tab creates a bookmark in the "dropped" location and position.
- [ ] Drag and dropping non-current tab creates a bookmark in the "dropped" location and position.
- [ ] Drag and dropping a file from the system creates a bookmark in the "dropped" location and position.
- [ ] Creating a bookmark updates the latest used folder.
- [ ] Moving a bookmark updates the latest used folder.

### Importing

- [ ] Importing bookmarks (via HTML) places them in the expected location.
- [ ] Importing bookmarks (via the "restore" feature) places them in the expected location.
- [ ] Importing bookmarks does not update the latest used folder.

## Quick bookmarking

- [ ] Clicking the icon creates a bookmark in the expected location and position.
  - [ ] For Firefox's default bookmark location.
  - [ ] For last used folder.
  - [ ] For selected location.
  - [ ] For the top position.
  - [ ] For the bottom position.
- [ ] Clicking the icon for an already bookmarked page will delete the bookmark.
- [ ] Clicking the icon for an already bookmarked page will not delete the bookmark if bookmark deletion prevention is enabled.
- [ ] "Inbox Mode" is working as expected.
  - [ ] Clicking the icon creates a bookmark in the expected location and position if there is no existing bookmarks for the page.
    - [ ] For Firefox's default bookmark location.
    - [ ] For last used folder.
    - [ ] For selected location.
    - [ ] For the top position.
    - [ ] For the bottom position.
  - [ ] Clicking the icon for an already bookmarked page only in the "inbox" folder will delete the bookmark.
  - [ ] Clicking the icon for an already bookmarked page only not in the "inbox" folder will create a bookmark in the "inbox" folder (only once).
  - [ ] Clicking the icon for an already bookmarked page both in and not in the "inbox" folder will do nothing.
- [ ] Creating a bookmark updates the latest used folder.

## Quick bookmarking shortcut (Alt+Shift+D)

- [ ] Triggering the shortcut creates a bookmark in the expected location and position.
  - [ ] For Firefox's default bookmark location.
  - [ ] For last used folder.
  - [ ] For selected location.
  - [ ] For the top position.
  - [ ] For the bottom position.
- [ ] Triggering the shortcut for an already bookmarked page will delete the bookmark.
- [ ] Triggering the shortcut for an already bookmarked page will not delete the bookmark if bookmark deletion prevention is enabled.
- [ ] "Inbox Mode" is working as expected.
  - [ ] Triggering the shortcut creates a bookmark in the expected location and position if there is no existing bookmarks for the page.
    - [ ] For Firefox's default bookmark location.
    - [ ] For last used folder.
    - [ ] For selected location.
    - [ ] For the top position.
    - [ ] For the bottom position.
  - [ ] Triggering the shortcut for an already bookmarked page only in the "inbox" folder will delete the bookmark.
  - [ ] Triggering the shortcut for an already bookmarked page only not in the "inbox" folder will create a bookmark in the "inbox" folder (only once).
  - [ ] Triggering the shortcut for an already bookmarked page both in and not in the "inbox" folder will do nothing.
- [ ] Creating a bookmark updates the latest used folder.

## Quick bookmarking context menu

- [ ] Using the page context menu will create a bookmark in the expected location and position.
  - [ ] For Firefox's default bookmark location.
  - [ ] For last used folder.
  - [ ] For selected location.
  - [ ] For the top position.
  - [ ] For the bottom position.
- [ ] Using the page context menu for already bookmarked page(s) will delete the bookmark(s).
- [ ] Using the page context menu for already bookmarked page(s) will delete the bookmark(s) even if inbox mode is enabled (and if bookmarks are in different locations).
- [ ] The page context menu will not be visible for an already bookmarked page if bookmark deletion prevention is enabled.
- [ ] Using the folder context menu will create a bookmark in the expected location and position.
  - [ ] For the top position.
  - [ ] For the bottom position.
- [ ] Creating a bookmark updates the latest used folder.

## Quick bookmarking to folder

- [ ] The settings button opens the settings page.
- [ ] Searching for exact match returns the expected result.
- [ ] Searching for partial match returns the expected result.
- [ ] Selecting search result creates a bookmark in the selected location (at the bottom).
- [ ] Keyboard navigation works as expected.
- [ ] Using the shortcut (Alt+Shift+M) opens the modal.
- [ ] Creating a bookmark updates the latest used folder.

## Options

- [ ] Option to open changelog on update.
- [ ] Links are going to the correct places.
- [ ] Bookmark folder tree refreshes when a folder is added.
- [ ] Bookmark folder tree refreshes when a folder is deleted.
- [ ] Bookmark folder tree refreshes when a folder is moved.
- [ ] Bookmark folder tree refreshes when a folder is updated.
- [ ] Quick bookmarking icon updates when a bookmark exists and color setting is changed.
