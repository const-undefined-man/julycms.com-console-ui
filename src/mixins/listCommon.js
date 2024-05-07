export const listCommon = {
	data() {
		return {
			pageKey: 1,
			fields: [],
			search: {},
			page: 1,
			limit: 10,
			list: [],
			total: 0,
			// 是否有分页
			isPage: true,
			// api数组[api文件夹下面的文件夹, 文件, 方法]
			api: [],
			row: {},
		};
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			if (!this.api.length) {
				const api = this.$route.path.substring(1).split('/');
				api.push(this.listMethod || 'list');
				this.api = api;
			}
		},
		// 获取数据
		async getList() {
			let data = JSON.parse(JSON.stringify(this.search));
			// 如果有分页
			if (this.isPage) {
				data.page = this.page;
				data.limit = this.limit;
			}
			// 处理检索额外条件
			this.formatCondition && this.formatCondition(data);
			data = this.$utils.formatParams(data);
			let [folder, file, method] = this.api;
			let res = await this.$api[folder][file][method](data).catch((c) => {
				this.listCatch && this.listCatch(c);

				return { success: false };
			});
			if (res.code === 1) {
				// 列表总数
				if (res.data.meta) {
					this.total = res.data.meta.totalItems;
				}

				// 防止后端返回数据为null的情况
				let list = res.data?.items || res.data;

				// 第2页存在1条数据，删除该数据，页码停留在第2页，列表区域显示"暂无数据"
				if (!list.length) {
					if (this.page > 1) {
						this.page -= 1;
						this.getList();
					}
				}
				this.list = list.map((item, index) => {
					item.index = (this.page - 1) * this.limit + index + 1;
					// 处理列表字段
					this.listItem && this.listItem(item);

					return item;
				});

				this.listAfter && this.listAfter();
			}
		},
		// 搜索
		onSearch(form) {
			this.search = form;
			this.page = 1;
			this.getList();
		},
		// 清空搜索
		clearSearch() {
			this.onSearch({});
		},
		// 分页
		onpage(page) {
			this.page = page;
			this.getList();
		},
		// 每页显示条数
		onsize(size) {
			this.page = 1;
			this.limit = size;
			this.getList();
		},
		// 列表通用操作
		async listCommonDel(data, title = '确认操作', msg = '此操作将永久删除该数据, 是否继续?') {
			const fnOk = async () => {
				let [folder, file, method] = this.api;
				let res = await this.$api[folder][file][method](data);
				if (res.code === 1) {
					this.api[2] = 'list';
					this.delAfter ? this.delAfter() : this.getList();
				}
			};
			const fncancel = () => {
				this.api[2] = 'list';
			};
			let res = await this.$confirm(msg, title, { type: 'warning' }).catch((err) => err);
			if (res !== 'confirm') {
				fncancel();

				return;
			}
			fnOk();
		},
		// 删除
		async listDel(row) {
			this.api[2] = 'del';
			this.listCommonDel(row.id);
		},
	},
};
