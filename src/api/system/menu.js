import fetch from '@/libs/http';
let url = '/api/console/menu';
export default {
	// 带权限校验的路由
	routers: () => fetch({ url: url + '/routers', method: 'get' }),
	list: (data) => fetch({ url, method: 'get', data }),
	add: (data) => fetch({ url, method: 'post', data }),
	update: (data) => fetch({ url, method: 'patch', data }),
	del: (id) => fetch({ url: `${url}/${id}`, method: 'delete' }),
	detail: (id) => fetch({ url: `${url}/${id}`, method: 'get', data: {} }),
	display: (id, val) => fetch({ url: `${url}/display/${id}/${val}`, method: 'patch', data: {} }),
	quickmenu: (id, val) => fetch({ url: `${url}/quickmenu/${id}/${val}`, method: 'patch', data: {} }),
	listorder: (id, val) => fetch({ url: `${url}/listorder/${id}/${val}`, method: 'patch', data: {} }),
};
