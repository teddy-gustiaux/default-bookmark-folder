# Default Bookmark Folder Changelog

All notable changes to this project are documented in this file.

> 🛈 No longer want to see this page when the add-on is updated?
>
> Go to the add-on settings, and uncheck the option *`Show the release notes on GitHub when the add-on is updated`* in the `About` section.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Additionally, the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) format is respected and used to generate this [conventional changelog](https://github.com/conventional-changelog/conventional-changelog).

# [4.0.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v3.1.0...v4.0.0) (2024-03-25)

### BREAKING CHANGES

The add-on will now officially support only versions of Firefox that are equal or more recent that the current [Extended Support Release (ESR)](https://support.mozilla.org/en-US/kb/choosing-firefox-update-channel).
As of this release, that means versions `115.x` and above are supported.

Additionally, a lot of work has been done on the internals of the add-on to try and fix (or at least improve) some of the issues introduced with the `3.x` branch of the add-on (and themselves related to the internal bookmarking changes that happened back then in Firefox).

While this should provide a better user experience, it also means the internal logic to identify which bookmarks to process and how has changed significantly, and this is made explicit via the major version number.

* update minimum Firefox version to current ESR branch ([87b862e](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/87b862ee913edae1668764f22b3ef66517858d03))
* refactoring of the code to prevent processing bookmark that should not be (and re-organization of the add-on's structure) ([725213f](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/725213febea6b467b152e075f778bf888ec6b24e))

### Features

* update bookmark tree in real-time on options page if there is any folder-related changes ([2cfd4b7](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/2cfd4b7ea94f10ae8948d4c9d9509cb969f0c26f))
* automatic dark mode for settings page  ([422470b](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/422470bd3b216b96a99c450576f432d6900f53d8))
* automatic dark mode for quick bookmarking to folder popup ([cfc0a2d](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/cfc0a2dcf30619773ac5ba8545dfe8bccc74cf13))

### Bug Fixes

* better handling for drag-and-drop ([49ed724](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/49ed7243796871ae6267de6ec7c9acfbaaf21c31))
* do not apply add-on logic when bookmark is created for a page different than the current one ([270025d](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/270025d128406b7fb0cbddd060584c4572cc6550))
* do not update last used folder when importing bookmarks ([09ed406](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/09ed406730d43af8088b55fa235feef9892abe0e))
* inbox mode consistently creating bookmarks (now limiting to a single one) ([48c94ba](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/48c94ba97644a86d2d688ede772709de8e63df3b))
* allow removal of multiple bookmarks via page context menu even if inbox mode is enabled ([95fc6a2](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/95fc6a263f267d2b5474aa781469e4ea775e31cb))
* update copy to be more accurate regarding how the feature works ([fbde721](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/fbde721619fc5355eaabe067f8aa2c115921b8b6))
* various UI and copy improvements
* various code cleanup

# [3.1.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v3.0.0...v3.1.0) (2021-01-26)

### Features

* update Hungarian translation (thanks to @efi99) ([4d525b6](https://github.com/teddy-gustiaux/default-bookmark-folder/pull/392/commits/4d525b672e0d63b02831c10c743a7d99579d6e2f))

### Bug Fixes

* bookmark added at wrong index (closes [#405](https://github.com/teddy-gustiaux/default-bookmark-folder/issues/405)) ([f988f1f](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/f988f1f2196099eb952bd1f345b96d155feaf87b))

# [3.0.0](https://github.com/teddy-gustiaux/default-bookmark-folder/compare/v2.13.0...v3.0.0) (2021-01-25)

### BREAKING CHANGES

* bookmarks created by drag-and-drop will automatically be moved to the configured default folder (if option is enabled) instead of staying where dragged (moving bookmarks is not affected).

This regression cannot be fixed in the current state of the APIs.
See [#399](https://github.com/teddy-gustiaux/default-bookmark-folder/issues/399).

### Bug Fixes

* support Firefox internal changes related to "2020H2 bookmarks improvements" ([da2e46a](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/da2e46a4a95e34ff9695d587741a80970ee93819)), closes [#356](https://github.com/teddy-gustiaux/default-bookmark-folder/issues/356) [#399](https://github.com/teddy-gustiaux/default-bookmark-folder/issues/399) [#400](https://github.com/teddy-gustiaux/default-bookmark-folder/issues/400)
* remove notes regarding default folders and add link to known issues ([ca2cc07](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/ca2cc076c8864f13d1218a58ff3131e348a093c3))
* retain position when drag-and-dropping new bookmark ([28d6b85](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/28d6b85af791e09d82631a4d062ebc94db27fb79))
* keeping index even if "0" when moving bookmarks ([cf4655e](https://github.com/teddy-gustiaux/default-bookmark-folder/commit/cf4655e2b7795f4fe6e1c1196086ec8369685683))

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


