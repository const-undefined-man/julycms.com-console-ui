import Vue from 'vue';
import Router from 'vue-router';
import Cookie from 'js-cookie';
import store from '../store/index';
import menu from '@/api/system/menu';
import constantRoutes from './constantRoutes';
import Layout from '@/pages/home/Home';
import LayoutPage from '@/components/layout/LayPage';

Vue.use(Router);

/**
 * 解决同一个菜单重复点击报错问题
 */
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
	return routerPush.call(this, location).catch((error) => error);
};

const router = new Router({
	mode: 'history',
	base: process.env.VUE_APP_BASE_URL,
	scrollBehavior: () => ({ y: 0 }),
	routes: constantRoutes,
});

router.beforeEach(async (to, from, next) => {
	// 设置标题
	if (to.meta.title) {
		document.title = to.meta.title;
	}

	// token 存在，说明已经登录
	let token = Cookie.get('token');

	if (token) {
		if (to.path === '/') {
			next('/home/dashboard');
		} else {
			// 判断是都拉取完菜单信息
			if (!store.getters['adminInfo/menus'].length) {
				loadMenus(next, to);
			} else {
				next();
			}
		}
	} else {
		if (to.path === '/') {
			next();
		} else {
			next('/');
		}
	}
});

/**
 * 加载菜单信息
 */
export const loadMenus = (next, to) => {
	menu
		.routers()
		.then((res) => {
			const asyncRouter = filterAsyncRouter(res.data);
			asyncRouter.push({ path: '*', redirect: '/404', hidden: true });

			// 存储权限
			store.dispatch('adminInfo/setPermissions', JSON.parse(JSON.stringify(res.data)));
			// 存储路由
			store.dispatch('adminInfo/setMenus', asyncRouter).then(() => {
				// 动态添加可访问路由表
				asyncRouter.forEach(item => {
					router.addRoute(item);
				});
				// console.log('router', router)
				next({ ...to, replace: true });
			});
		})
		.catch((e) => {
			console.log('router load err:', e);
		});
};

/**
 * 将拿到的组件数组，转换为组件对象
 * @param {Array} arr 获取到组件信息数组
 */
export const filterAsyncRouter = (arr) => {
	let routers = JSON.parse(JSON.stringify(arr));
	routers = routers.filter(v => v.display == 1);
	routers.forEach((item) => {
		item.name = item.name || item.componentName;
		item.path = item.componentRoute || '/';
		item.component = item.componentPath || 'Layout';
		item.meta = {
			title: item.name,
			icon: item.icon,
			mainBg: item.mainBg || false
		};
		if (item.component) {
			// Layout组件特殊处理
			if (item.component === 'Layout') {
				item.component = Layout;
			} else if (item.component === 'LayPage') {
				item.component = LayoutPage;
			} else {
				const component = item.component;
				item.component = loadPage(component);
			}
		}
		if (item.children && item.children.length) {
			item.children = filterAsyncRouter(item.children.filter(v => v.type != 2));
		}
	});

	return routers;
};

/**
 * 加载组件
 * @param {String} path 组件路径
 */
export const loadPage = (path) => {
	if (process.env.NODE_ENV === 'development') {
		return (resolve) => require([`@/pages/${path}`], resolve);
	} else {
		return () => import(`@/pages/${path}`);
	}
};

export default router;
