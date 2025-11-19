import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const getPackageJsonObject = (
  packageJsonPath: string = resolve(process.cwd(), 'package.json')
): Record<string, unknown> => {
  try {
    const packageJson = readFileSync(packageJsonPath, 'utf8');
    const packageObject = JSON.parse(packageJson);
    return packageObject;
  } catch (error) {
    console.error(`Failed to retrieve package.json for "${packageJsonPath}"`);
    throw error;
  }
};

export default getPackageJsonObject;
