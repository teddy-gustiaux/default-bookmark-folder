/*
 * ================================================================================
 * CONSTANTS
 * ================================================================================
 */

// List of stored options properties
const BUILTIN = 'builtin'
const ICON = 'icon'
const FOLDER = 'folder'
const TOP = 'top'
const ENABLED = 'enabled'
const INBOX = 'inbox'

// Miscellaneous
const FOLDER_NONE = 'none'

// Allow to retrieve all stored options at once
const OPTIONS_ARRAY = [BUILTIN, ICON]

/*
 * ================================================================================
 * UTILITIES
 * ================================================================================
 */

/*
 * Indicates if a folder selected has been selected to override Firefox built-in bookmarking
 */
function isBuiltinFolderSet (options) {
  let isSet = false
  if (options.hasOwnProperty(BUILTIN)) {
    let ff = options[BUILTIN]
    if (ff.hasOwnProperty(FOLDER) && ff[FOLDER] !== undefined && ff[FOLDER] !== FOLDER_NONE) isSet = true
  }
  return isSet
}

/*
 * Indicates if new bookmarks for Firefox built-in bookmarking should be added to the top of the folder
 */
function addBuiltinToTop (options) {
  let isEnabled = false
  if (options.hasOwnProperty(BUILTIN)) {
    let ff = options[BUILTIN]
    if (ff.hasOwnProperty(TOP) && ff[TOP] === true) isEnabled = true
  }
  return isEnabled
}

/*
 * Indicates if the quick bookmark icon has been enabled
 */
function isIconEnabled (options) {
  let isEnabled = false
  if (options.hasOwnProperty(ICON)) {
    let ic = options[ICON]
    if (ic.hasOwnProperty(ENABLED) && ic[ENABLED] === true) isEnabled = true
  }
  return isEnabled
}

/*
 * Indicates if a folder selected has been selected for the quick icon bookmark
 */
function isIconFolderSet (options) {
  let isSet = false
  if (options.hasOwnProperty(ICON)) {
    let ic = options[ICON]
    if (ic.hasOwnProperty(FOLDER) && ic[FOLDER] !== undefined && ic[FOLDER] !== FOLDER_NONE) isSet = true
  }
  return isSet
}

/*
 * Indicates if new bookmarks for Firefox built-in bookmarking should be added to the top of the folder
 */
function addIconToTop (options) {
  let isEnabled = false
  if (options.hasOwnProperty(ICON)) {
    let ic = options[ICON]
    if (ic.hasOwnProperty(TOP) && ic[TOP] === true) isEnabled = true
  }
  return isEnabled
}

/*
 * Indicates if the "inbox mode" has been enabled
 */
function isIconInboxEnabled (options) {
  let isEnabled = false
  if (options.hasOwnProperty(ICON)) {
    let ic = options[ICON]
    if (ic.hasOwnProperty(INBOX) && ic[INBOX] === true) isEnabled = true
  }
  return isEnabled
}

/*
 * Logs errors to the console
 */
function onError (error) {
  console.log(`An error occurred: ${error}`)
}

/*
 * ================================================================================
 * OPTIONS PAGE
 * ================================================================================
 */

function handleInstalled (details) {
  if (details.reason === 'install') {
    browser.runtime.openOptionsPage()
  } else if (details.reason === 'update') {
    let previousVersion = details.previousVersion
    if (previousVersion[0] === '1') {
      // Update from version 1.*
      browser.runtime.openOptionsPage()
    }
  }
}

/*
 * ================================================================================
 * OVERRIDING DEFAULT BOOKMARK FOLDER
 * ================================================================================
 */

/*
 * Moves the bookmark to the specified folder
 */
function handleCreated (id, bookmarkInfo) {
  // Only process bookmarks (not folders or separators) with an actual URL
  if (bookmarkInfo.type === 'bookmark' && bookmarkInfo.hasOwnProperty('url')) {
    if (bookmarkInfo.url !== undefined && bookmarkInfo.url !== 'about:blank') {
      let gettingOptions = browser.storage.local.get(OPTIONS_ARRAY)
      gettingOptions.then((options) => {
        let bookmarkTreeNode = {}

        if (isBuiltinFolderSet(options)) {
          bookmarkTreeNode.parentId = options[BUILTIN][FOLDER]
        }
        if (addBuiltinToTop(options)) {
          bookmarkTreeNode.index = 0
        }

        browser.bookmarks.move(id, bookmarkTreeNode)
      }, onError)
    }
  }
}

/*
 * ================================================================================
 * CREATING ANOTHER BOOKMARKING ICON
 * ================================================================================
 */

let currentTab
let currentBookmark
let canToggleQuickBookmark

/*
 * Updates the browserAction icon to reflect whether the current page is already bookmarked
 */
function updateIcon (iconEnabled) {
  canToggleQuickBookmark = iconEnabled
  if (iconEnabled === true) {
    browser.pageAction.setIcon({
      path: currentBookmark ? {
        32: 'icons/star-button-32.png',
        48: 'icons/star-button-48.png'
      } : {
        32: 'icons/star-button-empty-32.png',
        48: 'icons/star-button-empty-48.png'
      },
      tabId: currentTab.id
    })
    browser.pageAction.setTitle({
      title: currentBookmark ? 'Remove this bookmark' : 'Quick bookmark this page',
      tabId: currentTab.id
    })
  } else {
    browser.pageAction.setIcon({
      path: {
        32: 'icons/cross-32.png',
        48: 'icons/cross-48.png'
      },
      tabId: currentTab.id
    })
    browser.pageAction.setTitle({
      title: 'The quick bookmark icon is disabled',
      tabId: currentTab.id
    })
  }
}

/*
 * Add or remove the bookmark on the current page.
 */
function toggleBookmark () {
  if (currentBookmark) {
    browser.bookmarks.remove(currentBookmark.id)
  } else {
    let gettingOptions = browser.storage.local.get(OPTIONS_ARRAY)
    gettingOptions.then((options) => {
      let bookmarkTreeNode = {
        title: currentTab.title,
        url: currentTab.url
      }
      if (isIconFolderSet(options)) {
        bookmarkTreeNode.parentId = options[ICON][FOLDER]
      }
      if (addIconToTop(options)) {
        bookmarkTreeNode.index = 0
      }
      // Remove listener overriding the Firefox built-in bookmarking
      browser.bookmarks.onCreated.removeListener(handleCreated)
      // Create the bookmark
      browser.bookmarks.create(bookmarkTreeNode).then(() => {
        // Re-add the listener
        browser.bookmarks.onCreated.addListener(handleCreated)
      }, onError)
    }, onError)
  }
}

/*
 * Checks if URL can be handle by the add-on
 */
function isValidURL (urlString) {
  let valid = false
  if (isSupportedProtocol(urlString) || isExtraProtocol(urlString)) valid = true
  return valid
}

/*
 * Checks if URL is using supported protocols
 */
function isSupportedProtocol (urlString) {
  let supportedProtocols = ['https:', 'http:']
  let url = document.createElement('a')
  url.href = urlString
  return supportedProtocols.indexOf(url.protocol) !== -1
}

/*
* Checks if URL is using one of the extra supported protocols
*/
function isExtraProtocol (urlString) {
  let extraProtocols = ['file:']
  let url = document.createElement('a')
  url.href = urlString
  return extraProtocols.indexOf(url.protocol) !== -1
}

/*
 * Triggers the update of the icon of the currently active tab
 */
function updateActiveTab () {
  let gettingActiveTab = browser.tabs.query({active: true, currentWindow: true})
  gettingActiveTab.then(updateTab, onError)
}

/*
 * Hides the icon for the active tab
 */
function hideIcon () {
  currentBookmark = undefined
  browser.pageAction.hide(currentTab.id)
  updateIcon(false)
}

/*
 * Updates the icon of the currently active tab
 */
function updateTab (tabs) {
  let gettingOptions = browser.storage.local.get(OPTIONS_ARRAY)
  gettingOptions.then((options) => {
    if (tabs[0]) {
      currentTab = tabs[0]
      let currentURL = currentTab.url
      if (!isValidURL(currentURL) || !isIconEnabled(options)) {
        hideIcon()
      } else {
        // Icon is enabled
        browser.pageAction.show(currentTab.id)
        // Search for the bookmark
        let searching
        if (isSupportedProtocol(currentURL)) {
          searching = browser.bookmarks.search({url: currentURL})
        } else if (isExtraProtocol(currentURL)) {
          searching = browser.bookmarks.search(currentURL)
        }
        searching.then((bookmarks) => {
          if (bookmarks.length === 1) {
            currentBookmark = bookmarks[0]
            // Only proceed if bookmark matches current tab address
            if (currentBookmark.url === currentTab.url) {
              if (isIconInboxEnabled(options)) {
                // Only keep current bookmark if it is in the default location
                if (options[ICON][FOLDER] === undefined || currentBookmark.parentId !== options[ICON][FOLDER]) {
                  currentBookmark = undefined
                }
              }
            } else {
              currentBookmark = undefined
            }
            updateIcon(true)
          } else if (bookmarks.length === 0) {
            // No bookmarks
            currentBookmark = undefined
            updateIcon(true)
          } else if (bookmarks.length > 1) {
            // Duplicate bookmarks (not managed)
            hideIcon()
          }
        }, onError)
      }
    }
  }, onError)
}

/*
 * ================================================================================
 * CREATING ANOTHER BOOKMARKING ICON
 * ================================================================================
 */

function handleCommands (command) {
  if (command === 'quick-bookmark') {
    if (canToggleQuickBookmark === true) toggleBookmark()
  }
}

/*
 * ================================================================================
 * LISTENERS
 * ================================================================================
 */

// Listen for bookmarks being created
browser.bookmarks.onCreated.addListener(handleCreated)
browser.bookmarks.onCreated.addListener(updateActiveTab)
// Listen for bookmarks being removed
browser.bookmarks.onRemoved.addListener(updateActiveTab)
// Listen for bookmarks being moved
browser.bookmarks.onMoved.addListener(updateActiveTab)
// Listen for clicks on the button
browser.pageAction.onClicked.addListener(toggleBookmark)
// Listen to tab URL changes
browser.tabs.onUpdated.addListener(updateActiveTab)
// Listen to tab switching
browser.tabs.onActivated.addListener(updateActiveTab)
// Listen for window switching
browser.windows.onFocusChanged.addListener(updateActiveTab)
// Listen for add-on installation or update
browser.runtime.onInstalled.addListener(handleInstalled)
// Listen for shortcuts
browser.commands.onCommand.addListener(handleCommands)

// Update when the extension loads initially
updateActiveTab()
