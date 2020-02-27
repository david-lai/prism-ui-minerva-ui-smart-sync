//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The file servers name component
//
import React from 'react';
import { Link } from 'prism-reactjs';
import PropTypes from 'prop-types';

// Utils
import { MODAL_TYPE } from '../utils/AppConstants';

class AlertInfoCell extends React.Component {

  constructor(props) {
    super(props);
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

AlertInfoCell.propTypes = {
  entity: PropTypes.object,
  options: PropTypes.object,
  openModal: PropTypes.func
};

export default AlertInfoCell;
