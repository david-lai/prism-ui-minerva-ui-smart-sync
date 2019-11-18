import React from 'react';
import { mount } from 'enzyme';
import App from '../src/App';

describe('App', () => {
  it('Mounts main App', () => {
    const cbp = mount(<App />).instance();
    expect(cbp).toBeTruthy();
  });
});
