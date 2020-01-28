//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Tabs Reducer
//

// Actions
import {
  SET_TAB
} from '../actions/tabs';

// default state
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
  // define default payload
  const { payload = 0 } = action;

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

// export reducer
export default tabs;
