/**
 * constantRoutes
 * 静态路由
 */
export default [
	{
		path: '/home',
		component: () => import('@/pages/home/Home.vue'),
		children: [
			{
				path: '/home',
				redirect: '/home/dashboard',
			},
			{
				path: '/home/dashboard',
				name: 'dashboard',
				meta: { mainBg: false },
				component: () => import('@/pages/home/Dashboard.vue'),
			},
		],
	},
	{
		path: '/404',
		name: 'Error404',
		component: () => import('@/pages/status/Error404.vue'),
	},
	{
		path: '/500',
		name: 'Error500',
		component: () => import('@/pages/status/Error500.vue'),
	},
	{
		path: '/403',
		name: 'Error403',
		component: () => import('@/pages/status/Error403.vue'),
	},
	{
		path: '/',
		name: 'login',
		component: () => import('@/pages/status/Login.vue'),
	},
];
