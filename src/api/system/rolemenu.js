import fetch from '@/libs/http';
let prefix = '/api/console/rolemenu';
export default {
	add: (data) => fetch({ url: prefix + '/add', method: 'post', data }),
	update: (data) => fetch({ url: prefix + '/update', method: 'post', data }),
	detail: (data) => fetch({ url: prefix + '/detail', method: 'get', data }),
};
