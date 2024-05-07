export const dialogForm = {
	data() {
		return {
			oldForm: null,
		};
	},
	props: {
		data: {
			required: false,
			type: Object,
			default() {
				return null;
			},
		},
		visible: {
			required: false,
			type: Boolean,
			default() {
				return false;
			},
		},
		// 操作类型，add 添加；edit 编辑
		type: {
			required: false,
			type: String,
			validator(val) {
				return ['add', 'edit'].includes(val);
			},
			default() {
				return 'add';
			},
		},
	},
	mounted() {
		this.setFrom();
	},
	watch: {
		visible(val) {
			val && this.setFrom();
		},
	},
	methods: {
		// 编辑的时候，设置表单数据
		setFrom() {
			// 缓存一下原始数据
			this.oldForm = JSON.parse(JSON.stringify(Object.keys(this.form)));
			// 这里用JSON处理一下，是因为不影响列表的数据
			if (this.type === 'edit' && this.data) {
				this.form = Object.assign(this.form, this.data);
			}
			this.setFromAfter && this.setFromAfter();
		},
		// 关闭
		close() {
			if (this.form) {
				// this.$refs.form && this.$refs.form.resetFields();
				// Object.keys(this.form).map((item) => {
				// 	if (this.oldForm && !this.oldForm.includes(item)) {
				// 		delete this.form[item];
				// 	}
				// });
			}
			this.$emit('update:visible', false);
			this.$emit('close');
		},
		// 保存
		async save() {
			this.$refs.form.validate(async (valid) => {
				if (!valid) {
					return;
				}
				let data = JSON.parse(JSON.stringify(this.form));

				this.saveBefore && this.saveBefore(data);

				this.$emit('save', data, this.$refs.form);
			});
		},
	},
};
