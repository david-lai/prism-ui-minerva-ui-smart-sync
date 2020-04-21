//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Alert severity cell component
//
import React from 'react';
import { Badge } from '@nutanix-ui/prism-reactjs';
import PropTypes from 'prop-types';

import FormatterUtil from '../utils/FormatterUtil';

class AlertSeverityCell extends React.Component {

  static propTypes = {
    options: PropTypes.object
  };

  render() {
    let color = Badge.BADGE_COLOR_TYPES.GRAY;
    if (this.props.options.entity.severity === 'warning') {
      color = Badge.BADGE_COLOR_TYPES.YELLOW;
    } else if (this.props.options.entity.severity === 'critical') {
      color = Badge.BADGE_COLOR_TYPES.RED;
    }
    return (
      <Badge
        text={ FormatterUtil.capitalizeSentence(this.props.options.entity.severity) }
        color={ color }
      />
    );
  }

}

export default AlertSeverityCell;
