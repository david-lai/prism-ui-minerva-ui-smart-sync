//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// ReverseReplicationPolicyPage is the Failover/Failout Settings for Failover Action popup
//
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  FlexItem,
  FlexLayout,
  Divider,
  TextGroup,
  Paragraph,
  Checkbox,
  Title,
  FormLayout,
  FormItemSelect,
  StackingLayout,
  DotIcon,
  FormItemInput
} from '@nutanix-ui/prism-reactjs';

import i18n from '../../utils/i18n';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'ReverseReplicationPolicyPage', key, defaultValue, replacedValue);

class ReverseReplicationPolicyPage extends React.Component {

  static propTypes = {
    handleReverseReplicationClick: PropTypes.func,
    handleSelectChange: PropTypes.func,
    inputChanged: PropTypes.func,
    entity: PropTypes.object,
    selectedLocation: PropTypes.string,
    modalState: PropTypes.object
  }
  getHeader = () => {
    const {
      owner_fs_name: primaryFs,
      primary_fs_name: recoveryFs
    } = this.props.entity;

    if (this.props.selectedLocation) {
      return (
        <TextGroup>
          <Title size={ 'h3' }>
            { i18nT('data_protection_policy', 'Data Protection Policy') }
          </Title>
          <Paragraph>
            { i18nT('data_protection_policy_desc', 'data_protection_policy_desc') }
          </Paragraph>
        </TextGroup>
      );
    } else if (primaryFs === recoveryFs) {
      return (
        <div>
          <Checkbox id="default_unchecked" label={ i18nT('create_policy', 'create_policy') }
            checked={ this.props.modalState.createReverseReplicationPolicy }
            onChange={ this.props.handleReverseReplicationClick }
          />
          <Paragraph className="checkobx-description">
            { i18nT('create_policy_desc', 'create_policy_desc') }
          </Paragraph>
        </div>
      );
    }
    return (
      <div>
        <Paragraph className="checkobx-description">
          { i18nT('reverse_replication_policy_desc', 'reverse_replication_policy_desc') }
        </Paragraph>
      </div>
    );
  }

  render() {
    const {
      owner_fs_name: primaryFs,
      primary_fs_name: recoveryFs
    } = this.props.entity;

    return (
      <FlexItem>
        { this.getHeader() }
        <div className="first-page-section-container" >
          <div className="box-container">
            <div>
              { recoveryFs }
            </div>
          </div>
          <DotIcon className="bottom-dot-icon" />
          <div className="hr-line">
            <hr />
          </div>
          <DotIcon className="bottom-dot-icon" />
          <div className="rpo-cointainer">
            {this.getRPOSelect()}
          </div>
          <DotIcon className="bottom-dot-icon" />
          <div className="hr-line">
            <hr />
          </div>
          <DotIcon className="bottom-dot-icon" />
          <div className="box-container">
            <div>
              { primaryFs }
            </div>
          </div>
        </div>
      </FlexItem>
    );
  }

  getRPOSelect() {
    return (
      <FormLayout
        padding="0px-20px"
        justifyContent="center"
        flexDirection="column"
        itemSpacing="10px"
        contentWidth="230px"
      >
        <FlexLayout>
          <StackingLayout
            style={ { width: '320px' } }
            itemSpacing="10px"
            className="ntnx-form-item-provider"
          >
            { this.props.selectedLocation ? (
              <Checkbox
                id="default_unchecked"
                className="dp_policy_checkbox"
                label={ i18nT('dp_policy_title', 'Create a Data Protection Policy') }
                checked={ this.props.modalState.createReverseReplicationPolicy }
                onChange={ this.props.handleReverseReplicationClick }
              />
            ) : (
              null
            ) }
            <label>
              { i18nT('rpo', 'Recovery Point Objective (RPO)') }
            </label>
            <FlexLayout
              padding="10px-0px"
              itemFlexBasis="100pc"
            >
              <FlexItem>
                <FormItemSelect
                  id="recInterval"
                  selectedRow={ this.props.modalState.selectedRecoveryInterval }
                  rowsData={ this.props.modalState.recoveryInterval }
                  onSelectedChange={ this.props.handleSelectChange }
                />
              </FlexItem>
              <FlexItem>
                <FormItemSelect
                  id="recoveryIntervalUnit"
                  selectedRow={ this.props.modalState.selectedRecoveryIntervalUnit }
                  rowsData={ this.props.modalState.recoveryIntervalUnit }
                  onSelectedChange={ this.props.handleSelectChange }
                />
              </FlexItem>
            </FlexLayout>
            <Divider
              className="dark-divider"
            />
            <FormItemInput
              id="rpoPolicyName"
              defaultValue={ this.props.modalState.rpoPolicyName }
              label={ i18nT('policy_name', 'Policy Name') }
              onChange={ this.props.inputChanged }
            />
          </StackingLayout>
        </FlexLayout>
      </FormLayout>
    );
  }

  getRecoveryInterval = (range) => {
    const optionsArray = new Array(range);
    return _.map(optionsArray, (option, index) => {
      return {
        key: (index + 1).toString(),
        label: (index + 1).toString()
      };
    });
  }

}

export default ReverseReplicationPolicyPage;

