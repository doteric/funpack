import type { Metafile } from 'esbuild';

import { error } from './messages';

const getPackageNameFromPath = (path: string) => {
  const importSplitPath = path.split('/');

  // If package is scoped the second part is the package name also
  if (importSplitPath[1].startsWith('@')) {
    return `${importSplitPath[1]}/${importSplitPath[2]}`;
  }

  return importSplitPath[1];
};

const getImportedPackages = (
  inputPath: string,
  metafile: Metafile,
  importChain: string[] = []
): string[] => {
  const input = metafile.inputs[inputPath];
  if (!input) {
    error(`Input for path ${inputPath} not found!`);
  }

  const importedPackages = new Set<string>();

  for (const inputImport of input.imports) {
    if (inputImport.path.startsWith('node_modules')) {
      const packageName = getPackageNameFromPath(inputImport.path);
      importedPackages.add(packageName);
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
      for (const packageName of packages) {
        importedPackages.add(packageName);
      }
    }
  }

  return Array.from(importedPackages);
};

export default getImportedPackages;
