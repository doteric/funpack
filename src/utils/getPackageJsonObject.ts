import { readFileSync } from 'fs';
import { resolve } from 'path';

const getPackageJsonObject = (
  packageJsonPath: string = resolve(process.cwd(), 'package.json')
): Record<string, unknown> => {
  const packageJson = readFileSync(packageJsonPath, 'utf8');
  const packageObject = JSON.parse(packageJson);
  return packageObject;
};

export default getPackageJsonObject;
