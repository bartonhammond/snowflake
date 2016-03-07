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
 * Immutable
 */ 
import {Map} from 'immutable';

/**
	* Router
	*/
import {Actions} from 'react-native-router-flux'

import Subview from './Subview';

/**
 * We only need React
 */
import React,
{ 	
	Component,
	StyleSheet,
	View,
	Text
}
from 'react-native';

/**
 * The platform neutral button
 */
const  Button = require('apsl-react-native-button');


/**
 * If your app uses Redux action creators, you can add them here...
 * 
 */
const actions = [
];

/**
 *  Instead of including all app states via ...state
 *  You probably want to explicitly enumerate only those which Main.js will depend on.
 *
 */
function mapStateToProps(state) {
  return {
      ...state
  };
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

/**
 * ## App class
 */
class Main extends Component {
  
  handlePress(event) {
		Actions.Subview({
			title: 'Subview'
			// you can add additional props to be passed to Subview here...
		});
	}
  
  render() {
  	return(
    	<View style={ styles.container }>
    		<Button style={ styles.button } onPress={ this.handlePress.bind(this) }>
					{'Navigate to Subview'}
				</Button>
			</View>
    );
  }
};

var styles = StyleSheet.create({
	container: {
		marginTop: 200,
		padding: 10
	},
	summary: {
		fontFamily: 'BodoniSvtyTwoITCTT-Book',
		fontSize: 18,
		fontWeight: 'bold',
	},
	button: {
    backgroundColor: '#FF3366',
    borderColor:  '#FF3366'
  }
});

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(Main);

