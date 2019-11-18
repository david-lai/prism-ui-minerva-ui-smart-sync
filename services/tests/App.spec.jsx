import React from 'react';
import { mount } from 'enzyme';
import App from '../src/App';

describe('App', () => {
  it('Mounts main App', (done) => {
    const cbp = mount(<App />).instance();
    expect(cbp).toBeTruthy();
    done();
  });
});
