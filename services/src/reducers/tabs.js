//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Tabs Reducer
//

import {
  SET_TAB
} from '../actions/tabs';

const initialState = {
  tabIndex: 0
};

/**
 * Tabs reducer
 *
 * @param   {Object}   state   Current state.
 * @param   {Object}   action  Action
 *
 * @returns {Object}   New state
 */
function tabs(state = initialState, action) {
  let payload = 0;
  if (action.payload) {
    payload = action.payload;
  }
  switch (action.type) {
    case SET_TAB:
      return {
        ...state,
        tabIndex: payload
      };
    default:
      return state;
  }
}

export default tabs;
