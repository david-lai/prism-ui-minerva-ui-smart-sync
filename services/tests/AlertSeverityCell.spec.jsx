import React from 'react';
// import { Provider } from 'react-redux';
// import configureStore from 'redux-mock-store';
// import thunk from 'redux-thunk'
import { mount } from 'enzyme';
import AlertSeverityCell from '../src/components/AlertSeverityCell.jsx';
import AppUtil from '../src/utils/AppUtil';

import initStore from '../mockStore';

// import openModal from '../src/actions/modals';

describe('AlertSeverityCell', () => {
  // const middlewares = [thunk];
  // const mockStore = configureStore(middlewares);



  it('Mounts AlertSeverityCell with info alert', () => {
    // const store = mockStore(initStore.full);
    const alertEntity = AppUtil.extractGroupResults(initStore.full.groupsapi.alertsData)[0];
    alertEntity.severity = 'info';
    const options = {
      entity: alertEntity,
    };
    const testComponent = mount(
      <AlertSeverityCell options={ options } />
    ).instance();
    expect(testComponent).toBeTruthy();
  });

  it('Mounts AlertSeverityCell with warning alert', () => {
    // const store = mockStore(initStore.full);
    const alertEntity = AppUtil.extractGroupResults(initStore.full.groupsapi.alertsData)[0];
    alertEntity.severity = 'warning';
    const options = {
      entity: alertEntity,
    };
    const testComponent = mount(
      <AlertSeverityCell options={ options } />
    ).instance();
    expect(testComponent).toBeTruthy();
  });

  it('Mounts AlertSeverityCell with critical alert', () => {
    // const store = mockStore(initStore.full);
    const alertEntity = AppUtil.extractGroupResults(initStore.full.groupsapi.alertsData)[0];
    alertEntity.severity = 'critical';
    const options = {
      entity: alertEntity,
    };
    const testComponent = mount(
      <AlertSeverityCell options={ options } />
    ).instance();
    expect(testComponent).toBeTruthy();
  });


});
