<template>
  <div class="page">
    <ComActionBar :data="actionData"></ComActionBar>

    <ComTable :data="list" :fields="fields"></ComTable>

    <!-- 添加菜单 -->
    <ComDialog :visible.sync="add.status" :title="add.title" :width="add.width" @close="addHide">
      <st-linkage-add
        :visible.sync="add.status"
        :data="add.data"
        :type="add.type"
        @onclose="addHide"
        @onsave="addSave"
      ></st-linkage-add>
    </ComDialog>

    <!-- 添加子菜单 -->
    <ComDialog :title="addSub.title" :visible.sync="addSub.status" :width="addSub.width">
      <st-linkage-add-sub
        :visible.sync="addSub.status"
        :data="addSub.data"
        :type="addSub.type"
        @onsave="addSubSave"
      ></st-linkage-add-sub>
    </ComDialog>
  </div>
</template>

<script>
import StLinkageAdd from '@/components/section/site/StLinkageAdd.vue';
import StLinkageAddSub from '@/components/section/site/StLinkageAddSub.vue';
import { listCommon } from '@/mixins/listCommon.js';
export default {
	components: { StLinkageAdd, StLinkageAddSub },
	mixins: [listCommon],
	data() {
		return {
			actionData: [
				{ text: '添加', style: 'primary', fn: this.addShow },
				{ text: '排序', fn: this.actionListorder },
				{ text: '显示', fn: this.actionShow },
				{ text: '隐藏', fn: this.actionHide },
			],
			fields: [
				{ label: '菜单名称', prop: 'name' },
				{
					label: '排序',
					prop: 'listorder',
					type: 'input',
					width: 100,
					fn: this.listOrder,
				},
				{ label: 'ID', prop: 'id', width: 100 },
				{ label: '英文名称', prop: 'nameEn' },
				{ label: '菜单描述', prop: 'description' },
				{
					label: '是否显示',
					prop: 'display',
					type: 'switch',
					fn: this.toggleDisplay,
				},
				{
					label: '操作',
					type: 'action',
					width: 180,
					actions: [
						{ text: '添加子菜单', fn: this.listAddSub },
						{ text: '修改', fn: this.listEdit },
						{ text: '删除', fn: this.listDel },
					],
				},
			],
			add: {
				title: '添加联动菜单',
				status: false,
				width: 600,
				type: 'add',
			},
			addSub: {
				title: '添加子菜单',
				status: false,
				width: 600,
				type: 'add',
				args: [],
			},
			drawer: {
				title: '子菜单数据',
				status: false,
				size: '800px',
			},
		};
	},
	activated() {
		this.getList();
	},
	methods: {
		// 添加菜单弹窗 打开
		addShow(title) {
			this.add.title = title || '添加联动菜单';
			this.add.status = true;
		},
		// 添加菜单弹窗 关闭
		addHide() {
			this.add.data = null;
			this.add.status = false;
		},
		// 添加菜单弹窗 保存
		async addSave(data) {
			let method = data.id ? 'update' : 'create';
			let res = await this.$api.site.linkage[method](data);
			if (res.code === 1) {
				this.addHide();
				this.getList();
			}
		},
		// 添加子菜单弹窗 打开
		addSubShow(title) {
			this.addSub.title = title || '添加子菜单';
			this.addSub.status = true;
		},
		// 添加子菜单弹窗 关闭
		addSubHide() {
			this.addSub.data = null;
			this.addSub.status = false;
		},
		// 添加子菜单弹窗 保存
		async addSubSave(data) {
			let method = data.id ? 'update' : 'create';
			let res = await this.$api.site.linkage[method](data);
			if (res.code === 1) {
				this.addSubHide();
				this.getList();
			}
		},
		// 添加子菜单数据
		async listAddSub(row) {
			const { code, data } = await this.$api.site.linkage.detail({
				id: row.id,
			});
			if (code === 1) {
				this.addSub.data = {
					id: row.id,
					linkageArgs: data.linkageArgs.map((v) => {
						v.value = '';
						
						return v;
					}),
				};
				this.addSubShow(`添加【${row.name}】的子菜单`);
			}
		},
		// 编辑菜单
		async listEdit(row) {
			let res = await this.$api.site.linkage.detail({ id: row.id });
			if (res.code === 1) {
				// 如果是一级菜单
				if (row.pid == 0) {
					this.add.data = res.data;
					this.add.type = 'edit';
					this.addShow(`修改菜单【${row.name}】`);
				} else {
					this.addSub.data = res.data;
					this.addSub.type = 'edit';
					this.addSubShow(`修改菜单【${row.name}】`);
				}
			}
		},
		// 模型字段 排序
		async listOrder(row) {
			const data = {
				id: row.id,
				modelId: row.modelId,
				listorder: row.listorder,
			};
			let res = await this.$api.site.linkage.updateField(data);
			if (res.code === 1) {
				this.$notify.success({
					title: '提示',
					message: '操作成功',
				});

				this.getList();
			}
		},
		// 切换显示 与 隐藏
		async toggleDisplay(row) {
			const data = {
				id: row.id,
				display: row.display ? 1 : 0,
			};
			let res = await this.$api.site.linkage.updateField(data);
			if (res.code === 1) {
				this.$notify.success({
					title: '提示',
					message: '操作成功',
				});
			}
		},
	},
};
</script>
