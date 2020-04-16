import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import { mount } from 'enzyme';
import AlertInfoCell from '../src/components/AlertInfoCell.jsx';
import AppUtil from '../src/utils/AppUtil';

import initStore from '../mockStore';

import openModal from '../src/actions/modals';

describe('AlertInfoCell', () => {
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);

  const alertEntity = AppUtil.extractGroupResults(initStore.full.groupsapi.alertsData)[0];
  const options = {
    entity: alertEntity,
    text: alertEntity.title
  };
  const openModalFn = jest.fn(openModal);

  it('Mounts AlertInfoCell with info alert', () => {
    const store = mockStore(initStore.full);
    const testComponent = mount(
      <Provider store={ store }><AlertInfoCell options={ options } openModal={ openModalFn }/></Provider>
    ).instance();
    expect(testComponent).toBeTruthy();
  });


});
