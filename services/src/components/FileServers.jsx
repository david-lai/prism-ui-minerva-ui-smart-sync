//
// Copyright (c) 2019 Nutanix Inc. All rights reserved.
//
// The file servers main view
//
import React from 'react';
import { EntityBrowser, EBActionsUtil } from 'ebr-ui';
import { LeftNavLayout, Loader, Menu, MenuGroup, MenuItem, StackingLayout, TextLabel, Title, Divider } from 'prism-reactjs';
import EntityConfigs from '../config/entity_configs.js';
import AppConstants from '../utils/AppConstants';
import AppUtil from '../utils/AppUtil';
import EBComponentFactory from '../utils/EBComponentFactory';
import i18n from '../utils/i18n';
import FileServersManageVersion from './FileServersManageVersion';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'FileServers', key, defaultValue, replacedValue);

class FileServers extends React.Component {

  static propTypes = {
  };

  constructor(props) {
    super(props);

    this.state = {
      fileServersNum: 4,
      ebConfiguration: this.getEbConfiguration(AppConstants.ENTITY_TYPES.ENTITY_FILE_SERVER),
      filesEnabled: false
    };

  }

  getEbConfiguration= (entityType) => {
    // EB Configurations
    this.entityTypes = [
      entityType
    ];
    this.entityTypeDisplayNames = {
      [AppConstants.ENTITY_TYPES.ENTITY_FILE_SERVER]: {
       singular: AppConstants.ENTITY_TYPE_NAME.ENTITY_FILE_SERVER,
        plural: AppConstants.ENTITY_TYPE_NAME_PLURAL.ENTITY_FILE_SERVER
      },
     [AppConstants.ENTITY_TYPES.ENTITY_ALERT]: {
        singular: AppConstants.ENTITY_TYPE_NAME.ENTITY_ALERT,
        plural: AppConstants.ENTITY_TYPE_NAME_PLURAL.ENTITY_ALERT
      },
      [AppConstants.ENTITY_TYPES.ENTITY_EVENT]: {
        singular: AppConstants.ENTITY_TYPE_NAME.ENTITY_EVENT,
        plural: AppConstants.ENTITY_TYPE_NAME_PLURAL.ENTITY_EVENT
      }
    };
   this.entityGroupings = [
    {
       sectionName: '',
       entities: [
         {
           entity: entityType
         }
       ]
     }
   ];

    // Create the EB configuration we will be using
    const queryConfig = {
      pollingSec: AppConstants.POLLING_FREQ_SECS,
      //queryProcessorName: 'ListV3UQDC'
      queryProcessorName: 'GroupsV3UQDC'
    };

    return {
      ebId: entityType,
      entityTypes: this.entityTypes,
      entityTypeDisplayNames: this.entityTypeDisplayNames,
      selectedEntityType: this.entityTypes[0],
      entityConfigs: EntityConfigs,
      entityGroupings: this.entityGroupings,
      showEntityTypeSelector: false,
      showFiltersBar: false,
      showFiltersPanel: true,
      filterBarPlaceholder: i18nT('typeName', 'Type name to filter'),
      filtersPanelCollapsed: true,
      queryConfig,
      ebComponentFactory: EBComponentFactory.getInstance()
    };

  }

  onMenuChange = (e) => {
    console.log(e.key);
    this.setState({ebConfiguration: this.getEbConfiguration(e.key)});
  //  this.setState({ currentPanelKey: e.key });
    console.log(this.state);
  }

  onEnableFiles = () => {
    this.setState({filesEnabled: true});
  }

  getLeftPanel() {
    const fileServers_num = Number(this.state.fileServersNum);
    const numFileServers = this.renderFileServersCount(fileServers_num);

    return (
      <Menu oldMenu={ false }
        itemSpacing="10px"
        padding="20px-0px"
        activeKeyPath={ [this.state.currentPanelKey, '1'] }
        onClick={ this.onMenuChange } style={ { width: '240px' } } >

        <StackingLayout padding="0px-20px" itemSpacing="10px">
          <Title>{ i18nT('files', 'Files') }</Title>
          <div><TextLabel>{ numFileServers }</TextLabel></div>
          <Divider type="short" />
          <div><TextLabel>{ i18nT('summary', 'Summary') }</TextLabel></div>
        </StackingLayout>

        <MenuGroup key="1">
          <MenuItem key={AppConstants.ENTITY_TYPES.ENTITY_FILE_SERVER}>
            { i18nT('fileServers', 'File Servers') }
          </MenuItem>
          <MenuItem key={AppConstants.ENTITY_TYPES.ENTITY_ALERT}>
            { i18nT('alerts', 'Alerts') }
          </MenuItem>
          <MenuItem key={AppConstants.ENTITY_TYPES.ENTITY_EVENT}>
            { i18nT('events', 'Events') }
          </MenuItem>
        </MenuGroup>
      </Menu>
    );  
  }

  // Render buckets counts accounting for unavailability
  renderFileServersCount(count) {
    if (isNaN(count)) {
      return <Loader tip={ i18nT('fileServers', 'File Servers') } />;
    }
    switch (count) {
      case -1:
        return <Loader tip={ i18nT('fileServers', 'File Servers') } />;
      case 0:
        return i18nT('noFileServer', 'No File Server');
      case 1:
        return i18nT('oneFileServer', 'One File Server');
      default:
        return i18nT('numOfFileServers', '{num} File Servers',
          { num: AppUtil.rawNumericFormat(count) });
    }
  } 

  render() {
    if (this.state.filesEnabled) {
     return (
       <LeftNavLayout leftPanel={ this.getLeftPanel() } itemSpacing="0"
         rightBodyContent={
           <EntityBrowser { ...this.state.ebConfiguration } />
         } />
     );
    } else {
      return <FileServersManageVersion enableFiles = { this.onEnableFiles } />;
    }
    
  }

}

export default FileServers;
