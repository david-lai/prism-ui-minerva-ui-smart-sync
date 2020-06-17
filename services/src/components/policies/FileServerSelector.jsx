//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// File servers selection component for policy views
//
import React from 'react';
import PropTypes from 'prop-types';
import {
  DashboardWidgetHeader,
  DashboardWidgetLayout,
  FormItemSelect,
  StackingLayout
} from '@nutanix-ui/prism-reactjs';

class FileServerSelector extends React.Component {

  static propTypes = {
    rowsData: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    selectId: PropTypes.string.isRequired,
    selectLabel: PropTypes.string.isRequired,
    selectPlaceholder: PropTypes.string,
    // eslint-disable-next-line react/no-unused-prop-types
    selectedEntityId: PropTypes.string,
    onChange: PropTypes.func.isRequired
  };

  static getDerivedStateFromProps(props, state) {
    if (props.selectedEntityId && props.rowsData && props.rowsData.length && !state.selectedRow) {
      const selectedRow = props.rowsData.find(rd => {
        return rd.key === props.selectedEntityId;
      });
      if (selectedRow) {
        return {
          selectedRow
        };
      }
    }
    return null;
  }

  state = {
    selectedRow: null
  };

  handleChange = (selectedRow) => {
    this.setState({
      selectedRow
    }, () => {
      this.props.onChange(selectedRow.key);
    });
  }

  renderHeader() {
    return (
      <DashboardWidgetHeader
        padding="10px-0px"
        showCloseIcon={ false }
        title={ this.props.title }
      />
    );
  }

  renderBody() {
    const inputProps = {};
    if (this.props.selectPlaceholder) {
      inputProps.value = this.props.selectPlaceholder;
    }
    return (
      <StackingLayout
        className="file-server-selector-body"
      >
        <FormItemSelect
          id={ this.props.selectId }
          label={ this.props.selectLabel }
          rowsData={ this.props.rowsData }
          selectedRow={ this.state.selectedRow }
          inputProps={ inputProps }
          onSelectedChange={ this.handleChange }
        />
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

export default FileServerSelector;
