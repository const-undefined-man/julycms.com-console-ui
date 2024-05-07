import fetch from '@/libs/http';
let url = '/api/console/login-log';
export default {
	list: (params) => fetch({ url, method: 'get', params }),
	del: (id) => fetch({ url: `${url}/${id}`, method: 'delete' }),
	batDel: (data) => fetch({ url: `${url}/batchDel`, method: 'patch', data }),
	clear: () => fetch({ url: `${url}/clear`, method: 'delete' }),
};
