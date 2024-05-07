<template>
  <div class="page">
    <ComActionBar :data="actionData"></ComActionBar>

    <ComTable :data="list" :fields="fields"></ComTable>

    <!-- 添加 -->
    <ComDialog :title="add.title" :visible.sync="add.status" :width="add.width" @close="addHide">
      <StDictAdd :key="pageKey" :data="add.data" :type="add.type" @close="addHide" @save="addSave"></StDictAdd>
    </ComDialog>

    <!-- 字典值 列表 -->
    <el-drawer :visible.sync="drawer.show" :title="drawer.title" size="60%">
      <ComActionBar :data="drawer.actionData"></ComActionBar>
      <ComTable :data="drawer.list" :fields="drawer.fields">
        <el-table-column slot="style" label="值/预览">
          <template slot-scope="scope">
            <el-button :type="scope.row.style" plain size="mini">{{ scope.row.value }}</el-button>
          </template>
        </el-table-column>
      </ComTable>
    </el-drawer>
    <!-- 字典值 添加/编辑 -->
    <ComDialog :title="addValue.title" :visible.sync="addValue.status" :width="addValue.width" @close="addvalueHide">
      <StDictValueAdd
        :key="pageKey"
        :data="addValue.data"
        :type="addValue.type"
        @close="addvalueHide"
        @save="addvalueSave"
      ></StDictValueAdd>
    </ComDialog>
  </div>
</template>

<script>
import StDictAdd from '@/components/section/system/StDictAdd.vue';
import StDictValueAdd from '@/components/section/system/StDictValueAdd.vue';
import { listCommon } from '@/mixins/listCommon.js';
export default {
	name: 'DictList',
	components: { StDictAdd, StDictValueAdd },
	mixins: [listCommon],
	data() {
		return {
			actionData: [{ text: '添加', style: 'primary', auth: ['system:dict:create'], fn: this.addShow }],
			fields: [
				{ label: 'ID', prop: 'id' },
				{ label: '名称', prop: 'name', type: 'link', fn: this.listValueShow },
				{ label: '标识', prop: 'type' },
				{
					label: '显示',
					prop: 'display',
					type: 'switch',
					inactiveValue: 0,
					activeValue: 1,
					auth: ['system:dict:display'],
					fn: this.toggleDisplay,
				},
				{ label: '备注', prop: 'remark', width: 280 },
				{ label: '创建时间', prop: 'createdAt', width: 180 },
				{
					label: '操作',
					type: 'action',
					width: 150,
					actions: [
						{ text: '修改', auth: ['system:dict:detail'], fn: this.listEdit },
						{ text: '删除', auth: ['system:dict:delete'], fn: this.listDel },
					],
				},
			],
			// 添加弹窗信息
			add: {
				title: '添加',
				type: 'add',
				status: false,
				width: 500,
				data: null,
			},
			drawer: {
				show: false,
				title: '字典值列表',
				list: [],
				page: 1,
				limit: 10,
				actionData: [{ text: '添加', style: 'primary', auth: ['system:dict-value:create'], fn: this.addValueShow }],
				fields: [
					{ label: 'ID', prop: 'id' },
					{
						label: '排序',
						prop: 'listorder',
						type: 'input',
						auth: ['system:dict-value:listorder'],
						fn: this.listValueOrder,
					},
					{ label: '名称', prop: 'label' },
					{ slot: 'style' },
					{
						label: '显示',
						prop: 'display',
						type: 'switch',
						inactiveValue: 0,
						activeValue: 1,
						auth: ['system:dict-value:display'],
						fn: this.toggleValueDisplay,
					},
					{ label: '创建时间', prop: 'createdAt', width: 180 },
					{
						label: '操作',
						type: 'action',
						width: 150,
						actions: [
							{ text: '修改', auth: ['system:dict-value:detail'], fn: this.listValueEdit },
							{ text: '删除', auth: ['system:dict-value:delete'], fn: this.listValueDel },
						],
					},
				],
			},
			// 添加弹窗信息
			addValue: {
				title: '添加',
				type: 'add',
				status: false,
				width: 500,
				data: null,
			},
		};
	},
	activated() {
		this.getList();
	},
	methods: {
		listItem(item) {
			item.children = [];
		},
		// 添加弹窗 打开
		addShow() {
			this.pageKey += 1;
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
			let res = await this.$api.system.dict[method](data);
			if (res.code === 1) {
				this.addHide();
				this.getList();
			}
		},
		// 切换显示 与 隐藏
		toggleDisplay(row) {
			this.$api.system.dict.display(row.id, row.display ? 1 : 0);
		},
		// 修改
		async listEdit(row) {
			let res = await this.$api.system.dict.detail(row.id);
			if (res.code === 1) {
				this.pageKey += 1;
				this.add.data = res.data;
				this.add.type = 'edit';
				this.add.title = `修改【${row.name}】`;
				this.add.status = true;
			}
		},
		// 字典值 列表
		async getListValue() {
			let { code, data } = await this.$api.system.dictValue.list({ id: this.row.id });
			if (code === 1) {
				this.drawer.list = data;
			}
		},
		// 字典值 列表 显示
		async listValueShow(item) {
			this.row = item;
			await this.getListValue();
			this.drawer.title = `【${item.name}】字典值列表`;
			this.drawer.show = true;
		},
		// 字典值 列表 隐藏
		listValueHide() {
			this.drawer.show = false;
		},
		// 字典值 添加
		addValueShow() {
			this.pageKey += 1;
			this.addValue.type = 'add';
			this.addValue.data = {};
			this.addValue.title = `添加【${this.row.name}】字典值`;
			this.addValue.status = true;
		},
		// 字典值 隐藏
		addvalueHide() {
			this.addValue.data = {};
			this.addValue.title = '';
			this.addValue.status = false;
		},
		// 字典值 添加/编辑
		async addvalueSave(data) {
			let method = data.id ? 'update' : 'add';
			data.dict = this.row.id;
			let res = await this.$api.system.dictValue[method](data);
			if (res.code === 1) {
				this.addvalueHide();
				this.getListValue();
			}
		},
		// 字典值列表 排序
		async listValueOrder(row) {
			let res = await this.$api.system.dictValue.listorder(row.id, row.listorder);
			if (res.code === 1) {
				this.getListValue();
			}
		},
		// 字典值列表 启用/禁用
		toggleValueDisplay(row) {
			this.$api.system.dictValue.display(row.id, row.display ? 1 : 0);
		},
		// 字典值列表 编辑
		async listValueEdit(row) {
			let res = await this.$api.system.dictValue.detail(row.id);
			if (res.code === 1) {
				this.pageKey += 1;
				this.addValue.data = res.data;
				this.addValue.type = 'edit';
				this.addValue.title = `修改【${row.name}】`;
				this.addValue.status = true;
			}
		},
		// 字典值列表 删除
		async listValueDel(row) {
			let title = '确认操作';
			let msg = '此操作将永久删除该数据, 是否继续?';

			let res = await this.$confirm(msg, title, { type: 'warning' }).catch((err) => err);
			if (res !== 'confirm') {
				return;
			}

			let { code } = await this.$api.system.dictValue.del(row.id);
			if (code === 1) {
				this.getListValue();
			}
		},
	},
};
</script>
