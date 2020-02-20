//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The file servers main view
//
import React from 'react';
import { connect } from 'react-redux';
import {
  Route,
  withRouter
} from 'react-router-dom';
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
import { WindowsMessageUtil } from 'prism-utils-common';
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
  fetchServerAlerts
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
      fsEbConfiguration: this.getEbConfiguration(AppConstants.ENTITY_TYPES.ENTITY_FILE_SERVER),
      alertEbConfiguration: this.getEbConfiguration(AppConstants.ENTITY_TYPES.ENTITY_ALERT),
      eventEbConfiguration: this.getEbConfiguration(AppConstants.ENTITY_TYPES.ENTITY_EVENT),
      currentPanelKey: props.location.pathname.substring(1)
        ? props.location.pathname.substring(1) : AppConstants.SUMMARY_TAB_KEY
    };

    this.onMenuChange = this.onMenuChange.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.addEventListener = this.addEventListener.bind(this);
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

  /**
   * Fetches and populates server alert data if not present
   *
   * @return {undefined}
   */
  populateServerAlerts() {
    if (this.props.fsData && this.props.fsData.filtered_entity_count) {
      const fsIds = AppUtil.extractGroupResults(this.props.fsData).map(fsItem => fsItem.entity_id);
      if (fsIds && Array.isArray(fsIds) && fsIds.length) {
        fsIds.forEach(this.props.fetchServerAlerts);
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
        activeKeyPath={ [this.state.currentPanelKey, '1'] }
        onClick={ this.onMenuChange } style={ { width: '240px' } } >

        <StackingLayout padding="0px-20px" itemSpacing="10px">
          <Title>{ i18nT('files', 'Files') }</Title>
          <div><TextLabel>{ numFileServers }</TextLabel></div>
          <Divider type="short" />
        </StackingLayout>

        <MenuGroup key="1">
          <MenuItem key={ AppConstants.SUMMARY_TAB_KEY }
            active={ this.state.currentPanelKey === AppConstants.SUMMARY_TAB_KEY }>
            { i18nT('summary', 'Summary') }
          </MenuItem>
          <MenuItem key={ AppConstants.FILE_SERVERS_TAB_KEY }
            active={ this.state.currentPanelKey === AppConstants.FILE_SERVERS_TAB_KEY }>
            { i18nT('fileServers', 'File Servers') }
          </MenuItem>
          <MenuItem key={ AppConstants.ALERTS_TAB_KEY }
            active={ this.state.currentPanelKey === AppConstants.ALERTS_TAB_KEY }>
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
          <MenuItem key={ AppConstants.EVENTS_TAB_KEY }
            active={ this.state.currentPanelKey === AppConstants.VENTS_TAB_KEY }>
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

  // Event handler for left panel tab click
  onMenuChange = (e) => {
    const key = (typeof e === 'object') ? e.key : e;
    this.setState({
      currentPanelKey: key
    });
    this.props.history.push(`/${key}`);
    this.changePcUrl(key);
  }

  // Change PC URL
  changePcUrl(url) {
    WindowsMessageUtil.postMessage({
      service: AppConstants.SERVICE_NAME.PRISM_UI,
      target: AppConstants.IFRAME_EVENT_CHANGE_PC_URL,
      state: AppConstants.FS_CHANGE_PC_URL,
      serviceTargets: url
    }, '*', window.parent);
  }

  // Request to get PC URL
  requestPcUrl() {
    WindowsMessageUtil.postMessage({
      service: AppConstants.SERVICE_NAME.PRISM_UI,
      target: AppConstants.IFRAME_EVENT_REQUEST_PC_URL,
      state: AppConstants.FS_REQUEST_PC_URL,
      SERVICETARGETS: ''
    }, '*', window.parent);
  }

  // Set the correspoding componets for each files route
  getBodyContent() {
    return (
      <div className="app-main">
        <Route exact={ true } path="/"
          component={ () => <Summary onMenuChange={ this.onMenuChange } /> } />
        <Route exact={ true } path="/summary"
          component={ () => <Summary onMenuChange={ this.onMenuChange } /> } />
        <Route exact={ true } path="/file_servers"
          component={ () => <EntityBrowser { ...this.state.fsEbConfiguration } /> }
        />
        <Route exact={ true } path="/alerts"
          component={ () => <EntityBrowser { ...this.state.alertEbConfiguration } /> }
        />
        <Route exact={ true } path="/events"
          component={ () => <EntityBrowser { ...this.state.eventEbConfiguration } /> }
        />
      </div>
    );
  }

  render() {
    if (this.state.loading) {
      return <Loader />;
    }
    return (
      <LeftNavLayout leftPanel={ this.getLeftPanel() } itemSpacing="0"
        rightBodyContent={
          this.getBodyContent()
        } />
    );
  }

  // Set up message listenner to get commands from the iframe to navigate to
  // corresponding tab
  // @param message - message used to checked if post message is for the
  // listener
  addEventListener(message) {
    window.addEventListener('message', this.receiveMessage.bind(this), false);
  }

  // Remove message listenner to get commands from the iframe to navigate to
  // corresponding tab
  // @param message - message used to checked if post message is for the
  // listener
  removeEventListener(message) {
    window.removeEventListener('message', this.receiveMessage.bind(this), false);
  }

  // Function for Event Listener
  receiveMessage(message) {
    if (message && message.data && message.data.action) {
      const { data } = message;
      const { service, action, serviceTargets } = data;
      const { target, state } = action;
      if (service === AppConstants.SERVICE_NAME.PRISM_UI &&
        target === AppConstants.IFRAME_EVENT_CURRENT_PC_URL &&
        state === AppConstants.FS_CURRENT_PC_URL &&
        serviceTargets !== this.props.location.pathname.substring(1)) {
        this.setState({
          currentPanelKey: serviceTargets
        });
        this.props.history.push(`/${serviceTargets}`);
      }
    }
  }

  // Start Polling alerts data
  componentWillMount() {
    this.refreshSummaryData();
    this.dataPolling = setInterval(
      () => {
        this.refreshSummaryData();
      }, AppConstants.POLLING_FREQ_SECS * 1000);
    // Get URL from PC and listen to the url change from PC
    this.addEventListener(AppConstants.FS_PC_URL_LISTENER);
    this.requestPcUrl();
  }

  // Load initial fs alerts if not present
  componentDidUpdate(prevProps) {
    if (!prevProps.fsData && this.props.fsData) {
      this.populateServerAlerts();
    }
  }

  // Stop Polling FS data
  componentWillUnmount() {
    clearInterval(this.dataPolling);
    this.removeEventListener(AppConstants.FS_PC_URL_LISTENER);
  }
}

const mapStateToProps = state => {
  return {
    fsData: state.groupsapi.fsData,
    alertsData: state.groupsapi.alertsData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openModal: (type, options) => dispatch(openModal(type, options)),
    fetchFsData: () => dispatch(fetchFsData()),
    fetchServerAlerts: (serverId) => dispatch(fetchServerAlerts(serverId)),
    fetchAlerts: () => dispatch(fetchAlerts())
  };
};

FileServers.propTypes = {
  openModal: PropTypes.func,
  fsData: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  alertsData: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  filtered_entity_count: PropTypes.string,
  fetchFsData: PropTypes.func,
  fetchServerAlerts: PropTypes.func,
  fetchAlerts: PropTypes.func,
  location: PropTypes.object,
  history : PropTypes.object
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FileServers));
