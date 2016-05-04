/**
 * @providesModule SimpleAlert
 */

'use strict';

var React = require('react-native');
var { AlertIOS, Platform, NativeModules } = React;
var SimpleAlertAndroid = NativeModules.SimpleAlertAndroid;

if (Platform.OS === 'ios') {
    var Buttons = {
        POSITIVE_BUTTON: "POSITIVE_BUTTON",
        NEGATIVE_BUTTON: "NEGATIVE_BUTTON",
        NEUTRAL_BUTTON: "NEUTRAL_BUTTON",
    };
} else {
    var Buttons = {
        POSITIVE_BUTTON: SimpleAlertAndroid.POSITIVE_BUTTON,
        NEGATIVE_BUTTON: SimpleAlertAndroid.NEGATIVE_BUTTON,
        NEUTRAL_BUTTON: SimpleAlertAndroid.NEUTRAL_BUTTON,
    };
}

var SimpleAlert = {
    [Buttons.POSITIVE_BUTTON]: Buttons.POSITIVE_BUTTON,
    [Buttons.NEGATIVE_BUTTON]: Buttons.NEGATIVE_BUTTON,
    [Buttons.NEUTRAL_BUTTON]: Buttons.NEUTRAL_BUTTON,
    alert(title, text, buttonConfig) {
        let _buttonConfig = (buttonConfig||[{ type: SimpleAlert.POSITIVE_BUTTON, text: 'OK', }]);
        if (Platform.OS === 'ios') {
            for(let j=0; j<_buttonConfig.length; j++) {
                if("type" && _buttonConfig[j]) delete _buttonConfig[j]['type'];
            }
            AlertIOS.alert.apply(AlertIOS, [title, text, _buttonConfig]);
        } else {
            let _masterCallback = (buttonType) => {
                for(let j=0; j<_buttonConfig.length; j++) {
                    if("type" && _buttonConfig[j] && _buttonConfig[j].type === buttonType && ("onPress" in _buttonConfig[j] && typeof _buttonConfig[j].onPress == "function")) {
                        _buttonConfig[j].onPress.apply(null, [{type: buttonType}]);
                    }
                }
            };

            SimpleAlertAndroid.alert((title||null), (text||null), _buttonConfig, _masterCallback);
        }
    }
};

module.exports = SimpleAlert;
