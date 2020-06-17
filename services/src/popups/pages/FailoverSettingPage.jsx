//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// FailoverSettingPage is the Failover/Failout Settings for Failover Action popup
//
import React from 'react';
import PropTypes from 'prop-types';
import {
  FlexItem,
  FlexLayout,
  Form,
  Divider,
  TextGroup,
  Paragraph,
  Radio,
  Title,
  FormLayout,
  TriangleUpIcon,
  TriangleDownIcon,
  TriangleLeftIcon,
  TriangleRightIcon,
  DotIcon
} from '@nutanix-ui/prism-reactjs';

import ReverseReplicationPolicyPage from './ReverseReplicationPolicyPage.jsx';

// Local includes
import AppConstants from '../../utils/AppConstants';

// Utils
import Activated from '../../assets/images/Activated.svg';
import Deleted from '../../assets/images/Deleted.svg';

import i18n from '../../utils/i18n';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'FailoverSettingPage', key, defaultValue, replacedValue);


class FailoverSettingPage extends React.Component {

  static propTypes = {
    handlePlannedUnplannedOnChange: PropTypes.func,
    handleReverseReplicationClick: PropTypes.func,
    handleSelectChange: PropTypes.func,
    inputChanged: PropTypes.func,
    action: PropTypes.string,
    entity: PropTypes.object,
    modalState: PropTypes.object
  }

  renderFailoverRadioButton() {
    if (this.props.action === AppConstants.PROTECTED_FILE_SERVERS_ACTIONS.FAILOVER) {
      return (
        <FlexLayout
          justifyContent={ 'space-between' }
          itemFlexBasis={ '100pc' }
        >
          <Radio
            name="failoverRadio"
            value={ AppConstants.FAILOVER_TYPE.UNPLANNED }
            onChange={ this.props.handlePlannedUnplannedOnChange }
            checked={ !this.props.modalState.plannedChecked }
          >
            { i18nT('unplanned_failover', 'Unplanned Failover') }
          </Radio>
          <Radio
            name="failoverRadio"
            value={ AppConstants.FAILOVER_TYPE.PLANNED }
            onChange={ this.props.handlePlannedUnplannedOnChange }
            checked={ this.props.modalState.plannedChecked }
          >
            { i18nT('planned_failover', 'Planned Failover') }
          </Radio>
        </FlexLayout>
      );
    }
    return null;
  }

  render() {
    const { owner_fs_name: primaryFs, primary_fs_name: recoveryFs } = this.props.entity;
    return (
      <Form
        onSubmit={ this.handleFormSubmit }
      >
        <FormLayout
          padding="0px-20px"
          justifyContent="center"
          flexDirection="column"
          itemSpacing="10px"
          contentWidth="500px"
        >
          { this.renderFailoverRadioButton()}
          <FlexItem>
            <div className="top-section-label-container">
              <div className="top-section-label1">
                { i18nT('from', 'From (Primary)') }
              </div>
              <div className="top-section-label2">
                { i18nT('shares', 'Shares') }
              </div>
              <div>
                { i18nT('to', 'To (Recovery)') }
              </div>
            </div>
          </FlexItem>
          <FlexItem className="top-section">
            <div className="first-page-section-container">
              <div className="box-container">
                <div>
                  { primaryFs }
                </div>
              </div>
              <DotIcon className="top-dot-icon" />
              <div className="hr-line">
                <hr />
              </div>
              <DotIcon className="top-dot-icon" />
              <div className="box-container">
                Shares
              </div>
              <DotIcon className="top-dot-icon" />
              <div className="hr-line">
                <hr />
              </div>
              <DotIcon className="top-dot-icon" />
              <div className="box-container">
                <div>
                  { recoveryFs }
                </div>
              </div>
            </div>
          </FlexItem>
          <Divider />
          { this.getBottomSection() }
        </FormLayout>
      </Form>
    );
  }

  getBottomSection() {
    if (this.props.action === AppConstants.PROTECTED_FILE_SERVERS_ACTIONS.FAILOVER) {
      return (
        <ReverseReplicationPolicyPage
          entity={ this.props.entity }
          handleReverseReplicationClick={ this.props.handleReverseReplicationClick }
          handleSelectChange={ this.props.handleSelectChange }
          inputChanged={ this.props.inputChanged }
          modalState={ this.props.modalState }
        />
      );
    }
    return this.failbackPart();
  }

  failbackPart() {
    const {
      owner_fs_name: primaryFs,
      primary_fs_name: recoveryFs,
      policy_name: policyName
    } = this.props.entity;

    const emptyDiv = null;

    return (
      <FlexItem>
        <TextGroup>
          <Title size="h3">
            { i18nT('dp_policies', 'dp_policies') }
          </Title>
          <Paragraph>
            { i18nT('dp_policies_desc', 'dp_policies_desc') }
          </Paragraph>
        </TextGroup>
        <div className="failback-boxes-container" >
          <div className="upper-right-box">{ emptyDiv }</div>
          <div className="upper-left-box">{ emptyDiv }</div>
          <div className="lower-right-box">{ emptyDiv }</div>
          <div className="lower-left-box">{ emptyDiv }</div>
          <TriangleRightIcon className="triangle-right-icon triangle-icon" />
          <div className="top-box top-bottom-box failback-box">
            <div>
              <div>
                <img src={ Deleted } alt="Deleted Icon" />
                { i18nT('policy', 'Policy') }
              </div>
              <div className="box-content">
                <div className="margin-top-text">
                  { `Rev-${policyName}` }
                </div>
                <div className="deleted-box margin-top-text">
                  { i18nT('deleted', 'Deleted') }
                </div>
              </div>
            </div>
          </div>
          <DotIcon className="top-box-dot dot-icon" />
          <TriangleUpIcon className="triangle-up-icon triangle-icon" />
          <div className="left-box left-right-box failback-box">
            <div className="box-content">
              <div>
                { i18nT('pa_fs', 'Primary / Active File Server') }
              </div>
              <div className="margin-top-text">
                { primaryFs }
              </div>
            </div>
          </div>
          <DotIcon className="left-box-dot dot-icon" />
          <TriangleDownIcon className="triangle-down-icon triangle-icon" />
          <div className="right-box left-right-box failback-box">
            <div className="box-content">
              <div>
                { i18nT('rs_fs', 'Recovery / Standby File Server') }
              </div>
              <div className="margin-top-text">
                { recoveryFs }
              </div>
            </div>
          </div>
          <DotIcon className="right-box-dot dot-icon" />
          <TriangleLeftIcon className="triangle-left-icon triangle-icon" />
          <div className="bottom-box top-bottom-box failback-box">
            <div>
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
            </div>
          </div>
          <DotIcon className="bottom-box-dot dot-icon" />
        </div>
      </FlexItem>
    );
  }

}

export default FailoverSettingPage;

