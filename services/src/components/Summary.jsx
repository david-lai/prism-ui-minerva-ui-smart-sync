//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The file for summary tab view
//
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Badge,
  Dashboard,
  DashboardWidgetHeader,
  DashboardWidgetLayout,
  FlexLayout,
  FlexItem,
  Link,
  Loader,
  Select,
  Title
} from '@nutanix-ui/prism-reactjs';

import AppConstants from '../utils/AppConstants';
import AppUtil from '../utils/AppUtil';

import FileServerSummary from './FileServerSummary.jsx';
import AlertSummary from './AlertSummary.jsx';

// Actions
import {
  fetchSummaryAlerts,
  fetchServerAlerts,
  setAlertsWidgetRange
} from '../actions';

import i18n from '../utils/i18n';
// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'Summary', key, defaultValue, replacedValue);

class Summary extends React.Component {

  static propTypes = {
    setAlertsWidgetRange: PropTypes.func,
    onMenuChange: PropTypes.func,
    fetchSummaryAlerts: PropTypes.func,
    fetchServerAlerts: PropTypes.func,
    alertsWidgetRange: PropTypes.string,
    alertsWidgetBusy: PropTypes.bool,
    fsData: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    highlightedWidgetBusy: PropTypes.bool,
    summaryAlerts: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
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

    this.showAllServers = this.showAllServers.bind(this);
  }

  /**
   * Navigates to file servers tab
   *
   * @param  {HTMLEvent} e Event that triggers the method
   *
   * @return {undefined}
   */
  showAllServers = (e) => {
    e.preventDefault();
    // Change url to show file servers
    this.props.onMenuChange(AppConstants.FILE_SERVERS_TAB_KEY);
  }

  /**
   * Handles <Select> alert range change
   *
   * @param  {Object} row Selected row
   *
   * @return {undefined}
   */
  handleAlertRangeChange = (row) => {
    this.props.setAlertsWidgetRange(row.key);
    this.props.fetchSummaryAlerts(row.key);
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
   * Calculates and returns alert counts by severity
   *
   * @return {Object} Object with alert counts
   */
  getAlertCounts() {
    let totals = {
      critical: 0,
      warning: 0,
      info: 0
    };
    if (this.props.summaryAlerts && this.props.summaryAlerts.filtered_entity_count) {
      totals = AppUtil.extractGroupResults(this.props.summaryAlerts)
        .reduce((acc, val) => {
          acc[val.severity]++;
          return acc;
        }, {
          ...{},
          ...totals
        });
    }
    return totals;
  }

  refreshData() {
    this.props.fetchSummaryAlerts(this.props.alertsWidgetRange);
    this.populateServerAlerts();
  }

  /**
   * Renders the component
   *
   * @return {node} Component contents
   */
  render() {
    const alertCounts = this.getAlertCounts();
    const fileServers_num = (this.props.fsData && this.props.fsData.filtered_entity_count)
      ? AppUtil.rawNumericFormat(+this.props.fsData.filtered_entity_count)
      : 0;

    const alertsWidgetFooter = (this.props.alertsWidgetBusy ||
      !(
        this.props.summaryAlerts &&
        this.props.summaryAlerts.filtered_entity_count > 0
      )
    )
      ? (
        <div />
      )
      : (
        <FlexLayout flexGrow="1" alignItems="center" justifyContent="center">
          <FlexItem>
            <Badge
              color={ Badge.BADGE_COLOR_TYPES.RED }
              text={ i18nT('alertLegendCritical', 'Critical') }
            />
          </FlexItem>
          <FlexItem>
            <Badge
              color={ Badge.BADGE_COLOR_TYPES.YELLOW }
              text={ i18nT('alertLegendWarning', 'Warning') }
            />
          </FlexItem>
          <FlexItem>
            <Badge
              color={ Badge.BADGE_COLOR_TYPES.GRAY }
              text={ i18nT('alertLegendInfo', 'Info') }
            />
          </FlexItem>
        </FlexLayout>
      );

    return (
      <Dashboard
        breakpoints={
          {
            lg: 1200
          }
        }
        cols={
          {
            lg: 2
          }
        }
        layouts={
          {
            lg: [
              {
                i: 'fileServerSummary'
              },
              {
                i: 'alertSummary',
                x: 1
              }
            ]
          }
        }
      >
        <div key="fileServerSummary">
          <DashboardWidgetLayout
            header={
              <DashboardWidgetHeader
                showCloseIcon={ false }
                title={
                  i18nT(
                    'highlightedFileServers',
                    'Highlighted File Servers',
                    {
                      count: !this.props.highlightedWidgetBusy &&
                        fileServers_num > 0
                        ? ` (${fileServers_num})`
                        : ''
                    }
                  )
                }
              />
            }
            footer={
              <div
                style={
                  {
                    margin: '0 auto'
                  }
                }
              >
                <Link onClick={ this.showAllServers } >
                  { i18nT('viewAllFileServers', 'View all File Servers') }
                </Link>
              </div>
            }
            bodyContent={ (<FileServerSummary />) }
            bodyContentProps={
              {
                flexDirection: 'column',
                alignItems: 'stretch'
              }
            }
          />
        </div>
        <div key="alertSummary">
          <DashboardWidgetLayout
            header={
              <DashboardWidgetHeader
                showCloseIcon={ false }
                title={
                  <FlexLayout
                    itemSpacing="10px"
                    alignItems="center"
                    justifyContent="center"
                    flexGrow="1"
                  >
                    <FlexItem flexGrow="0" >
                      <Title size="h3">
                        { i18nT('alertsSummaryTitle', 'Alerts') }
                      </Title>
                    </FlexItem>
                    { !this.props.alertsWidgetBusy &&
                      this.props.summaryAlerts &&
                      this.props.summaryAlerts.filtered_entity_count > 0 &&
                      (
                        <FlexItem flexGrow="1">
                          <Badge
                            color={ Badge.BADGE_COLOR_TYPES.RED }
                            text=" "
                            count={ alertCounts.critical }
                          />
                          <Badge
                            color={ Badge.BADGE_COLOR_TYPES.YELLOW }
                            text=" "
                            count={ alertCounts.warning }
                          />
                          <Badge
                            color={ Badge.BADGE_COLOR_TYPES.GRAY }
                            text=" "
                            count={ alertCounts.info }
                          />
                        </FlexItem>
                      )
                    }
                    { this.props.alertsWidgetBusy &&
                      (
                        <FlexItem flexGrow="1">
                          <Loader />
                        </FlexItem>
                      )
                    }
                    { !this.props.alertsWidgetBusy &&
                      !(this.props.summaryAlerts &&
                        this.props.summaryAlerts.filtered_entity_count > 0) &&
                      (
                        <FlexItem flexGrow="1" />
                      )
                    }
                    <FlexItem flexGrow="0" alignSelf="flex-end">
                      <Select
                        searchable={ false }
                        disabled={ !this.props.summaryAlerts || this.props.alertsWidgetBusy }
                        onSelectedChange={ this.handleAlertRangeChange }
                        rowsData={
                          [
                            {
                              key: 'day',
                              label: i18nT('last24Hours', 'Last 24 Hours')
                            },
                            {
                              key: 'week',
                              label: i18nT('lastWeek', 'Last Week')
                            }
                          ]
                        }
                        selectedRow={
                          this.props.alertsWidgetRange === 'day'
                            ? {
                              key: 'day',
                              label: i18nT('last24Hours', 'Last 24 Hours')
                            }
                            : {
                              key: 'week',
                              label: i18nT('lastWeek', 'Last Week')
                            }
                        }
                        style={
                          {
                            minWidth: '100px'
                          }
                        }
                      />
                    </FlexItem>
                  </FlexLayout>
                }
              />
            }
            footer={ alertsWidgetFooter }
            bodyContent={ (<AlertSummary />) }
            bodyContentProps={
              {
                flexDirection: 'column',
                alignItems: 'stretch'
              }
            }
          />
        </div>
      </Dashboard>
    );
  }

  // Start Polling alerts data
  componentDidMount() {
    this.refreshData();
    this.dataPolling = setInterval(
      () => {
        this.refreshData();
      }, AppConstants.POLLING_FREQ_SECS * 1000);
  }

  // Stop Polling FS data
  componentWillUnmount() {
    clearInterval(this.dataPolling);
  }

}

/**
 * Maps store state to props
 * @param  {Object} state Store state
 *
 * @return {Object}       Props map
 */
const mapStateToProps = state => {
  return {
    fsData: state.groupsapi.fsData,
    highlightedWidgetBusy: state.groupsapi.highlightedWidgetBusy,
    alertsWidgetRange: state.groupsapi.alertsWidgetRange,
    alertsWidgetBusy: state.groupsapi.alertsWidgetBusy,
    summaryAlerts: state.groupsapi.summaryAlerts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setAlertsWidgetRange: (value) => dispatch(setAlertsWidgetRange(value)),
    fetchServerAlerts: (entityId) => dispatch(fetchServerAlerts(entityId)),
    fetchSummaryAlerts: (value) => dispatch(fetchSummaryAlerts(value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Summary);
