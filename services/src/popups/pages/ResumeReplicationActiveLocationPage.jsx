//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// ResumeReplicationActiveLocationPage is the Active Location selection page for Resume Replication Action popup
//
import React from 'react';
import PropTypes from 'prop-types';
import {
  FlexItem,
  FlexLayout,
  Title,
  Paragraph,
  Radio,
  StackingLayout
} from '@nutanix-ui/prism-reactjs';

// Local includes
import FailoverAdDnsConfigPage from './FailoverAdDnsConfigPage.jsx';

import i18n from '../../utils/i18n';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'ResumeReplicationActiveLocationPage', key, defaultValue, replacedValue);

class ResumeReplicationActiveLocationPage extends React.Component {

  static propTypes = {
    inputChanged: PropTypes.func,
    handleOnClose: PropTypes.func,
    handleOnConfirm: PropTypes.func,
    confirmVisible: PropTypes.bool,
    handleAutoUpdateOnChange: PropTypes.func,
    setLocation: PropTypes.func,
    entity: PropTypes.object,
    modalState: PropTypes.object
  }

  state = {
    selectedLocation: ''
  }

  getBottomPart = () => {
    if (!this.props.modalState.selectedLocation) {
      return null;
    }
    return (
      <FailoverAdDnsConfigPage
        handleAutoUpdateOnChange={ this.props.handleAutoUpdateOnChange }
        inputChanged={ this.props.inputChanged }
        confirmVisible={ this.props.confirmVisible }
        handleOnClose={ this.props.handleOnClose }
        handleOnConfirm={ this.props.handleOnConfirm }
        modalState={ this.props.modalState }
      />
    );
  }

  render() {
    const {
      owner_fs_name: primaryFs,
      primary_fs_name: recoveryFs
    } = this.props.entity;

    const nullRadio = null;
    return (
      <FlexLayout justifyContent="center">
        <StackingLayout>
          <FlexItem>
            <Title size={ 'h3' }>
              {
                i18nT('choose_location', 'Choose the location on which the shares would be active:')
              }
            </Title>
          </FlexItem>
          <FlexItem>
            <FlexLayout alignItems="center" justifyContent="space-around">
              <FlexLayout
                alignItems="center"
                justifyContent="space-around"
                className="location-radio-box"
              >
                <div>
                  { (primaryFs && primaryFs[0]) || 'Ger-PrimaryFS' }
                </div>
                <Radio
                  onChange={ this.props.setLocation }
                  checked={
                    this.props.modalState.selectedLocation === (primaryFs || 'Ger-PrimaryFS')
                  }
                  value={ (primaryFs && primaryFs[0]) || 'Ger-PrimaryFS' }
                >
                  { nullRadio }
                </Radio>
              </FlexLayout>
              <FlexLayout
                alignItems="center"
                justifyContent="space-around"
                className="location-radio-box"
              >
                <div>
                  { (recoveryFs && recoveryFs[0]) || 'London-BackupFS' }
                </div>
                <Radio
                  onChange={ this.props.setLocation }
                  checked={ this.props.modalState.selectedLocation === recoveryFs[0] }
                  value={ (recoveryFs && recoveryFs[0]) || 'London-BackupFS' }
                >
                  { nullRadio }
                </Radio>
              </FlexLayout>
            </FlexLayout>
          </FlexItem>
          <FlexItem>
            <Paragraph>
              { i18nT('share_desc', 'share_desc') }
            </Paragraph>
          </FlexItem>
          { this.getBottomPart() }
        </StackingLayout>
      </FlexLayout>
    );
  }

}

export default ResumeReplicationActiveLocationPage;

