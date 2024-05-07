import Vue from 'vue';
import App from './App.vue';
import router from './router/';
import store from './store/';
import directive from './directive/auth';
import './assets/css/common.scss';
import './libs';

Vue.use(directive);
Vue.config.productionTip = false;

new Vue({
	store,
	router,
	render: (h) => h(App),
}).$mount('#app');
