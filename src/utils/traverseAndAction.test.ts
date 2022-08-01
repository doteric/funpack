import traverseAndAction from './traverseAndAction';
import envVarReplace from './envVarReplace';

describe('traverseAndAction', () => {
  it('returns correctly updated object', () => {
    const action = (value: string) => value.replace('a', 'e');
    const newObject = traverseAndAction(
      {
        test: {
          example: 'aaaa',
        },
        test2: 'bba',
      },
      action
    );
    expect(newObject).toEqual({
      test: {
        example: 'eaaa',
      },
      test2: 'bbe',
    });
  });

  it('returns correcly when using env var replace', () => {
    process.env.EXAMPLE = 'test1';
    const newObject = traverseAndAction(
      {
        test: {
          example: '${EXAMPLE}',
        },
        test2: 'test:${EXAMPLE}',
      },
      envVarReplace
    );
    expect(newObject).toEqual({
      test: {
        example: 'test1',
      },
      test2: 'test:test1',
    });
  });

  it('returns correcly when using arrays and numbers', () => {
    process.env.EXAMPLE = 'test1';
    const newObject = traverseAndAction(
      {
        number: 1,
        array: ['test', '${EXAMPLE}'],
        arrayWithObjects: [{ test1: 'example', test2: '${EXAMPLE}' }],
        arrayWithArray: [[{ test: 'test' }, '${EXAMPLE}'], 'test'],
      },
      envVarReplace
    );
    expect(newObject).toEqual({
      number: 1,
      array: ['test', 'test1'],
      arrayWithObjects: [{ test1: 'example', test2: 'test1' }],
      arrayWithArray: [[{ test: 'test' }, 'test1'], 'test'],
    });
  });
});
