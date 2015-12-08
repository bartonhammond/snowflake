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
import React,
{
  PropTypes,
  StyleSheet,
  View
} from 'react-native';
  
/**
 * The platform neutral button
 */
import Button from 'apsl-react-native-button';

/**
 * ## Styles
 */
var styles = StyleSheet.create({
  signin: {
    marginLeft: 10,
    marginRight: 10
  }
});

var FormButton = React.createClass({
  /**
   * ## FormButon 
   * Display the text within the button, disable if prop is set and
   * when pressed call the ```onPress```
   */
  propTypes: {
    isDisabled:PropTypes.bool,
    onPress: PropTypes.func,
    buttonText: PropTypes.string
  },
  /**
   * ### render
   *
   * Display the Button 
   */
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
