/**
 * # BackendFactory.js
 *
 * Mocked BackendFactory
 *
 *
 */
'use strict'

const Backend = require('./Backend').default

export default function BackendFactory (token = null) {
  return new Backend()
}
