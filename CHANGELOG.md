# Default Bookmark Folder Changelog

All notable changes to this project are documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Additionally, the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) format is respected and used to generate the [conventional changelog](https://github.com/conventional-changelog/conventional-changelog).

Starting with 2.7.0 and 

# [2.6.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.5.0...v2.6.0) (2018-11-07)

### Features

* add back the option to show page as bookmarked only if all the bookmarks are in the defined folder (when using quick bookmark icon) (GitHub issue #38)
* add favicon to the options page (GitHub issue #40)

### Bug Fixes

* replace Font Awesome dependency by Unicode characters (GitHub issue #39)

# [2.5.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.3.0...v2.4.0) (2018-10-21)

### Features

* add an option to bookmark to last used folder for all modes (GitHub issues #19 and #29)
* add context menu quick bookmarking in web pages and bookmark toolbar (GitHub issue #20)
* the quick bookmark icon supports multiple bookmarks removal (in the same way Firefox does)
* internal code refactoring

### BREAKING CHANGES

* remove option to show page as bookmarked only if the bookmark is in the defined folder (when using quick bookmark icon)- this was reintroduced in 2.6.0

## [2.4.1](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.4.0...v2.4.1) (2018-07-03)

### Bug Fixes

* new folders moved to selected location for "Bookmark All Tabs..." (GitHub issue #30)

# [2.4.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.3.0...v2.4.0) (2018-06-25)

### Features

* add an option to show (or not) release notes on add-on update (GitHub issue #27)
* add Hungarian translation (thanks to @meskobalazs)
* improvement of the French translation (thanks to @Machou)
* add new icon resolutions

# [2.3.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.2.1...v2.3.0) (2018-06-20)

### Features

* add an option to prevent quick unbookmarking (GitHub issue #21)
* add internationalization support (GitHub issue #10)
* add French translation
* upgrade of internal libraries

## [2.2.1](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.2.0...v2.2.1) (2018-06-04)

### Features

* add support for Firefox Reader Mode - requires version 58 or later (GitHub issue #22)

### Bug Fixes

* quick bookmarking of local files

# [2.2.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.1.2...v2.2.0) (2018-03-19)

### Features

* select the default folder for "Bookmark All Tabs..." feature (GitHub issue #13)
* code refactoring and upgrade of internal libraries
* small wording updates of the add-on options

### Bug Fixes

* hide quick bookmark icon automatically if option is enabled and then disabled
* consistency of the quick bookmark shortcut behavior
* avast add-on reputation - fixed internally by Avast (GitHub issue #14)

## [2.1.2](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.1.1...v2.1.2) (2017-12-23)

### Bug Fixes

* the built-in bookmarking features of the add-on now work normally on Firefox 56.x (GitHub issue #8)

## [2.1.1](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.1.0...v2.1.1) (2017-12-23)

### Bug Fixes

* the built-in shortcut and context menu bookmarking now use the defined location on Firefox stable version 57.x (GitHub issues #7 and #9)

# [2.1.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.0.0...v2.1.0) (2017-12-16)

### Features

* select the color of the quick bookmark icon (among a list) when the current page is bookmarked
* higher quality quick bookmark icons
* release notes tab in the options

### Bug Fixes

* tab drag and drop bookmarking and "Bookmark All Tabs..." features are now excluded from the overriding and behave normally (GitHub issue #5)

# [2.0.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v1.2.4...v2.0.0) (2017-12-03)

### Features

* the settings now have a dedicated page
* the settings have been separated for more flexibility: you can now choose a different folder for the built-in bookmarking and for the quick bookmarking
* the quick bookmarking feature now has a dedicated shortcut (Alt+Shift+D)
* the settings are now save automatically on change

### Bug Fixes

* GitHub issue #3 (links to local files do not work properly)

## [1.2.4](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v1.2.3...v1.2.4) (2017-11-16)

### Features

* bookmarks can now be added to the top of the selected location if desired

### Bug Fixes

* code improvements and bug fixes

## [1.2.3](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v1.2.2...v1.2.3) (2017-11-16)

### Bug Fixes

* better handling of manually created items (they will no longer be moved to the default folder if created manually at a specific location)

## [1.2.2](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v1.2.1...v1.2.2) (2017-11-05)

### Bug Fixes

* the selected folder is now properly displayed in the drop-down menu after reload (settings page)

## [1.2.1](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v1.1...v1.2.1) (2017-11-05)

### Features

* orange cross indicator for disabled "quick bookmark" icon (for Nightly users)

### Bug Fixes

* GitHub issue #1: the configuration is now saved locally (settings might need to be set again)
* avoid moving manually created folders

# [1.1.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v1.0...v1.1) (2017-11-03)

### Features

* better management of duplicate bookmarks
* improvement of the extension settings design

# 1.0.0 (2017-11-02)

### Features

* initial release


