//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// ResumeReplicationDataProtectionPolicyPage is the Active Location selection page for Resume Replication Action popup
//
import React from 'react';
import PropTypes from 'prop-types';
import {
  FlexLayout,
  TextGroup,
  Title,
  Paragraph,
  StackingLayout,
  TriangleRightIcon,
  DotIcon
} from '@nutanix-ui/prism-reactjs';

// Utils
import Activated from '../../assets/images/Activated.svg';

// Reverse Replication Policy Page
import ReverseReplicationPolicyPage from './ReverseReplicationPolicyPage.jsx';

import i18n from '../../utils/i18n';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'ResumeReplicationDataProtectionPolicyPage', key, defaultValue, replacedValue);

class ResumeReplicationDataProtectionPolicyPage extends React.Component {

  // constructor(props, context) {
  //   super(props, context);
  //   this.handleAutoUpdateOnChange = this.handleAutoUpdateOnChange.bind(this);
  // }

  static propTypes = {
    handleReverseReplicationClick: PropTypes.func,
    handleSelectChange: PropTypes.func,
    entity: PropTypes.object,
    selectedLocation: PropTypes.string,
    modalState: PropTypes.object
  }

  render() {
    const {
      owner_fs_name: primaryFs,
      policy_name: policyName,
      primary_fs_name: recoveryFs
    } = this.props.entity;

    if (this.props.selectedLocation === (primaryFs && primaryFs[0])) {
      return (
        <FlexLayout justifyContent="center">
          <StackingLayout>
            <TextGroup>
              <Title size={ 'h3' }>
                { i18nT('dp_policy', 'Data Protection Policy') }
              </Title>
              <Paragraph>
                { i18nT('page_desc', 'page_desc') }
              </Paragraph>
            </TextGroup>
            <FlexLayout justifyContent="center" alignItems="center" itemSpacing="0px">
              <div className="side-box-container box-container">
                <div>
                  { primaryFs }
                </div>
              </div>
              <DotIcon className="dot-icon" />
              <div className="hr-line">
                <hr />
              </div>
              <TriangleRightIcon className="triangle-icon" />
              <div className="mid-box-container box-container">
                <StackingLayout>
                  <div>
                    <img src={ Activated } alt="Activate Icon" />
                    { i18nT('policy', 'Policy') }
                  </div>
                  <div className="box-content">
                    <div className="margin-top-text">
                      { policyName }
                    </div>
                    <div className="activated-box margin-top-text">
                      { i18nT('activated', 'Activated') }
                    </div>
                  </div>
                </StackingLayout>
              </div>
              <DotIcon className="dot-icon" />
              <div className="hr-line">
                <hr />
              </div>
              <TriangleRightIcon className="triangle-icon" />
              <div className="side-box-container box-container">
                <div>
                  { recoveryFs }
                </div>
              </div>
            </FlexLayout>
          </StackingLayout>
        </FlexLayout>
      );
    }

    return (
      <FlexLayout justifyContent="center" alignItems="center" itemSpacing="0px">
        <ReverseReplicationPolicyPage
          entity={ this.props.entity }
          handleReverseReplicationClick={ this.props.handleReverseReplicationClick }
          handleSelectChange={ this.props.handleSelectChange }
          selectedLocation={ this.props.selectedLocation }
          modalState={ this.props.modalState }
        />
      </FlexLayout>
    );
  }

}

export default ResumeReplicationDataProtectionPolicyPage;

