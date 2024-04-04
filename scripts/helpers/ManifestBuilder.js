import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';
import merge from 'lodash.merge';

class ManifestBuilder {
	static FIREFOX = 'firefox';

	static CHROME = 'chrome';

	get baseValues() {
		return {
			manifest_version: 2,
			name: `Default Bookmark Folder${this.developmentMode ? ' [DEV]' : ''}`,
			author: 'Teddy Gustiaux',
			version: '4.0.0',
			description: '__MSG_manifest_extension_description__',
			homepage_url: 'https://github.com/teddy-gustiaux/default-bookmark-folder',
			default_locale: 'en',
			permissions: ['bookmarks', 'activeTab', 'tabs', 'storage', 'menus'],
			page_action: {
				default_icon: {
					16: 'images/icons/cross/cross-16.png',
					24: 'images/icons/cross/cross-24.png',
					32: 'images/icons/cross/cross-32.png',
					48: 'images/icons/cross/cross-48.png',
					64: 'images/icons/cross/cross-64.png',
					96: 'images/icons/cross/cross-96.png',
					128: 'images/icons/cross/cross-128.png',
					256: 'images/icons/cross/cross-256.png',
					512: 'images/icons/cross/cross-512.png',
					1024: 'images/icons/cross/cross-1024.png',
				},
				default_title: '__MSG_manifest_page_action_default_title__',
			},
			browser_action: {
				default_icon: 'images/icons/browser-action/icon-for-dark-text.svg',
				theme_icons: [
					{
						light: 'images/icons/browser-action/icon-for-light-text.svg',
						dark: 'images/icons/browser-action/icon-for-dark-text.svg',
						size: 16,
					},
					{
						light: 'images/icons/browser-action/icon-for-light-text.svg',
						dark: 'images/icons/browser-action/icon-for-dark-text.svg',
						size: 32,
					},
				],
				default_popup: 'views/popup.html',
			},
			icons: {
				16: 'images/icons/logo/default-bookmark-folder-16.png',
				24: 'images/icons/logo/default-bookmark-folder-24.png',
				32: 'images/icons/logo/default-bookmark-folder-32.png',
				48: 'images/icons/logo/default-bookmark-folder-48.png',
				64: 'images/icons/logo/default-bookmark-folder-64.png',
				96: 'images/icons/logo/default-bookmark-folder-96.png',
				128: 'images/icons/logo/default-bookmark-folder-128.png',
				256: 'images/icons/logo/default-bookmark-folder-256.png',
				512: 'images/icons/logo/default-bookmark-folder-512.png',
				1024: 'images/icons/logo/default-bookmark-folder-1024.png',
			},
			background: {
				scripts: [
					'scripts/constants.js',

					'scripts/utils/Logger.js',
					'scripts/utils/Utils.js',
					'scripts/utils/BrowserAction.js',
					'scripts/utils/PageAction.js',
					'scripts/utils/ContextMenus.js',

					'scripts/components/Options.js',
					'scripts/components/Update.js',
					'scripts/components/WebPage.js',
					'scripts/components/Interface.js',

					'scripts/bookmarking/BuiltinBookmarking.js',
					'scripts/bookmarking/QuickBookmarking.js',
					'scripts/bookmarking/BookmarkingHistory.js',
					'scripts/bookmarking/BookmarkingGatekeeper.js',

					'scripts/components/Orchestrator.js',
					'scripts/components/Global.js',

					'scripts/bootstrap.js',
					'scripts/background/background.js',
				],
			},
			options_ui: {
				page: 'views/options.html',
				open_in_tab: true,
			},
			commands: {
				'quick-bookmark': {
					suggested_key: {
						default: 'Alt+Shift+D',
					},
					description: '__MSG_manifest_shortcut_quick_bookmark_description__',
				},
				_execute_browser_action: {
					suggested_key: {
						default: 'Alt+Shift+M',
					},
					description: '__MSG_manifest_shortcut_browser_action_description__',
				},
			},
		};
	}

	get firefoxValues() {
		return {
			browser_specific_settings: {
				gecko: {
					id: 'default-bookmark-folder@gustiaux.com',
					strict_min_version: '115.0',
				},
			},
		};
	}

	get firefoxDevelopmentValues() {
		return {
			browser_action: {
				default_area: 'navbar',
			},
		};
	}

	get chromeTranslations() {
		return {};
	}

	constructor(target, location, developmentMode) {
		const targets = [ManifestBuilder.FIREFOX, ManifestBuilder.CHROME];
		if (targets.includes(target)) this.target = target;
		this.location = location;
		this.developmentMode = developmentMode;
	}

	#translateKeys(objectToProcess, translations) {
		for (const [original, replacement] of Object.entries(translations)) {
			if (typeof replacement === 'object' && replacement !== null) {
				objectToProcess[original] = {
					...this.#translateKeys(objectToProcess[original], replacement),
				};
			} else {
				if (replacement !== null) {
					objectToProcess[replacement] = { ...objectToProcess[original] };
				}
				delete objectToProcess[original];
			}
		}
		return objectToProcess;
	}

	#makeForFirefox() {
		return merge({ ...this.baseValues, ...this.firefoxValues}, this.firefoxDevelopmentValues);
	}

	#makeForChrome() {
		const manifest = this.#makeForFirefox();
		return this.#translateKeys(manifest, this.chromeTranslations);
	}

	async make() {
		let manifest = null;
		if (this.target === ManifestBuilder.FIREFOX) {
			manifest = this.#makeForFirefox();
		} else if (this.target === ManifestBuilder.CHROME) {
			manifest = this.#makeForChrome();
		}

		if (manifest !== null) {
			await fs.writeFile(this.location, JSON.stringify(manifest, null, 4));
		}
	}
}

const buildManifest = async (target, developmentMode = false) => {
	const currentDirectory = url.fileURLToPath(new URL('.', import.meta.url));
	const sourceDir = path.resolve(currentDirectory, '../../', 'src/');
	const browser =
		target === ManifestBuilder.CHROME ? ManifestBuilder.CHROME : ManifestBuilder.FIREFOX;

	const builder = new ManifestBuilder(browser, path.join(sourceDir, '/manifest.json'), developmentMode);
	await builder.make();

	let specificOptions = {};
	if (browser === ManifestBuilder.FIREFOX) {
		specificOptions = {
			firefox: target,
		};
	} else {
		specificOptions = {
			target: 'chromium',
		};
	}

	return {
		browser,
		sourceDir,
	};
};

export { ManifestBuilder, buildManifest };
