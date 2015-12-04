/* eslint-disable react/no-multi-comp */
/**
 * @see http://www.schibsted.pl/2015/10/testing-react-native-components-with-jest/
 */
import React from 'react';
const ReactNative = React;

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

ReactNative.View = View;
ReactNative.ScrollView = View;
ReactNative.Text = View;
ReactNative.TouchableOpacity = View;
ReactNative.TouchableWithoutFeedback = View;
ReactNative.ToolbarAndroid = View;
ReactNative.Image = View;
ReactNative.PixelRatio = PixelRatio;
ReactNative.NativeModules= {};

ReactNative.Platform = {};

module.exports = ReactNative;
