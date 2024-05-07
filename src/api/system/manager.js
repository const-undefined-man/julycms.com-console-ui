import fetch from '@/libs/http';
let url = '/api/console/manager';
export default {
	list: (params) => fetch({ url, method: 'get', params }),
	add: (data) => fetch({ url, method: 'post', data }),
	update: (data) => fetch({ url, method: 'patch', data }),
	del: (id) => fetch({ url: `${url}/${id}`, method: 'delete' }),
	detail: (id) => fetch({ url: `${url}/${id}`, method: 'get', data: {} }),
	resetPass: (id) => fetch({ url: `${url}/resetPass/${id}`, method: 'patch', data: {} }),
};
