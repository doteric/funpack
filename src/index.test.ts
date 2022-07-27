import { join } from 'path';

import funpack from './index';

jest.mock('./utils/getPackageJsonObject', () =>
  jest.fn().mockReturnValue({
    name: 'my-lambdas',
    version: '0.0.0-dev',
    type: 'module',
    funpack: {
      settings: {
        outputDir: 'example/dist',
        packageFieldsToCopy: ['version', 'type'],
        cleanupOutputDir: true,
        zip: true,
        removeDirAfterZip: true,
      },
      functions: {
        testfunc: './example/test.ts',
        second: './example/second.ts',
      },
    },
  })
);

describe('funpack', () => {
  console.log = jest.fn();
  it('builds correctly', async () => {
    await funpack();
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toBeCalledWith(
      join('example', 'dist', 'testfunc.zip'),
      '-',
      20728,
      'total bytes'
    );
    expect(console.log).toBeCalledWith(
      join('example', 'dist', 'second.zip'),
      '-',
      20725,
      'total bytes'
    );
  });
});
