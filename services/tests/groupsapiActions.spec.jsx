import util from 'util';
import reducers from '../src/reducers/groupsapi';
import * as actions from '../src/actions/groupsapis';
import AppConstants from '../src/utils/AppConstants';
import clusterDetailsObj from '../mockserver/mock_data/cluster_details.json';
import fileServerDetailsObj from '../mockserver/mock_data/file_server_details.json';
import expect from 'expect';


const {
	FETCH_CLUSTER_DETAILS,
	FETCH_FS_DETAILS
} = AppConstants.ACTIONS;

const vs = function(...params) {
	console.log(...params);
}



describe('Groups reducer', () => {

	const clusterEntityId = clusterDetailsObj.entityId;
	const clusterEntityResponse = clusterDetailsObj.entityResponse;
	const serverEntityId = fileServerDetailsObj.entityId;
	const serverEntityResponse = fileServerDetailsObj.entityResponse;


	it('should reduce FETCH_FS_DETAILS', () => {

		const actionObj = {
			type: FETCH_FS_DETAILS,
			payload: {
				entityId: serverEntityId,
				details: serverEntityResponse
			}
		};
		expect(reducers({fsDetails: {}}, actionObj)).toBeTruthy();
	});

	it('should handle FETCH_FS_DETAILS', (done) => {
		try {
			const disp = (action) => {
				if (action && typeof action === 'object' && action.type === FETCH_FS_DETAILS) {
					done();
				} else {
					done(new Error('Action format mismatch'));
				}
			};
			actions.fetchFsDetails(serverEntityId)(disp);
		} catch (ex) {
			done(ex);
		}
	});


	it('should reduce FETCH_CLUSTER_DETAILS', () => {

		const actionObj = {
			type: FETCH_CLUSTER_DETAILS,
			payload: {
				entityId: clusterEntityId,
				details: clusterEntityResponse
			}
		};
		expect(reducers({clusterDetails: {}}, actionObj)).toBeTruthy();
	});

	it('should handle FETCH_CLUSTER_DETAILS', (done) => {
		try {
			const disp = (action) => {
				if (action && typeof action === 'object' && action.type === FETCH_CLUSTER_DETAILS) {
					done();
				} else {
					done(new Error('Action format mismatch'));
				}
			};
			actions.fetchClusterDetails([clusterEntityId])(disp);
		} catch (ex) {
			done(ex);
		}
	});


});