//
// Copyright (c) 2019 Nutanix Inc. All rights reserved.
//
// The file servers manage version view
//
import React from 'react';
import { Link, StackingLayout, Title, Paragraph, Alert, Divider, ContainerLayout, Button,
  FlexLayout } from 'prism-reactjs';
import PropTypes from 'prop-types';
import i18n from '../utils/i18n';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'FileServersManageVersion', key, defaultValue, replacedValue);
const nutanixFileDesc = 'A native file-storage solution for unstructured data. Files provides a' +
  'highly available and massively scalable data repository for a wide rand of deployments and' +
  'applications.';
const enableFilesDesc = 'Once enabled, File servers across all of your Nutanix Clusters can be' +
  'managed from Prism Central(PC). File Server Manager(FSM) is required to manage File Servers' +
  'from PC';
const fileServerManagerInfo = 'PC is not running the latest verion of the File Server Manager.' +
  'Use {lcm} to upgrade FSM to the latest version.';


class FileServersManageVersion extends React.Component {

  getLCM() {
    return (
      <Link>
        { i18nT('lcm', 'Life Cycle Management(LCM)') }
      </Link>
    );
  }

  render() {
    return (
      <FlexLayout style={ { height: '800px' } } alignItems="center" justifyContent="center">
        <StackingLayout style={ { width: '550px' } } itemSpacing="20px">
          <FlexLayout justifyContent="center">
            <Title size="h2">{ i18nT('nutanix_files', 'Nutanix Files') }</Title>
          </FlexLayout>
          <FlexLayout justifyContent="center">
            <Paragraph type="secondary">{ i18nT('nutanix_files_desc', nutanixFileDesc) }
            </Paragraph>
          </FlexLayout>
          <Divider />
          <FlexLayout justifyContent="center">
            <Title size="h3">{ i18nT('enable_files', 'Enable Files') }</Title>
          </FlexLayout>
          <FlexLayout justifyContent="center">
            <Paragraph type="secondary">{ i18nT('enable_files_desc', enableFilesDesc) }</Paragraph>
          </FlexLayout>
          <FlexLayout justifyContent="center">
            <Alert type={ Alert.TYPE.INFO }
              message={ i18nT('file_server_manager_info', fileServerManagerInfo,
                { lcm: this.getLCM() }) } />
          </FlexLayout>
          <Title size="h3">{i18nT('file_server_manager_version', 'File Server Manager Version')}
          </Title>
          <FlexLayout>
            <ContainerLayout backgroundColor="white" style={ {
              width: '500px',
              padding:'10px 10px 10px 10px' } } border={ true }>
              <StackingLayout itemSpacing="10px">
                <FlexLayout justifyContent="space-between">
                  <Title size="h3">{i18nT('current_version', 'Current Version')}</Title>
                  <Title size="h3">1.0</Title>
                </FlexLayout>
                <FlexLayout justifyContent="space-between">
                  <Title size="h3">{i18nT('latest_version', 'Latest Version')}</Title>
                  <Title size="h3">2.0</Title>
                </FlexLayout>
              </StackingLayout>
            </ContainerLayout>
          </FlexLayout>
          <FlexLayout justifyContent="center">
            <Button onClick={ this.props.enableFiles }>{ i18nT('enable_files', 'Enable Files') }
            </Button>
          </FlexLayout>
        </StackingLayout>
      </FlexLayout>
    );
  }

}

FileServersManageVersion.propTypes = {
  enableFiles: PropTypes.func
};

export default FileServersManageVersion;
