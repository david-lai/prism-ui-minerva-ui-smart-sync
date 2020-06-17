//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Replication schedule component for policy views
//
import React from 'react';
import PropTypes from 'prop-types';
import {
  DashboardWidgetHeader,
  DashboardWidgetLayout,
  FlexLayout,
  FlexItem,
  FormItemSelect,
  StackingLayout,
  TextLabel
} from '@nutanix-ui/prism-reactjs';

import i18n from '../../utils/i18n';

import AppUtil from '../../utils/AppUtil';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'ReplicationSchedule', key, defaultValue, replacedValue);

class ReplicationSchedule extends React.Component {

  static propTypes = {
    scheduleUnits: PropTypes.object.isRequired,
    replicationScheduleValue: PropTypes.number,
    replicationScheduleUnit: PropTypes.string,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    replicationScheduleValue: 10,
    replicationScheduleUnit: 'min'
  }

  state = {
    selectedUnitRow: null,
    selectedValueRow: null
  };

  triggerChange() {
    const value = this.state.selectedValueRow ? this.state.selectedValueRow.key : 0;
    const unit = this.state.selectedUnitRow ? this.state.selectedUnitRow.key : 'min';
    this.props.onChange({
      value,
      unit
    });
  }

  handleUnitChange = (selectedUnitRow) => {
    this.setState({
      selectedUnitRow
    }, () => {
      this.triggerChange();
    });
  }

  handleValueChange = (selectedValueRow) => {
    this.setState({
      selectedValueRow
    }, () => {
      this.triggerChange();
    });
  }

  renderHeader() {
    return (
      <DashboardWidgetHeader
        padding="10px-0px"
        showCloseIcon={ false }
        title={
          i18nT('Replication_schedule', 'Replication Schedule')
        }
      />
    );
  }

  getUnitRowsData() {
    return Object.keys(this.props.scheduleUnits).map(su => {
      return {
        key: su,
        label: this.props.replicationScheduleValue % 10 !== 1
          ? i18nT(
            `schedule_unit_plural_${su}`,
            su
          )
          : i18nT(
            `schedule_unit_${su}`,
            su
          )
      };
    });
  }
  getUnitSelectedRow() {
    const rowsData = this.getUnitRowsData();
    let selectedRow = rowsData.find(ur => {
      return ur.key === this.props.replicationScheduleUnit;
    });
    if (!selectedRow) {
      selectedRow = null;
    }
    return selectedRow;
  }

  getValueRowsData() {
    const unitData = this.props.scheduleUnits[this.props.replicationScheduleUnit]
      .values.map(value => {
        return {
          key: value,
          label: `${value}`
        };
      });
    return unitData;
  }
  getValueSelectedRow() {
    const rowsData = this.getValueRowsData();
    let selectedRow = rowsData.find(ur => {
      return ur.key === this.props.replicationScheduleValue;
    });
    if (!selectedRow) {
      selectedRow = null;
    }
    return selectedRow;
  }

  renderBody() {
    return (
      <StackingLayout
        className="file-server-selector-body ntnx ntnx-form-item-provider"
        itemSpacing="0px"
      >
        <label>
          {
            i18nT(
              'Recovery_point_objective_RPO',
              'Recovery Point Objective (RPO)',
            )
          }
        </label>
        <FlexLayout
          padding="10px"
          itemFlexBasis="100pc"
        >
          <FlexItem>
            <FormItemSelect
              id="schedule_value"
              rowsData={ this.getValueRowsData() }
              selectedRow={ this.getValueSelectedRow() }
              onSelectedChange={ this.handleValueChange }
            />
          </FlexItem>
          <FlexItem>
            <FormItemSelect
              id="schedule_unit"
              rowsData={ this.getUnitRowsData() }
              selectedRow={ this.getUnitSelectedRow() }
              onSelectedChange={ this.handleUnitChange }
            />
          </FlexItem>
        </FlexLayout>
        <TextLabel>
          {
            i18nT(
              'snapshot_timing_info',
              'A snapshot will be taken and replicated ' +
              'every {value} {unit}',
              {
                value: AppUtil.rawNumericFormat(this.props.replicationScheduleValue),
                unit: this.props.replicationScheduleValue % 10 !== 1
                  ? i18nT(
                    `schedule_unit_plural_${this.props.replicationScheduleUnit}`,
                    this.props.replicationScheduleUnit
                  )
                  : i18nT(
                    `schedule_unit_${this.props.replicationScheduleUnit}`,
                    this.props.replicationScheduleUnit
                  )
              }
            )
          }
        </TextLabel>
      </StackingLayout>
    );
  }

  render() {
    return (
      <DashboardWidgetLayout
        bodyContent={ this.renderBody() }
        header={ this.renderHeader() }
      />
    );
  }

}

export default ReplicationSchedule;
