<template>
  <div class="page">
    <ComActionBar :data="actionData"></ComActionBar>

    <ComTable :data="list" :fields="fields">
      <el-table-column slot="name" label="名称" width="210px">
        <template slot-scope="scope">
          <i v-if="scope.row.icon" :class="scope.row.icon" />
          {{ scope.row.name }}
        </template>
      </el-table-column>
    </ComTable>

    <!-- 添加 -->
    <ComDialog :title="add.title" :visible.sync="add.status" :width="add.width" @close="addHide">
      <StMenuAdd v-if="add.status" :data="add.data" :listMenu="list" @close="addHide" @save="addSave"></StMenuAdd>
    </ComDialog>
  </div>
</template>

<script>
import StMenuAdd from '@/components/section/system/StMenuAdd.vue';
import { listCommon } from '@/mixins/listCommon.js';
import { filterAsyncRouter } from '@/router/';
export default {
	components: { StMenuAdd },
	mixins: [listCommon],
	data() {
		return {
			actionData: [{ text: '添加', style: 'primary', auth: ['system:menu:create'], fn: this.addShow }],
			fields: [
				{ slot: 'name' },
				{ label: 'ID', prop: 'id', width: 100 },
				{
					label: '排序',
					prop: 'listorder',
					type: 'input',
					auth: ['system:menu:listorder'],
					fn: this.listOrder,
					width: 100,
				},
				{ label: '权限标识', prop: 'mark' },
				{ label: '路由地址', prop: 'componentRoute' },
				{ label: '组件路径', prop: 'componentPath' },
				{
					label: '显示',
					prop: 'display',
					type: 'switch',
					inactiveValue: 0,
					activeValue: 1,
					auth: ['system:menu:display'],
					fn: this.toggleDisplay,
					width: 80,
				},
				{
					label: '快捷菜单',
					prop: 'quickmenu',
					type: 'switch',
					inactiveValue: 0,
					activeValue: 1,
					width: 80,
					auth: ['system:menu:quickmenu'],
					fn: this.toggleQuickmenu,
				},
				{ label: '创建时间', prop: 'createdAt', width: 180 },
				{
					label: '操作',
					type: 'action',
					width: 150,
					actions: [
						{ text: '添加', show: 'btnAdd', fn: this.listAdd },
						{ text: '修改', show: 'btnEdit', fn: this.listEdit },
						{ text: '删除', show: 'btnDel', fn: this.listDel },
					],
				},
			],
			// 添加弹窗信息
			add: {
				title: '添加',
				status: false,
				width: 700,
				data: null,
			},
			// 是否有分页
			isPage: false,
		};
	},
	activated() {
		this.getList();
	},
	methods: {
		listAfter() {
			this.formatList(this.list);
		},
		formatList(data) {
			data.forEach((item) => {
				item.btnAdd = item.id !== 1 && this.$auth(['system:menu:create']);
				item.btnEdit = item.id !== 1 && this.$auth(['system:menu:detail']);
				item.btnDel = item.id !== 1 && this.$auth(['system:menu:delete']);
				if (item.children.length) {
					this.formatList(item.children);
				} else {
					delete item.children;
				}
			});
		},
		// 添加弹窗 打开
		addShow() {
			this.add.type = 'add';
			this.add.data = {};
			this.add.title = '添加';
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
			let res = await this.$api.system.menu[method](data);
			if (res.code === 1) {
				this.addHide();
				this.getList();
				this.updateRuote();
			}
		},
		// 菜单 排序
		async listOrder(row) {
			let res = await this.$api.system.menu.listorder(row.id, row.listorder);
			if (res.code === 1) {
				this.getList();
			}
		},
		// 切换显示 与 隐藏
		async toggleDisplay(row) {
			await this.$api.system.menu.display(row.id, row.display ? 1 : 0);
			this.updateRuote();
		},
		async toggleQuickmenu(row) {
			await this.$api.system.menu.quickmenu(row.id, row.quickmenu ? 1 : 0);
			this.updateRuote();
		},
		async updateRuote() {
			let { code, data } = await this.$api.system.menu.list();
			if (code === 1) {
				const asyncRouter = filterAsyncRouter(data);
				asyncRouter.push({ path: '*', redirect: '/404', hidden: true });
				this.$store.dispatch('adminInfo/setMenus', asyncRouter);
			}
		},
		listAdd(row) {
			this.add.data = {
				parent: row.id,
			};
			this.add.type = 'edit';
			this.add.title = `添加子菜单【${row.name}】`;
			this.add.status = true;
		},
		// 修改
		async listEdit(row) {
			// let listRow = this.listMenu.find((v) => v.id == row.id);
			// listRow.disabled = true;
			let res = await this.$api.system.menu.detail(row.id);
			if (res.code === 1) {
				this.add.data = res.data;
				if (res.data.parent) {
					this.add.data.parent = res.data.parent.id;
				}
				this.add.type = 'add';
				this.add.title = `修改【${row.name}】`;
				this.add.status = true;
			}
		},
	},
};
</script>
