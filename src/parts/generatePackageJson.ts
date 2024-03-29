import { writeFileSync } from 'fs';
import { join, normalize, basename } from 'path';
import type { Metafile } from 'esbuild';

import type { PackageObjectType } from '../types';
import getImportedPackages from '../utils/getImportedPackages';
import prepareFunctionPackageJson from '../utils/prepareFunctionPackageJson';
import { error } from '../utils/messages';

const generatePackageJson = (
  metafile: Metafile,
  packageObject: PackageObjectType,
  outputFilePath: string
) => {
  // List used packages of output
  const output =
    metafile.outputs[outputFilePath] ||
    metafile.outputs[outputFilePath.replaceAll('\\', '/')]; // For Windows
  if (!output) {
    console.warn('Metafile outputs:', metafile.outputs);
    error('Missing output in metafile for path:', outputFilePath);
    return;
  }

  if (!output.entryPoint) {
    error('Entrypoint of output not defined!');
    return;
  }
  const dependencies = getImportedPackages(output.entryPoint, metafile);

  // Get main file path
  const mainFile = basename(outputFilePath);
  if (!mainFile) {
    error('Could not retrieve file name from path:', outputFilePath);
    return;
  }

  // Prepare package.json
  const preparedPackageJson = prepareFunctionPackageJson({
    dependencies,
    packageObject,
    mainPath: mainFile,
  });

  // Write package.json
  const path = normalize(join(outputFilePath, '..'));
  writeFileSync(
    join(path, 'package.json'),
    JSON.stringify(preparedPackageJson, null, 2)
  );
};

export default generatePackageJson;
