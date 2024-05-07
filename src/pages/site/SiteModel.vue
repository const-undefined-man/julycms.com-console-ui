<template>
  <div class="page">
    <ComTable :data="list" :fields="fields" :total="total" @page="onpage" @size="onsize"></ComTable>

    <!-- 添加模型 -->
    <ComDialog :visible.sync="dialog.add.status" :title="dialog.add.title" :width="500" @close="addHide">
      <StModelAdd
        :visible.sync="dialog.add.status"
        :data="dialog.add.data"
        :type="dialog.add.type"
        @close="addHide"
        @save="addSave"
      ></StModelAdd>
    </ComDialog>
  </div>
</template>

<script>
import StModelAdd from '@/components/section/site/StModelAdd.vue';
import { listCommon } from '@/mixins/listCommon.js';
export default {
  components: { StModelAdd },
  mixins: [listCommon],
  data() {
    return {
      fields: [
        { label: 'id', prop: 'id' },
        { label: '模型名称', prop: 'name' },
        { label: '数据表', prop: 'mark' },
        { label: '描述', prop: 'description', width: 200 },
        {
          label: '是否启用',
          prop: 'display',
          type: 'switch',
          inactiveValue: 0,
          activeValue: 1,
          auth: ['site:model:display'],
          fn: this.toggleDisplay,
        },
        { label: '更新时间', prop: 'updatedAt', width: 200 },
        {
          label: '操作',
          type: 'action',
          width: 160,
          actions: [
            // { text: '字段管理', fn: this.listField, show: 'isField' },
            { text: '修改', fn: this.listEdit, auth: ['site:model:detail'] },
            { text: '删除', fn: this.listDel, auth: ['site:model:delete'] },
          ],
        },
      ],
      // actionFieldData: [
      // 	{ text: '添加', style: 'primary', fn: this.addFieldShow },
      // ],
      // modelFields: [
      // 	{
      // 		label: '排序',
      // 		prop: 'listorder',
      // 		type: 'input',
      // 		width: 100,
      // 		fn: this.listOrder,
      // 	},
      // 	{ label: '字段名', prop: 'name' },
      // 	{ label: '中文名', prop: 'label' },
      // 	{ label: '类型', prop: 'type' },
      // 	{ label: '系统字段', prop: 'issys', type: 'icon' },
      // 	{ label: '是否必填', prop: 'allowNull', type: 'icon' },
      // 	{
      // 		label: '操作',
      // 		type: 'action',
      // 		width: 100,
      // 		actions: [
      // 			{ text: '修改', fn: this.listFieldEdit, show: 'unsys' },
      // 			{ text: '删除', fn: this.listFieldDel, show: 'unsys' },
      // 		],
      // 	},
      // ],
      // 模型字段列表数据
      // modelList: [],
      dialog: {
        add: {
          status: false,
          title: '添加模型',
          type: 'add',
          data: null,
        },
        addField: {
          status: false,
          title: '添加模型字段',
          data: null,
        },
      },
      // drawer: {
      // 	field: {
      // 		status: false,
      // 		size: '800px',
      // 	},
      // },
    };
  },
  // computed: {
  // 	infos() {
  // 		return this.$utils.getTokenInfo()
  // 	}
  // },
  activated() {
    this.getList();
  },
  methods: {
    // 添加模型 打开
    addShow() {
      this.dialog.add.type = 'add';
      this.dialog.add.data = {};
      this.dialog.add.title = '添加模型';
      this.dialog.add.status = true;
    },
    // 添加模型 关闭
    addHide() {
      this.dialog.add.data = null;
      this.dialog.add.status = false;
    },
    // 添加模型 保存
    async addSave(data) {
      let method = data.id ? 'update' : 'add';
      let res = await this.$api.site.sitemodel[method](data);
      if (res.code === 1) {
        this.addHide();
        this.getList();
      }
    },
    // 切换显示 与 隐藏
    toggleDisplay(row) {
      this.$api.site.sitemodel.display(row.id, row.display ? 1 : 0);
    },
    // 编辑模型 打开
    async listEdit(row) {
      let res = await this.$api.site.sitemodel.detail(row.id);
      if (res.code === 1) {
        this.dialog.add.data = res.data;
        this.dialog.add.type = 'edit';
        this.dialog.add.title = `修改【${row.name}】`;
        this.dialog.add.status = true;
      }
    },
    // 获取模型字段列表
    // async getFieldList() {
    // 	let id = this.drawer.field.id;
    // 	const res = await this.$api.site.sitemodelField.list({ id });

    // 	if (res.code === 1) {
    // 		this.modelList = res.data.map((item) => {
    // 			// 显示编辑 和 删除 按钮
    // 			item.unsys = !item.issys;
    // 			// 系统字段
    // 			item.issys = item.issys
    // 				? 'el-icon-circle-check'
    // 				: 'el-icon-circle-close';

    // 			// 是否必填
    // 			item.allowNull = !item.allowNull
    // 				? 'el-icon-circle-check'
    // 				: 'el-icon-circle-close';

    // 			return item;
    // 		});
    // 	}
    // },
    // 模型字段 打开
    // async listField(row) {
    // 	this.drawer.field.id = row.id;
    // 	await this.getFieldList();
    // 	this.drawer.field.status = true;
    // },
    // 模型字段 排序
    // async listOrder(row) {
    // 	const data = {
    // 		id: row.id,
    // 		modelId: row.modelId,
    // 		listorder: row.listorder,
    // 	};
    // 	let res = await this.$api.site.sitemodelField.updateField(data);
    // 	if (res.code === 1) {
    // 		this.$notify.success({
    // 			title: '提示',
    // 			message: '操作成功',
    // 		});

    // 		this.getFieldList();
    // 	}
    // },
    // 模型字段 打开
    // addFieldShow(title) {
    // 	this.dialog.addField.title = title || '添加字段';
    // 	this.dialog.addField.status = true;
    // },
    // 模型字段 关闭
    // addFieldHide() {
    // 	this.dialog.addField.status = false;
    // 	this.dialog.addField.data = null;
    // },
    // 模型字段 保存
    // async addFieldSave(data) {
    // 	let method = data.id ? 'update' : 'create';
    // 	// 模型id
    // 	data.modelId = this.drawer.field.id;
    // 	data.maxlength *= 1;
    // 	let res = await this.$api.site.sitemodelField[method](data);
    // 	if (res.code === 1) {
    // 		this.addFieldHide();
    // 		this.getFieldList();
    // 	}
    // },
    // 模型字段 编辑
    // async listFieldEdit(row) {
    // 	let res = await this.$api.site.sitemodelField.detail({ id: row.id });
    // 	if (res.code === 1) {
    // 		this.dialog.addField.data = res.data;
    // 		this.addFieldShow(`修改字段【${row.name}】`);
    // 	}
    // },
    // 模型字段 删除
    // listFieldDel(row) {
    // 	let data = { id: row.id };
    // 	this.api[1] = 'sitemodelField';
    // 	this.api[2] = 'del';
    // 	this.listCommonDel(data);
    // },
    // delAfter() {
    // 	this.getFieldList();
    // },
  },
};
</script>
