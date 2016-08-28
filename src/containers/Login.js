/**
 * # Login.js
 *
 *  The container to display the Login form
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

/**
 *   LoginRender
 */
import LoginRender from '../components/LoginRender'

/**
 * The necessary React components
 */
import React from 'react'

const {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
} = require('../lib/constants').default

/**
 * ## Redux boilerplate
 */

function mapStateToProps (state) {
  return {
    auth: state.auth,
    global: state.global
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(authActions, dispatch)
  }
}

function buttonPressHandler (login, username, password) {
  login(username, password)
}

/**
 * ### Translations
 */
var I18n = require('react-native-i18n')
import Translations from '../lib/Translations'
I18n.translations = Translations

let Login = React.createClass({

  render () {
    let loginButtonText = I18n.t('Login.login')
    let onButtonPress = buttonPressHandler.bind(null,
                                                this.props.actions.login,
                                                this.props.auth.form.fields.username,
                                                this.props.auth.form.fields.password
                                               )

    return (
      <LoginRender
        formType={LOGIN}
        loginButtonText={loginButtonText}
        onButtonPress={onButtonPress}
        displayPasswordCheckbox
        leftMessageType={REGISTER}
        rightMessageType={FORGOT_PASSWORD}
        auth={this.props.auth}
        global={this.props.global}
      />
    )
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
