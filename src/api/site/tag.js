import fetch from '@/libs/http';
let url = '/api/console/tag';
export default {
	list: (data) => fetch({ url, method: 'get', data }),
	add: (data) => fetch({ url, method: 'post', data }),
	update: (data) => fetch({ url, method: 'patch', data }),
	del: (id) => fetch({ url: `${url}/${id}`, method: 'delete' }),
	detail: (id) => fetch({ url: `${url}/${id}`, method: 'get' }),
	display: (id, val) => fetch({ url: `${url}/display/${id}/${val}`, method: 'patch' }),
	count: (id) => fetch({ url: `${url}/count/${id}`, method: 'get' }),
};
