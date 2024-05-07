<template>
  <div class="page">
    <ComActionBar :data="actionData"></ComActionBar>

    <ComTable
      :data="list"
      :fields="fields"
      :total="total"
      @page="onpage"
      @size="onsize"
      @listSelect="listSelect"
    ></ComTable>

    <!-- 添加 -->
    <ComDialog :title="add.title" :visible.sync="add.status" :width="add.width" @close="addHide">
      <StSencetiveAdd
        :visible.sync="add.status"
        :data="add.data"
        :type="add.type"
        :sencetive="dictSencetive"
        @close="addHide"
        @save="addSave"
      ></StSencetiveAdd>
    </ComDialog>
  </div>
</template>

<script>
import StSencetiveAdd from '@/components/section/site/StSencetiveAdd.vue';
import { listCommon } from '@/mixins/listCommon.js';
export default {
	components: { StSencetiveAdd },
	mixins: [listCommon],
	data() {
		return {
			actionData: [
				{ text: '添加', style: 'primary', auth: ['site:sencetive:create'], fn: this.addShow },
				{ text: '删除', style: 'danger', auth: ['site:sencetive:batDel'], fn: this.listDelBat, disabled: true },
			],
			fields: [
				{ type: 'selection' },
				{ label: 'id', prop: 'id' },
				{ label: '敏感词', prop: 'word' },
				{ label: '替换词', prop: 'replaceWord' },
				{ label: '敏感词类别', prop: 'classify', type: 'enum', enum: [] },
				{ label: '更新时间', prop: 'updatedAt', width: '180' },
				{
					label: '操作',
					type: 'action',
					width: 100,
					actions: [
						{ text: '修改', auth: ['site:sencetive:detail'], fn: this.listEdit },
						{ text: '删除', auth: ['site:sencetive:delete'], fn: this.listDel },
					],
				},
			],
			add: {
				title: '添加敏感词',
				status: false,
				width: 500,
			},
			dictSencetive: [],
			listSelected: [],
		};
	},
	activated() {
		this.getList();
		this.getDictSencetive();
	},
	methods: {
		// 获取敏感词类别字典
		async getDictSencetive() {
			let { code, data } = await this.$api.system.dict.values('sencetive');
			if (code == 1) {
				this.dictSencetive = data;
				this.$set(
					this.fields[4],
					'enum',
					data.map((v) => v.label)
				);
			}
		},
		// 选中事件
		listSelect(rows) {
			this.listSelected = rows;
			this.$set(this.actionData[1], 'disabled', rows.length == 0);
		},
		// 添加弹窗 打开
		addShow() {
			this.add.type = 'add';
			this.add.title = '添加敏感词';
			this.add.status = true;
		},
		// 添加弹窗 关闭
		addHide() {
			this.add.status = false;
			this.add.data = null;
		},
		// 添加敏感词弹窗 保存
		async addSave(data) {
			// 单条数据添加
			if (data.type === 1) {
				delete data.words;
			} else {
				// 批量添加
			}

			let method = data[0].id ? 'update' : 'add';
			let res = await this.$api.site.sencetive[method](data);
			if (res.code === 1) {
				this.addHide();
				this.getList();
			}
		},
		async listDelBat() {
			if (!this.listSelected.length) {
				return;
			}
			let ids = this.listSelected.map((v) => v.id);
			let res = await this.$api.site.sencetive.delbat({ ids });
			if (res.code === 1) {
				this.addHide();
				this.getList();
			}
		},
		async listEdit(row) {
			let res = await this.$api.site.sencetive.detail(row.id);
			if (res.code === 1) {
				this.add.data = res.data;
				this.add.type = 'edit';
				this.add.title = `修改【${row.word}】`;
				this.add.status = true;
			}
		},
	},
};
</script>
