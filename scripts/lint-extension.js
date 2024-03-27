import webExt from 'web-ext';
import { buildManifest } from './helpers/ManifestBuilder.js';

const target = process.argv[2];
const { sourceDir } = await buildManifest(target);

webExt.cmd.lint(
	{
		sourceDir,
	},
	{
		shouldExitProgram: true,
	},
);
