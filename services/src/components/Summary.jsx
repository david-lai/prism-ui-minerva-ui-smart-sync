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
  Select,
  Title
} from 'prism-reactjs';

import AppConstants from '../utils/AppConstants';
import AppUtil from '../utils/AppUtil';

import FileServerSummary from './FileServerSummary.jsx';
import AlertSummary from './AlertSummary.jsx';

// Actions
import {
  fetchSummaryAlerts,
  setAlertsWidgetRange,
  setTab
} from '../actions';

import i18n from '../utils/i18n';
// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'Summary', key, defaultValue, replacedValue);


class Summary extends React.Component {

  /**
   * Navigates to file servers tab
   *
   * @param  {HTMLEvent} e Event that triggers the method
   *
   * @return {undefined}
   */
  showAllServers = (e) => {
    e.preventDefault();
    this.props.setTab(1);
  }

  /**
   * Handles <Select> alert range change
   *
   * @param  {String} value New alert range
   *
   * @return {undefined}
   */
  handleAlertRangeChange = (value) => {
    this.props.setAlertsWidgetRange(value);
    this.props.fetchSummaryAlerts(value);
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
                      count: fileServers_num ? ` (${fileServers_num})` : ''
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
                    { this.props.summaryAlerts && this.props.summaryAlerts.filtered_entity_count &&
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
                    { !(this.props.summaryAlerts &&
                        this.props.summaryAlerts.filtered_entity_count) &&
                      (
                        <FlexItem flexGrow="1" />
                      )
                    }
                    <FlexItem flexGrow="0" alignSelf="flex-end">
                      <Select
                        disabled={ !this.props.summaryAlerts }
                        onChange={ this.handleAlertRangeChange }
                        selectOptions={
                          [
                            {
                              key: 'day',
                              value: 'day',
                              title: i18nT('last24Hours', 'Last 24 Hours')
                            },
                            {
                              key: 'week',
                              value: 'week',
                              title: i18nT('lastWeek', 'Last Week')
                            }
                          ]
                        }
                        value={ this.props.alertsWidgetRange }
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
            footer={
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
            }
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
  componentWillMount() {
    this.props.fetchSummaryAlerts(this.props.alertsWidgetRange);
    this.dataPolling = setInterval(
      () => {
        this.props.fetchSummaryAlerts(this.props.alertsWidgetRange);
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
    alertsWidgetRange: state.groupsapi.alertsWidgetRange,
    summaryAlerts: state.groupsapi.summaryAlerts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setTab: (tabIndex) => dispatch(setTab(tabIndex)),
    setAlertsWidgetRange: (value) => dispatch(setAlertsWidgetRange(value)),
    fetchSummaryAlerts: (value) => dispatch(fetchSummaryAlerts(value))
  };
};

Summary.propTypes = {
  setAlertsWidgetRange: PropTypes.func,
  setTab: PropTypes.func,
  fetchSummaryAlerts: PropTypes.func,
  alertsWidgetRange: PropTypes.string,
  fsData: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  summaryAlerts: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Summary);
