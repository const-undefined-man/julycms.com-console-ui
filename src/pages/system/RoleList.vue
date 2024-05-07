<template>
  <div class="page">
    <ComActionBar :data="actionData"></ComActionBar>

    <ComTable :data="list" :fields="fields"></ComTable>

    <!-- 添加 -->
    <ComDialog :title="add.title" :visible.sync="add.status" :width="add.width" @close="addHide">
      <StRoleAdd
        :visible.sync="add.status"
        :data="add.data"
        :type="add.type"
        :menus="listMenu"
        @close="addHide"
        @save="addSave"
      ></StRoleAdd>
    </ComDialog>
  </div>
</template>

<script>
import StRoleAdd from '@/components/section/system/StRoleAdd.vue';
// import StRoleMenu from '@/components/section/system/StRoleMenu.vue';
// import StRoleCat from '@/components/section/system/StRoleCat.vue';
import { listCommon } from '@/mixins/listCommon.js';
import { filterAsyncRouter } from '@/router/';
export default {
	components: { StRoleAdd },
	mixins: [listCommon],
	data() {
		return {
			actionData: [{ text: '添加', style: 'primary', fn: this.addShow, auth: ['system:role:create'] }],
			fields: [
				{ label: 'ID', prop: 'id' },
				{ label: '角色名称', prop: 'name' },
				{ label: '角色描述', prop: 'description', width: 300 },
				{ label: '更新时间', prop: 'updatedAt' },
				{
					label: '状态',
					prop: 'status',
					type: 'switch',
					inactiveValue: 0,
					activeValue: 1,
					fn: this.toggleStatus,
					auth: ['system:role:status'],
				},
				{
					label: '操作',
					type: 'action',
					width: 220,
					actions: [
						{ text: '修改', fn: this.listEdit, auth: ['system:role:detail'] },
						{ text: '删除', fn: this.listDel, auth: ['system:role:delete'] },
					],
				},
			],
			// 添加弹窗信息
			add: {
				title: '添加',
				type: 'add',
				status: false,
				width: 700,
				list: [],
			},
			// 是否有分页
			isPage: false,
			// 菜单列表
			listMenu: [],
			// 当前角色id
			curId: 0,
			// 角色菜单
			roleMenu: [],
		};
	},
	activated() {
		this.getList();
		this.getMenus();
	},
	methods: {
		// 处理角色
		listAfter() {
			let list = JSON.parse(JSON.stringify(this.list));
			this.add.list = [{ id: 0, rolename: '顶级角色' }, ...list];
		},
		// 获取菜单
		async getMenus() {
			let { code, data } = await this.$api.system.menu.list();
			if (code === 1) {
				this.listMenu = data;
			}
		},
		// 添加弹窗 打开
		addShow() {
			this.add.data = {};
			this.add.type = 'add';
			this.add.title = '添加';
			this.add.status = true;
		},
		// 添加弹窗 关闭
		addHide() {
			this.add.status = false;
			this.add.data = null;
		},
		// 添加弹窗 保存
		async addSave(data) {
			let method = data.id ? 'update' : 'add';
			let res = await this.$api.system.role[method](data);
			if (res.code === 1) {
				this.addHide();
				this.getList();
				this.updateRuote();
			}
		},
		async updateRuote() {
			let { code, data } = await this.$api.system.menu.list();
			if (code === 1) {
				const asyncRouter = filterAsyncRouter(data);
				asyncRouter.push({ path: '*', redirect: '/404', hidden: true });
				this.$store.dispatch('adminInfo/setMenus', asyncRouter);
			}
		},
		// 切换状态
		toggleStatus(row) {
			this.$api.system.role.status(row.id, row.status ? 1 : 0);
		},
		// 修改
		async listEdit(row) {
			let res = await this.$api.system.role.detail(row.id);
			if (res.code === 1) {
				this.add.data = res.data;
				this.add.type = 'edit';
				this.add.title = `修改【${row.name}】`;
				this.add.status = true;
			}
		},
	},
};
</script>
