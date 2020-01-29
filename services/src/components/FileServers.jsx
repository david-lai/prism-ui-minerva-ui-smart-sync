//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The file servers main view
//
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EntityBrowser } from 'ebr-ui';
import {
  Badge,
  Divider,
  FlexItem,
  FlexLayout,
  LeftNavLayout,
  Loader,
  Menu,
  MenuGroup,
  MenuItem,
  StackingLayout,
  TextLabel,
  Title
} from 'prism-reactjs';
import EntityConfigs from '../config/entity_configs.js';
import AppConstants from '../utils/AppConstants';
import AppUtil from '../utils/AppUtil';
import EBComponentFactory from '../utils/EBComponentFactory';
import i18n from '../utils/i18n';

import Summary from './Summary.jsx';


// Actions
import {
  openModal,
  fetchFsData,
  fetchAlerts,
  fetchServerAlerts,
  fetchClusterInfo,
  setTab
} from '../actions';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'FileServers', key, defaultValue, replacedValue);

class FileServers extends React.Component {

  static propTypes = {
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      ebConfiguration: this.getEbConfiguration(AppConstants.ENTITY_TYPES.ENTITY_FILE_SERVER),
      tabKeys: [
        AppConstants.SUMMARY_TAB_KEY,
        AppConstants.ENTITY_TYPES.ENTITY_FILE_SERVER,
        AppConstants.ENTITY_TYPES.ENTITY_ALERT,
        AppConstants.ENTITY_TYPES.ENTITY_EVENT
      ]
    };
  }

  getEbConfiguration = (entityType) => {
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
      ebComponentFactory: EBComponentFactory.getInstance({ openModal: this.props.openModal })
    };
  }

  onMenuChange = (e) => {
    let tabIndex = +(e.key.substr(e.key.lastIndexOf('_') + 1));
    if (isNaN(tabIndex)) {
      tabIndex = 0;
    }
    this.props.setTab(tabIndex);
  }

  /**
   * Fetches and populates server alert data if not present
   *
   * @return {undefined}
   */
  populateServerAlerts() {
    if (this.props.fsData && this.props.fsData.filtered_entity_count) {
      const fsIds = this.props.fsData.group_results.flatMap((gr) => {
        return gr.entity_results.map(er => er.entity_id);
      });
      if (fsIds && Array.isArray(fsIds) && fsIds.length) {
        fsIds.forEach(this.props.fetchServerAlerts);
      }
    }
  }

  /**
   * Fetches and populates cluster data for missing cluster uuids
   *
   * @return {undefined}
   */
  populateClusterData() {
    if (this.props.fsData && this.props.fsData.filtered_entity_count) {
      const clusterIds = Array.from(
        new Set(
          AppUtil.extractGroupResults(this.props.fsData)
            .map(er => er.cluster_uuid)
        )
      );

      if (clusterIds && Array.isArray(clusterIds) && clusterIds.length) {
        let clusterKeys = [];
        if (this.props.clusters) {
          clusterKeys = Object.keys(this.props.clusters);
        }

        clusterIds.forEach((clusterId) => {
          if (clusterKeys.indexOf(clusterId) === -1) {
            this.props.fetchClusterInfo(clusterId);
          }
        });
      }
    }
  }

  /**
   * Data polling method
   *
   * @return {undefined}
   */
  refreshSummaryData() {
    this.props.fetchFsData();
    this.props.fetchAlerts();
    this.populateServerAlerts();
    this.populateClusterData();
  }

  getLeftPanel() {
    const fileServers_num = Number(this.props.fsData && this.props.fsData.filtered_entity_count);
    const numFileServers = this.renderFileServersCount(fileServers_num);
    let alertCount = 0;
    let maxSeverity = -1;
    const severities = [
      'info',
      'warning',
      'critical'
    ];
    let alertBadgeColor = Badge.BADGE_COLOR_TYPES.GRAY;
    if (this.props.alertsData && this.props.alertsData.filtered_entity_count) {
      alertCount = +this.props.alertsData.filtered_entity_count;
      AppUtil.extractGroupResults(this.props.alertsData).forEach((alert) => {
        const asIndex = severities.indexOf(alert.severity);
        if (maxSeverity < asIndex) {
          maxSeverity = asIndex;
        }
      });
    }
    if (maxSeverity === 1) {
      alertBadgeColor = Badge.BADGE_COLOR_TYPES.YELLOW;
    } else if (maxSeverity === 2) {
      alertBadgeColor = Badge.BADGE_COLOR_TYPES.RED;
    }

    return (
      <Menu oldMenu={ false }
        itemSpacing="10px"
        padding="20px-0px"
        activeKeyPath={ [`tab_${this.props.tabIndex}`, '1'] }
        onClick={ this.onMenuChange } style={ { width: '240px' } } >

        <StackingLayout padding="0px-20px" itemSpacing="10px">
          <Title>{ i18nT('files', 'Files') }</Title>
          <div><TextLabel>{ numFileServers }</TextLabel></div>
          <Divider type="short" />
        </StackingLayout>

        <MenuGroup key="1">
          <MenuItem key={ 'tab_0' } active={ this.props.tabIndex === 0 }>
            { i18nT('summary', 'Summary') }
          </MenuItem>
          <MenuItem key={ 'tab_1' } active={ this.props.tabIndex === 1 }>
            { i18nT('fileServers', 'File Servers') }
          </MenuItem>
          <MenuItem key={ 'tab_2' } active={ this.props.tabIndex === 2 }>
            <FlexLayout flexGrow="1" justifyContent="space-between">
              <FlexItem>
                { i18nT('alerts', 'Alerts') }
              </FlexItem>
              <FlexItem>
                { !alertCount &&
                  (
                    <Loader />
                  )
                }
                { alertCount > 0 &&
                  (
                    <Badge
                      color={ alertBadgeColor }
                      count={ AppUtil.rawNumericFormat(alertCount) }
                    />
                  )
                }
              </FlexItem>
            </FlexLayout>
          </MenuItem>
          <MenuItem key={ 'tab_3' } active={ this.props.tabIndex === 3 }>
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
        return <Loader tip={ i18nT('files', 'Files') } />;
      case 0:
        return i18nT('noFileServer', 'No File Servers');
      case 1:
        return i18nT('oneFileServer', 'One File Server');
      default:
        return i18nT('numOfFileServers', '{num} File Servers',
          { num: AppUtil.rawNumericFormat(count) });
    }
  }

  render() {
    if (this.state.loading) {
      return <Loader />;
    }
    return (
      <LeftNavLayout leftPanel={ this.getLeftPanel() } itemSpacing="0"
        rightBodyContent={ this.props.tabIndex > 0 ? (
          <EntityBrowser { ...this.state.ebConfiguration } />
        ) : (
          <Summary />
        )
        } />
    );
  }


  // Start Polling alerts data
  componentWillMount() {
    this.refreshSummaryData();
    this.dataPolling = setInterval(
      () => {
        this.refreshSummaryData();
      }, AppConstants.POLLING_FREQ_SECS * 1000);
  }

  // Set eb configuration depending on tabIndex prop
  componentWillReceiveProps(nextProps) {
    if (this.props.tabIndex !== nextProps.tabIndex) {
      if (nextProps.tabIndex > 0) {
        this.setState({
          ebConfiguration: this.getEbConfiguration(this.state.tabKeys[nextProps.tabIndex])
        });
      }
    }
  }

  // Load initial fs alerts if not present
  componentDidUpdate(prevProps) {
    if (!prevProps.fsData && this.props.fsData) {
      this.populateServerAlerts();
      this.populateClusterData();
    }
  }

  // Stop Polling FS data
  componentWillUnmount() {
    clearInterval(this.dataPolling);
  }

}

const mapStateToProps = state => {
  return {
    fsData: state.groupsapi.fsData,
    alertsData: state.groupsapi.alertsData,
    clusters: state.groupsapi.clusters,
    tabIndex: state.tabs.tabIndex
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openModal: (type, options) => dispatch(openModal(type, options)),
    fetchFsData: () => dispatch(fetchFsData()),
    fetchServerAlerts: (serverId) => dispatch(fetchServerAlerts(serverId)),
    fetchAlerts: () => dispatch(fetchAlerts()),
    fetchClusterInfo: (clusterId) => dispatch(fetchClusterInfo(clusterId)),
    setTab: (tabIndex) => dispatch(setTab(tabIndex))
  };
};

FileServers.propTypes = {
  openModal: PropTypes.func,
  fsData: PropTypes.object,
  alertsData: PropTypes.object,
  clusters: PropTypes.object,
  filtered_entity_count: PropTypes.string,
  fetchClusterInfo: PropTypes.func,
  fetchFsData: PropTypes.func,
  fetchServerAlerts: PropTypes.func,
  fetchAlerts: PropTypes.func,
  setTab: PropTypes.func,
  tabIndex: PropTypes.number
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileServers);
