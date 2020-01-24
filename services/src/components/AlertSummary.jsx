//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The alerts summary view
//
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import {
  Badge,
  BarChart,
  ContainerLayout,
  FlexItem,
  FlexLayout,
  Loader,
  TextLabel,
  ThemeManager,
  Title
} from 'prism-reactjs';
import AppUtil from '../utils/AppUtil';
import i18n from '../utils/i18n';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'Summary', key, defaultValue, replacedValue);

class AlertSummary extends React.Component {

  static propTypes = {
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      errorMessage: '',
      summaryData: {
        totals: {
          info: 0,
          warning: 0,
          critical: 0
        },
        items: []
      }
    };
  }

  getAlertBarChartData() {
    let data = [];
    if (this.state.summaryData) {
      const alerts = this.state.summaryData.items ? this.state.summaryData.items : [];
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

  render() {
    const data = this.getAlertBarChartData();

    const criticalColor = ThemeManager.getVar('red-1');
    const warningColor = ThemeManager.getVar('yellow-1');
    const infoColor = ThemeManager.getVar('light-gray-1');

    return (
      <ContainerLayout backgroundColor="white" padding="15px">
        <FlexLayout itemSpacing="10px" alignItems="center" justifyContent="center">
          <FlexItem flexGrow="0" >
            <Title size="h3">
              { i18nT('alertsSummaryTitle', 'Alerts') }
            </Title>
          </FlexItem>
          { !this.state.loading &&
            (
              <FlexItem flexGrow="1">
                <Badge
                  color={ Badge.BADGE_COLOR_TYPES.RED }
                  text=" "
                  count={ this.state.summaryData.totals.critical }
                />
                <Badge
                  color={ Badge.BADGE_COLOR_TYPES.YELLOW }
                  text=" "
                  count={ this.state.summaryData.totals.warning }
                />
                <Badge
                  color={ Badge.BADGE_COLOR_TYPES.GRAY }
                  text=" "
                  count={ this.state.summaryData.totals.info }
                />
              </FlexItem>
            )
          }
          { this.state.loading &&
            (
              <FlexItem flexGrow="1" />
            )
          }
          <FlexItem flexGrow="0" />
        </FlexLayout>
        { this.state.loading &&
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

        { !this.state.loading && this.state.errorMessage &&
          (
            <FlexLayout alignItems="center" justifyContent="center" flexDirection="column">
              <FlexItem>
                <TextLabel
                  type={ TextLabel.TEXT_LABEL_TYPE.ERROR }
                  size={ TextLabel.TEXT_LABEL_SIZE.MEDIUM }
                >
                  { this.state.errorMessage }
                </TextLabel>
              </FlexItem>
            </FlexLayout>
          )
        }

        { !this.state.loading && !this.state.errorMessage &&
          (
            <FlexLayout alignItems="center" justifyContent="center" flexDirection="column">
              <FlexItem>
                <BarChart
                  width={ 400 }
                  height={ 200 }
                  barSize={ 20 }
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
              </FlexItem>
              <FlexItem flexGrow="0">
                <FlexLayout alignItems="center">
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
              </FlexItem>
            </FlexLayout>
          )
        }
      </ContainerLayout>
    );
  }

  componentWillMount() {
    // Fetch aggregated summary data
    AppUtil.fetchSummaryAlertData()
      .then(
        (summaryData) => {
          this.setState({
            loading: false,
            summaryData
          });
        })
      .catch(() => {
        this.setState({
          loading: false,
          errorMessage: i18nT('errorFetchingAlerts', 'Error fetching Alerts') });
      });
  }

}


AlertSummary.propTypes = {};

export default connect(
  null,
)(AlertSummary);
