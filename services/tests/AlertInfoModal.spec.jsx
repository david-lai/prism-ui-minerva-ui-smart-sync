import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import { mount } from 'enzyme';
import AlertInfoModal from '../src/popups/AlertInfoModal.jsx';

import initStore from '../mockStore';
jest.mock('../src/reducers/groupsapi');

describe('AlertInfoModal', () => {

  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);
  let store;

  const alertEntity = {
      entityId: 'testId',
      entityType: 'alert',
      _created_timestamp_usecs_: 1579292383633242,
      title: 'Appropriate Site Not Found in Active Directory',
      param_value_list: [
          '2b7b407d-b8fa-4e85-a653-cfc6cd1deb7f',
          'files-1234',
          '2b7b407d-b8fa-4e85-a653-cfc6cd1deb7f',
          'master-7ddaebd5',
          '5.17'
      ],
      impact_type: 'SystemIndicator',
      severity: 'info',
      cluster_name: null
  };

  it('Mounts AlertInfoModal without alert info', () => {
    const modalStore = {
      groupsapi: {
        alertModalLoading: false,
        alertRequestActive: false,
        alertRequestStatus: true,
        alertRequestType: '',
        alertInfo: false
      }
    };
    const store = mockStore(modalStore);
    const modal = mount(
      <Provider store={ store }><AlertInfoModal alert={ alertEntity } visible={ true } /></Provider>
    ).instance();

    expect(modal).toBeTruthy();
  });

  it('Mounts AlertInfoModal with info alert', () => {
    const store = mockStore(initStore);
    const modal = mount(
      <Provider store={ store }><AlertInfoModal alert={ alertEntity } visible={ true } /></Provider>
    ).instance();

    expect(modal).toBeTruthy();
  });

  // other severity levels - improve coverage
  it('Mounts AlertInfoModal with warning alert', () => {
    alertEntity.severity = 'warning';
    const store = mockStore(initStore);
    const modal = mount(
      <Provider store={ store }><AlertInfoModal alert={ alertEntity } visible={ true } /></Provider>
    ).instance();
    expect(modal).toBeTruthy();
  });

  it('Mounts AlertInfoModal with critical alert', () => {
    alertEntity.severity = 'critical';
    const store = mockStore(initStore);
    const modal = mount(
      <Provider store={ store }><AlertInfoModal alert={ alertEntity } visible={ true } /></Provider>
    ).instance();
    expect(modal).toBeTruthy();
  });

  it('Mounts AlertInfoModal with acknowledged alert', () => {
    initStore.groupsapi.alertInfo.entity.resolution_status = {
      is_true: false
    };
    initStore.groupsapi.alertInfo.entity.acknowledged_status = {
      is_true: true,
      user: 'admin',
      time: '2020-03-03T17:26:09Z'
    };
    const store = mockStore(initStore);
    const modal = mount(
      <Provider store={ store }><AlertInfoModal alert={ alertEntity } visible={ true } /></Provider>
    ).instance();
    expect(modal).toBeTruthy();
  });

  it('Mounts AlertInfoModal with user resolved alert', () => {
    initStore.groupsapi.alertInfo.entity.acknowledged_status = {
      is_true: false
    };
    initStore.groupsapi.alertInfo.entity.resolution_status = {
      is_true: true,
      is_auto_resolved: false,
      user: 'admin',
      time: '2020-03-03T17:26:09Z'
    };
    const store = mockStore(initStore);
    const modal = mount(
      <Provider store={ store }><AlertInfoModal alert={ alertEntity } visible={ true } /></Provider>
    ).instance();
    expect(modal).toBeTruthy();
  });

  it('Mounts AlertInfoModal with auto resolved alert', () => {
    initStore.groupsapi.alertInfo.entity.resolution_status = {
      is_true: true,
      is_auto_resolved: true,
      user: '',
      time: ''
    };
    const store = mockStore(initStore);
    const modal = mount(
      <Provider store={ store }><AlertInfoModal alert={ alertEntity } visible={ true } /></Provider>
    ).instance();
    expect(modal).toBeTruthy();
  });

  it('Mounts invisible AlertInfoModal', () => {
    const store = mockStore(initStore);
    const modal = mount(
      <Provider store={ store }><AlertInfoModal alert={ alertEntity } visible={ false } /></Provider>
    ).instance();
    expect(modal).toBeTruthy();
  });

});
