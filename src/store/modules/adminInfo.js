import { removeToken } from '@/libs/token';

const state = () => ({
	info: {},
	menus: [],
	permissions: [],
});

// this.$store.commit('xxx')
const mutations = {
	setInfo(state, payload) {
		state.info = payload;
		sessionStorage.setItem('adminInfo', JSON.stringify(payload));
	},
	setMenus(state, payload) {
		// 去除最后一条的404路由
		payload.pop();
		state.menus = payload;
	},
	setPermissions(state, payload) {
		state.permissions = payload;
	},
	clear(state) {
		state.info = {};
		state.menus = [];
		removeToken();
		sessionStorage.removeItem('adminInfo');
		sessionStorage.removeItem('tabIndex');
		sessionStorage.removeItem('navTab');
	}
};

// this.$store.dispatch('xxx')
const actions = {
	setInfo({ commit }, payload) {
		commit('setInfo', payload);
	},
	setMenus({ commit }, payload) {
		commit('setMenus', payload);
	},
	setPermissions({ commit }, payload) {
		const flattenTree = (tree) => {
			return tree.reduce((acc, node) => {
				acc.push(node);
				if (node.children.length) {
					acc.push(...flattenTree(node.children));
				}

				return acc;
			}, []);
		};

		let list = flattenTree(payload);
		let permissions = list.map(item => item.mark);
		commit('setPermissions', permissions);
	},
	clear({ commit }) {
		return new Promise((resolve) => {
			commit('clear');
			resolve();
		});
	},
};

// computed 调用 mapGetters(['xxx'...])
const getters = {
	info(state) {
		let res = JSON.parse(sessionStorage.getItem('adminInfo'));
		
		return state.info ? state.info : res;
	},
	menus(state) {
		return state.menus;
	},
	permissions(state) {
		return state.permissions;
	}
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
