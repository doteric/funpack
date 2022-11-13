import { join } from 'path';

import funpack from '../index';

process.env.GIT_REPO_URL = 'https://example.com/test/repo.git';

// TODO: Change to using full examples instead of mocking like that
jest.mock('../utils/getPackageJsonObject', () =>
  jest.fn().mockReturnValue({
    name: 'my-lambdas',
    version: '0.0.0-dev',
    type: 'module',
    funpack: {
      settings: {
        outputDir: 'example/dist-splitting',
        packageFieldsToCopy: ['version', 'type'],
        cleanupOutputDir: true,
        zip: true,
        esbuildConfigOverride: {
          format: 'esm',
          target: 'node16',
          splitting: true,
          sourcemap: true,
        },
      },
      functions: {
        firstSplit: './example/test.ts',
        secondSplit: './example/second.ts',
      },
    },
  })
);

describe('funpack', () => {
  console.log = jest.fn();
  it('builds correctly', async () => {
    await funpack();
    // TODO: Improve test case to check for files?
    expect(console.log).toHaveBeenCalledTimes(2);
    const logMock = console.log as jest.Mock;

    expect(logMock.mock.calls[0][0]).toBe(
      join('example', 'dist-splitting', 'secondSplit.zip')
    );
    expect(logMock.mock.calls[0][2]).toBeCloseTo(67352, -2);

    expect(logMock.mock.calls[1][0]).toBe(
      join('example', 'dist-splitting', 'firstSplit.zip')
    );
    expect(logMock.mock.calls[1][2]).toBeCloseTo(69275, -2);
  });
});
