import fetch from '@/libs/http';
let url = '/api/console/dict-value';
export default {
	list: (params) => fetch({ url, method: 'get', params }),
	add: (data) => fetch({ url, method: 'post', data }),
	update: (data) => fetch({ url, method: 'patch', data }),
	del: (id) => fetch({ url: `${url}/${id}`, method: 'delete' }),
	detail: (id) => fetch({ url: `${url}/${id}`, method: 'get', data: {} }),
	display: (id, val) => fetch({ url: `${url}/display/${id}/${val}`, method: 'patch', data: {} }),
	listorder: (id, val) => fetch({ url: `${url}/listorder/${id}/${val}`, method: 'patch', data: {} }),
};
