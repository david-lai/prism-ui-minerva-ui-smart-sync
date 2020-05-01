import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import { mount } from 'enzyme';
import EventTitleCell from '../src/components/EventTitleCell.jsx';
import AppUtil from '../src/utils/AppUtil';

import initStore from '../mockStore';

import openModal from '../src/actions/modals';

describe('EventTitleCell', () => {
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);

  const openModalFn = jest.fn(openModal);
  const options = {
    entity: initStore.full.groupsapi.eventList[0],
    text: ' event '
  };

  it('Mounts EventTitleCell', () => {
    const store = mockStore(initStore.full);
    const testComponent = mount(
      <Provider store={ store }><EventTitleCell value={ 'event title' } options={ options } openModal={ openModalFn }/></Provider>
    ).instance();
    expect(testComponent).toBeTruthy();
  });


});
