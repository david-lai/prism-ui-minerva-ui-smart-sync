//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The alerts summary view
//
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  BarChart,
  ContainerLayout,
  FlexItem,
  FlexLayout,
  Loader,
  TextLabel,
  ThemeManager
} from 'prism-reactjs';

import AppUtil from '../utils/AppUtil';
import i18n from '../utils/i18n';

import noAlertsIcon from '../assets/images/no-alerts.svg';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'AlertSummary', key, defaultValue, replacedValue);

/**
 * AlertSummary component class
 * @class
 */
class AlertSummary extends React.Component {

  /**
   * Repacks alert summary data (from self.prepareSummaryAlertData) in order
   * for it to be compatible with chart component
   *
   * @param  {Object} summaryData   Summary alert data ( @see prepareSummaryAlertData )
   *
   * @return {Array}                Data array ready for charts component
   */
  prepareAlertBarChartData(summaryData) {
    let data = [];
    if (summaryData) {
      const alerts = summaryData.items ? summaryData.items : [];
      const items = alerts.map((alert) => {
        const alertTimestamp = parseInt((alert._created_timestamp_usecs_ / 1000), 10);
        const dayName = moment(alertTimestamp).format('MMM D');
        return {
          ...alert,
          alertTimestamp,
          dayName
        };
      });
      items.sort((a, b) => {
        if (a.alertTimestamp > b.alertTimestamp) {
          return 1;
        } else if (a.alertTimestamp > b.alertTimestamp) {
          return -1;
        }
        return 0;
      });
      const days = Array.from(new Set(items.map(item => item.dayName)));
      data = days.map(day => {
        const dayItems = items.filter(item => item.dayName === day);
        const dayData = {
          name: day,
          info: dayItems.filter(item => item.severity === 'info').length,
          warning: dayItems.filter(item => item.severity === 'warning').length,
          critical: dayItems.filter(item => item.severity === 'critical').length
        };
        return dayData;
      });

      return data;
    }
  }

  /**
   * Prepares raw alerts data from props
   *
   * @return {Object}    AlertSummary object with 'totals' property containing
   *                     counts for all alert types and items array with alert objects
   */
  prepareSummaryAlertData() {
    if (!this.props.summaryAlerts) {
      return null;
    }

    const alertSummary = {
      totals: {
        info: 0,
        warning: 0,
        critical: 0
      },
      items: []
    };
    const alertData = this.props.summaryAlerts;
    if (alertData && alertData.filtered_entity_count) {
      alertSummary.items = AppUtil.extractGroupResults(alertData);
      alertSummary.totals = alertSummary.items.reduce((acc, val) => {
        acc[val.severity]++;
        return acc;
      }, {
        ...{},
        ...alertSummary.totals
      });
    }

    return alertSummary;
  }

  render() {
    const summaryData = this.prepareSummaryAlertData(this.props.summaryAlerts);

    const data = this.prepareAlertBarChartData(summaryData);

    const criticalColor = ThemeManager.getVar('red-1');
    const warningColor = ThemeManager.getVar('yellow-1');
    const infoColor = ThemeManager.getVar('light-gray-1');

    return (
      <ContainerLayout
        backgroundColor="white"
        padding="15px"
        style={
          {
            height: '100%'
          }
        }
      >
        { this.props.alertsWidgetBusy && this.props.summaryAlerts !== false &&
          (
            <FlexLayout
              itemSpacing="5px"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              padding="40px"
            >
              <FlexItem />
              <FlexItem>
                <Loader tip={ i18nT('fetchingData', 'Fetching data') } />
              </FlexItem>
            </FlexLayout>
          )
        }

        { this.props.summaryAlerts === false &&
          (
            <FlexLayout
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <FlexItem>
                <TextLabel
                  type={ TextLabel.TEXT_LABEL_TYPE.ERROR }
                  size={ TextLabel.TEXT_LABEL_SIZE.MEDIUM }
                >
                  { i18nT('fetchingDataFailed', 'Fetching data failed') }
                </TextLabel>
              </FlexItem>
            </FlexLayout>
          )
        }

        { !this.props.alertsWidgetBusy &&
          summaryData &&
          summaryData.items &&
          summaryData.items.length === 0 &&
          (
            <FlexLayout
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              itemSpacing="10px"
            >
              <img
                src={ noAlertsIcon }
                alt={ i18nT('NoAlerts', 'No alerts') }
                height="150"
              />
              <TextLabel>
                { i18nT('NoAlerts', 'No alerts') }
              </TextLabel>
            </FlexLayout>
          )
        }

        { !this.props.alertsWidgetBusy &&
          summaryData &&
          summaryData.items &&
          summaryData.items.length > 0 &&
          (
            <BarChart
              barSize={ 8 }
              tooltipProps={ {} }
              bars={
                [
                  {
                    dataKey: 'warning',
                    fill: warningColor,
                    stackId: 1
                  },
                  {
                    dataKey: 'info',
                    fill: infoColor,
                    stackId: 1
                  },
                  {
                    dataKey: 'critical',
                    fill: criticalColor,
                    stackId: 1
                  }
                ]
              }
              data={ data }
              xAxisProps={
                {
                  padding: {
                    left: 40,
                    right: 0
                  }
                }
              }
              yAxisProps={
                {
                  allowDecimals: false,
                  domain: [
                    'dataMin',
                    4
                  ]
                }
              }
            />
          )
        }
      </ContainerLayout>
    );
  }

}


const mapStateToProps = state => {
  return {
    summaryAlerts: state.groupsapi.summaryAlerts,
    alertsWidgetBusy: state.groupsapi.alertsWidgetBusy
  };
};


AlertSummary.propTypes = {
  summaryAlerts: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  alertsWidgetBusy: PropTypes.bool
};

export default connect(
  mapStateToProps,
  null
)(AlertSummary);
