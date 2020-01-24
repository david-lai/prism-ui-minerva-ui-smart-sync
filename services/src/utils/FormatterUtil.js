//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Various helper functions for value formatting
//
const FormatterUtil = {
  capitalizeSentence(sentence) {
    let formatted = sentence;
    if (sentence && sentence.substring && typeof sentence.substring === 'function') {
      formatted = sentence.substring(0, 1).toUpperCase() + sentence.substring(1);
    }
    return formatted;
  },

  capitalizeWords(textValue) {
    let formatted = textValue;
    if (textValue && textValue.replace && typeof textValue.replace === 'function') {
      formatted = textValue.replace(/(\s[a-z](?=[\w]{2,}))/g, (tMatch) => {
        return tMatch.toUpperCase();
      }).replace(/^([a-z])/g, (tMatch) => {
        return tMatch.toUpperCase();
      });
    }
    return formatted;
  },

  separatePascalCase(textValue) {
    let formatted = textValue;
    if (textValue && textValue.replace && typeof textValue.replace === 'function') {
      formatted = textValue.replace(/([A-Z][^A-Z])/g, ' $1').trim();
    }
    return formatted;
  },

  joinStringArray(stringArray, options) {
    console.log(stringArray, options);
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
