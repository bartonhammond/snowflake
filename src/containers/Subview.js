/**
 * # Subview.js
 *
 *  This is called from main to demonstrate the back button
 *
 */
'use strict'
/*
 * ## Imports
 *
 * Imports from redux
 */
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

/**
 * Router
 */
import {Actions} from 'react-native-router-flux'

/**
 * Navigation Bar
 */
import NavigationBar from 'react-native-navbar'

/**
 * The necessary components from React
 */
import React from 'react'
import
{
  StyleSheet,
  View,
  Text
}
from 'react-native'

/**
 * Use device options so we can reference the Version
 *
 */
import * as deviceActions from '../reducers/device/deviceActions'

/**
* ## Redux boilerplate
*/

/**
 *  Instead of including all app states via ...state
 *  You probably want to explicitly enumerate only those which Main.js will depend on.
 *
 */
function mapStateToProps (state) {
  return {
    deviceVersion: state.device.version
  }
}

/*
 * Bind all the actions in deviceActions
 */
function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(deviceActions, dispatch)
  }
}

var styles = StyleSheet.create({
  container: {
    borderTopWidth: 2,
    borderBottomWidth: 2,
    marginTop: 80,
    padding: 10
  },
  summary: {
    fontFamily: 'BodoniSvtyTwoITCTT-Book',
    fontSize: 18,
    fontWeight: 'bold'
  }
})
/**
 * ### Translations
 */
var I18n = require('react-native-i18n')
import Translations from '../lib/Translations'
I18n.translations = Translations

/**
 * ## Subview class
 */
let Subview = React.createClass({

  render () {
    var titleConfig = {
      title: I18n.t('Subview.subview')
    }

    var leftButtonConfig = {
      title: I18n.t('Subview.back'),
      handler: Actions.pop
    }

    return (
      <View>
        <NavigationBar
          title={titleConfig}
          leftButton={leftButtonConfig} />
        <View style={styles.container}>
          <Text style={styles.summary}>{I18n.t('Subview.subview')} {I18n.t('App.version')}: {this.props.deviceVersion}
          </Text>
        </View>
      </View>
    )
  }
})

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(Subview)
