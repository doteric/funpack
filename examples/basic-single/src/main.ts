// Check if nodejs internal modules resolve correctly
import { fileURLToPath } from 'url';
import { join } from 'node:path';

// Check if importing with package paths works correctly
import { AST_NODE_TYPES } from '@typescript-eslint/utils/dist/ts-estree';
import resolvePackagePath from 'resolve-package-path';

export const handler = (event: unknown) => {
  console.log('Hello world!', 'event:', event);

  const currentFilePath = fileURLToPath('.');
  const directoryPath = join(currentFilePath, '..');
  console.log(
    { currentFilePath, directoryPath },
    AST_NODE_TYPES,
    resolvePackagePath
  );

  return {
    status: 200,
  };
};
