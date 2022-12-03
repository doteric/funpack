import parseConfig from '../parts/parseConfig';
import prepareFunctionPackageJson from './prepareFunctionPackageJson';

describe('prepareFunctionPackageJson', () => {
  it('returns correct package.json for function', () => {
    const packageObjectMock = {
      funpack: parseConfig({
        functions: {},
        settings: { outputDir: 'example/dist', zip: false },
      }),
    };
    const packageObject = prepareFunctionPackageJson({
      dependencies: {
        esbuild: '0.15.13',
        commander: '9.3.0',
      },
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
