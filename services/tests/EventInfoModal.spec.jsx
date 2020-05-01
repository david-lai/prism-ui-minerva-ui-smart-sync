import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import { mount } from 'enzyme';
import EventInfoModal from '../src/popups/EventInfoModal.jsx';
import AppConstants from '../src/utils/AppConstants';

import stores from '../mockStore';
const initStore = stores;

const FETCH_EVENTS = AppConstants.ACTIONS.FETCH_EVENTS;

function fetchEvents (eventIds = []) {
  return (dispatch) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch({
          type: 'FETCH_EVENTS',
          payload: initStore.full.groupsapi.eventList
        });
        resolve();
      }, 1000);
    });
  };
}

describe('EventInfoModal', () => {

  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);
  let store;

  const options = {
    entity: {
      id: 'event1',
      entity_id: 'event1',
      title: null,
      source_entity_name: null,
      cluster: '0005a3d4-b40c-623f-0000-000000024e1b',
      source_entity_uuid: null,
      source_entity_type: null,
      operation_type: null,
      default_message: 'Export dvd-smb-nfs is created on File server dvd',
      param_name_list: 'file_server_share_uuid',
      param_value_list: '5dc2fc08-f028-42c0-b160-4773f9fe801c',
      _created_timestamp_usecs_: '1587579774935581'
    }
  };


  it('Mounts EventInfoModal', () => {
    const store = mockStore(initStore.full);
    const modal = mount(
      <Provider store={ store }><EventInfoModal options={ options } visible={ true } /></Provider>
    ).instance();

    expect(modal).toBeTruthy();
  });

  it('Mounts empty EventInfoModal', () => {
    const store = mockStore(initStore.empty);
    const modal = mount(
      <Provider store={ store }><EventInfoModal options={ { entity: { id: 0, entity_id: 0 } } } visible={ true } /></Provider>
    ).instance();
    store.dispatch(fetchEvents())
      .then((result) => {
        expect(modal).toBeTruthy();
      });

  });

  it('Mounts invisible EventInfoModal', () => {
    const store = mockStore(initStore.empty);
    const modal = mount(
      <Provider store={ store }><EventInfoModal options={ options } visible={ false } /></Provider>
    ).instance();
    expect(modal).toBeTruthy();
  });

  it('Mounts loading EventInfoModal', () => {
    const store = mockStore({
      ...initStore.full,
      ...{
        groupsapi: {
          ...initStore.full.groupsapi,
          eventListLoading: true
        }
      }
    });
    const modal = mount(
      <Provider store={ store }><EventInfoModal options={ options } visible={ true } /></Provider>
    ).instance();
    expect(modal).toBeTruthy();
  });

});
