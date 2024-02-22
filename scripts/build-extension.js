import * as path from 'node:path';
import webExt from 'web-ext';
import { buildManifest } from './helpers/ManifestBuilder.js';

const target = process.argv[2];
const { browser, sourceDir } = await buildManifest(target);

webExt.cmd.build(
	{
		sourceDir,
		overwriteDest: true,
		artifactsDir: path.join(sourceDir.replace('src', 'dist'), browser),
	},
	{
		shouldExitProgram: true,
	},
);
