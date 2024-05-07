<template>
  <div class="page">
    <ComActionBar :data="actionData"></ComActionBar>

    <ComTable :data="list" :fields="fields" @listSelect="onListSelect">
      <el-table-column slot="siteModel" label="所属模型">
        <template slot-scope="scope">
          {{ scope.row.siteModel.name }}
        </template>
      </el-table-column>
    </ComTable>

    <!-- 添加弹窗 -->
    <ComDialog :visible.sync="add.status" :title="add.title" :width="add.width" @close="addHide">
      <StCategoryAdd
        :visible.sync="add.status"
        :data="add.data"
        :listCategory="list"
        :listSiteModel="listSiteModel"
        :type="add.type"
        @close="addHide"
        @save="addSave"
      >
      </StCategoryAdd>
    </ComDialog>
  </div>
</template>

<script>
import { listCommon } from '@/mixins/listCommon';
import StCategoryAdd from '@/components/section/site/StCategoryAdd.vue';
export default {
	name: 'CategoryList',
	mixins: [listCommon],
	components: { StCategoryAdd },
	data() {
		return {
			actionData: [
				{ text: '添加栏目', style: 'primary', auth: ['content:category:create'], fn: this.addShow },
				{ type: 'line' },
				{ text: '重新统计栏目数据', auth: ['content:category:recount'], fn: this.actionRecount },
				{ type: 'line' },
				{
					type: 'popover-tree',
					text: '批量移动',
					disabled: true,
					key: 1,
					data: [],
					auth: ['content:category:move'],
					fn: this.actionMove,
				},
			],
			fields: [
				{ type: 'selection' },
				{ label: '栏目名称', prop: 'catname' },
				{ label: '栏目ID', prop: 'id', width: 80 },
				{ label: '栏目目录', prop: 'catdir' },
				{ slot: 'siteModel' },
				{ label: '数据量', prop: 'count' },
				{ label: '排序', prop: 'listorder', type: 'input', auth: ['content:category:listorder'], fn: this.listOrder },
				{
					label: '显示',
					prop: 'display',
					type: 'switch',
					inactiveValue: 0,
					activeValue: 1,
					auth: ['content:category:display'],
					fn: this.toggleDisplay,
				},
				{
					label: '操作',
					type: 'action',
					width: 200,
					actions: [
						{ text: '添加子栏目', auth: ['content:category:create'], fn: this.listAddSub },
						{ text: '修改', auth: ['content:category:detail'], fn: this.listEdit },
						{ text: '删除', auth: ['content:category:delete'], fn: this.listDel },
					],
				},
			],
			list: [],
			// 添加信息
			add: {
				status: false,
				title: '添加栏目',
				width: 700,
				type: 'add',
				data: {},
			},
			// 选中的栏目
			selected: [],
			isPage: false,
			listSiteModel: [],
		};
	},
	mounted() {
		this.getList();
		this.getSiteModel();
	},
	methods: {
		listAfter() {
			const listMove = [{ id: 0, catname: '一级栏目' }, ...this.list];
			this.$set(this.actionData[4], 'data', listMove);
		},
		// 列表选中事件
		onListSelect(rows) {
			const ids = rows.map((v) => v.id);
			this.selected = ids;

			const setdisebled = (list) => {
				list.forEach((v) => {
					v.disabled = ids.includes(v.id);
					if (v.children.length) {
						setdisebled(v.children);
					}
				});
			};
			setdisebled(this.list);

			this.$set(this.actionData[4], 'key', Date.now());
			this.$set(this.actionData[4], 'disabled', !rows.length);
		},
		// 模型
		async getSiteModel() {
			const { code, data } = await this.$api.site.sitemodel.list();
			if (code === 1) {
				this.listSiteModel = data;
			}
		},
		// 添加弹窗 打开
		addShow() {
			this.add.type = 'add';
			this.add.data = {};
			this.add.title = '添加栏目';
			this.add.status = true;
		},
		// 添加弹窗 关闭
		addHide() {
			this.add.data = null;
			this.add.status = false;
		},
		// 添加弹窗 保存
		async addSave(data) {
			let method = data.id ? 'update' : 'add';
			let res = await this.$api.site.category[method](data);
			if (res.code === 1) {
				this.addHide();
				this.getList();
			}
		},
		// 更新缓存
		actionUpdateCache() {},
		// 重新统计数据
		async actionRecount() {
			let res = await this.$api.site.category.recount();
			if (res.code === 1) {
				this.getList();
			}
		},
		// 删除
		actionDel() {
			// 删除的时候，需要判断是否有子栏目，有的话不允许删除
			this.api[2] = 'delBat';
			this.listCommonDel({ ids: this.selected });
		},
		// 批量移动
		async actionMove(data) {
			if (data.disabled) {
				this.$notify.warning({
					title: '提示',
					message: '不能移动到被选中的栏目',
				});
				
				return;
			}

			const params = {
				from: this.selected,
				to: data.id,
			};
			let res = await this.$api.site.category.move(params);
			if (res.code === 1) {
				this.getList();
			}
		},
		// 批量编辑
		// actionEditBat(data) {
		// 	this.$store.dispatch('navTab/setTab', {
		// 		index: 'batEditCategoty',
		// 		catname: '批量编辑栏目',
		// 		path: '/site/category/batedit',
		// 	});
		// 	this.$store.dispatch('navTab/setTabIndex', 'batEditCategoty');
		// 	this.$router.push({ path: '/content/category/batedit' });
		// },
		// 排序
		async listOrder(row) {
			let res = await this.$api.site.category.listorder(row.id, row.listorder);
			if (res.code === 1) {
				this.getList();
			}
		},
		// 切换显示 与 隐藏
		toggleDisplay(row) {
			this.$api.site.category.display(row.id, row.display ? 1 : 0);
		},
		// 添加子栏目
		listAddSub(row) {
			this.add.data = {
				parent: { id: row.id, catname: row.catname },
				siteModel: { id: row.siteModel.id },
			};
			this.add.type = 'edit';
			this.add.title = `添加【${row.catname}】子栏目`;
			this.add.status = true;
		},
		// 编辑栏目
		async listEdit(row) {
			let res = await this.$api.site.category.detail(row.id);
			if (res.code === 1) {
				this.add.data = res.data;
				if (res.data.parent) {
					this.add.data.parent = { id: res.data.parent.id };
				} else {
					this.add.data.parent = { id: 0 };
				}
				this.add.type = 'edit';
				this.add.title = `修改【${row.catname}】`;
				this.add.status = true;
			}
		},
	},
};
</script>

<style scoped>
.el-dropdown-menu {
  max-height: 300px;
  overflow-y: scroll;
}
</style>
