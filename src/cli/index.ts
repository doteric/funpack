#!/usr/bin/env node
import { program } from 'commander';
import funpack from '../index';

program.name('funpack').description('Function Packager');

program
  .option('-p, --packageJsonPath <path>')
  .option('-wd, --workingDirectory <path>')
  .action(async (options) => {
    const packageJsonPath: string | undefined = options.packageJsonPath;
    const workingDirectory: string | undefined = options.workingDirectory;
    await funpack({
      packageJsonPath,
      workingDirectory,
    });
  });

program.parse();
