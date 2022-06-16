import type { Metafile } from 'esbuild';
import getImportedPackages from './getImportedPackages';

describe('getImportedPackages', () => {
  it('returns correct package list', () => {
    const metafileMock: Metafile = {
      inputs: {
        'node_modules/@scoped/test/main.js': { bytes: 19445, imports: [] },
        'node_modules/glob/glob.js': { bytes: 19445, imports: [] },
        'node_modules/test/test.js': { bytes: 19445, imports: [] },
        'node_modules/rimraf/rimraf.js': {
          bytes: 8866,
          imports: [
            {
              path: 'node_modules/glob/glob.js',
              kind: 'import-statement',
            },
          ],
        },
        'example/second.ts': {
          bytes: 158,
          imports: [
            {
              path: 'node_modules/rimraf/rimraf.js',
              kind: 'import-statement',
            },
            {
              path: 'node_modules/@scoped/test/main.js',
              kind: 'import-statement',
            },
          ],
        },
        'example/test.ts': {
          bytes: 130,
          imports: [
            {
              path: 'example/second.ts',
              kind: 'import-statement',
            },
            {
              path: 'node_modules/test/test.js',
              kind: 'import-statement',
            },
          ],
        },
      },
      outputs: {
        'example/dist/testfunc.js': {
          imports: [],
          exports: [],
          entryPoint: 'example/test.ts',
          inputs: {},
          bytes: 82693,
        },
      },
    };
    const packages = getImportedPackages('example/test.ts', metafileMock);
    expect(packages).toEqual(['rimraf', '@scoped/test', 'test']);
  });

  it('returns correctly when same package used multiple times', () => {
    const metafileMock: Metafile = {
      inputs: {
        'node_modules/test/test.js': {
          bytes: 8866,
          imports: [],
        },
        'example/second.ts': {
          bytes: 158,
          imports: [
            {
              path: 'node_modules/test/test.js',
              kind: 'import-statement',
            },
          ],
        },
        'example/test.ts': {
          bytes: 130,
          imports: [
            {
              path: 'example/second.ts',
              kind: 'import-statement',
            },
            {
              path: 'node_modules/test/test.js',
              kind: 'import-statement',
            },
          ],
        },
      },
      outputs: {
        'example/dist/testfunc.js': {
          imports: [],
          exports: [],
          entryPoint: 'example/test.ts',
          inputs: {},
          bytes: 82693,
        },
      },
    };
    const packages = getImportedPackages('example/test.ts', metafileMock);
    expect(packages).toEqual(['test']);
  });
});
