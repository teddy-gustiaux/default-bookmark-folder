import * as path from 'node:path';
import webExt from 'web-ext';
import { buildManifest } from './helpers/ManifestBuilder.js';

const target = process.argv[2];
const isDevelopmentMode = process.argv[3] === 'debug';
const { browser, sourceDir } = await buildManifest(target, isDevelopmentMode);

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
