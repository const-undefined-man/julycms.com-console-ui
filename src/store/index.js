import Vue from 'vue';
import Vuex from 'vuex';

import adminInfo from './modules/adminInfo';
import navTab from './modules/navTab';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		navTab,
		adminInfo,
	},
});
