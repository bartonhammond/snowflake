'use strict';

import {
  SET_PLATFORM,
  SET_VERSION
} from '../../lib/constants';

export function setPlatform(platform) {
  return {
    type: SET_PLATFORM,
    payload: platform
  };
}
export function setVersion(version) {
  return {
    type: SET_VERSION,
    payload: version
  };
}
