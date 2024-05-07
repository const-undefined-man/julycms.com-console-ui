import fetch from '@/libs/http';
let url = '/api/console/patch';
export default {
	list: (params) => fetch({ url: `${url}`, method: 'get', params }),
	add: (data) => fetch({ url, method: 'post', data }),
	update: (data) => fetch({ url, method: 'patch', data }),
	del: (id) => fetch({ url: `${url}/${id}`, method: 'delete' }),
	detail: (id) => fetch({ url: `${url}/${id}`, method: 'get' }),
	display: (id, val) => fetch({ url: `${url}/display/${id}/${val}`, method: 'patch' }),
	displayBat: (data) => fetch({ url: `${url}/displayBat`, method: 'patch', data }),
	displayDel: (data) => fetch({ url: `${url}/displayDel`, method: 'patch', data }),

	updateText: (data) => fetch({ url: `${url}/text`, method: 'patch', data }),
	petchList: (params) => fetch({ url: `${url}/list`, method: 'get', params }),
	petchListAdd: (data) => fetch({ url: `${url}/list`, method: 'post', data }),
	petchListUpdate: (data) => fetch({ url: `${url}/list`, method: 'patch', data }),
	petchListDel: (id) => fetch({ url: `${url}/list/${id}`, method: 'delete' }),
	petchListSort: (data) => fetch({ url: `${url}/list/${data.id}/${data.listorder}`, method: 'delete' }),
};
