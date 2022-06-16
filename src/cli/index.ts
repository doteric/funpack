import { program } from 'commander';
import funpack from '../index';

program.name('funpack').description('Function Packager');

program.option('-p, --packageJsonPath <path>').action(async (options) => {
  const packageJsonPath: string | undefined = options.packageJsonPath;
  await funpack(packageJsonPath);
});

program.parse();
