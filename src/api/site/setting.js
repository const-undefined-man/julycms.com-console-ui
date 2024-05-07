import fetch from '@/libs/http';
let url = '/api/console/site-setting';
export default {
	list: data => fetch({ url: `${url}/byType/${data.type}`, method: 'get', data: {} }),
	update: data => fetch({ url, method: 'patch', data })
};
