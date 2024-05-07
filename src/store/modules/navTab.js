const state = () => ({
	info: [
		{ meta: { title: '首页' }, id: '1', names: [], path: '/home/dashboard' },
	],
	tabIndex: 1,
});

// this.$store.commit('xxx')
const mutations = {
	setTab(state, payload) {
		let findRes = state.info.find((v) => v.id == payload.id);
		if (!findRes) {
			state.info.push(payload);
			sessionStorage.setItem('navTab', JSON.stringify(state.info));
		}
	},
	delTab(state, payload) {
		let index = state.info.findIndex((v) => v.id == payload);

		if (index >= 0) {
			state.info.splice(index, 1);
			sessionStorage.setItem('navTab', JSON.stringify(state.info));
		}
	},
	setTabIndex(state, payload) {
		state.tabIndex = payload;
		sessionStorage.setItem('tabIndex', JSON.stringify(payload));
	},
};

// this.$store.dispatch('xxx')
const actions = {
	setTab({ commit }, payload) {
		commit('setTab', payload);
	},
	delTab({ commit }, payload) {
		commit('delTab', payload);
	},

	setTabIndex({ commit }, payload) {
		commit('setTabIndex', payload);
	},
};

// computed 调用 mapGetters(['xxx'...])
const getters = {
	getTab(state) {
		return state.info;
	},
	getTabIndex(state) {
		return state.tabIndex;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
