'use strict';

var t = require('tcomb-validation');

function getOptionsOfEnum(type) {
  var enums = type.meta.map;
  return Object.keys(enums).map(value => {
    return {
      value,
      text: enums[value]
    };
  });
}

function getTypeInfo(type) {

  var innerType = type;
  var isMaybe = false;
  var isSubtype = false;
  var kind;
  var innerGetValidationErrorMessage;

  while (innerType) {
    kind = innerType.meta.kind;
    if (t.Function.is(innerType.getValidationErrorMessage)) {
      innerGetValidationErrorMessage = innerType.getValidationErrorMessage;
    }
    if (kind === 'maybe') {
      isMaybe = true;
      innerType = innerType.meta.type;
      continue;
    }
    if (kind === 'subtype') {
      isSubtype = true;
      innerType = innerType.meta.type;
      continue;
    }
    break;
  }

  var getValidationErrorMessage = innerGetValidationErrorMessage ? function (value, path, context) {
    var result = t.validate(value, type, {path, context});
    if (!result.isValid()) {
      for (var i = 0, len = result.errors.length; i < len; i++ ) {
        if (t.Function.is(result.errors[i].expected.getValidationErrorMessage)) {
          return result.errors[i].message;
        }
      }
      return innerGetValidationErrorMessage(value, path, context);
    }
  } : undefined;

  return {
    type,
    isMaybe,
    isSubtype,
    innerType,
    getValidationErrorMessage
  };
}

// thanks to https://github.com/epeli/underscore.string

function underscored(s){
  return s.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
}

function capitalize(s){
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function humanize(s){
  return capitalize(underscored(s).replace(/_id$/, '').replace(/_/g, ' '));
}

function merge(a, b) {
  return t.mixin(t.mixin({}, a), b, true);
}

/*

  Detecting the React library to require in your own npm packages.
  https://twitter.com/Rygu/status/582683864818167808
  thanks @RickWong

*/
var React;
try {
  React = require.call(this, 'react');
} catch(e) {
  React = require('react-native');
}

module.exports = {
  getOptionsOfEnum,
  getTypeInfo,
  humanize,
  merge,
  React
};

