import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import { mount } from 'enzyme';
import FileServersName from '../src/components/FileServersName.jsx';
import AppUtil from '../src/utils/AppUtil';

import initStore from '../mockStore';

import openModal from '../src/actions/modals';

describe('FileServersName', () => {
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);

  const fsEntity = AppUtil.extractGroupResults(initStore.full.groupsapi.fsData)[0];
  const options = {
    entity: fsEntity,
    name: fsEntity.name
  };
  const openModalFn = jest.fn(openModal);

  it('Mounts FileServersName with info alert', () => {
    const store = mockStore(initStore.full);
    const testComponent = mount(
      <Provider store={ store }><FileServersName options={ options } openModal={ openModalFn }/></Provider>
    ).instance();
    expect(testComponent).toBeTruthy();
  });


});
