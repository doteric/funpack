import { readFileSync } from 'fs';
import { join } from 'path';

import type { PackageObjectType } from '../types';

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
  const dependencies: Record<string, string> = {};
  for (const packageName of packages) {
    const packageJsonPath = join('node_modules', packageName, 'package.json');
    const packageJson = readFileSync(packageJsonPath, {
      encoding: 'utf-8',
    });
    const version = JSON.parse(packageJson).version;
    dependencies[packageName] = version;
  }

  const fieldsToCopy = packageObject.funpack.settings.packageFieldsToCopy;
  const copiedFromMainPackage: Record<string, unknown> = {};
  for (const fieldName of fieldsToCopy) {
    copiedFromMainPackage[fieldName] = packageObject[fieldName];
  }

  return {
    ...copiedFromMainPackage,
    main: mainPath,
    dependencies,
  };
};

export default prepareFunctionPackageJson;
