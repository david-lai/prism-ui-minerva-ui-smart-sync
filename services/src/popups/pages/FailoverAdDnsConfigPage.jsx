//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// FailoverAdDnsConfigPage is the Active Directory and DNS Configuration for Failover Action popup
//
import React from 'react';
import PropTypes from 'prop-types';
import {
  FlexItem,
  FlexLayout,
  Form,
  TextGroup,
  Title,
  Divider,
  Paragraph,
  Radio,
  FormLayout,
  FormItemInput,
  InputPassword,
  StackingLayout
} from '@nutanix-ui/prism-reactjs';

// Local includes
import AppConstants from '../../utils/AppConstants';
import FailoverConfirmModal from '../FailoverConfirmModal.jsx';

import i18n from '../../utils/i18n';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'FailoverAdDnsConfigPage', key, defaultValue, replacedValue);

class FailoverAdDnsConfigPage extends React.Component {

  static propTypes = {
    inputChanged: PropTypes.func,
    handleOnClose: PropTypes.func,
    handleOnConfirm: PropTypes.func,
    confirmVisible: PropTypes.bool,
    handleAutoUpdateOnChange: PropTypes.func,
    modalState: PropTypes.object
  }

  render() {
    return (
      <div>
        <FailoverConfirmModal
          confirmVisible={ this.props.confirmVisible }
          handleOnClose={ this.props.handleOnClose }
          handleOnConfirm={ this.props.handleOnConfirm }
        />
        <Form>
          <FormLayout
            padding="0px-20px"
            justifyContent="center"
            flexDirection="column"
            itemSpacing="10px"
            contentWidth="750px"
          >
            <StackingLayout
              style={ { width: '750px' } }
              itemSpacing="10px"
              className="ntnx-form-item-provider"
            >
              <FlexItem>
                <Paragraph>
                  { i18nT('ad_dns_config_desc', 'ad_dns_config_desc') }
                </Paragraph>
              </FlexItem>
              <FlexItem>
                <Title size={ 'h3' }>
                  { i18nT('fs_ame', 'File Server Name') }
                </Title>
                <div className="fs-domain-name">
                    Ger-PrimaryFS
                </div>
              </FlexItem>
              <FlexItem>
                <TextGroup>
                  <Title size={ 'h3' }>
                    { i18nT('ad_credentials', 'Active Directory Credentials') }
                  </Title>
                  <Paragraph>
                    { i18nT('ad_domain_name', 'Active Directory Domain Name') }
                  </Paragraph>
                </TextGroup>
              </FlexItem>
              <div className="fs-domain-name">
                  demo.local
              </div>
              <FlexLayout
                justifyContent={ 'space-between' }
                itemFlexBasis={ '100pc' }
              >
                <FormItemInput
                  id="adDomainUsername"
                  label={ i18nT('admin_username', 'Administrator Username') }
                  defaultValue={ this.props.modalState.adDomainUsername }
                  onChange={ this.props.inputChanged }
                />
                <div className="ntnx-form-item-provider ntnx-stacking-layout ntnx">
                  <div className="password-label">
                    <label htmlFor="adDomainPassword">
                      { i18nT('password', 'Password') }
                    </label>
                  </div>
                  <InputPassword
                    id="adDomainPassword"
                    defaultValue={ this.props.modalState.adDomainPassword }
                    label={ i18nT('password', 'Password') }
                    onChange={ this.props.inputChanged }
                  />
                </div>
              </FlexLayout>
              <Divider />
              <FlexItem>
                <TextGroup>
                  <Title size={ 'h3' }>
                    { i18nT('fs_dns', 'File Server DNS Entries') }
                  </Title>
                  <Paragraph>
                    { i18nT('fs_specific_dns', 'fs_specific_dns') }
                  </Paragraph>
                </TextGroup>
              </FlexItem>
              <Radio
                name="dnsUpdateRadio"
                value={ AppConstants.DNS_UPDATE_TYPE.MS_DNS }
                onChange={ this.props.handleAutoUpdateOnChange }
                checked={ this.props.modalState.autoUpdateChecked }
              >
                { i18nT('auto_update', 'Automatically Update entires(MS-DNS only)') }
              </Radio>
              <Radio
                name="dnsUpdateRadio"
                value={ AppConstants.DNS_UPDATE_TYPE.MANUAL }
                onChange={ this.props.handleAutoUpdateOnChange }
                checked={ !this.props.modalState.autoUpdateChecked }
              >
                { i18nT('manual_update', 'Manually update Entries (All other DNS)') }
              </Radio>
              <FormItemInput
                id="preferredNameServer"
                defaultValue={ this.props.modalState.preferredNameServer }
                label={ i18nT('preferred_ns', 'Preferred Name Server') }
                onChange={ this.props.inputChanged }
              />
            </StackingLayout>
            <FlexLayout
              justifyContent={ 'space-between' }
              itemFlexBasis={ '100pc' }
            >
              <FormItemInput
                id="dnsUsername"
                defaultValue={ this.props.modalState.dnsUsername }
                label={ i18nT('username', 'Username') }
                onChange={ this.props.inputChanged }
              />
              <div className="ntnx-form-item-provider ntnx-stacking-layout ntnx">
                <div className="password-label">
                  <label htmlFor="dnsPassword">
                    { i18nT('password', 'Password') }
                  </label>
                </div>
                <InputPassword
                  id="dnsPassword"
                  defaultValue={ this.props.modalState.dnsPassword }
                  label={ i18nT('password', 'Password') }
                  onChange={ this.props.inputChanged }
                />
              </div>
            </FlexLayout>
          </FormLayout>
        </Form>
      </div>
    );
  }

}

export default FailoverAdDnsConfigPage;

