<template>
  <div class="page">
    <ComActionBar :data="actionData"></ComActionBar>

    <ComTable :data="list" :fields="fields" :total="total" @page="onpage" @size="onsize"></ComTable>

    <!-- 添加 -->
    <ComDialog :title="add.title" :visible.sync="add.status" :width="add.width" @close="addHide">
      <StTagAdd
        :visible.sync="add.status"
        :data="add.data"
        :type="add.type"
        @close="addHide"
        @save="addSave"
      ></StTagAdd>
    </ComDialog>
  </div>
</template>

<script>
import StTagAdd from '@/components/section/site/StTagAdd.vue';
import { listCommon } from '@/mixins/listCommon.js';
export default {
	components: { StTagAdd },
	mixins: [listCommon],
	data() {
		return {
			actionData: [{ text: '添加', style: 'primary', auth: ['content:tag:create'], fn: this.addShow }],
			fields: [
				{ type: 'selection' },
				{ label: 'ID', prop: 'id' },
				{ label: 'tag名称', prop: 'name' },
				{ label: '数据量', prop: 'count', type: 'link', auth: ['content:tag:count'], fn: this.listCount },
				{ label: 'seo标题', prop: 'seoTitle', width: 200 },
				{ label: 'seo关键词', prop: 'seoKeywords', width: 200 },
				{ label: 'seo描述', prop: 'seoDescription', width: 200 },
				{
					label: '是否显示',
					prop: 'display',
					type: 'switch',
					inactiveValue: 0,
					activeValue: 1,
					auth: ['content:tag:display'],
					fn: this.toggleDisplay,
				},
				{
					label: '操作',
					type: 'action',
					width: 100,
					actions: [
						{ text: '修改', auth: ['content:tag:detail'], fn: this.listEdit },
						{ text: '删除', auth: ['content:tag:delete'], fn: this.listDel },
					],
				},
			],
			add: {
				title: '添加Tag',
				status: false,
				width: 500,
			},
		};
	},
	activated() {
		this.getList();
	},
	methods: {
		// 添加弹窗 打开
		addShow() {
			this.add.type = 'add';
			this.add.data = {};
			this.add.title = '添加Tag';
			this.add.status = true;
		},
		// 添加弹窗 关闭
		addHide() {
			this.add.status = false;
			this.add.data = null;
		},
		// 添加tag弹窗 保存
		async addSave(data) {
			let method = data.id ? 'update' : 'add';
			let res = await this.$api.site.tag[method](data);
			if (res.code === 1) {
				this.addHide();
				this.getList();
			}
		},
		async listCount(row) {
			await this.$api.site.tag.count(row.id);
			this.getList();
		},
		// 切换显示 与 隐藏
		toggleDisplay(row) {
			this.$api.site.tag.display(row.id, row.display ? 1 : 0);
		},
		async listEdit(row) {
			let res = await this.$api.site.tag.detail(row.id);
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

<style lang="scss" scoped>
.el-loading-mask {
  margin: 0 -15px;
}
.cell p span {
  margin-right: 10px;
  font-size: 12px;
  color: #999;
}
</style>
