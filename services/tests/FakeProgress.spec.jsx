import React from 'react';
import { mount } from 'enzyme';
import FakeProgress from '../src/components/ui/FakeProgress.jsx';

describe('FakeProgress', () => {

  const props = {
    percent: 0,
    label: 'label',
    color: 'red',
    theme: 'light',
    type: 'horizontal',
    fixedLabelWidth: '100px',
    progressWaitText: 'Wait',
    progressDoneText: 'Done',
    className: 'progress',
    tooltipProps: {},

    autorun: true,
    showProgress: true,
  };

  it('Mounts active FakeProgress', () => {

    const testComponent = mount(
      <FakeProgress { ...props } />
    ).instance();
    expect(testComponent).toBeTruthy();
  });

  it('Mounts inactive FakeProgress', () => {
    props.autorun = false;
    props.showProgress = false;
    const testComponent = mount(
      <FakeProgress { ...props }/>
    ).instance();
    expect(testComponent).toBeTruthy();
  });

  it('Mounts active FakeProgress w/percent', () => {
    props.autorun = true;
    props.showProgress = true;
    props.percent = 10;
    const testComponent = mount(
      <FakeProgress { ...props } />
    ).instance();
    testComponent.finish();
    expect(testComponent).toBeTruthy();
  });


});
