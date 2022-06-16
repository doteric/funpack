jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
}));

import type { Metafile } from 'esbuild';
import { writeFileSync } from 'fs';
import { join } from 'path';

import generatePackageJson from './generatePackageJson';
import parseConfig from './parseConfig';

/*
  outputFilePath: 'test/path/index.js',
  outputFilePath: 'test2\path\index.js'
*/
describe('generatePackageJson', () => {
  const metafileMock: Metafile = {
    inputs: {
      'example/index.ts': {
        imports: [{ path: 'test/index.ts', kind: 'import-statement' }],
        bytes: 2000,
      },
      'test/index.ts': {
        imports: [],
        bytes: 100,
      },
    },
    outputs: {
      'test/path/index.js': {
        entryPoint: 'example/index.ts',
        bytes: 2100,
        inputs: {},
        imports: [],
        exports: [],
      },
    },
  };
  const packageObjectMock = {
    funpack: parseConfig({ functions: {}, settings: {} }),
  };

  it('calls writeFileSync with correct parameters', () => {
    generatePackageJson(
      metafileMock,
      packageObjectMock,
      'test/path/index.js',
      'index.js'
    );
    expect(writeFileSync).toBeCalledWith(
      join('test', 'path', 'package.json'),
      JSON.stringify(
        {
          main: 'index.js',
          dependencies: {},
        },
        null,
        2
      )
    );
  });

  it('calls writeFileSync with correct parameters for windows outputFilePath', () => {
    generatePackageJson(
      metafileMock,
      packageObjectMock,
      'test\\path\\index.js',
      'index.js'
    );
    expect(writeFileSync).toBeCalledWith(
      join('test', 'path', 'package.json'),
      JSON.stringify(
        {
          main: 'index.js',
          dependencies: {},
        },
        null,
        2
      )
    );
  });
});
