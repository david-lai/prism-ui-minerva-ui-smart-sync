import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import { mount } from 'enzyme';
import CreateNewPolicyModal from '../src/popups/CreateNewPolicyModal.jsx';
import AppConstants from '../src/utils/AppConstants';

import stores from '../mockStore';
const initStore = stores;

describe('CreateNewPolicyModal', () => {

  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);
  let store;

  const options = {
    closeOnEsc: true,
    update: false
  };


  it('Mounts CreateNewPolicyModal', () => {
    const store = mockStore(initStore.full);
    const modal = mount(
      <Provider store={ store }><CreateNewPolicyModal options={ options } visible={ true } /></Provider>
    ).instance();

    expect(modal).toBeTruthy();
  });

});
