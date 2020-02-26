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
  },

  /**
   * Returns single value from list (by numeric index)
   *
   * @param  {Array}      list          Value list
   * @param  {Object}     options       Options hash (default: { index: 0 })
   *
   * @return {Mixed}                    List item
   */
  pickListItem(list, options) {
    let formatted = '';
    if (!(options && typeof options === 'object')) {
      options = {};
    }
    if (!options.index) {
      options.index = 0;
    }
    if (list) {
      if (Array.isArray(list)) {
        if (list.length > options.index) {
          formatted = list[options.index];
        }
      } else {
        formatted = list;
      }
    }
    return formatted;
  },

  /**
   * Returns single value from list (by value name)
   *
   * Used in situations where we have param_name_list with list of param names
   * and param_value_list as list of values.
   *
   * If we need file_server_uuid from param_value_list and don't know its index
   * we have to fetch param_name_list as well in order to find list value
   * in that case, options should look like this:
   *
   * {
   *   nameListProps: 'param_name_list', // should be something like ['cluster', 'file_server_uuid']
   *   valueName: 'file_server_uuid'
   * }
   *
   * @param  {Array}      list          Value list
   * @param  {Object}     options       Options hash (required properties: nameListProp, valueName)
   *
   * @return {Mixed}                    List item value
   */
  pickNamedListItem(list, options) {
    let formatted = '';
    if (
      list &&
      Array.isArray(list) &&

      options &&
      typeof options === 'object' &&

      options.valueName &&
      options.nameListProp &&

      options.entity &&
      typeof options.entity === 'object' &&

      options.entity[options.nameListProp] &&
      Array.isArray(options.entity[options.nameListProp]) &&

      options.entity[options.nameListProp].indexOf(options.valueName) !== -1 &&
      list.length > options.entity[options.nameListProp].indexOf(options.valueName)
    ) {
      formatted = list[options.entity[options.nameListProp].indexOf(options.valueName)];
    }
    return formatted;
  }

};

export default FormatterUtil;
