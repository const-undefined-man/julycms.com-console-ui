import fetch from '@/libs/http';
let url = '/api/console/document';
export default {
	list: (data, params) => fetch({ url: `${url}/${data.catId}/${data.modelMark}`, method: 'get', params }),
	add: (data) => fetch({ url, method: 'post', data }),
	update: (data) => fetch({ url, method: 'patch', data }),
	del: (id) => fetch({ url: `${url}/${id}`, method: 'delete' }),
	detail: (id) => fetch({ url: `${url}/${id}`, method: 'get' }),
	display: (id, val) => fetch({ url: `${url}/display/${id}/${val}`, method: 'patch' }),
	listorder: (id, val) => fetch({ url: `${url}/listorder/${id}/${val}`, method: 'patch' }),
	recount: () => fetch({ url: `${url}/recount`, method: 'post' }),
	move: (data) => fetch({ url: `${url}/move`, method: 'post', data }),
};
