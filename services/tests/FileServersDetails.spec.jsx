import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import { mount } from 'enzyme';
import FileServersDetails from '../src/popups/FileServersDetails.jsx';

jest.mock('../src/reducers/groupsapi');

describe('FileServersDetails', () => {

  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);
  let store;

  const fsDetails = {
    'fs_id': {
      'id': 'fs_id',
      'entity_id': 'fs_id',
      'name': 'El-Captain',
      'cluster': null,
      'nvm_uuid_list': 'c4e1eefd-1154-4840-8629-fa6c052410af',
      'afs_version': '3.7.0-c62b24a28626a156b2287edfbd91a649cc7b930e',
      'cluster_uuid': 'cluster_uuid',
      'last_used_size_bytes': null,
      'ipv4_address': '10.51.17.184'
    }
  };

  const clusterDetails = {
    'cluster_uuid': {
      'id': 'cluster_uuid',
      'entity_id': 'cluster_uuid',
      'cluster_name': 'goblyn0609',
      'check.overall_score': null,
      'capacity.runway': '365.5',
      'version': '5.17',
      'cluster_upgrade_status': 'kSucceeded',
      'hypervisor_types': 'kKvm',
      'num_vms': '13',
      'num_nodes': '4',
      'external_ip_address': '10.46.44.103',
      '_created_timestamp_usecs_': '1582779079090722'
    }
  };

  const detailsProp = {
   'entityId': 'fs_id',
   'entityType': 'file_server_service',
   'name': 'El-Captain',
   'cluster': null,
   'nvm_uuid_list': 'c4e1eefd-1154-4840-8629-fa6c052410af',
   'afs_version': '3.7.0-c62b24a28626a156b2287edfbd91a649cc7b930e',
   'cluster_uuid': 'cluster_uuid'
  };

  it('Mounts FileServersDetails correctly', () => {
    const modalStore = {
      groupsapi: {
        clusterDetails,
        fsDetails
      }
    };
    const store = mockStore(modalStore);
    const modal = mount(
      <Provider store={ store }><FileServersDetails details={ detailsProp } visible={ true } /></Provider>
    ).instance();

    expect(modal).toBeTruthy();
  });

});
