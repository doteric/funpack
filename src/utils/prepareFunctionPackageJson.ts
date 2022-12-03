import type { PackageObjectType } from '../types';
import traverseAndAction from './traverseAndAction';
import envVarReplace from './envVarReplace';

interface ParamsType {
  dependencies: Record<string, string>;
  packageObject: PackageObjectType;
  mainPath: string;
}

const prepareFunctionPackageJson = ({
  dependencies,
  packageObject,
  mainPath,
}: ParamsType): Record<string, unknown> => {
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
