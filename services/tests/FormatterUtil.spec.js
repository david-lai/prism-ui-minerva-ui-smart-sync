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

  it('Picks valid value from the list', () => {
    expect(FormatterUtil.pickListItem(['one', 'two', 'three'], { index: 1 }))
      .toBe('two');
  });

  it('Picks valid named value from the list', () => {
    expect(FormatterUtil.pickNamedListItem(['one', 'two', 'three'], {
      valueName: 'third_param',
      nameListProp: 'param_name_list',
      entity: {
        param_name_list: [
          'first_param',
          'second_param',
          'third_param'
        ]
      }
    }))
      .toBe('three');
  });

});
