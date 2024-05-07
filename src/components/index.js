import Vue from 'vue';

const requireComponent = require.context('./common', false, /\.vue$/);
requireComponent.keys().forEach((fileName) => {
	// 获取组件配置
	const componentConfig = requireComponent(fileName);
	const componentName = fileName.substring(2).replace(/\.\w+$/, '');
	// 全局注册组件
	Vue.component(componentName, componentConfig.default || componentConfig);
});
