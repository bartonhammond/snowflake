'use strict';

import React,
{
  Image,
  PropTypes,
  StyleSheet,
  Text,
  View

} from 'react-native';

import GiftedSpinner from 'react-native-gifted-spinner';

var styles = StyleSheet.create({
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
  propTypes: {
    isFetching: PropTypes.bool
  },

  render() {
    let spinner = <Text> </Text>;
    if (this.props.isFetching) {
      spinner =  <GiftedSpinner/>;
    }

    return (
      <View style={styles.header}>
        <Image style={styles.mark} source={{uri:
                                            'http://i.imgur.com/da4G0Io.png'}}
        />
        {spinner}
      </View>
    );
  }
});

module.exports = Header;
