import fetch from '@/libs/http';
let url = '/api/console/notification';
export default {
	list: (data) => fetch({ url, method: 'get', data }),
	add: (data) => fetch({ url, method: 'post', data }),
	update: (data) => fetch({ url, method: 'patch', data }),
	del: (id) => fetch({ url: `${url}/${id}`, method: 'delete' }),
	detail: (id) => fetch({ url: `${url}/${id}`, method: 'get', data: {} }),
	status: (id, val) => fetch({ url: `${url}/status/${id}/${val}`, method: 'patch', data: {} }),
};
