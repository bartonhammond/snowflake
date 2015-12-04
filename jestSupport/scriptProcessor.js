/* eslint-disable */
// see http://www.schibsted.pl/2015/10/testing-react-native-components-with-jest/
var babel = require('babel-core');

module.exports = {
    process: function (src, filename) {
        var result = babel.transform(src, {
          filename: filename,
          compact: false
       });

        return result.code;
    }
};
