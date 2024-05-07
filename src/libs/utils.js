// 获取对象类型
export function getType(o) {
	return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
}

// sessionStorage 存储
export const SStore = {
	set: (key, val) => {
		if (getType(key) === 'object') {
			Object.keys(key).forEach((k) => {
				var v = JSON.stringify(key[k]);
				sessionStorage.setItem(k, v);
			});
		} else {
			var item = JSON.stringify(val);
			sessionStorage.setItem(key, item);
		}
	},
	get: (key) => {
		return sessionStorage.getItem(key)
			? JSON.parse(sessionStorage.getItem(key))
			: false;
	},
	del: (key) => {
		let keys = [];
		keys = Array.isArray(key) ? key : [key];
		keys.forEach((item) => {
			sessionStorage.getItem(item) && sessionStorage.removeItem(item);
		});
	},
};

// 只能输入数字
export function onlyNumber(str) {
	if (!str) {
		return;
	}
	// eslint-disable-next-line
	return str.toString().replace(/[^\d+]|[`,\.eE\-\+]/g, '');
}

/**
 * 下载文件
 * @param {string} url
 */
export function download(url) {
	let link = document.createElement('a');
	link.style.display = 'none';
	link.href = url;
	link.target = '_blank';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

/**
 * 导入失败然后下载二进制文件
 * @param {文件流} binary
 * @param {文件对象} file
 * @param {文件mimetype} mimeType
 */
export function downloadFile(
	data,
	file,
	mimeType = 'application/ms-excel;charset=utf-8'
) {
	let filename = file.name;
	let blob = new Blob(['\ufeff' + data], { type: mimeType });
	if (window.navigator.msSaveOrOpenBlob) {
		navigator.msSaveBlob(blob, filename);
	} else {
		let href = window.URL.createObjectURL(blob);
		let a = document.createElement('a');
		a.download = filename;
		a.href = href;
		a.click();
		window.URL.revokeObjectURL(href);
	}
}

// 格式化查询参数，去掉空元素
export function formatParams(data) {
	if (!Object.keys(data).length) {
		return {};
	}

	// 去掉空元素
	for (let item in data) {
		if (['', null].includes(data[item])) {
			delete data[item];
		}
	}
	
	return data;
}
