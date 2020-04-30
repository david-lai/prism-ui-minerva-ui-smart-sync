import fsData from './mockserver/mock_data/groups_file_servers.json';
import alertsData from './mockserver/mock_data/groups_alerts.json';
import serverAlerts from './mockserver/mock_data/file_server_alerts.json';

export default {
	empty: {
		modals:{
			visible: false,
			options: {},
			type: ''
		},
		groupsapi: {
			alertsWidgetRange: 'day',
			alertsWidgetBusy: false,

			alertModalLoading: false,
			alertRequestActive: false,
			alertRequestType: '',
			alertRequestStatus: true,

			highlightedWidgetBusy: false,
			alertInfo: false,
			fsDetails: {},
			serverAlerts: {},
			clusterDetails: {},
			eventList: [],
			eventListLoading: false
		},
		tabs: {
			tabIndex: 0,
		}
	},
	full: {
		modals:{
			visible: true,
			options: {},
			type: ''
		},
		groupsapi: {
			fsData,
			alertsData,
			summaryAlerts: alertsData,
			alertsWidgetRange: 'day',
			alertModalLoading: false,
			alertRequestActive: false,
			alertRequestType: '',
			alertRequestStatus: true,
			serverAlerts,
			alertInfo: {
				entity: {
					last_update_time: '2020-03-03T17:26:09Z',
					source_entity: {},
					affected_entity_list: [],
					severity: 'warning',
					title: 'File Server User Management Configuration Failed',
					default_message: 'The values provided for File server {file_server_name}\'s user management options are incorrect.',
					creation_time: '2020-02-11T00:47:20Z',
					resolution_status: {
						is_true: false
					},
					indicator_list: [],
					acknowledged_status: {
						is_true: false
					},
					is_user_defined: false,
					severity_trail_list: [
					{
						severity_change_time: '2020-02-11T00:47:20Z',
						severity: 'warning'
					}
					],
					classification_list: [
					'NutanixFiles'
					],
					possible_cause_list: [
					{
						resolution_list: [
						'Please check and try again with correct entries for various fields in the user management tab.'
						],
						cause_list: [
						'Failed to configure user management with given options'
						]
					}
					],
					impact_type_list: [
					'Configuration'
					],
					parameters: {
						nos_version: {
							string_value: '5.17'
						},
						arithmos_id: {
							string_value: 'ffb63302-585a-48b2-a07c-c82eaa8f7252'
						},
						file_server_uuid: {
							string_value: 'ffb63302-585a-48b2-a07c-c82eaa8f7252'
						},
						reason: {
							string_value: 'User credentials failed with error -  Authentication failed: Invalid credentials.'
						},
						file_server_name: {
							string_value: 'File-App01'
						},
						ncc_version: {
							string_value: '3.10.0-7f482156'
						}
					},
					type: 'A160050',
					latest_occurrence_time: '2020-02-11T00:47:20Z',
					entityId: 'testId'
				},
			},
			eventListLoading: false,
			eventList: [
				{
					"id": "event1",
					"entity_id": "event1",
					"title": null,
					"source_entity_name": null,
					"cluster": "0005a3d4-b40c-623f-0000-000000024e1b",
					"source_entity_uuid": null,
					"source_entity_type": null,
					"operation_type": null,
					"default_message": "Export dvd-smb-nfs is created on File server dvd",
					"param_name_list": "file_server_share_uuid",
					"param_value_list": "5dc2fc08-f028-42c0-b160-4773f9fe801c",
					"_created_timestamp_usecs_": "1587579774935587",
					"details": {
						"id": "event1",
						"alertTypeUuid": "CreateFileServerShareAudit",
						"checkId": null,
						"resolved": true,
						"autoResolved": false,
						"acknowledged": true,
						"serviceVMId": "0",
						"nodeUuid": "0",
						"createdTimeStampInUsecs": 1587579774935587,
						"lastOccurrenceTimeStampInUsecs": 0,
						"clusterUuid": "0005a3d4-b40c-623f-0000-000000024e1b",
						"originatingClusterUuid": "0005a3d4-b40c-623f-0000-000000024e1b",
						"severity": "kAudit",
						"categories": [
						""
						],
						"impact": "kUnknown",
						"acknowledgedByUsername": "",
						"message": "Export {file_server_share_name} is created on File server {file_server_name}",
						"detailedMessage": "",
						"alertTitle": "",
						"operationType": "kCreate",
						"acknowledgedTimeStampInUsecs": 1587579774935587,
						"resolvedTimeStampInUsecs": 0,
						"resolvedByUsername": "",
						"entityTypes": [
						"file_server",
						"file_server_share"
						],
						"entityIds": [
						"99efa87f-4268-4c36-887a-6bb4277abf66",
						"5dc2fc08-f028-42c0-b160-4773f9fe801c"
						],
						"entityUuids": [
						"99efa87f-4268-4c36-887a-6bb4277abf66",
						"5dc2fc08-f028-42c0-b160-4773f9fe801c"
						],
						"contextTypes": [
						"file_server_share_uuid",
						"file_server_uuid",
						"file_server_name",
						"file_server_share_name"
						],
						"contextValues": [
						"5dc2fc08-f028-42c0-b160-4773f9fe801c",
						"99efa87f-4268-4c36-887a-6bb4277abf66",
						"dvd",
						"dvd-smb-nfs"
						],
						"possibleCauses": [],
						"alertDetails": null
					}
				},
				{
					"id": "a47a58f5-e5e6-469e-bdd9-24ff160dc27a",
					"entity_id": "a47a58f5-e5e6-469e-bdd9-24ff160dc27a",
					"title": null,
					"source_entity_name": null,
					"cluster": "0005a3d4-b40c-623f-0000-000000024e1b",
					"source_entity_uuid": null,
					"source_entity_type": null,
					"operation_type": null,
					"default_message": "Export dvd-1-nfs is created on File server dvd-1",
					"param_name_list": "file_server_share_uuid",
					"param_value_list": "bae5a67f-00e6-4496-a259-60bd2e1b5a1b",
					"_created_timestamp_usecs_": "1587579753417175",
					"details": {
						"id": "a47a58f5-e5e6-469e-bdd9-24ff160dc27a",
						"alertTypeUuid": "CreateFileServerShareAudit",
						"checkId": null,
						"resolved": true,
						"autoResolved": false,
						"acknowledged": true,
						"serviceVMId": "0",
						"nodeUuid": "0",
						"createdTimeStampInUsecs": 1587579753417175,
						"lastOccurrenceTimeStampInUsecs": 0,
						"clusterUuid": "0005a3d4-b40c-623f-0000-000000024e1b",
						"originatingClusterUuid": "0005a3d4-b40c-623f-0000-000000024e1b",
						"severity": "kAudit",
						"categories": [
						""
						],
						"impact": "kUnknown",
						"acknowledgedByUsername": "",
						"message": "Export {file_server_share_name} is created on File server {file_server_name}",
						"detailedMessage": "",
						"alertTitle": "",
						"operationType": "kCreate",
						"acknowledgedTimeStampInUsecs": 1587579753417175,
						"resolvedTimeStampInUsecs": 0,
						"resolvedByUsername": "",
						"entityTypes": [
						"file_server",
						"file_server_share"
						],
						"entityIds": [
						"ee5d0b20-89b5-40a5-b643-72cd3546ba72",
						"bae5a67f-00e6-4496-a259-60bd2e1b5a1b"
						],
						"entityUuids": [
						"ee5d0b20-89b5-40a5-b643-72cd3546ba72",
						"bae5a67f-00e6-4496-a259-60bd2e1b5a1b"
						],
						"contextTypes": [
						"file_server_share_uuid",
						"file_server_uuid",
						"file_server_name",
						"file_server_share_name"
						],
						"contextValues": [
						"bae5a67f-00e6-4496-a259-60bd2e1b5a1b",
						"ee5d0b20-89b5-40a5-b643-72cd3546ba72",
						"dvd-1",
						"dvd-1-nfs"
						],
						"possibleCauses": [],
						"alertDetails": null
					}
				},
				{
					"id": "e85c2f95-d841-45df-9e81-e49f41b57ba3",
					"entity_id": "e85c2f95-d841-45df-9e81-e49f41b57ba3",
					"title": null,
					"source_entity_name": null,
					"cluster": "0005a3d4-b40c-623f-0000-000000024e1b",
					"source_entity_uuid": null,
					"source_entity_type": null,
					"operation_type": null,
					"default_message": "Share dvd-smb is created on File server dvd",
					"param_name_list": "file_server_share_uuid",
					"param_value_list": "dca59586-1998-45f8-afda-fad020330974",
					"_created_timestamp_usecs_": "1587579471374261",
					"details": {
						"id": "e85c2f95-d841-45df-9e81-e49f41b57ba3",
						"alertTypeUuid": "CreateFileServerShareAudit",
						"checkId": null,
						"resolved": true,
						"autoResolved": false,
						"acknowledged": true,
						"serviceVMId": "0",
						"nodeUuid": "0",
						"createdTimeStampInUsecs": 1587579471374261,
						"lastOccurrenceTimeStampInUsecs": 0,
						"clusterUuid": "0005a3d4-b40c-623f-0000-000000024e1b",
						"originatingClusterUuid": "0005a3d4-b40c-623f-0000-000000024e1b",
						"severity": "kAudit",
						"categories": [
						""
						],
						"impact": "kUnknown",
						"acknowledgedByUsername": "",
						"message": "Share {file_server_share_name} is created on File server {file_server_name}",
						"detailedMessage": "",
						"alertTitle": "",
						"operationType": "kCreate",
						"acknowledgedTimeStampInUsecs": 1587579471374261,
						"resolvedTimeStampInUsecs": 0,
						"resolvedByUsername": "",
						"entityTypes": [
						"file_server",
						"file_server_share"
						],
						"entityIds": [
						"99efa87f-4268-4c36-887a-6bb4277abf66",
						"dca59586-1998-45f8-afda-fad020330974"
						],
						"entityUuids": [
						"99efa87f-4268-4c36-887a-6bb4277abf66",
						"dca59586-1998-45f8-afda-fad020330974"
						],
						"contextTypes": [
						"file_server_share_uuid",
						"file_server_uuid",
						"file_server_name",
						"file_server_share_name"
						],
						"contextValues": [
						"dca59586-1998-45f8-afda-fad020330974",
						"99efa87f-4268-4c36-887a-6bb4277abf66",
						"dvd",
						"dvd-smb"
						],
						"possibleCauses": [],
						"alertDetails": null
					}
				},
				{
					"id": "f61136ea-b485-4186-a84c-8a068a0e994a",
					"entity_id": "f61136ea-b485-4186-a84c-8a068a0e994a",
					"title": null,
					"source_entity_name": null,
					"cluster": "0005a0ff-f0c5-775f-0000-00000000b7c0",
					"source_entity_uuid": null,
					"source_entity_type": null,
					"operation_type": null,
					"default_message": "File server clone anilgv-2c1 create for File server 37e1f79e-8bf3-4858-b2bd-fab7b306b5fb",
					"param_name_list": "file_server_uuid",
					"param_value_list": "11b15c96-e80d-4789-87be-f43ec60e88e6",
					"_created_timestamp_usecs_": "1584582665591024",
					"details": {
						"id": "f61136ea-b485-4186-a84c-8a068a0e994a",
						"alertTypeUuid": "FileServerCloneCreateAudit",
						"checkId": null,
						"resolved": true,
						"autoResolved": false,
						"acknowledged": true,
						"serviceVMId": "0",
						"nodeUuid": "0",
						"createdTimeStampInUsecs": 1584582665591024,
						"lastOccurrenceTimeStampInUsecs": 0,
						"clusterUuid": "0005a0ff-f0c5-775f-0000-00000000b7c0",
						"originatingClusterUuid": "0005a0ff-f0c5-775f-0000-00000000b7c0",
						"severity": "kAudit",
						"categories": [
						""
						],
						"impact": "kUnknown",
						"acknowledgedByUsername": "",
						"message": "File server clone {file_server_name} create for File server {original_file_server_uuid}",
						"detailedMessage": "",
						"alertTitle": "",
						"operationType": "kCreate",
						"acknowledgedTimeStampInUsecs": 1584582665591024,
						"resolvedTimeStampInUsecs": 0,
						"resolvedByUsername": "",
						"entityTypes": [
						"file_server"
						],
						"entityIds": [
						"11b15c96-e80d-4789-87be-f43ec60e88e6"
						],
						"entityUuids": [
						"11b15c96-e80d-4789-87be-f43ec60e88e6"
						],
						"contextTypes": [
						"file_server_uuid",
						"file_server_name",
						"original_file_server_uuid"
						],
						"contextValues": [
						"11b15c96-e80d-4789-87be-f43ec60e88e6",
						"anilgv-2c1",
						"37e1f79e-8bf3-4858-b2bd-fab7b306b5fb"
						],
						"possibleCauses": [],
						"alertDetails": null
					}
				}
			],
		},
		tabs: {
			tabIndex: 0,
		}
	}
};
