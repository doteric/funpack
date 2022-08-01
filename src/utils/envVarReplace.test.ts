import envVarReplace from './envVarReplace';

describe('envVarStringReplace', () => {
  process.env.TEST_EXAMPLE = 'test';
  process.env.SECOND_EXAMPLE = 'example1';
  it('returns correctly for a string with just a variable', () => {
    const value = envVarReplace('${TEST_EXAMPLE}');
    expect(value).toBe('test');
  });

  it('returns correctly for a string with a variable and custom text', () => {
    const value = envVarReplace('${TEST_EXAMPLE}-example');
    expect(value).toBe('test-example');
  });

  it('returns correctly for a string with two variables', () => {
    const value = envVarReplace('${TEST_EXAMPLE}-${SECOND_EXAMPLE}');
    expect(value).toBe('test-example1');
  });
});
