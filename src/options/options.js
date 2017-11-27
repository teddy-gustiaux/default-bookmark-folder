/*
 * ================================================================================
 * CONSTANTS
 * ================================================================================
 */

// List of options IDs
const OPT_FF_FOLDER = 'builtin-folder'
const OPT_FF_TOP = 'builtin-top'
const OPT_IC_ICON = 'icon-enabled'
const OPT_IC_FOLDER = 'icon-folder'
const OPT_IC_TOP = 'icon-top'
const OPT_IC_INBOX = 'icon-inbox'

// List of options query selectors
const QRY_FF_FOLDER = '#' + OPT_FF_FOLDER
const QRY_FF_TOP = '#' + OPT_FF_TOP
const QRY_IC_ICON = '#' + OPT_IC_ICON
const QRY_IC_FOLDER = '#' + OPT_IC_FOLDER
const QRY_IC_TOP = '#' + OPT_IC_TOP
const QRY_IC_INBOX = '#' + OPT_IC_INBOX

// List of stored options properties
const BUILTIN = 'builtin'
const ICON = 'icon'
const FOLDER = 'folder'
const TOP = 'top'
const ENABLED = 'enabled'
const INBOX = 'inbox'

// Miscellaneous
const UNNAMED_FOLDER = '[no name]'
const MISC_TAB = 'tab'
const TAB_DEFAULT_NUMBER = 1

// Allow to retrieve all stored options at once
const OPTIONS_ARRAY = [BUILTIN, ICON, MISC_TAB]

/*
 * ================================================================================
 * FUNCTIONS - OPTIONS
 * ================================================================================
 */

/*
 * Sets the selection option in a <select> element
 */
function setOption (selectElement, value) {
  return [...selectElement.options].some((option, index) => {
    if (option.value === value) {
      selectElement.selectedIndex = index
      return true
    }
  })
}

/*
 * Toggles quick bookmark icon options depending on the feature status
 */
function toggleIconOptions (iconEnabled) {
  if (iconEnabled !== undefined && iconEnabled === true) {
    Array.from(document.querySelectorAll(':disabled')).forEach(item => {
      item.removeAttribute('disabled')
    })
  } else {
    document.querySelector(QRY_IC_FOLDER).setAttribute('disabled', '')
    document.querySelector(QRY_IC_TOP).setAttribute('disabled', '')
    document.querySelector(QRY_IC_INBOX).setAttribute('disabled', '')
  }
}
/*
 * Saves the options
 */
function saveOptions () {
  let iconEnabled = document.querySelector(QRY_IC_ICON).checked
  toggleIconOptions(iconEnabled)
  let firefoxBookmarking = {
    folder: document.querySelector(QRY_FF_FOLDER).value,
    top: document.querySelector(QRY_FF_TOP).checked
  }
  let icon = {
    enabled: iconEnabled,
    folder: document.querySelector(QRY_IC_FOLDER).value,
    top: document.querySelector(QRY_IC_TOP).checked,
    inbox: document.querySelector(QRY_IC_INBOX).checked
  }
  browser.storage.local.set({
    builtin: firefoxBookmarking,
    icon: icon
  }).then(null, onError)
}

/*
 * Restores the extension options
 */
function restoreOptions () {
  function updateOptions (bookmarkItems) {
    buildTree(bookmarkItems, [QRY_FF_FOLDER, QRY_IC_FOLDER])
    let gettingOptions = browser.storage.local.get(OPTIONS_ARRAY)
    gettingOptions.then((res) => {
      // For Firefox built-in bookmarking
      if (res[BUILTIN][FOLDER] !== undefined) setOption(document.querySelector(QRY_FF_FOLDER), res[BUILTIN][FOLDER])
      if (res[BUILTIN][TOP] !== undefined) document.querySelector(QRY_FF_TOP).checked = res[BUILTIN][TOP]
      // For quick bookmark icon
      if (res[ICON][ENABLED] !== undefined) document.querySelector(QRY_IC_ICON).checked = res[ICON][ENABLED]
      if (res[ICON][FOLDER] !== undefined) setOption(document.querySelector(QRY_IC_FOLDER), res[ICON][FOLDER])
      if (res[ICON][TOP] !== undefined) document.querySelector(QRY_IC_TOP).checked = res[ICON][TOP]
      if (res[ICON][INBOX] !== undefined) document.querySelector(QRY_IC_INBOX).checked = res[ICON][INBOX]
      toggleIconOptions(res[ICON][ENABLED])
      // For tab management
      res[MISC_TAB] !== undefined ? switchTab(res[MISC_TAB]) : switchTab(TAB_DEFAULT_NUMBER)
    }, onError)
  }

  let gettingTree = browser.bookmarks.getTree()
  gettingTree.then(updateOptions, onError)
}

/*
 * Adds an unbreakable space for indentation
 */
function makeIndent (indentLength) {
  return '\xA0\xA0'.repeat(indentLength)
}

/*
 * Builds the <select> options from the bookmarks tree
 */
function buildItems (bookmarkItem, indent, selectors) {
  if (!bookmarkItem.url) {
    if (!bookmarkItem.title && indent === 0) {
      // Root of the bookmark tree
    } else {
      let displayName
      let select
      if (!bookmarkItem.title) {
        displayName = UNNAMED_FOLDER
      } else {
        displayName = bookmarkItem.title
      }
      let key = makeIndent(indent) + displayName
      Array.from(selectors).forEach(selector => {
        select = document.querySelector(selector)
        select.options[select.options.length] = new Option(key, bookmarkItem.id)
      })
      indent++
    }
  }
  if (bookmarkItem.children) {
    for (let child of bookmarkItem.children) {
      buildItems(child, indent, selectors)
    }
  }
  indent--
}

/*
 * Builds the bookmarks tree
 */
function buildTree (bookmarkItems, selectors) {
  buildItems(bookmarkItems[0], 0, selectors)
}

/*
 * Logs errors to the console
 */
function onError (error) {
  console.log(`An error occurred: ${error}`)
}

/*
 * ================================================================================
 * FUNCTIONS - TAB MANAGEMENT
 * ================================================================================
 */

function tabManagement () {
  let menuTabs = document.querySelectorAll('.tab_menu')
  Array.from(menuTabs).forEach(link => {
    link.addEventListener('click', function () {
      let tabNumber = this.dataset.tab
      switchTab(tabNumber)
    })
  })
}

function switchTab (number) {
  let tabs = document.querySelectorAll('.tab_menu')
  Array.from(tabs).forEach(tabItem => {
    tabItem.classList.remove('is-active')
  })
  document.querySelector("[data-tab='" + number + "']").classList.add('is-active')

  let containers = document.querySelectorAll('.container_item')
  Array.from(containers).forEach(containerItem => {
    containerItem.classList.remove('is-active')
  })
  document.querySelector("[data-item='" + number + "']").classList.add('is-active')

  browser.storage.local.set({
    tab: number
  }).then(null, onError)
}

/*
 * ================================================================================
 * LISTENERS
 * ================================================================================
 */

// Listen for loading of the options page
document.addEventListener('DOMContentLoaded', restoreOptions)
document.addEventListener('DOMContentLoaded', tabManagement)

// Listen for saving of the options page
document.querySelector('#tab_container').addEventListener('change', saveOptions)
