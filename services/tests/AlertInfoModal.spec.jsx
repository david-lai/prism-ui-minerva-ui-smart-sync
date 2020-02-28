import React from 'react';
import { shallow } from 'enzyme';
import AlertInfoModal from '../src/popups/AlertInfoModal.jsx';

describe('AlertInfoModal', () => {

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

  it('Mounts AlertInfoModal with info alert', () => {
    const modal = shallow(
      <AlertInfoModal alert={ alertEntity } visible={ true } />
    );
    expect(modal).toBeTruthy();
  });

  // other severity levels - improve coverage
  it('Mounts AlertInfoModal with warning alert', () => {
    alertEntity.severity = 'warning';
    const modal = shallow(
      <AlertInfoModal alert={ alertEntity } visible={ true } />
    );
    expect(modal).toBeTruthy();
  });

  it('Mounts AlertInfoModal with critical alert', () => {
    alertEntity.severity = 'critical';
    const modal = shallow(
      <AlertInfoModal alert={ alertEntity } visible={ true } />
    );
    expect(modal).toBeTruthy();
  });

  it('Mounts invisible AlertInfoModal', () => {
    const modal = shallow(
      <AlertInfoModal alert={ alertEntity } visible={ false } />
    );
    expect(modal).toBeTruthy();
  });

});
