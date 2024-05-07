<template>
  <div class="page">
    <ComActionBar :data="actionData"></ComActionBar>

    <ComTable :data="list" :fields="fields" :total="total" @page="onpage" @size="onsize"></ComTable>

    <!-- 添加 -->
    <ComDialog :title="add.title" :visible.sync="add.status" :width="add.width" @close="addHide">
      <st-third-add :visible.sync="add.status" :data="add.data" @onclose="addHide" @onsave="addSave"></st-third-add>
    </ComDialog>
  </div>
</template>

<script>
import StThirdAdd from '@/components/section/site/StThirdAdd.vue';
import { listCommon } from '@/mixins/listCommon.js';
export default {
	components: { StThirdAdd },
	mixins: [listCommon],
	data() {
		return {
			actionData: [{ text: '添加', style: 'primary', fn: this.addShow }],
			fields: [
				{ label: 'ID', prop: 'id' },
				{ label: '标题', prop: 'title' },
				{ label: '应用场景', prop: 'scene' },
				{ label: '产品所属公司', prop: 'compony' },
				{ label: '账号', prop: 'account' },
				{
					label: '操作',
					type: 'action',
					width: 100,
					actions: [
						{ text: '修改', fn: this.listEdit },
						{ text: '删除', fn: this.listDel },
					],
				},
			],
			add: {
				title: '添加',
				status: false,
				width: 700,
			},
		};
	},
	activated() {
		this.getList();
	},
	methods: {
		// 添加弹窗 打开
		addShow(title) {
			this.add.title = title || '添加';
			this.add.status = true;
		},
		// 添加弹窗 关闭
		addHide() {
			this.add.status = false;
			this.add.data = null;
		},
		// 添加弹窗 保存
		async addSave(data) {
			let method = data.id ? 'update' : 'create';
			let res = await this.$api.site.third[method](data);
			if (res.code === 1) {
				this.addHide();
				this.getList();
			}
		},
		async listEdit(row) {
			let res = await this.$api.site.third.detail({ id: row.id });
			if (res.code === 1) {
				this.add.data = res.data;
				this.addShow(`修改【${row.title}】`);
			}
		},
	},
};
</script>
