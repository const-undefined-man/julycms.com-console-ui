/**
 * v-auth 操作权限处理
 * 指令使用方法：
 * v-auth=['权限标签']
 *
 * 方法使用
 * $auth(['*:*:*'])
 *
 * Copyright (c) 2024 JulyCms
 */
import store from '@/store';

const validAuth = (value) => {
	const permissions = store.getters && store.getters['adminInfo/permissions'];
	if (value && Array.isArray(value) && value.length) {
		return permissions.some(item => {
			return value.includes(item);
		});
	}
	
	return true;
};

const Auth = {
	inserted(el, binding) {
		const hasAuth = validAuth(binding.value);

		if (!hasAuth) {
			el.parentNode && el.parentNode.removeChild(el);
		}
	}
};

export default function(Vue) {
	// 注册指令
	Vue.directive('auth', Auth);

	// 扩展方法
	window.$auth = validAuth;
	Object.defineProperty(Vue.prototype, '$auth', {
		get() {
			return validAuth;
		},
	});
}