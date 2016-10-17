/**
 * # Logout.js
 *
 *
 *
 */
'use strict'
/**
 * ## Imports
 *
 * Redux
 */
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

/**
 * The actions we need
 */
import * as authActions from '../reducers/auth/authActions'
import * as globalActions from '../reducers/global/globalActions'

/**
 * The Header will display a Image and support Hot Loading
 */
import Header from '../components/Header'
/**
 * The FormButton will change it's text between the 4 states as necessary
 */
import FormButton from '../components/FormButton'

/**
 * The necessary React components
 */
import React, {Component} from 'react'
import
{
  StyleSheet,
  View
}
from 'react-native'

/**
 * ## Styles
 */
var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1
  }
})
/**
 * ## Redux boilerplate
 */

function mapStateToProps (state) {
  return {
    auth: {
      form: {
        isFetching: state.auth.form.isFetching,
        isValid: state.auth.form.isValid
      }
    },
    global: {
      currentState: state.global.currentState,
      showState: state.global.showState
    }
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ ...authActions, ...globalActions }, dispatch)
  }
}
/**
 * ### Translations
 */
var I18n = require('react-native-i18n')
import Translations from '../lib/Translations'
I18n.translations = Translations

class Logout extends Component {

  /**
   * ### render
   * Setup some default presentations and render
   */
  render () {
    let self = this

    let onButtonPress = () => {
      this.props.actions.logout()
    }

    return (
      <View style={styles.container}>
        <View>
          <Header isFetching={this.props.auth.form.isFetching}
            showState={this.props.global.showState}
            currentState={this.props.global.currentState}
            onGetState={this.props.actions.getState}
            onSetState={this.props.actions.setState} />

          <FormButton
            isDisabled={!this.props.auth.form.isValid || this.props.auth.form.isFetching}
            onPress={onButtonPress.bind(self)}
            buttonText={I18n.t('Snowflake.logout')} />
        </View>
      </View>
      )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Logout)
