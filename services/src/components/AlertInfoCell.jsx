//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Alert name cell component
//
import React from 'react';
import { Link } from '@nutanix-ui/prism-reactjs';
import PropTypes from 'prop-types';

// Utils
import { MODAL_TYPE } from '../utils/AppConstants';

class AlertInfoCell extends React.Component {

  static propTypes = {
    entity: PropTypes.object,
    options: PropTypes.object,
    openModal: PropTypes.func
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
    this.handleShowAlertModal = this.handleShowAlertModal.bind(this);
  }

  // Handler to launch alert info modal
  handleShowAlertModal = () => {
    this.props.openModal(MODAL_TYPE.ALERT_INFO, this.props.options);
  }

  render() {
    return (
      <Link className="manage-link"
        onClick={ this.handleShowAlertModal }>
        { this.props.options.entity.title }
      </Link>
    );
  }

}

export default AlertInfoCell;
