'use strict';
import React,
{
  StyleSheet,
  View
}
from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/FontAwesome';
import Login from '../containers/Login';
import Profile from '../containers/Profile';

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'transparent'
  },
  header: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  mark: {
    width: 150,
    height: 150
  }
});

let Tabbar = React.createClass({
    getInitialState() {
      return {
        selectedTab: 'home'
      };
    },

    render() {
      return (
        <TabNavigator>
          <TabNavigator.Item selected={this.state.selectedTab === 'home'}
                             title="Home"
                             renderIcon={() => <Icon name="home" size={30} color="#FFB3B3" />}
                             renderSelectedIcon={() => <Icon name="home" size={30} color="#FF3366" />}
                             onPress={() => this.setState({ selectedTab: 'home' })}>
            <View style={styles.container}>
              <Login />
            </View>
          </TabNavigator.Item>
          <TabNavigator.Item selected={this.state.selectedTab === 'profile'}
                             title="Profile"
                             renderIcon={() => <Icon name="gear" size={30} color="#FFB3B3" />}
                             renderSelectedIcon={() => <Icon name="gear" size={30} color="#FF3366" />}
                             onPress={() => this.setState({ selectedTab: 'profile' })}>
            <View style={styles.container}>
              <Profile time={new Date()}/>
            </View>
          </TabNavigator.Item>
        </TabNavigator>

    )
  }
});

export default Tabbar;
