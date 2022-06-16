import { writeFileSync } from 'fs';
import { join, normalize } from 'path';
import type { Metafile } from 'esbuild';

import type { PackageObjectType } from '../types';
import getImportedPackages from '../utils/getImportedPackages';
import prepareFunctionPackageJson from '../utils/prepareFunctionPackageJson';
import { error } from '../utils/messages';

const generatePackageJson = (
  metafile: Metafile,
  packageObject: PackageObjectType,
  outputFilePath: string,
  mainFilePath: string
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
  const packages = getImportedPackages(output.entryPoint, metafile);

  // Prepare package.json
  const preparedPackageJson = prepareFunctionPackageJson({
    packages,
    packageObject,
    mainPath: mainFilePath,
  });

  // Write package.json
  const path = normalize(join(outputFilePath, '..'));
  writeFileSync(
    join(path, 'package.json'),
    JSON.stringify(preparedPackageJson, null, 2)
  );
};

export default generatePackageJson;
