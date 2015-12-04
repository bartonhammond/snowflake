'use strict';

import React,
{
  PropTypes,
  StyleSheet,
  View

} from 'react-native';

import Button from 'apsl-react-native-button';

var styles = StyleSheet.create({
  signin: {
    marginLeft: 10,
    marginRight: 10
  }
});

var FormButton = React.createClass({
  propTypes: {
    self: PropTypes.object,
    isDisabled:PropTypes.bool,
    onPress: PropTypes.func,
    buttonText: PropTypes.string
  },

  render() {
    return (
      <View style={styles.signin}>
        <Button
            style={{
                backgroundColor: '#FF3366',
                borderColor:  '#FF3366'
              }}
            isDisabled={this.props.isDisabled}
            onPress={this.props.onPress}
        >
          {this.props.buttonText}
        </Button>
      </View>
    );
  }
});

module.exports = FormButton;
