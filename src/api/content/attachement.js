import fetch from '@/libs/http';
let url = '/api/console/attachement';
export default {
	list: (params) => fetch({ url, method: 'get', params }),
	add: (data) => fetch({ url, method: 'post', data }),
	update: (data) => fetch({ url, method: 'patch', data }),
	del: (id) => fetch({ url: `${url}/${id}`, method: 'delete' }),
	delbat: (data) => fetch({ url: `${url}/delete`, method: 'put', data }),
	detail: (id) => fetch({ url: `${url}/${id}`, method: 'get' }),
	display: (id, val) => fetch({ url: `${url}/display/${id}/${val}`, method: 'patch' }),
};
