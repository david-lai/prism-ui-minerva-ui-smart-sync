import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import { mount } from 'enzyme';
import App from '../src/App';
import { MemoryRouter } from 'react-router';

import initStore from '../mockStore';

// Import for code coverage
import reducers from '../src/reducers/index.js'

describe('App', () => {
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);

  it('Mounts main App with empty store', () => {
  	const store = mockStore(initStore.empty);
    const cbp = mount(<MemoryRouter initialEntries={ [ '/' ] }><Provider store={ store }>
      <App /></Provider></MemoryRouter>).instance();
    expect(cbp).toBeTruthy();
  });

  it('Mounts main App with empty store', () => {
  	const store = mockStore(initStore.full);
    const cbp = mount(<MemoryRouter initialEntries={ [ '/' ] }><Provider store={ store }>
      <App /></Provider></MemoryRouter>).instance();
    expect(cbp).toBeTruthy();
  });

  it('Mounts main App file servers view', () => {
    const store = mockStore(initStore.full);
    const cbp = mount(<MemoryRouter initialEntries={ [ '/#/file_servers' ] }><Provider store={ store }>
      <App /></Provider></MemoryRouter>).instance();
    expect(cbp).toBeTruthy();
  });

  it('Mounts main App alerts view', () => {
    const store = mockStore(initStore.full);
    const cbp = mount(<MemoryRouter initialEntries={ [ '/#/alerts' ] }><Provider store={ store }>
      <App /></Provider></MemoryRouter>).instance();
    expect(cbp).toBeTruthy();
  });

  it('Mounts main App events view', () => {
    const store = mockStore(initStore.full);
    const cbp = mount(<MemoryRouter initialEntries={ [ '/#/events' ] }><Provider store={ store }>
      <App /></Provider></MemoryRouter>).instance();
    expect(cbp).toBeTruthy();
  });
});
