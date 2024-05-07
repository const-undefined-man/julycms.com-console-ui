import fetch from '@/libs/http';
let prefix = '/api/console/third';
export default {
	list: data => fetch({ url: prefix + '/list', method: 'get', data }),
	pass: data => fetch({ url: prefix + '/pass', method: 'get', data }),
	detail: data => fetch({ url: prefix + '/detail', method: 'get', data }),
	create: data => fetch({ url: prefix + '/create', method: 'post', data }),
	update: data => fetch({ url: prefix + '/update', method: 'post', data }),
	del: data => fetch({ url: prefix + '/del', method: 'post', data })
};
