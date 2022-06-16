import { rmSync, existsSync } from 'fs';

import validateConfig from './parts/parseConfig';
import getPackageJsonObject from './utils/getPackageJsonObject';
import buildFunction from './bulidFunction';

const funpack = async (packageJsonPath?: string) => {
  // Get package.json content
  const packageObject = getPackageJsonObject(packageJsonPath);

  // Parse funpack config from packageObject (with setting defaults)
  const config = validateConfig(packageObject.funpack);
  const packageObjectParsedConfig = {
    ...packageObject,
    funpack: config,
  };

  // Clean output directory
  const outputDir = packageObjectParsedConfig.funpack.settings.outputDir;
  if (existsSync(outputDir)) {
    rmSync(outputDir, { recursive: true });
  }

  // Prepare to build functions
  const functions = packageObjectParsedConfig.funpack.functions;
  const builds = [];
  for (const functionName in functions) {
    if (Object.prototype.hasOwnProperty.call(functions, functionName)) {
      const entrypoint = functions[functionName];
      const build = buildFunction(
        functionName,
        entrypoint,
        packageObjectParsedConfig
      );
      builds.push(build);
    }
  }

  // Build multiple functions in parallel
  await Promise.all(builds);
};

export default funpack;
