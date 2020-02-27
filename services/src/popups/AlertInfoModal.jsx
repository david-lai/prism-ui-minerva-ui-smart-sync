//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The file servers alert popup
//
import React from 'react';
import moment from 'moment';
import {
  Badge,
  Button,
  ButtonGroup,
  ContainerLayout,
  Divider,
  FlexItem,
  FlexLayout,
  FullPageModal,
  HeaderFooterLayout,
  TextLabel,
  Title,
  StackingLayout
} from 'prism-reactjs';
import PropTypes from 'prop-types';

// Local includes
import FormatterUtil from '../utils/FormatterUtil';
import i18n from '../utils/i18n';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'AlertInfoModal', key, defaultValue, replacedValue);

class AlertInfoModal extends React.Component {

  static propTypes = {
  };

  resolveAlert = (e) => {
    // TODO add handler logic once it gets determined
    e.preventDefault();
  }

  acknowledgeAlert = (e) => {
    // TODO add handler logic once it gets determined
    e.preventDefault();
  }

  render() {
    const alertTimestamp = parseInt((this.props.alert._created_timestamp_usecs_ / 1000), 10);

    let color = Badge.BADGE_COLOR_TYPES.GRAY;
    let severity = i18nT('alertSeverityInfo', 'Info');
    if (this.props.alert.severity === 'warning') {
      color = Badge.BADGE_COLOR_TYPES.YELLOW;
      severity = i18nT('alertSeverityWarning', 'Warning');
    } else if (this.props.alert.severity === 'critical') {
      color = Badge.BADGE_COLOR_TYPES.RED;
      severity = i18nT('alertSeverityCritical', 'Critical');
    }

    const leftPanel = (
      <StackingLayout itemSpacing="20px">
        <StackingLayout itemSpacing="10px">
          <Title size="h2">
            { this.props.alert.title }
          </Title>
          <TextLabel>
            { i18nT('AlertTitle', 'Alert Title') }
          </TextLabel>
        </StackingLayout>
        <Divider type="short" />
        <StackingLayout itemSpacing="5px">
          <FlexLayout padding="5px" itemSpacing="10px">
            <FlexItem flexGrow="1">
              <TextLabel>
                { i18nT('SourceEntity', 'Source Entity') }
              </TextLabel>
            </FlexItem>
            <FlexItem>
              <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                { FormatterUtil.pickListItem(this.props.alert.param_value_list, { index: 1 }) }
              </TextLabel>
            </FlexItem>
          </FlexLayout>

          <FlexLayout padding="5px" itemSpacing="10px">
            <FlexItem flexGrow="1">
              <TextLabel>
                { i18nT('Severity', 'Severity') }
              </TextLabel>
            </FlexItem>
            <FlexItem>
              <Badge color={ color } text={ severity } />
            </FlexItem>
          </FlexLayout>

          <FlexLayout padding="5px" itemSpacing="10px">
            <FlexItem flexGrow="1">
              <TextLabel>
                { i18nT('CreatedTime', 'Created Time') }
              </TextLabel>
            </FlexItem>
            <FlexItem
              style={
                {
                  textAlign: 'right'
                }
              }
            >
              <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                { moment(alertTimestamp).format('MM/DD/YY h:m:s A') }
              </TextLabel>
            </FlexItem>
          </FlexLayout>

          <FlexLayout padding="5px" itemSpacing="10px">
            <FlexItem flexGrow="1">
              <TextLabel>
                { i18nT('LastOccurred', 'Last Occured') }
              </TextLabel>
            </FlexItem>
            <FlexItem
              style={
                {
                  textAlign: 'right'
                }
              }
            >
              <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                { moment(alertTimestamp).format('MM/DD/YY h:m:s A') }
              </TextLabel>
            </FlexItem>
          </FlexLayout>

          <FlexLayout padding="5px" itemSpacing="10px">
            <FlexItem flexGrow="1">
              <TextLabel>
                { i18nT('ImpactType', 'Impact Type') }
              </TextLabel>
            </FlexItem>
            <FlexItem>
              <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                { FormatterUtil.separatePascalCase(this.props.alert.impact_type) }
              </TextLabel>
            </FlexItem>
          </FlexLayout>

          <FlexLayout padding="5px" itemSpacing="10px">
            <FlexItem flexGrow="1">
              <TextLabel>
                { i18nT('Policy', 'Policy') }
              </TextLabel>
            </FlexItem>
            <FlexItem>
              <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                -
              </TextLabel>
            </FlexItem>
          </FlexLayout>

          <FlexLayout padding="5px" itemSpacing="10px">
            <FlexItem flexGrow="1">
              <TextLabel>
                { i18nT('Status', 'Status') }
              </TextLabel>
            </FlexItem>
            <FlexItem>
              <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                -
              </TextLabel>
            </FlexItem>
          </FlexLayout>

          <FlexLayout padding="5px" itemSpacing="10px">
            <FlexItem flexGrow="1">
              <TextLabel>
                { i18nT('AcknowledgedBy', 'Acknowledged By') }
              </TextLabel>
            </FlexItem>
            <FlexItem>
              <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                -
              </TextLabel>
            </FlexItem>
          </FlexLayout>

          <FlexLayout padding="5px" itemSpacing="10px">
            <FlexItem flexGrow="1">
              <TextLabel>
                { i18nT('ResolvedBy', 'Resolved By') }
              </TextLabel>
            </FlexItem>
            <FlexItem>
              <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                -
              </TextLabel>
            </FlexItem>
          </FlexLayout>

          <FlexLayout padding="5px" itemSpacing="10px">
            <FlexItem flexGrow="1">
              <TextLabel>
                { i18nT('Description', 'Description') }
              </TextLabel>
            </FlexItem>
            <FlexItem>
              <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                -
              </TextLabel>
            </FlexItem>
          </FlexLayout>
        </StackingLayout>
      </StackingLayout>
    );


    const footer = (
      <div />
    );

    return (
      <div>
        <FullPageModal
          visible={ this.props.visible }
          title={ this.props.alert.title }
          footer={ footer }
          extraIcons={
            <ButtonGroup>
              <Button type="secondary" onClick={ this.resolveAlert }>
                { i18nT('Resolve', 'Resolve') }
              </Button>
              <Button type="secondary" onClick={ this.acknowledgeAlert }>
                { i18nT('Acknowledge', 'Acknowledge') }
              </Button>
            </ButtonGroup>
          }
        >
          <FlexLayout itemSpacing="0px">
            <FlexLayout padding="20px" flexShrink="0" style={
              {
                flexBasis: '240px'
              }
            }>
              { leftPanel }
            </FlexLayout>

            <FlexLayout
              itemFlexBasis="100pc"
              padding="20px"
              flexGrow="1"
              style={
                {
                  height: 'inherit',
                  backgroundColor: '#F2F4F6'
                }
              }
            >
              <StackingLayout>
                <ContainerLayout backgroundColor="white">
                  <HeaderFooterLayout
                    itemSpacing="0px"
                    header={
                      <StackingLayout padding="10px">
                        <Title size="h3">
                          { i18nT('PossibleCause', 'Possible Cause') }
                        </Title>
                      </StackingLayout>
                    }
                    bodyContent={
                      <StackingLayout
                        itemSpacing="10px"
                        style={
                          {
                            width: '100%'
                          }
                        }>
                        <StackingLayout padding="10px">
                          <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                            Possible cause text
                          </TextLabel>
                        </StackingLayout>
                        <Divider />
                        <StackingLayout padding="10px" itemSpacing="0px">
                          <Title size="h4">
                            { i18nT('Recommendations', 'Recommendations') }
                          </Title>
                          <StackingLayout padding="10px">
                            <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                              { i18nT('ContactNutanixSupport', 'Contact Nutanix Support') }
                            </TextLabel>
                          </StackingLayout>
                        </StackingLayout>
                      </StackingLayout>
                    }
                  />
                </ContainerLayout>
              </StackingLayout>
            </FlexLayout>
          </FlexLayout>
        </FullPageModal>
      </div>
    );
  }

}

AlertInfoModal.propTypes = {
  alert: PropTypes.object,
  visible: PropTypes.bool
};

export default AlertInfoModal;
