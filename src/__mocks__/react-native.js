/**
 * # __mockes__/react-native.js
 * 
 * This class stubs out the React-Native classes with React classes
 */
'use strict';
/**
 * ## Imports
 * 
 * ReactNative is actually React
 */ 
const React = require('react');
const ReactNative = React;

/**
 * ## These need additional mocking
 * 
 * ReactNative is actually React
 */ 
ReactNative.StyleSheet = {
    create: function create(styles) {
        return styles;
    }
};
class View extends React.Component {
    render() { return false; }
}
class PixelRatio extends React.Component {
    static get() { return 1; }
}
/**
 * ## Stubs
 * 
 * Simple replacements for testing
 */ 
ReactNative.View = View;
ReactNative.ScrollView = View;
ReactNative.Text = View;
ReactNative.TouchableOpacity = View;
ReactNative.TouchableHighlight = View;
ReactNative.TouchableWithoutFeedback = View;
ReactNative.ToolbarAndroid = View;
ReactNative.Image = View;
ReactNative.PixelRatio = PixelRatio;
ReactNative.NativeModules= {};

ReactNative.Platform = {};
module.exports = ReactNative;
