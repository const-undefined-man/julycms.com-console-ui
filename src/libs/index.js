import Vue from 'vue';
import dayjs from 'dayjs';
import Cookie from 'js-cookie';

// ElementUI
import ElementUI from 'element-ui';
import '@/assets/css/element-variables.scss';

import * as utils from './utils';
import * as token from './token';

// 全局api
import '@/api/index';

// 全局公共组件
import '@/components/index';

// 注册 elementUI
Vue.use(ElementUI, { size: 'small' });

// utils
Object.defineProperty(Vue.prototype, '$utils', {
	get() {
		return {...utils, ...token};
	},
});

// cookie
Object.defineProperty(Vue.prototype, '$cookie', {
	get() {
		return Cookie;
	},
});

// dayjs
Object.defineProperty(Vue.prototype, '$dayjs', {
	get() {
		return dayjs;
	},
});
