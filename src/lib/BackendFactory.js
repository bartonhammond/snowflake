/**
 * # BackendFactory
 *
 * This class sets up the backend by checking the config.js
 *
 */
'use strict'

import CONFIG from './config'
import {hapi} from './Hapi'

export default function BackendFactory (token = null) {
  if (CONFIG.backend.hapiLocal || CONFIG.backend.hapiRemote) {
    hapi.initialize(token)
    return hapi
  }
}
