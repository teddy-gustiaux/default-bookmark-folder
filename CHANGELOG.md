# Default Bookmark Folder Changelog

All notable changes to this project are documented in this file.

> 🛈 No longer want to see this page when the add-on is updated?
>
> Go to the add-on settings, and uncheck the option *`Show the release notes on GitHub when the add-on is updated`* in the `About` section.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Additionally, the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) format is respected and used to generate this [conventional changelog](https://github.com/conventional-changelog/conventional-changelog).

# [2.13.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.12.1...v2.13.0) (2020-08-18)

### Features

*  add support for selection using "enter" key in "quick bookmarking to folder" (close [#250](https://github.com/teddy-gustiaux/default-bookmark-folder/issues/250)) ([6cc475d](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/6cc475d599e77d0856086f04708ca385b65de263))
*  add keyboard navigation in "quick bookmarking to folder" results (close [#270](https://github.com/teddy-gustiaux/default-bookmark-folder/issues/270)) ([196ba20](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/196ba2043802d8ec2e75273b7af6d378d2a5a474))

### Bug Fixes

* incorrect tabulation order in "quick bookmarking to folder" (see [#270](https://github.com/teddy-gustiaux/default-bookmark-folder/issues/270)) ([71a9bc7](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/71a9bc7d71ff827338778dfe4b63994763c0cf6c))


## [2.12.1](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.12.0...v2.12.1) (2020-03-05)

### Bug Fixes

* browser action icon color for default theme ([257904e](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/257904e1621197f8880b5c481596e679c676f400))

# [2.12.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.11.0...v2.12.0) (2020-02-17)

### Features

* add German translation (thanks to @Mr-Update) ([2febf70](https://github.com/teddy-gustiaux/default-bookmark-folder/pull/143/commits/2febf70ac272075106482a1b17772c9b2afb168d))

### Bug Fixes

* add to top does not work with built-in bookmarking default location (close [#172](https://github.com/teddy-gustiaux/default-bookmark-folder/issues/172)) ([fd411c8](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/fd411c8c6bf0a5d7d6cc2e24ccf3c50d8c513186))

# [2.11.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.10.1...v2.11.0) (2019-12-17)

### Features

* display message when failing to save bookmark directly to folder ([649f00d](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/649f00d2fd653f1f6519d9bea38883404f2218c4))

### Bug Fixes

* manually added bookmarks in system folders moved to default folder ([cb1e8f7](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/cb1e8f754a4e2f0c7b79662470238a741ac97397))
* quick bookmarking to folder saving in wrong folder (close [#111](https://github.com/teddy-gustiaux/default-bookmark-folder/issues/111)) ([31b7fcc](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/31b7fccb9db5b62bf0eabb2ec78e6005941976ae))
* quick bookmarking to system folders failing when default folder on ([b0808d4](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/b0808d497bb4eab9cbc5ab39f4c823f67399380a))

## [2.10.1](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.10.0...v2.10.1) (2019-07-04)

### Bug Fixes

* copy for bookmarking of multiple tabs ([8fe0d2b](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/8fe0d2b))
* in add-on settings, move release notes section to the about section ([1dc0d1e](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/1dc0d1e))
* open add-on settings page on install ([fea376d](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/fea376d))
* option to show release notes on GitHub when the add-on is updated ([a938635](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/a938635))

# [2.10.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.9.0...v2.10.0) (2019-05-21)

### Features

* add support for "chrome://" URLs ([97a0a52](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/97a0a52))

# [2.9.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.8.0...v2.9.0) (2019-05-14)

### Features

* add dark theme to the add-on settings ([8a6c001](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/8a6c001))
* add dark theme to welcome message ([46a5a40](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/46a5a40))

### Bug Fixes

* bookmarking tabs not working properly in non-English UI (close [#56](https://github.com/teddy-gustiaux/default-bookmark-folder/issues/56)) ([4d9daf7](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/4d9daf7))
* hide the global notification as it does not give useful information ([742c265](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/742c265))
* insert SVG icons by creating proper elements ([d38313c](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/d38313c))
* make the options page responsive and improve dark theme ([b18961a](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/b18961a))
* new separator always added to default location (close [#44](https://github.com/teddy-gustiaux/default-bookmark-folder/issues/44)) ([5609cae](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/5609cae))
* replace red notification block by regular information message ([7c91801](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/7c91801))
* use SVG icons instead of Unicode characters ([0134689](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/0134689))

# [2.8.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.7.0...v2.8.0) (2019-04-13)

### Features

* update Russian translation (thanks to @Neytrino-OnLine) ([119764b](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/119764b))
* display the parent folder's title when searching (thanks to @JagdCake) ([129c8db](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/129c8db))

# [2.7.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.6.0...v2.7.0) (2019-02-13)

### Bug Fixes

* bug preventing to determine the supported status of the page ([378769a](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/378769a))

### Features

* add a browserAction (toolbar icon) ([7f0e34e](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/7f0e34e)), closes [#18](https://github.com/teddy-gustiaux/default-bookmark-folder/issues/18) [#11](https://github.com/teddy-gustiaux/default-bookmark-folder/issues/11)
* add top banner to popup (with button to access the settings) ([91c6023](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/91c6023))
* support 'about:' and 'moz-extension:' pages ([8e893f9](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/8e893f9))
* changelog is now accessible on GitHub ([866da8a](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/866da8a))
* add translation capabilities to the manifest ([b7954a9](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/b7954a9))
* add Russian translation (thanks to @Neytrino-OnLine, close [#46](https://github.com/teddy-gustiaux/default-bookmark-folder/issues/46)) ([b37c9b8](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/b37c9b8))

# [2.6.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.5.0...v2.6.0) (2018-11-07)

### Bug Fixes

* replace Font Awesome dependency by Unicode characters (GitHub issue #39)

### Features

* add back the option to show page as bookmarked only if all the bookmarks are in the defined folder (when using quick bookmark icon) (GitHub issue #38)
* add favicon to the options page (GitHub issue #40)

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

### Bug Fixes

* quick bookmarking of local files

### Features

* add support for Firefox Reader Mode - requires version 58 or later (GitHub issue #22)

# [2.2.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.1.2...v2.2.0) (2018-03-19)

### Bug Fixes

* hide quick bookmark icon automatically if option is enabled and then disabled
* consistency of the quick bookmark shortcut behavior
* avast add-on reputation - fixed internally by Avast (GitHub issue #14)

### Features

* select the default folder for "Bookmark All Tabs..." feature (GitHub issue #13)
* code refactoring and upgrade of internal libraries
* small wording updates of the add-on options

## [2.1.2](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.1.1...v2.1.2) (2017-12-23)

### Bug Fixes

* the built-in bookmarking features of the add-on now work normally on Firefox 56.x (GitHub issue #8)

## [2.1.1](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.1.0...v2.1.1) (2017-12-23)

### Bug Fixes

* the built-in shortcut and context menu bookmarking now use the defined location on Firefox stable version 57.x (GitHub issues #7 and #9)

# [2.1.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.0.0...v2.1.0) (2017-12-16)

### Bug Fixes

* tab drag and drop bookmarking and "Bookmark All Tabs..." features are now excluded from the overriding and behave normally (GitHub issue #5)

### Features

* select the color of the quick bookmark icon (among a list) when the current page is bookmarked
* higher quality quick bookmark icons
* release notes tab in the options

# [2.0.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v1.2.4...v2.0.0) (2017-12-03)

### Bug Fixes

* GitHub issue #3 (links to local files do not work properly)

### Features

* the settings now have a dedicated page
* the settings have been separated for more flexibility: you can now choose a different folder for the built-in bookmarking and for the quick bookmarking
* the quick bookmarking feature now has a dedicated shortcut (Alt+Shift+D)
* the settings are now save automatically on change

## [1.2.4](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v1.2.3...v1.2.4) (2017-11-16)

### Bug Fixes

* code improvements and bug fixes

### Features

* bookmarks can now be added to the top of the selected location if desired

## [1.2.3](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v1.2.2...v1.2.3) (2017-11-16)

### Bug Fixes

* better handling of manually created items (they will no longer be moved to the default folder if created manually at a specific location)

## [1.2.2](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v1.2.1...v1.2.2) (2017-11-05)

### Bug Fixes

* the selected folder is now properly displayed in the drop-down menu after reload (settings page)

## [1.2.1](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v1.1...v1.2.1) (2017-11-05)

### Bug Fixes

* GitHub issue #1: the configuration is now saved locally (settings might need to be set again)
* avoid moving manually created folders

### Features

* orange cross indicator for disabled "quick bookmark" icon (for Nightly users)

# [1.1.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v1.0...v1.1) (2017-11-03)

### Features

* better management of duplicate bookmarks
* improvement of the extension settings design

# 1.0.0 (2017-11-02)

### Features

* initial release


