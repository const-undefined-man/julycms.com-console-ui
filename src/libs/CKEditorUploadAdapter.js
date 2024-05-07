import fetch from './http';
import {getToken} from './token';
import apis from '../api/common';
/**
 * CKEditor编辑器上传附件适配器
 */
export default class CKEditorUploadAdapter {
	constructor(options) {
		this.loader = options.loader;
		this.url = apis.uploadUrl;
		this.token = getToken();
		this.callback = options.callback || function() {};
	}

	async upload() {
		const data = new FormData();
		const file = await this.loader.file;
		// console.log(file)
		data.append('file', file);

		const res = await fetch({
			url: this.url,
			method: 'post',
			headers: {
				Authorization: 'Bearer ' + this.token,
				'Content-Type': 'multipart/form-data'
			},
			data
		});

		// console.log(res);

		if (res.code === 1) {
			this.callback({
				url: res.data,
				size: file.size,
				mimetype: file.type,
				operatorType: 1
			});

			return Promise.resolve({default: process.env.VUE_APP_API_URL + res.data});
		} else {
			return Promise.reject(res);
		}
	}
}