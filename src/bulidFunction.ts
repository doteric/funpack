import type { BuildOptions } from 'esbuild';
import { join } from 'path';

import type { PackageObjectType } from './types';
import useEsbuild from './parts/esbuild';
import generatePackageJson from './parts/generatePackageJson';
import { error } from './utils/messages';
import zipDirectory from './parts/zipDirectory';

const OUTPUT_FILE_NAME = 'index';

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
    OUTPUT_FILE_NAME,
    esbuildConfig
  );

  // Get output file extension in case it was changed from the default (.js)
  const outputExtension = esbuildConfig.outExtension?.['.js'] || '.js';

  // Generate package.json
  const metafile = buildResult.metafile;
  if (!metafile) {
    error('Missing metafile in esbuild result!');
    return false;
  }

  const outputFilePath = join(
    outputDir,
    name,
    `${OUTPUT_FILE_NAME}${outputExtension}`
  );
  generatePackageJson(metafile, packageObject, outputFilePath);

  // Zip functions
  const shouldZip = packageObject.funpack.settings.zip;
  if (shouldZip) {
    const shouldRemoveDir = packageObject.funpack.settings.removeDirAfterZip;
    await zipDirectory(join(outputDir, name), shouldRemoveDir);
  }

  return buildResult;
};

export default buildFunction;
