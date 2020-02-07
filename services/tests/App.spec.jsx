import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import { mount } from 'enzyme';
import App from '../src/App';

// Temporary measure until API work is done
import fsData from '../mockserver/mock_data/groups_file_servers.json';
import alertsData from '../mockserver/mock_data/groups_alerts.json';

describe('App', () => {
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);
  let store;
  const initStore = {
  	modals:{
  	visible: true,
  	options: {},
    type: ''
  	},
    groupsapi: {
      fsData,
      alertsData,
      summaryAlerts: alertsData,
      alertsWidgetRange: 'day'
    },
    tabs: {
      tabIndex: 0,
    }
  }

  it('Mounts main App', () => {
  	store = mockStore(initStore);
    const cbp = mount(<Provider store={ store }>
      <App /></Provider>).instance();
    expect(cbp).toBeTruthy();
  });
});
