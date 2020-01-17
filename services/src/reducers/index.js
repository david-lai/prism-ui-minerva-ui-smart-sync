/**
 * @file reducers index
 * @description Starting point of redux reducers
 * @author Nutanix
 * @version 2.0
*/

// Lib
import { combineReducers } from 'redux';

// Reducers
import modals from './modals';

export default combineReducers({
  modals
});
