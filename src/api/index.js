import Vue from 'vue';

const API = {};
const files = require.context('./', true, /\.js$/);

files.keys().forEach((fileName) => {
	const apiConfig = files(fileName);
	const apiName = fileName.substring(2).replace(/\.\w+$/, '');
	const arr = apiName.split('/');

	if (arr.length == 1) {
		if (arr[0] !== 'index') {
			API[arr[0]] = apiConfig.default;
		}
	} else {
		if (arr[0] in API) {
			API[arr[0]][arr[1]] = apiConfig.default;
		} else {
			API[arr[0]] = {};
			API[arr[0]][arr[1]] = apiConfig.default;
		}
	}
});

Object.defineProperty(Vue.prototype, '$api', {
	get() {
		return API;
	},
});
