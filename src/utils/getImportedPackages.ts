import { join } from 'node:path';
import { builtinModules } from 'node:module';
import resolvePackagePath from 'resolve-package-path';
import type { Metafile } from 'esbuild';

import { error } from './messages';
import getPackageJsonObject from './getPackageJsonObject';

const nodeModulesDirName = 'node_modules';

const getPackageNameFromPath = (path: string) => {
  const importSplitPath = path.split('/');
  const nodeModulesIndex = importSplitPath.indexOf(nodeModulesDirName);

  // If package is scoped the second part is the package name also
  if (importSplitPath[nodeModulesIndex + 1].startsWith('@')) {
    return importSplitPath
      .slice(nodeModulesIndex + 1, nodeModulesIndex + 3)
      .join('/');
  }

  return importSplitPath[nodeModulesIndex + 1];
};

type PackageDetailsType = {
  name: string;
  version: string;
};
// Non-arrow function due to "asserts" usage
function validateAndNarrowPackageObject(
  obj: Record<string, unknown>,
  packageJsonPath: string
): asserts obj is PackageDetailsType {
  if (!obj.name || typeof obj.name !== 'string') {
    throw error(`Could not extract package name from "${packageJsonPath}"`);
  }
  if (!obj.version || typeof obj.version !== 'string') {
    throw error(`Could not extract package version from "${packageJsonPath}"`);
  }
}
const getPackageDetails = (packageJsonPath: string) => {
  const packageObject = getPackageJsonObject(packageJsonPath);
  validateAndNarrowPackageObject(packageObject, packageJsonPath);
  return packageObject;
};

const getImportedPackages = (
  inputPath: string,
  metafile: Metafile,
  importChain: string[] = []
): Record<string, string> => {
  const input = metafile.inputs[inputPath];
  if (!input) {
    error(`Input for path "${inputPath}" not found!`);
  }

  const importedPackages: Record<string, string> = {};

  for (const inputImport of input.imports) {
    /* example inputImport:
      {
        path: '../../node_modules/resolve-package-path/lib/index.js',
        kind: 'import-statement',
        original: 'resolve-package-path'
      }
    */
    // TODO: Extract to separate file and add full tests for various scenarios
    if (inputImport.external === true) {
      const packageName = inputImport.path.startsWith('@')
        ? inputImport.path.split('/').slice(0, 2).join('/')
        : inputImport.path.split('/')[0];

      // Check if package is node internal module
      const moduleName = packageName.startsWith('node:')
        ? packageName.replace('node:', '')
        : packageName;

      if (builtinModules.includes(moduleName)) {
        continue;
      }

      // Find package.json path
      const baseDir = process.cwd();
      const packageJsonPath = resolvePackagePath(packageName, baseDir);
      if (!packageJsonPath) {
        error(
          `Could not resolve package.json path for "${packageName}" with base dir "${baseDir}"`,
          'inputImport:',
          JSON.stringify(inputImport)
        );
        // Error thrown inside error function already (TODO: To be adjusted in the future)
        continue;
      }

      const { name, version } = getPackageDetails(packageJsonPath);

      if (importedPackages[name]) {
        if (importedPackages[name] !== version) {
          console.warn(
            `Package "${name}" already present, but with a different version, "${importedPackages[name]}" and "${version}"!`
          );
        }
      } else {
        importedPackages[name] = version;
      }
    } else if (inputImport.path.includes(nodeModulesDirName)) {
      // Legacy way to get package.json
      // This is still used in monorepos that use top level packages for example?
      const packageName = getPackageNameFromPath(inputImport.path);
      if (!importedPackages[packageName]) {
        const packagePathEndIndex =
          inputImport.path.indexOf(packageName) + packageName.length;
        const packageJsonPath = join(
          inputImport.path.slice(0, packagePathEndIndex),
          'package.json'
        );

        const { name, version } = getPackageDetails(packageJsonPath);
        importedPackages[name] = version;
      }
    } else {
      const updatedImportChain = [...importChain, inputImport.path];

      // Check for circular dependency
      if (importChain.includes(inputImport.path)) {
        console.warn(
          'Circular dependency detected! Chain:',
          updatedImportChain
        );
        continue;
      }

      // Check imports of specified path
      const packages = getImportedPackages(
        inputImport.path,
        metafile,
        updatedImportChain
      );
      for (const packageName in packages) {
        if (
          Object.prototype.hasOwnProperty.call(packages, packageName) &&
          !importedPackages[packageName]
        ) {
          const version = packages[packageName];
          importedPackages[packageName] = version;
        }
      }
    }
  }

  return importedPackages;
};

export default getImportedPackages;
