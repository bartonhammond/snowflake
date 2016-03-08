/**
 * # Main.js
 *  This is the main app screen
 *  
 */
'use strict';
/*
 * ## Imports
 *  
 * Imports from redux
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * The actions we need
 */
import * as authActions from '../reducers/auth/authActions';
import * as globalActions from '../reducers/global/globalActions';

/**
 * Immutable
 */ 
import {Map} from 'immutable';

/**
 * Router
 */
import {Actions} from 'react-native-router-flux';

/**
 * The Header will display a Image and support Hot Loading
 */
import Header from '../components/Header';

/**
 * The components needed from React
 */
import React,
{ 	
  Component,
  StyleSheet,
  View
}
from 'react-native';

/**
 * The platform neutral button
 */
const  Button = require('apsl-react-native-button');


/**
 * Support for Hot reload
 * 
 */
const actions = [
  authActions,
  globalActions  
];

/**
 *  Instead of including all app states via ...state
 *  One could explicitly enumerate only those which Main.js will depend on.
 *
 */
function mapStateToProps(state) {
  return {
      ...state
  }
};

/*
 * Bind all the functions from the ```actions``` and bind them with
 * ```dispatch```

 */
function mapDispatchToProps(dispatch) {

  const creators = Map()
          .merge(...actions)
          .filter(value => typeof value === 'function')
          .toObject();

  return {
    actions: bindActionCreators(creators, dispatch),
    dispatch
  };
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1    
  },
  summary: {
    fontFamily: 'BodoniSvtyTwoITCTT-Book',
    fontSize: 18,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#FF3366',
    borderColor:  '#FF3366',
    marginLeft: 10,
    marginRight: 10    
  }
});

/**
 * ## App class
 */
class Main extends Component {
  
  handlePress() {
    Actions.Subview({
      title: 'Subview'
      // you can add additional props to be passed to Subview here...
    });
  }
  
  render() {
    return(
      <View style={styles.container}>
        <View>
        <Header isFetching={this.props.auth.form.isFetching}
                showState={this.props.global.showState}
                currentState={this.props.global.currentState}
                onGetState={this.props.actions.getState}
                onSetState={this.props.actions.setState}
        />        
    	<Button style={ styles.button } onPress={ this.handlePress.bind(this) }>
	  {'Navigate to Subview'}
        </Button>
        </View>
      </View>
    );
  }
};

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(Main);

