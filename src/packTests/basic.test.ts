import { join } from 'path';
import { readFileSync } from 'fs';

import funpack from '../index';

process.env.GIT_REPO_URL = 'https://example.com/test/repo.git';

jest.mock('../utils/getPackageJsonObject', () =>
  jest.fn().mockReturnValue({
    name: 'my-lambdas',
    version: '0.0.0-dev',
    funpack: {
      settings: {
        outputDir: 'example/dist',
        packageFieldsToCopy: ['version', 'type'],
        cleanupOutputDir: true,
        zip: true,
        //removeDirAfterZip: true,
        customPackageFields: {
          repository: {
            type: 'git',
            url: '${GIT_REPO_URL}',
          },
        },
      },
      functions: {
        testfunc: './example/example.ts',
        second: './example/second.ts',
      },
    },
  })
);

describe('funpack', () => {
  console.log = jest.fn();
  it('builds correctly', async () => {
    await funpack();
    const firstPackageJson = JSON.parse(
      readFileSync('example/dist/testfunc/package.json').toString()
    );
    expect(firstPackageJson).toMatchSnapshot();

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toBeCalledWith(
      join('example', 'dist', 'testfunc.zip'),
      '-',
      21199,
      'total bytes'
    );
    expect(console.log).toBeCalledWith(
      join('example', 'dist', 'second.zip'),
      '-',
      20876,
      'total bytes'
    );
  });
});
