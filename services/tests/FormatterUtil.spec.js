import FormatterUtil from '../src/utils/FormatterUtil';

describe('FormatterUtil', () => {

  const sentence = 'quick brown fox jumps over the lazy dog.';
  const pascalCaseTest = 'UserActionRequired';

  it('Capitalizes first letter in sentence', () => {
    expect(FormatterUtil.capitalizeSentence(sentence))
      .toBe('Quick brown fox jumps over the lazy dog.');
  });

  it('Separates PascalCase words using space', () => {
    expect(FormatterUtil.separatePascalCase(pascalCaseTest))
      .toBe('User Action Required');
  });

  it('Joins string array with space', () => {
    expect(FormatterUtil.joinStringArray(sentence.split(' ')))
      .toBe(sentence);
  });

});
