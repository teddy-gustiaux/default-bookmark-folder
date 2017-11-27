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
  let ff = options[BUILTIN]
  if (ff.hasOwnProperty(FOLDER) && ff[FOLDER] !== undefined && ff[FOLDER] !== FOLDER_NONE) {
    isSet = true
  }
  return isSet
}

/*
 * Indicates if new bookmarks for Firefox built-in bookmarking should be added to the top of the folder
 */
function addBuiltinToTop (options) {
  let isEnabled = false
  if (options[BUILTIN].hasOwnProperty(TOP) && options[BUILTIN][TOP] === true) isEnabled = true
  return isEnabled
}

/*
 * Indicates if the quick bookmark icon has been enabled
 */
function isIconEnabled (options) {
  let isEnabled = false
  if (options[ICON].hasOwnProperty(ENABLED) && options[ICON][ENABLED] === true) isEnabled = true
  return isEnabled
}

/*
 * Indicates if a folder selected has been selected for the quick icon bookmark
 */
function isIconFolderSet (options) {
  let isSet = false
  let ic = options[ICON]
  if (ic.hasOwnProperty(FOLDER) && ic[FOLDER] !== undefined && ic[FOLDER] !== FOLDER_NONE) {
    isSet = true
  }
  return isSet
}

/*
 * Indicates if new bookmarks for Firefox built-in bookmarking should be added to the top of the folder
 */
function addIconToTop (options) {
  let isEnabled = false
  if (options[ICON].hasOwnProperty(TOP) && options[ICON][TOP] === true) isEnabled = true
  return isEnabled
}

/*
 * Indicates if the "inbox mode" has been enabled
 */
function isIconInboxEnabled (options) {
  let isEnabled = false
  if (options[ICON].hasOwnProperty(INBOX) && options[ICON][INBOX] === true) isEnabled = true
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

/*
 * Updates the browserAction icon to reflect whether the current page
 * is already bookmarked.
 */
function updateIcon (iconEnabled) {
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
function toggleBookmark (tab) {
  if (currentBookmark) {
    browser.bookmarks.remove(currentBookmark.id)
  } else {
    // Create the bookmark (will toggle the handleCreated listener callback function)
    browser.bookmarks.create({title: currentTab.title, url: currentTab.url})
  }
}

/*
 * Switches currentTab and currentBookmark to reflect the currently active tab
 */
function updateActiveTab () {
  function isSupportedProtocol (urlString) {
    let supportedProtocols = ['https:', 'http:']
    let url = document.createElement('a')
    url.href = urlString
    return supportedProtocols.indexOf(url.protocol) !== -1
  }

  function updateTab (tabs) {
    let gettingOptions = browser.storage.local.get(OPTIONS_ARRAY)
    gettingOptions.then((options) => {
      if (tabs[0]) {
        currentTab = tabs[0]
        if (isIconEnabled(options)) {
          browser.pageAction.show(currentTab.id)
          let searching
          if (isSupportedProtocol(currentTab.url)) {
            searching = browser.bookmarks.search({url: currentTab.url})
          } else {
            searching = browser.bookmarks.search(currentTab.url)
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
            } else if (bookmarks.length === 0) {
              // No bookmarks
              currentBookmark = undefined
            } else if (bookmarks.length > 1) {
              // Duplicate bookmarks
              currentBookmark = undefined
              browser.pageAction.hide(currentTab.id)
            }
            updateIcon(true)
          }, onError)
        } else {
          currentBookmark = undefined
          browser.pageAction.hide(currentTab.id)
          updateIcon(false)
        }
      }
    }, onError)
  }

  let gettingActiveTab = browser.tabs.query({active: true, currentWindow: true})
  gettingActiveTab.then(updateTab, onError)
}

/*
 * ================================================================================
 * LISTENERS
 * ================================================================================
 */

// Listen for bookmarks being created
browser.bookmarks.onCreated.addListener(handleCreated)

// Listen for clicks on the button
browser.pageAction.onClicked.addListener(toggleBookmark)

// Listen for bookmarks being created
browser.bookmarks.onCreated.addListener(updateActiveTab)

// Listen for bookmarks being removed
browser.bookmarks.onRemoved.addListener(updateActiveTab)

// Listen for bookmarks being moved
browser.bookmarks.onMoved.addListener(updateActiveTab)

// Listen to tab URL changes
browser.tabs.onUpdated.addListener(updateActiveTab)

// Listen to tab switching
browser.tabs.onActivated.addListener(updateActiveTab)

// Listen for window switching
browser.windows.onFocusChanged.addListener(updateActiveTab)

// Update when the extension loads initially
updateActiveTab()
