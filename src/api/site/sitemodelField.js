import fetch from '@/libs/http';
let prefix = '/api/console/sitemodelField';
export default {
	list: (data) => fetch({ url: prefix + '/list', method: 'get', data }),
	detail: (data) => fetch({ url: prefix + '/detail', method: 'get', data }),
	create: (data) => fetch({ url: prefix + '/create', method: 'post', data }),
	update: (data) => fetch({ url: prefix + '/update', method: 'post', data }),
	updateField: (data) =>
		fetch({ url: prefix + '/updateField', method: 'post', data }),
	del: (data) => fetch({ url: prefix + '/del', method: 'post', data }),
};
