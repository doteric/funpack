import funpack from './index';

// TODO: Mock esbuild?

jest.mock('./utils/getPackageJsonObject', () =>
  jest.fn().mockReturnValue({
    name: 'my-lambdas',
    version: '0.0.0-dev',
    type: 'module',
    funpack: {
      settings: {
        outputDir: 'example/dist',
        packageFieldsToCopy: ['version', 'type'],
        zip: true,
      },
      functions: {
        testfunc: './example/test.ts',
        second: './example/second.ts',
      },
    },
  })
);

describe('funpack', () => {
  it('builds correctly', async () => {
    await funpack();
    expect(true).toBeTruthy();
  });
});
