import prepareFunctionPackageJson from './prepareFunctionPackageJson';

describe('prepareFunctionPackageJson', () => {
  it('returns ...', () => {
    const packageObject = prepareFunctionPackageJson({
      packages: ['esbuild', 'commander'],
      packageObject: {
        funpack: {
          settings: {
            // TODO: Prepare some default settings generator
            esbuildConfigOverride: {},
            outputDir: 'example/dist',
            zip: false,
            packageFieldsToCopy: [],
          },
          functions: {},
        },
      },
      mainPath: './index.js',
    });
    expect(packageObject).toEqual({
      dependencies: {
        commander: '9.3.0',
        esbuild: '0.14.43',
      },
      main: './index.js',
    });
  });
});
