import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import funpack from '../src';

const directories = [
  {
    dir: 'basic-multi',
    expectedOutput: [
      { name: 'functionOne', zip: { approxSize: 854 } },
      { name: 'functionTwo', zip: { approxSize: 856 } },
    ],
  },
  {
    dir: 'basic-single',
    expectedOutput: [{ name: 'main', zip: { approxSize: 7400 } }],
  },
  {
    dir: 'mjs-extension',
    expectedOutput: [{ name: 'example', zip: { approxSize: 701 } }],
  },
  {
    dir: 'module-splitting',
    expectedOutput: [
      { name: 'exampleTwo', zip: { approxSize: 432 } },
      { name: 'exampleOne', zip: { approxSize: 21868 } },
    ],
  },
  {
    dir: 'circular-dependency',
    expectedOutput: [{ name: 'main', zip: { approxSize: 899 } }],
  },
];

describe('examples', () => {
  const rootDir = process.cwd();
  afterEach(() => {
    process.chdir(rootDir);
  });
  for (const dirSettings of directories) {
    const { dir, expectedOutput } = dirSettings;
    it(`"${dir}" packages correctly`, async () => {
      console.log = jest.fn();
      process.chdir(`./examples/${dir}`);

      await funpack();

      // TODO: Improve test case to check for files?
      expect(console.log).toHaveBeenCalledTimes(expectedOutput.length);
      const logMock = console.log as jest.Mock;

      for (const expected of expectedOutput) {
        const packageJson = JSON.parse(
          readFileSync(join('dist', expected.name, 'package.json')).toString()
        );
        expect(packageJson).toMatchSnapshot();

        const foundCall = logMock.mock.calls.find((params) =>
          params[0].includes(expected.name)
        );

        expect(foundCall[0]).toBe(join('dist', `${expected.name}.zip`));
        expect(foundCall[2]).toBeCloseTo(expected.zip.approxSize, -2);
      }
    });
  }
});
