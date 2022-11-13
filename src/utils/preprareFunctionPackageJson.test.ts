import parseConfig from '../parts/parseConfig';
import prepareFunctionPackageJson from './prepareFunctionPackageJson';

describe('prepareFunctionPackageJson', () => {
  it('returns ...', () => {
    const packageObjectMock = {
      funpack: parseConfig({
        functions: {},
        settings: { outputDir: 'example/dist', zip: false },
      }),
    };
    const packageObject = prepareFunctionPackageJson({
      packages: ['esbuild', 'commander'],
      packageObject: packageObjectMock,
      mainPath: './index.js',
    });
    expect(packageObject).toEqual({
      dependencies: {
        commander: '9.3.0',
        esbuild: '0.15.13',
      },
      main: './index.js',
    });
  });
});
