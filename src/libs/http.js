import axios from 'axios';
import store from '@/store';
import { getToken } from './token';
import { Loading, Notification, MessageBox } from 'element-ui';

let loading = null;
let notify = null;
let requestCount = 0;

/** 创建axios实例 */
const service = axios.create({
	baseURL: process.env.VUE_APP_API_URL,
	timeout: 30000,
	token: true,
	withCredentials: true,
});

/** request拦截器，对请求参数做处理*/
service.interceptors.request.use(
	(config) => {
		requestCount++;
		loadingShow();

		// set header token
		let token = getToken() || '';
		// token 根据这个参数判断是否需要添加token
		if (config.token) {
			config.headers['Authorization'] = 'Bearer ' + token;
		}
		
		return config;
	},
	(error) => {
		loadingHide();
		// eslint-disable-next-line newline-before-return
		return Promise.reject(error);
	}
);

/** respone拦截器，对响应做处理*/
service.interceptors.response.use(
	(response) => {
		requestCount--;

		if (requestCount <= 0) {
			loadingHide();
		}

		if (response.data.code === 1) {
			if (['post', 'patch', 'delete', 'put'].includes(response.config.method)) {
				Notification.success({
					title: '提示',
					message: '操作成功'
				});
			}
		} else {
			messageShow('提示', response.data.message);
		}

		return response.data;
	},
	(error) => {
		let res = error.response;
		let title = '异常';
		let msg = '';
		// console.dir(error);
		// 如果有返回的数据
		if (res) {
			if (res.status === 401) {
				tokenOut();
			} else {
				msg = error.response.data.message;
				messageShow(title, msg);
			}
		} else {
			if (error.code === 'ECONNABORTED') {
				msg = '请求超时，请刷新页面重试。';
			} else {
				msg = '系统异常，错误码: ' + (res ? res.status : error.message);
			}
			messageShow(title, msg);
		}

		loadingHide();

		return Promise.reject(error);
	}
);

// 错误消息显示
function messageShow(title = '错误', msg) {
	if (notify) {
		return;
	}
	notify = Notification.error({
		title: title,
		message: msg,
		onClose() {
			notify = null;
		},
	});
}

function loadingShow() {
	if (loading) {
		return;
	}
	loading = Loading.service({ fullscreen: true, customClass: 'page-loading', spinner: 'el-icon-loading' });
}

function loadingHide() {
	if (!loading) {
		return;
	}
	requestCount = 0;
	loading.close();
	loading = null;
}

function tokenOut() {
	MessageBox.confirm('登录状态已过期，请重新登录', {
		confirmButtonText: '确定',
		showCancelButton: false,
		closeOnClickModal: false,
		closeOnPressEscape: false,
		closeOnHashChange: false,
		showClose: false,
		type: 'warning',
	}).then(() => {
		store.dispatch('adminInfo/clear').then(() => {
			location.reload();
		});
	});
}

/** 发送请求*/
const fetch = async (options) => {
	let defConfig = {
		method: 'post',
		token: true,
	};

	let config = Object.assign(defConfig, options);

	return service(config);
};

export default fetch;
