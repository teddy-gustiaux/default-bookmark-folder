'use strict'
/*
 * ================================================================================
 * CONSTANTS
 * ================================================================================
 */

// List of stored options properties
const BUILTIN = 'builtin'
const ALLTABS = 'alltabs'
const ICON = 'icon'
const FOLDER = 'folder'
const TOP = 'top'
const ENABLED = 'enabled'
const INBOX = 'inbox'
const COLOR = 'color'
const SHORTCUT = 'shortcut'

// Miscellaneous
const FOLDER_NONE = 'none'
const ICON_DEFAULT_COLOR = 'red'

// Default bookmark folders ('unfiled' by default for all versions, 'menu' with shortcut/context menu on stable version)
const FIREFOX_DEFAULT_FOLDERS = ['unfiled_____', 'menu________']

// List of status
const ST_BOOKMARKED = 100
const ST_NOT_BOOKMARKED = 101
const ST_MULTIPLE_BOOKMARKS = 102

// Allow to retrieve all stored options at once
const OPTIONS_ARRAY = [BUILTIN, ALLTABS, ICON]

/*
 * ================================================================================
 * UTILITIES
 * ================================================================================
 */

function getOptions () {
  return new Promise((resolve, reject) => {
    browser.storage.local.get().then((options) => {
      resolve({options: options})
    }, onError)
  })
}

function updateStatus (context) {
  return new Promise((resolve, reject) => {
    let currentURL = currentTab.url
    let searching
    if (isSupportedProtocol(currentURL)) {
      searching = browser.bookmarks.search({url: currentURL})
    } else if (isExtraProtocol(currentURL)) {
      searching = browser.bookmarks.search(currentURL)
    }
    searching.then((bookmarks) => {
      if (bookmarks.length === 1) {
        currentBookmark = bookmarks[0]
        pageIsSupported = true
        context.status = ST_BOOKMARKED
        resolve(context)
      } else if (bookmarks.length === 0) {
        pageIsSupported = true
        context.status = ST_NOT_BOOKMARKED
        resolve(context)
      } else if (bookmarks.length > 1) {
        pageIsSupported = false
        context.status = ST_MULTIPLE_BOOKMARKS
        resolve(context)
      }
    }, onError)
  })
}

function updateUI (context) {
  return new Promise((resolve, reject) => {
    switch (context.status) {
      case ST_BOOKMARKED:
        if (isIconEnabled(context.options)) {
          if (isIconInboxEnabled(context.options)) {
            // Only keep current bookmark if it is in the default location
            if (context.options[ICON][FOLDER] === undefined || currentBookmark.parentId !== context.options[ICON][FOLDER]) {
              currentBookmark = undefined
            }
          }
          let color = ICON_DEFAULT_COLOR
          if (context.options[ICON][COLOR] !== undefined) color = context.options[ICON][COLOR]
          showIcon(color)
        }
        break
      case ST_NOT_BOOKMARKED:
        currentBookmark = undefined
        if (isIconEnabled(context.options)) showIcon()
        break
      case ST_MULTIPLE_BOOKMARKS:
        hideIcon()
        break
    }
  })
}

/*
 * Indicates if a folder has been selected to override Firefox built-in bookmarking
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
 * Indicates if a folder has been selected to override Firefox built-in all tabs bookmarking
 */
function isAllTabsFolderSet (options) {
  let isSet = false
  if (options.hasOwnProperty(ALLTABS)) {
    let ff = options[ALLTABS]
    if (ff.hasOwnProperty(FOLDER) && ff[FOLDER] !== undefined && ff[FOLDER] !== FOLDER_NONE) isSet = true
  }
  return isSet
}

/*
 * Indicates if new folders for Firefox built-in all tabs bookmarking should be added to the top of the folder
 */
function addAllTabsToTop (options) {
  let isEnabled = false
  if (options.hasOwnProperty(ALLTABS)) {
    let ff = options[ALLTABS]
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
 * Indicates if the quick bookmark icon has been enabled
 */
function isIconShortcutEnabled (options) {
  let isEnabled = false
  if (options.hasOwnProperty(ICON)) {
    let ic = options[ICON]
    if (ic.hasOwnProperty(SHORTCUT) && ic[SHORTCUT] === true) isEnabled = true
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
 * Indicates if a bookmark is a web page
 */
function isWebPage (bookmarkInfo) {
  function checkBoolmarkUrl (bookmarkInfo) {
    if (bookmarkInfo.hasOwnProperty('url') && bookmarkInfo.url !== undefined && bookmarkInfo.url !== 'about:blank') {
      return true
    } else {
      return false
    }
  }

  if (bookmarkInfo.hasOwnProperty('type')) {
    if (bookmarkInfo.type !== undefined && bookmarkInfo.type === 'bookmark') {
      return checkBoolmarkUrl(bookmarkInfo)
    }
  } else {
    return checkBoolmarkUrl(bookmarkInfo)
  }
}

/*
 * Indicates if a bookmark is a folder
 */
function isFolder (bookmarkInfo) {
  if (bookmarkInfo.hasOwnProperty('type')) {
    return (bookmarkInfo.type !== undefined && bookmarkInfo.type === 'folder')
  } else {
    return (bookmarkInfo.hasOwnProperty('children'))
  }
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
      browser.storage.local.remove(['override', 'icon', 'inbox', 'addtotop'])
    }
    browser.storage.local.set({newRelease: true}).then(() => {
      browser.runtime.openOptionsPage()
    }, onError)
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
  if (isWebPage(bookmarkInfo)) {
    if (isValidURL(bookmarkInfo.url)) {
      let gettingOptions = browser.storage.local.get(OPTIONS_ARRAY)
      gettingOptions.then((options) => {
        if (bookmarkInfo.hasOwnProperty('parentId') && FIREFOX_DEFAULT_FOLDERS.includes(bookmarkInfo.parentId)) {
          let bookmarkTreeNode = {}
          if (isBuiltinFolderSet(options)) {
            bookmarkTreeNode.parentId = options[BUILTIN][FOLDER]
          } else {
            bookmarkTreeNode.index = bookmarkInfo.index
          }
          if (addBuiltinToTop(options)) {
            bookmarkTreeNode.index = 0
          }
          browser.bookmarks.move(id, bookmarkTreeNode)
        } else {
          // Bookmark created by an other mean
        }
      }, onError)
    }
  } else if (isFolder(bookmarkInfo)) {
    let gettingOptions = browser.storage.local.get(OPTIONS_ARRAY)
    gettingOptions.then((options) => {
      if (bookmarkInfo.hasOwnProperty('parentId') && FIREFOX_DEFAULT_FOLDERS.includes(bookmarkInfo.parentId)) {
        let bookmarkTreeNode = {}
        if (isAllTabsFolderSet(options)) {
          bookmarkTreeNode.parentId = options[ALLTABS][FOLDER]
        } else {
          bookmarkTreeNode.index = bookmarkInfo.index
        }
        if (addAllTabsToTop(options)) {
          bookmarkTreeNode.index = 0
        }
        browser.bookmarks.move(id, bookmarkTreeNode)
      } else {
        // Bookmark created by an other mean
      }
    }, onError)
  }
}

/*
 * ================================================================================
 * CREATING ANOTHER BOOKMARKING ICON
 * ================================================================================
 */

let currentTab
let currentBookmark
let pageIsSupported

/*
 * Updates the browserAction icon to reflect whether the current page is already bookmarked
 */
function updateIcon (iconEnabled, color = 'red') {
  if (iconEnabled === true) {
    browser.pageAction.setIcon({
      path: currentBookmark ? {
        32: `icons/star/star-${color}-32.png`,
        64: `icons/star/star-${color}-64.png`,
        128: `icons/star/star-${color}-128.png`,
        256: `icons/star/star-${color}-256.png`,
        512: `icons/star/star-${color}-512.png`
      } : {
        32: 'icons/empty/empty-32.png',
        64: 'icons/empty/empty-64.png',
        128: 'icons/empty/empty-128.png',
        256: 'icons/empty/empty-256.png',
        512: 'icons/empty/empty-512.png'
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
        32: 'icons/cross/cross-32.png',
        64: 'icons/cross/cross-64.png',
        128: 'icons/cross/cross-128.png',
        256: 'icons/cross/cross-256.png',
        512: 'icons/cross/cross-512.png'
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
 * Show the icon for the active tab
 */
function showIcon (color = 'red') {
  browser.pageAction.show(currentTab.id)
  updateIcon(true, color)
}

/*
 * Updates the icon of the currently active tab
 */
function updateTab (tabs) {
  if (tabs[0]) {
    currentTab = tabs[0]
    let currentURL = currentTab.url
    if (!isValidURL(currentURL)) {
      hideIcon()
    } else {
      getOptions()
        .then(updateStatus)
        .then(updateUI)
    }
  }
}

/*
 * ================================================================================
 * CREATING ANOTHER BOOKMARKING SHORTCUT
 * ================================================================================
 */

function handleCommands (command) {
  let gettingOptions = browser.storage.local.get(OPTIONS_ARRAY)
  gettingOptions.then((options) => {
    if (command === 'quick-bookmark') {
      if (pageIsSupported === true && isIconShortcutEnabled(options)) toggleBookmark()
    }
  }, onError)
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
