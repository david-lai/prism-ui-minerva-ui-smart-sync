import AppUtil from '../src/utils/AppUtil';
import results from '../mockserver/mock_data/groups_alerts.json';

describe('AppUtil', () => {

  it('Formats numbers', () => {
    expect(AppUtil.rawNumericFormat(1000, false)).toBe('1K');
  });

  it('Extracts group results', () => {
    expect(AppUtil.extractGroupResults(results)).toBeTruthy();
  });

  it('Shows notification', () => {
    expect(AppUtil.showNotification('info', 'message')).toBeUndefined();
  });

});
