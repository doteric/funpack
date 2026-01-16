import { join, resolve } from 'node:path';

jest.mock('node:fs', () => ({
  readFileSync: jest.fn((packageJsonPath: string) => {
    const packageJsonMap: Record<string, { name: string; version: string }> = {
      [join('node_modules', '@scoped', 'test', 'package.json')]: {
        name: '@scoped/test',
        version: '1.2.3',
      },
      [join('node_modules', 'test', 'package.json')]: {
        name: 'test',
        version: '3.2.1',
      },
      [join('node_modules', 'rimraf', 'package.json')]: {
        name: 'rimraf',
        version: '3.0.0',
      },
      [join('..', 'node_modules', 'test', 'package.json')]: {
        name: 'test',
        version: '2.1.3',
      },
      [resolve(join('node_modules', 'rimraf', 'package.json'))]: {
        name: 'rimraf',
        version: '4.4.4',
      },
      [resolve(join('node_modules', '@types', 'archiver', 'package.json'))]: {
        name: '@types/archiver',
        version: '1.2.3',
      },
      [resolve(join('node_modules', 'archiver', 'package.json'))]: {
        name: 'archiver',
        version: '3.2.1',
      },
    };
    return JSON.stringify(packageJsonMap[packageJsonPath]);
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
          bytes: 866,
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

  it('returns correct package list for new esbuild external true', () => {
    const metafileMock: Metafile = {
      inputs: {
        'node_modules/@scoped/test/main.js': { bytes: 19445, imports: [] },
        'node_modules/glob/glob.js': { bytes: 19445, imports: [] },
        'node_modules/test/test.js': { bytes: 19445, imports: [] },
        'node_modules/rimraf/rimraf.js': {
          bytes: 866,
          imports: [
            {
              path: 'glob',
              kind: 'import-statement',
              external: true,
            },
          ],
        },
        'example/second.ts': {
          bytes: 158,
          imports: [
            {
              path: 'rimraf',
              kind: 'import-statement',
              external: true,
            },
            {
              path: '@types/archiver',
              kind: 'import-statement',
              external: true,
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
              path: 'archiver',
              kind: 'import-statement',
              external: true,
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
      '@types/archiver': '1.2.3',
      rimraf: '4.4.4',
      archiver: '3.2.1',
    });
  });

  it('skips relative specifiers marked as external', () => {
    const metafileMock: Metafile = {
      inputs: {
        '../../../common/slack/parseMiddleware.js': {
          bytes: 1000,
          imports: [],
        },
        'example/example.ts': {
          bytes: 130,
          imports: [
            {
              path: '../../../common/slack/parseMiddleware.js',
              kind: 'import-statement',
              external: true,
            },
            {
              path: 'archiver',
              kind: 'import-statement',
              external: true,
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
      archiver: '3.2.1',
    });
  });
});
