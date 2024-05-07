export const stDialogRow = {
	props: {
		dialogStatu: {
			required: true,
			type: Boolean,
			default() {
				return false;
			},
		},
		dialogTitle: {
			required: true,
			type: String,
			default() {
				return '';
			},
		},
		row: {
			required: false,
			type: Object,
			default() {
				return {};
			},
		},
		id: {
			required: false,
			type: Number,
			default() {
				return 0;
			},
		},
	},
	data() {
		return {
			visible: this.dialogStatu,
		};
	},
	methods: {
		// 获取详细信息
		async getShow() {
			if (!this.row.id) {
				return;
			}
			let res = await this.$request[this.apiName].show({ id: this.row.id });
			if (res.code === 1) {
				this.form = res.result;
			}
		},
		// 关闭
		dialogClose() {
			if (this.form) {
				Object.keys(this.form).map((item) => {
					this.form[item] = null;
				});
			}
			this.$refs.form && this.$refs.form.resetFields();
			this.visible = false;
			this.$emit('close');
		},
		closeBefore() {
			this.dialogClose();
		},
		async dialogSave() {
			this.$refs.form.validate(async (valid) => {
				if (!valid) {
					return;
				}
				let res = null;
				let data = JSON.parse(JSON.stringify(this.form));
				this.saveBefore && this.saveBefore(data);
				if (Object.keys(this.row).length) {
					// 编辑
					res = await this.$request[this.apiName].edit(data);
				} else {
					// 添加
					res = await this.$request[this.apiName].add(data);
				}
				if (res.code === 1) {
					this.$notify.success({ title: '提示', message: '操作成功!' });
					this.dialogClose();
					this.$emit('saved');
				}
			});
		},
	},
	watch: {
		dialogStatu(val) {
			this.visible = val;
			this.$nextTick(() => {
				this.$refs.form && this.$refs.form.resetFields();
				if (Object.keys(this.row).length) {
					this.form = JSON.parse(JSON.stringify(this.row));
				}
			});
		},
	},
};
