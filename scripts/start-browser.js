import webExt from 'web-ext';
import { ManifestBuilder, buildManifest } from './helpers/ManifestBuilder.js';

const target = process.argv[2];
const { browser, sourceDir } = await buildManifest(target, true);

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

webExt.cmd.run(
	{
		...specificOptions,
		sourceDir,
		devtools: true,
		pref: {
			'browser.toolbars.bookmarks.visibility': 'always',
		},
	},
	{
		shouldExitProgram: true,
	},
);
