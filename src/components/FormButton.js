/**
* # FormButton.js
*
* Display a button that responds to onPress and is colored appropriately
*/
'use strict';
/**
 * ## Imports
 *
 * React
 */
const  React = require('react-native');
const
{
  StyleSheet,
  View
} = React;
  
/**
 * The platform neutral button
 */
const  Button = require('apsl-react-native-button');

/**
 * ## Styles
 */
var styles = StyleSheet.create({
  signin: {
    marginLeft: 10,
    marginRight: 10
  },
  button: {
    backgroundColor: '#FF3366',
    borderColor:  '#FF3366'
  }

});

var FormButton = React.createClass({
  /**
   * ### render
   *
   * Display the Button 
   */
  render() {
    return (
      <View style={styles.signin}>
        <Button style={styles.button}
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
