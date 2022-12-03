import { join } from 'path';

jest.mock('fs', () => ({
  readFileSync: jest.fn((packageJsonPath: string) => {
    const packageJsonToVersionMap: Record<string, string> = {
      [join('node_modules', '@scoped', 'test', 'package.json')]: '1.2.3',
      [join('node_modules', 'test', 'package.json')]: '3.2.1',
      [join('node_modules', 'rimraf', 'package.json')]: '3.0.0',
      [join('..', 'node_modules', 'test', 'package.json')]: '2.1.3',
    };
    return JSON.stringify({
      version: packageJsonToVersionMap[packageJsonPath],
    });
  }),
}));

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
        'example/example.ts': {
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
          entryPoint: 'example/example.ts',
          inputs: {},
          bytes: 82693,
        },
      },
    };
    const packages = getImportedPackages('example/example.ts', metafileMock);
    expect(packages).toEqual({
      '@scoped/test': '1.2.3',
      rimraf: '3.0.0',
      test: '3.2.1',
    });
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
        'example/example.ts': {
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
          entryPoint: 'example/example.ts',
          inputs: {},
          bytes: 82693,
        },
      },
    };
    const packages = getImportedPackages('example/example.ts', metafileMock);
    expect(packages).toEqual({ test: '3.2.1' });
  });

  it('returns correctly when node_modules not in root dir', () => {
    const metafileMock: Metafile = {
      inputs: {
        '../node_modules/test/test.js': {
          bytes: 8866,
          imports: [],
        },
        'example/example.ts': {
          bytes: 130,
          imports: [
            {
              path: '../node_modules/test/test.js',
              kind: 'import-statement',
            },
          ],
        },
      },
      outputs: {
        'example/dist/testfunc.js': {
          imports: [],
          exports: [],
          entryPoint: 'example/example.ts',
          inputs: {},
          bytes: 82693,
        },
      },
    };
    const packages = getImportedPackages('example/example.ts', metafileMock);
    expect(packages).toEqual({ test: '2.1.3' });
  });
});
