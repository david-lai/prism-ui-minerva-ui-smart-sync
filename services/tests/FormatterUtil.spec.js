import FormatterUtil from '../src/utils/FormatterUtil';

describe('FormatterUtil', () => {

  const sentence = 'quick brown fox jumps over the lazy dog.';
  const pascalCaseTest = 'UserActionRequired';

  it('Capitalizes first letter in sentence', () => {
    expect(FormatterUtil.capitalizeSentence(sentence))
      .toBe('Quick brown fox jumps over the lazy dog.');
  });

  it('Capitalizes words in sentence', () => {
    expect(FormatterUtil.capitalizeWords(sentence))
      .toBe('Quick Brown Fox Jumps Over The Lazy Dog.');
  });

  it('Capitalizes words in sentence with min length > 3', () => {
    expect(FormatterUtil.capitalizeWords(sentence, { minLength: 3 }))
      .toBe('Quick Brown fox Jumps Over the Lazy dog.');
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

// describe('App', () => {
//   it('Mounts main App', () => {
//     expect(1).toBeTruthy();
//   });
// });