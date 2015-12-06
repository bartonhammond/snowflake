'use strict';

import React,
{
  Image,
  PropTypes,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View

} from 'react-native';

import GiftedSpinner from 'react-native-gifted-spinner';
import FormButton from './FormButton';

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    margin: 20
  },
  header: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  mark: {
    width: 100,
    height: 100
  }
});

var Header = React.createClass({
  getInitialState() {
    return {
      text: '',
      isDisabled: true
    };
  },
  
  propTypes: {
    isFetching: PropTypes.bool,
    showState: PropTypes.bool,
    currentState: PropTypes.object,
    onGetState: PropTypes.func,
    onSetState: PropTypes.func
  },

  _onPressMark() {
    this.props.onGetState(!this.props.showState);
  },
  _onChangeText(text) {
    this.setState({
      text,
      isDisabled: false
    });
  },
  
  _updateStateButtonPress() {
    this.props.onSetState(this.state.text);
  },


  render() {
    let showState = <Text> </Text>;
    if (this.props.showState) {
      let displayText = JSON.stringify(this.props.currentState);
      
      //leave so user can copy/paste
      console.log(displayText)

      showState =
      <View style={styles.container}>
        <Text>Current State (see console)</Text>
        <TextInput style={{height: 100, borderColor: 'gray', borderWidth: 1}}
                   value={displayText}
                   editable={true}
                   multiline={true}
                   onChangeText={(text) => this._onChangeText(text)}
                   numberOfLines={20}>
        </TextInput>
        <View style={{
            marginTop: 10
          }}>
          <FormButton  isDisabled={this.state.isDisabled}
                       onPress={this._updateStateButtonPress}
                       buttonText={'Update State'}>
          </FormButton>
          
        </View>
      </View>
    }
    
    let spinner = <Text> </Text>;
    if (this.props.isFetching) {
      spinner =  <GiftedSpinner/>;
    }

    return (
      <View>
        <View style={styles.header}>

          <TouchableHighlight onPress={this._onPressMark}>

            <Image style={styles.mark} source={{uri:
                                                'http://i.imgur.com/da4G0Io.png'}}
            />
          </TouchableHighlight>
          {spinner}
        </View>
        {showState}
      </View>
    );
  }
});

module.exports = Header;
