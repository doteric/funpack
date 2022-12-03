import { readFileSync } from 'fs';
import { join } from 'path';
import type { Metafile } from 'esbuild';

import { error } from './messages';

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

const getPackageVersion = (importPath: string, packageName: string) => {
  const packagePathEndIndex =
    importPath.indexOf(packageName) + packageName.length;
  const packageJsonPath = join(
    importPath.slice(0, packagePathEndIndex),
    'package.json'
  );
  const packageJson = readFileSync(packageJsonPath, {
    encoding: 'utf-8',
  });
  return JSON.parse(packageJson).version;
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
    if (inputImport.path.includes(nodeModulesDirName)) {
      const packageName = getPackageNameFromPath(inputImport.path);
      if (!importedPackages[packageName]) {
        const version = getPackageVersion(inputImport.path, packageName);
        importedPackages[packageName] = version;
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
