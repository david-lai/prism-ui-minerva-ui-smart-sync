//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The files app main view
//
import React from 'react';
import { connect } from 'react-redux';
import {
  Route,
  withRouter
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { EntityBrowser } from '@nutanix-ui/ebr-ui';
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
} from '@nutanix-ui/prism-reactjs';
import { WindowsMessageUtil } from 'prism-utils-common';
import EntityConfigs from '../config/entity_configs.js';
import AppConstants from '../utils/AppConstants';
import AppUtil from '../utils/AppUtil';
import EBComponentFactory from '../utils/EBComponentFactory';
import i18n from '../utils/i18n';

import Summary from '../components/Summary.jsx';
import FileServers from '../components/FileServers.jsx';


// Actions
import {
  openModal,
  fetchFsData,
  fetchAlerts,
  fetchEvents
} from '../actions';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'Files', key, defaultValue, replacedValue);

class Files extends React.Component {

  static getDerivedStateFromProps(props, state) {
    let changed = false;
    const changes = {};

    const severities = [
      'info',
      'warning',
      'critical'
    ];
    let maxSeverity = -1;

    if (props.fsData && props.alertsData) {
      if (!state.initialized) {
        changed = true;
        changes.initialized = true;
      }
    }

    if (props.fsData && state.serverCount !== props.fsData.filtered_entity_count) {
      changed = true;
      changes.serverCount = props.fsData.filtered_entity_count;
    }

    if (props.alertsData) {
      if (state.alertCount !== props.alertsData.filtered_entity_count) {
        changed = true;
        changes.alertCount = props.alertsData.filtered_entity_count;
      }
      if (props.alertsData.filtered_entity_count) {
        AppUtil.extractGroupResults(props.alertsData).forEach((alert) => {
          const asIndex = severities.indexOf(alert.severity);
          if (maxSeverity < asIndex) {
            maxSeverity = asIndex;
          }
        });
        if (maxSeverity !== state.maxSeverity) {
          changed = true;
          changes.maxSeverity = maxSeverity;
        }
      }
    }

    let alertBadgeColor = Badge.BADGE_COLOR_TYPES.GRAY;
    if (maxSeverity === 1) {
      alertBadgeColor = Badge.BADGE_COLOR_TYPES.YELLOW;
    } else if (maxSeverity === 2) {
      alertBadgeColor = Badge.BADGE_COLOR_TYPES.RED;
    }
    if (alertBadgeColor !== state.alertBadgeColor) {
      changed = true;
      changes.alertBadgeColor = alertBadgeColor;
    }

    let panelKey = AppConstants.SUMMARY_TAB_KEY;
    if (props.location.pathname && props.location.pathname.substring) {
      panelKey = props.location.pathname.substring(1);
    }
    if (state.currentPanelKey !== panelKey) {
      changed = true;
      changes.currentPanelKey = panelKey;
    }

    if (changed) {
      return changes;
    }
    return null;
  }

  static propTypes = {
    openModal: PropTypes.func,
    fsData: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    alertsData: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    alertList: PropTypes.array,
    filtered_entity_count: PropTypes.string,
    fetchFsData: PropTypes.func,
    fetchAlerts: PropTypes.func,
    fetchEvents: PropTypes.func,
    location: PropTypes.object,
    history : PropTypes.object
  };

  state = {
    loading: false,
    initialized: false,
    fsData: null,
    alertsData: null,
    fsEbConfiguration: null,
    alertEbConfiguration: null,
    eventEbConfiguration: null,
    currentPanelKey: AppConstants.SUMMARY_TAB_KEY,

    alertCount: -1,
    serverCount: -1,
    maxSeverity: -1,
    alertBadgeColor: Badge.BADGE_COLOR_TYPES.GRAY
  };

  /**
   * Constructor method
   *
   * @param  {Object} props   Component props
   * @param  {Object} context Component conntext
   *
   * @return {undefined}
   */
  constructor(props, context) {
    super(props, context);

    this.state.fsEbConfiguration =
      this.getEbConfiguration(AppConstants.ENTITY_TYPES.ENTITY_FILE_SERVER);
    this.state.alertEbConfiguration =
      this.getEbConfiguration(AppConstants.ENTITY_TYPES.ENTITY_ALERT);
    this.state.eventEbConfiguration =
      this.getEbConfiguration(AppConstants.ENTITY_TYPES.ENTITY_EVENT);

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
      filterBarPlaceholder: i18nT('Type_name_to_filter', 'Type name to filter'),
      filtersPanelCollapsed: true,
      queryConfig,
      ebComponentFactory: EBComponentFactory.getInstance({
        openModal: this.props.openModal
      })
    };
  }

  // Event handler for left panel tab click
  onMenuChange = (e) => {
    const key = (typeof e === 'object') ? e.key : e;
    if (key && this.state.currentPanelKey !== key) {
      this.setState({
        currentPanelKey: key
      });
      const newPath = `/${key}`;
      this.props.history.push(newPath);
      this.changePcUrl(key);
    }
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

  /**
   * Data polling method
   *
   * @return {undefined}
   */
  refreshData() {
    this.props.fetchFsData();
    this.props.fetchAlerts();
    this.props.fetchEvents();
  }

  getLeftPanel() {
    const fileServerCount = this.renderFileServersCount(this.state.serverCount);
    return (
      <Menu
        itemSpacing="10px"
        padding="20px-0px"
        activeKeyPath={ ['1', this.state.currentPanelKey] }
        onClick={ this.onMenuChange } style={ { width: '240px' } } >

        <StackingLayout padding="0px-20px" itemSpacing="10px">
          <Title>
            { i18nT('Files', 'Files') }
          </Title>
          <div>
            <TextLabel>
              { fileServerCount }
            </TextLabel>
          </div>
          <Divider type="short" />
        </StackingLayout>

        <MenuGroup key="1">
          <MenuItem key={ AppConstants.SUMMARY_TAB_KEY }>
            { i18nT('Summary', 'Summary') }
          </MenuItem>
          <MenuItem key={ AppConstants.FILE_SERVERS_TAB_KEY }>
            { i18nT('File_servers', 'File Servers') }
          </MenuItem>
          <MenuItem key={ AppConstants.ALERTS_TAB_KEY }>
            <FlexLayout flexGrow="1" justifyContent="space-between">
              <FlexItem>
                { i18nT('Alerts', 'Alerts') }
              </FlexItem>
              <FlexItem>
                { this.state.alertCount < 0 &&
                  (
                    <Loader />
                  )
                }
                { this.state.alertCount > 0 &&
                  (
                    <Badge
                      color={ this.state.alertBadgeColor }
                      count={ AppUtil.rawNumericFormat(this.state.alertCount) }
                    />
                  )
                }
              </FlexItem>
            </FlexLayout>
          </MenuItem>
          <MenuItem key={ AppConstants.EVENTS_TAB_KEY }>
            { i18nT('Events', 'Events') }
          </MenuItem>
        </MenuGroup>
      </Menu>
    );
  }

  // Render buckets counts accounting for unavailability
  renderFileServersCount(count) {
    if (isNaN(count)) {
      return <Loader tip={ i18nT('File_servers', 'File Servers') } />;
    }
    switch (count) {
      case -1:
        return <Loader tip={ i18nT('File_servers', 'File Servers') } />;
      case 0:
        return i18nT('No_file_servers', 'No File Servers');
      case 1:
        return i18nT('One_file_server', 'One File Server');
      default:
        return i18nT('num_of_file_servers', '{num} File Servers',
          { num: AppUtil.rawNumericFormat(count) });
    }
  }

  // Set the correspoding componets for each files route
  getBodyContent() {
    const mainClassName = `app-main app-main-${this.state.currentPanelKey}`;
    if (!this.state.initialized || this.state.loading) {
      return (
        <div className={ `${mainClassName} app-main-loader` }>
          <Loader
            tip={ i18nT('Loading', 'Loading') }
            overlay={ true }
          />
        </div>
      );
    }

    return (
      <div className={ mainClassName }>
        <Route
          path="/"
          exact={ true }
        >
          <Summary onMenuChange={ this.onMenuChange } />
        </Route>
        <Route
          path="/summary"
          exact={ true }
        >
          <Summary onMenuChange={ this.onMenuChange } />
        </Route>
        <Route
          path="/file_servers"
          exact={ true }
        >
          <FileServers
            ebConfig={ this.state.fsEbConfiguration }
            openModal={ this.props.openModal }
          />
        </Route>
        <Route
          path="/alerts"
          exact={ true }
        >
          <EntityBrowser { ...this.state.alertEbConfiguration } />
        </Route>
        <Route
          path="/events"
          exact={ true }
        >
          <EntityBrowser { ...this.state.eventEbConfiguration } />
        </Route>
      </div>
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="app-main app-main-loader">
          <Loader
            tip={ i18nT('Loading', 'Loading') }
            overlay={ true }
          />
        </div>
      );
    }
    return (
      <LeftNavLayout
        leftPanel={ this.getLeftPanel() }
        rightBodyContent={
          this.getBodyContent()
        }
      />
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

  // Setup component
  componentDidMount() {
    this.refreshData();
    this.addEventListener(AppConstants.FS_PC_URL_LISTENER);
    this.requestPcUrl();
  }

  // Remove message listener
  componentWillUnmount() {
    this.removeEventListener(AppConstants.FS_PC_URL_LISTENER);
  }

}

const mapStateToProps = state => {
  return {
    fsData: state.groupsapi.fsData,
    alertsData: state.groupsapi.alertsData,
    alertList: state.groupsapi.alertList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openModal: (type, options) => dispatch(openModal(type, options)),
    fetchFsData: () => dispatch(fetchFsData()),
    fetchAlerts: () => dispatch(fetchAlerts()),
    fetchEvents: () => dispatch(fetchEvents())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Files));
