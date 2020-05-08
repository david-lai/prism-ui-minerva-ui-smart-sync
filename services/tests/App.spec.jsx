import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import { mount } from 'enzyme';
import App from '../src/App';
import { MemoryRouter as Router } from 'react-router';
import util from 'util';

import initStore from '../mockStore';

// Import for code coverage
import reducers from '../src/reducers/index.js'

describe('App', () => {
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);

  it('Mounts main App with empty store', () => {
  	const store = mockStore(initStore.empty);
    const cbp = mount(<Router initialEntries={ [ '/' ] }><Provider store={ store }>
      <App /></Provider></Router>).instance();
    expect(cbp).toBeTruthy();
  });

  it('Mounts main App with full store', () => {
  	const store = mockStore(initStore.full);
    const cbp = mount(<Router initialEntries={ [ '/' ] }><Provider store={ store }>
      <App /></Provider></Router>).instance();
    expect(cbp).toBeTruthy();
  });

  it('Mounts main App file servers view', () => {
    const store = mockStore(initStore.full);
    const cbp = mount(
      <Provider store={ store }>
        <Router initialEntries={ [ '/#/file_servers' ] }>
          <App />
        </Router>
      </Provider>
    ).instance();
    expect(cbp).toBeTruthy();
  });

  it('Mounts main App alerts view', () => {
    const store = mockStore(initStore.full);
    const cbp = mount(<Router initialEntries={ [ '/#/alerts' ] }><Provider store={ store }>
      <App /></Provider></Router>).instance();
    expect(cbp).toBeTruthy();
  });

  it('Mounts main App events view', () => {
    const store = mockStore(initStore.full);
    const cbp = mount(<Router initialEntries={ [ '/#/events' ] }><Provider store={ store }>
      <App /></Provider></Router>).instance();
    expect(cbp).toBeTruthy();
  });

  it('Mounts main App protected file servers view', () => {
    const store = mockStore(initStore.full);
    const wrapper = mount(
      <Router>
        <Provider store={ store }>
          <App />
        </Provider>
      </Router>
    );
    const filesWrapper = wrapper.find('Files');
    const files = filesWrapper.instance();
    files.goToPath('/protected_file_servers');

    const cbp = wrapper.instance();
    expect(cbp).toBeTruthy();
  });

  it('Mounts main App replication jobs view', () => {
    const store = mockStore(initStore.full);
    const wrapper = mount(
      <Provider store={ store }>
        <App />
      </Provider>
    );
    const filesWrapper = wrapper.find('Files');
    const files = filesWrapper.instance();
    files.goToPath('/replication_jobs');

    const cbp = wrapper.instance();
    expect(cbp).toBeTruthy();
  });



  it('Mounts main App create policy view', () => {
    const store = mockStore(initStore.full);
    const wrapper = mount(
      <Provider store={ store }>
        <Router initialEntries={ [ '/policies/new' ] } initialIndex={ 0 }>
          <App />
        </Router>
      </Provider>
    );
    const filesWrapper = wrapper.find('Files');
    const files = filesWrapper.instance();
    files.goToPath('/policies/new');

    const cbp = wrapper.instance();
    expect(cbp).toBeTruthy();
  });
});
