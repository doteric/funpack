import type { BuildOptions } from 'esbuild';
import { join } from 'path';

import type { PackageObjectType } from './types';
import useEsbuild from './parts/esbuild';
import generatePackageJson from './parts/generatePackageJson';
import { error } from './utils/messages';
import zipDirectory from './parts/zipDirectory';

const OUTPUT_FILE_NAME = 'index.js';

const buildFunction = async (
  name: string,
  entrypoint: string,
  packageObject: PackageObjectType
) => {
  const esbuildConfig: BuildOptions =
    packageObject.funpack.settings.esbuildConfigOverride;
  const outputDir = packageObject.funpack.settings.outputDir;
  const functionOutputDir = join(outputDir, name);

  // Use esbuild to compile the function
  const buildResult = await useEsbuild(
    entrypoint,
    functionOutputDir,
    OUTPUT_FILE_NAME.replace('.js', ''),
    esbuildConfig
  );

  // Generate package.json
  const metafile = buildResult.metafile;
  if (!metafile) {
    error('Missing metafile in esbuild result!');
    return false;
  }
  const outputFilePath = join(outputDir, name, OUTPUT_FILE_NAME);
  generatePackageJson(
    metafile,
    packageObject,
    outputFilePath,
    OUTPUT_FILE_NAME
  );

  // Zip functions
  const shouldZip = packageObject.funpack.settings.zip;
  if (shouldZip) {
    const shouldRemoveDir = packageObject.funpack.settings.removeDirAfterZip;
    await zipDirectory(join(outputDir, name), shouldRemoveDir);
  }

  return buildResult;
};

export default buildFunction;
