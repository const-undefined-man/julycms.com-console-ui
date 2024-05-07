import fetch from '@/libs/http';
let prefix = '/api/console/auth';
export default {
	getCode: (data) =>
		fetch({ url: prefix + '/code', method: 'get', token: false, data }),
	login: (data) => fetch({ url: prefix + '/login', token: false, data }),
	logout: () => fetch({ url: prefix + '/logout' }),
	dashboard: () => fetch({ url: '/api/console/dashboard', method: 'get' }),
	// 刷新token
	refresh: (data) => fetch({ url: prefix + '/refresh', token: false, data }),
	uploadUrl: '/api/console/attachement/upload'
};
