import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import { mount } from 'enzyme';
import App from '../src/App';

import initStore from '../mockStore';

// Import for code coverage
import reducers from '../src/reducers/index.js'

describe('App', () => {
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);

  it('Mounts main App with empty store', () => {
  	const store = mockStore(initStore.empty);
    const cbp = mount(<Provider store={ store }>
      <App /></Provider>).instance();
    expect(cbp).toBeTruthy();
  });

  it('Mounts main App with empty store', () => {
  	const store = mockStore(initStore.full);
    const cbp = mount(<Provider store={ store }>
      <App /></Provider>).instance();
    expect(cbp).toBeTruthy();
  });
});
