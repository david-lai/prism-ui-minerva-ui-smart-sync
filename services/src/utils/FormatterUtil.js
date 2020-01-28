//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Various helper functions for value formatting
//
const FormatterUtil = {

  /**
   * Capitalizes just first letter for given sentence
   *
   * e.g. user action required. > User action required.
   *
   * @param  {String} sentence Source text
   *
   * @return {String}          Capitalized result
   */
  capitalizeSentence(sentence) {
    let formatted = sentence;
    if (sentence && sentence.substring && typeof sentence.substring === 'function') {
      formatted = sentence.substring(0, 1).toUpperCase() + sentence.substring(1);
    }
    return formatted;
  },

  /**
   * Separates words in pascal-case strings with space
   *
   * e.g. UserActionRequired > User Action Required
   *
   * @param  {String} textValue Source PascalCase text
   *
   * @return {String}           Formatted text
   */
  separatePascalCase(textValue) {
    let formatted = textValue;
    if (textValue && textValue.replace && typeof textValue.replace === 'function') {
      formatted = textValue.replace(/([A-Z][^A-Z])/g, ' $1').trim();
    }
    return formatted;
  },

  /**
   * Joins an array of strings using delimiter passed in options (default: ' ')
   *
   *  e.g. ["Alert", "Event", "Status"] > "Alert Event Status"
   *
   * @param  {String[]}   stringArray   An array of strings to join
   * @param  {Object}     options       Options hash (default: { delimiter: ' ' })
   *
   * @return {String}                   Formatted string value
   */
  joinStringArray(stringArray, options) {
    let formatted = '';
    if (!(options && typeof options === 'object')) {
      options = {};
    }
    if (!options.delimiter) {
      options.delimiter = ' ';
    }
    if (stringArray) {
      if (Array.isArray(stringArray)) {
        formatted = stringArray.join(options.delimiter);
      } else {
        formatted = stringArray;
      }
    }
    return formatted;
  }
};

export default FormatterUtil;
