import { readFileSync } from 'fs';
import { join } from 'path';

import type { PackageObjectType } from '../types';
import traverseAndAction from './traverseAndAction';
import envVarReplace from './envVarReplace';

interface ParamsType {
  packages: string[];
  packageObject: PackageObjectType;
  mainPath: string;
}

const prepareFunctionPackageJson = ({
  packages,
  packageObject,
  mainPath,
}: ParamsType): Record<string, unknown> => {
  // Get used dependencies and their versions
  const dependencies: Record<string, string> = {};
  for (const packageName of packages) {
    const packageJsonPath = join('node_modules', packageName, 'package.json');
    const packageJson = readFileSync(packageJsonPath, {
      encoding: 'utf-8',
    });
    const version = JSON.parse(packageJson).version;
    dependencies[packageName] = version;
  }

  // Copy fields from root package.json
  const fieldsToCopy = packageObject.funpack.settings.packageFieldsToCopy;
  const copiedFromMainPackage: Record<string, unknown> = {};
  for (const fieldName of fieldsToCopy) {
    copiedFromMainPackage[fieldName] = packageObject[fieldName];
  }

  // Set specific vars or static strings to specified package.json fields
  const customPackageFields =
    packageObject.funpack.settings.customPackageFields;
  const customObject = traverseAndAction(
    customPackageFields,
    envVarReplace
  ) as typeof customPackageFields;

  return {
    ...copiedFromMainPackage,
    ...customObject,
    main: mainPath,
    dependencies,
  };
};

export default prepareFunctionPackageJson;
