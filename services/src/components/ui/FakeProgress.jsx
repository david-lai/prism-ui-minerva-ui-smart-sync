//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Fake progress component
//
import React from 'react';
import PropTypes from 'prop-types';

import {
  Progress
} from '@nutanix-ui/prism-reactjs';

class FakeProgress extends React.Component {

  static propTypes = {
    percent: PropTypes.number,
    label: PropTypes.string,
    color: PropTypes.string,
    theme: PropTypes.string,
    type: PropTypes.string,
    fixedLabelWidth: PropTypes.string,
    progressWaitText: PropTypes.string,
    progressDoneText: PropTypes.string,
    className: PropTypes.string,
    tooltipProps: PropTypes.object,

    showProgress: PropTypes.bool,
    autorun: PropTypes.bool,
    autorunInterval: PropTypes.number,
    hideDelay: PropTypes.number
  }

  static defaultProps = {
    autorun: true,
    showProgress: true,
    percent: -1,
    label: null,
    autorunInterval: 50,
    hideDelay: 2000
  }

  static timeoutRef = null
  static autorunRef = null

  static getDerivedStateFromProps(props, state) {
    if (state.currentShow !== props.showProgress) {
      if (props.showProgress) {
        return {
          currentShow: props.showProgress
        };
      }
      if (state.percent > 0) {
        return {
          percent: 100
        };
      }
      return null;
    }

    if (state.percent === -1 && props.percent !== state.percent) {
      return {
        percent: props.percent
      };
    }

    return null;
  }

  state = {
    currentShow: false,
    percent: -1
  }

  resetProgress() {
    this.setState({
      percent: -1,
      currentShow: false
    });
  }

  finish() {
    this.setState({
      percent: 100
    }, () => {
      if (!this.timeoutRef) {
        this.timeoutRef = setTimeout(() => {
          this.resetProgress();
          clearTimeout(this.timeoutRef);
          this.timeoutRef = null;
        }, this.props.hideDelay);
      }
    });
  }

  clearAutorunTimeout() {
    clearTimeout(this.autorunRef);
    this.autorunRef = null;
  }

  autorunStep() {
    let autorunInterval = this.props.autorunInterval;
    if (this.state.percent < 40) {
      this.setState({
        percent: this.state.percent + 2
      });
    } else if (this.state.percent < 95) {
      this.setState({
        percent: this.state.percent + 1
      });
      autorunInterval *= 2;
    } else {
      return;
    }
    this.autorunRef = setTimeout(() => {
      this.autorunStep();
    }, autorunInterval);
  }

  render() {
    if (!this.state.currentShow) {
      return null;
    }
    const props = {
      percent: Math.max(0, this.state.percent),
      label: this.props.label ? this.props.label : '',
      className: this.props.className ? this.props.className : null
    };

    if (this.props.color) {
      props.color = this.props.color;
    }
    if (this.props.theme) {
      props.theme = this.props.theme;
    }
    if (this.props.type) {
      props.type = this.props.type;
    }
    if (this.props.fixedLabelWidth) {
      props.fixedLabelWidth = this.props.fixedLabelWidth;
    }
    if (this.props.progressWaitText) {
      props.progressWaitText = this.props.progressWaitText;
    }
    if (this.props.progressDoneText) {
      props.progressDoneText = this.props.progressDoneText;
    }
    if (this.props.tooltipProps) {
      props.tooltipProps = this.props.tooltipProps;
    }

    return (
      <Progress { ...props } />
    );
  }

  componentDidUpdate() {
    if (this.state.currentShow !== this.props.showProgress) {
      if (this.props.showProgress) {
        if (this.props.autorun) {
          this.autorunStep();
        }
      } else if (!this.timeoutRef) {
        this.finish();
      }
    }
  }

  compoentWillUnmount() {
    this.clearAutorunTimeout();
  }

}

export default FakeProgress;
