import type { Metafile } from 'esbuild';

const getPackageNameFromPath = (path: string) => {
  const importSplitPath = path.split('/');

  // If package is scoped the second part is the package name also
  if (importSplitPath[1].startsWith('@')) {
    return `${importSplitPath[1]}/${importSplitPath[2]}`;
  }

  return importSplitPath[1];
};

const getImportedPackages = (path: string, metafile: Metafile): string[] => {
  const inputs = metafile.inputs[path];

  const importedPackages = new Set<string>();

  for (const inputImport of inputs.imports) {
    if (inputImport.path.startsWith('node_modules')) {
      const packageName = getPackageNameFromPath(inputImport.path);
      importedPackages.add(packageName);
    } else {
      const packages = getImportedPackages(inputImport.path, metafile);
      for (const packageName of packages) {
        importedPackages.add(packageName);
      }
    }
  }

  return Array.from(importedPackages);
};

export default getImportedPackages;
