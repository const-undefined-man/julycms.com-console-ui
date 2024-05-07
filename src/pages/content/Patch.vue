<template>
  <div class="page">
    <ComSearchBar :data="searchData" labelWidth="50px" @search="onSearch"></ComSearchBar>

    <ComActionBar :data="actionData"></ComActionBar>

    <ComTable :data="list" :fields="fields" :total="total" @listSelect="onListSelect"></ComTable>

    <!-- 添加 编辑 -->
    <ComDialog :title="add.title" :visible.sync="add.status" :width="add.width" @close="addHide">
      <StPatchAdd
        :visible.sync="add.status"
        :data="add.data"
        :type="add.type"
        @close="addHide"
        @save="addSave"
      ></StPatchAdd>
    </ComDialog>

    <!-- 编辑 patchText -->
    <ComDialog
      :title="patchText.title"
      :visible.sync="patchText.status"
      :width="patchText.width"
      @close="patchTextHide"
    >
      <ComEditor :visible.sync="add.status" v-model="patchText.content"></ComEditor>
      <el-row class="text-right mt20">
        <el-button type="primary" @click="patchTextSave">确定</el-button>
        <el-button @click="patchTextHide">取消</el-button>
      </el-row>
    </ComDialog>

    <!-- 编辑 patchList -->
    <ComDialog
      :title="patchList.title"
      :visible.sync="patchList.status"
      :width="patchList.width"
      @close="patchListHide"
    >
      <el-button v-auth="['content:patch:listCreate']" @click="patchListItemShow">添加</el-button>
      <ComTable class="mt20" :data="patchList.list" :fields="patchList.fields"></ComTable>
      <el-row class="text-right mt20">
        <el-button @click="patchListHide">关闭</el-button>
      </el-row>
    </ComDialog>

    <!-- 编辑 patchListItem -->
    <ComDialog
      :title="patchListItem.title"
      :visible.sync="patchListItem.status"
      :width="patchListItem.width"
      @close="patchListItemHide"
    >
      <StPatchAddItem
        :visible.sync="patchListItem.status"
        :data="patchListItem.data"
        :type="patchListItem.type"
        @close="patchListItemHide"
        @save="patchListSave"
      ></StPatchAddItem>
    </ComDialog>
  </div>
</template>

<script>
import { listCommon } from '@/mixins/listCommon.js';
import StPatchAdd from '@/components/section/content/StPatchAdd.vue';
import StPatchAddItem from '@/components/section/content/StPatchAddItem.vue';
export default {
  name: 'Patch',
  mixins: [listCommon],
  components: { StPatchAdd, StPatchAddItem },
  data() {
    return {
      searchData: [
        [
          { type: 'number', label: 'ID', name: 'id' },
          { label: '标题', name: 'title' },
          {
            type: 'radio-button',
            label: '类型',
            name: 'type',
            options: [
              { name: '富文本', value: 0 },
              { name: '列表数据', value: 1 },
            ],
          },
        ],
      ],
      actionData: [
        { text: '添加', style: 'primary', auth: ['content:patch:create'], fn: this.addShow },
        { text: '删除', style: 'danger', auth: ['content:patch:batDelete'], disabled: true, fn: this.listBatDel },
        { text: '禁用', disabled: true, auth: ['content:patch:batDisplay'], fn: this.listBatDisable },
        { text: '启用', disabled: true, auth: ['content:patch:batDisplay'], fn: this.listBatEnable },
      ],
      fields: [
        { type: 'selection' },
        { label: 'ID', prop: 'id' },
        { label: '标题', prop: 'title', tip: true, width: 500 },
        { label: '描述', prop: 'description' },
        { label: '类型', prop: 'type', type: 'enum', enum: ['富文本', '列表数据'] },
        { label: '添加人', prop: 'manager.username' },
        {
          label: '是否启用',
          prop: 'display',
          type: 'switch',
          inactiveValue: 0,
          activeValue: 1,
          auth: ['content:patch:display'],
          fn: this.toggleDisplay,
        },
        {
          label: '操作',
          type: 'action',
          width: 180,
          actions: [
            { text: '删除', auth: ['content:patch:delete'], fn: this.listDel },
            { text: '修改', auth: ['content:patch:detail'], fn: this.listEdit },
            { text: '修改内容', show: 'updateContent', fn: this.listEditContent },
          ],
        },
      ],
      list: [],
      selected: [],
      catType: 'list',
      add: {
        title: '添加碎片',
        status: false,
        width: 500,
      },
      patchText: {
        title: '修改碎片内容',
        data: null,
        content: '',
        status: false,
        width: 800,
      },
      patchList: {
        title: '修改碎片内容',
        data: null,
        status: false,
        width: 800,
        list: [],
        fields: [
          { label: 'ID', prop: 'id' },
          { label: '图片', prop: 'imgUrl', type: 'avatar' },
          { label: '名称', prop: 'title', width: 200, tip: true },
          { label: '描述', prop: 'description', tip: true },
          { label: '链接', prop: 'url', tip: true },
          {
            label: '操作',
            type: 'action',
            width: 100,
            actions: [
              { text: '编辑', auth: ['content:patch:listUpdate'], fn: this.patchListItemEdit },
              { text: '删除', auth: ['content:patch:listDel'], fn: this.patchListDel },
            ],
          },
        ],
      },
      patchListItem: {
        title: '修改碎片内容',
        data: null,
        type: 'add',
        status: false,
        width: 500,
      },
    };
  },
  activated() {
    this.getList();
  },
  methods: {
    listItem(item) {
      item.updateContent =
        item.type == 0 ? this.$auth(['content:patch:textUpdate']) : this.$auth(['content:patch:listQuery']);
    },
    // 列表选中事件
    onListSelect(rows) {
      const ids = rows.map((v) => v.id);
      this.selected = ids;
      this.$set(this.actionData[1], 'disabled', !ids.length);
      this.$set(this.actionData[2], 'disabled', !ids.length);
      this.$set(this.actionData[3], 'disabled', !ids.length);
    },
    // 添加弹窗 打开
    addShow() {
      this.add.type = 'add';
      this.add.data = {};
      this.add.title = '添加碎片';
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

      let res = await this.$api.content.patch[method](data);
      if (res.code === 1) {
        this.addHide();
        this.getList();
      }
    },
    // 批量 删除
    async listBatDel() {
      let res = await this.$confirm('确定删除选择的数据吗？', '提示', { type: 'warning' }).catch((err) => err);
      if (res !== 'confirm') {
        return;
      }
      await this.$api.content.patch.displayDel({ ids: this.selected });
      this.getList();
    },
    // 批量 禁用
    async listBatDisable() {
      let res = await this.$confirm('确定禁用选择的数据吗？', '提示', { type: 'warning' }).catch((err) => err);
      if (res !== 'confirm') {
        return;
      }
      await this.$api.content.patch.displayBat({ ids: this.selected, display: 0 });
      this.getList();
    },
    // 批量 启用
    async listBatEnable() {
      let res = await this.$confirm('确定启用选择的数据吗？', '提示', { type: 'warning' }).catch((err) => err);
      if (res !== 'confirm') {
        return;
      }
      await this.$api.content.patch.displayBat({ ids: this.selected, display: 1 });
      this.getList();
    },
    // 切换启用 与 禁用
    async toggleDisplay({ id, display }) {
      await this.$api.content.patch.display(id, display);
      this.getList();
    },
    // 碎片 修改
    async listEdit(row) {
      const { code, data } = await this.$api.content.patch.detail(row.id);
      if (code === 1) {
        this.add.data = data;
        this.add.type = 'edit';
        this.add.title = `修改【${row.title}】`;
        this.add.status = true;
      }
    },
    // 碎片 删除
    async listDel(row) {
      let res = await this.$confirm('确定删除该碎片？', '提示', { type: 'warning' }).catch((err) => err);
      if (res !== 'confirm') {
        return;
      }
      const { code } = await this.$api.content.patch.del(row.id);
      if (code === 1) {
        this.getList();
      }
    },

    // 碎片 修改内容
    async listEditContent(row) {
      if (row.type === 0) {
        this.patchText.data = row;
        const { code, data } = await this.$api.content.patch.detail(row.id);
        if (code === 1) {
          this.patchTextShow(data);
        }
      } else {
        this.patchList.data = row;
        await this.getPatchList(row.id);
        this.patchListShow(row);
      }
    },

    // text show
    patchTextShow(data) {
      this.patchText.content = data.patchText.content;
      this.patchText.type = 'edit';
      this.patchText.title = `修改【${data.title}】`;
      this.patchText.status = true;
    },
    // text hide
    patchTextHide() {
      this.patchText.status = false;
      this.patchText.content = '';
      this.patchText.data = {};
    },
    // text save
    async patchTextSave() {
      const data = {
        id: this.patchText.data.id,
        content: this.patchText.content,
      };
      const { code } = await this.$api.content.patch.updateText(data);
      if (code === 1) {
        this.patchTextHide();
      }
    },

    // patchList
    async getPatchList(id) {
      const { code, data } = await this.$api.content.patch.petchList({ id });
      if (code === 1) {
        this.patchList.list = data.map((v) => {
          if (v.img) {
            v.imgUrl = process.env.VUE_APP_API_URL + v.img.url;
          } else {
            v.imgrl = '';
          }

          return v;
        });
      }
    },
    // patchList 显示
    patchListShow(data) {
      this.patchList.type = 'edit';
      this.patchList.title = `修改【${data.title}】`;
      this.patchList.status = true;
    },
    // patchList 隐藏
    patchListHide() {
      this.patchList.status = false;
      this.patchList.list = [];
    },
    // patchList 保存
    async patchListSave(data) {
      data.patchId = this.patchList.data.id;
      let method = data.id ? 'petchListUpdate' : 'petchListAdd';

      let res = await this.$api.content.patch[method](data);
      if (res.code === 1) {
        await this.getPatchList(this.patchList.data.id);
        this.patchListItemHide();
      }
    },
    // patchList 删除
    async patchListDel(row) {
      let res = await this.$confirm('确定删除该条数据？', '提示', { type: 'warning' }).catch((err) => err);
      if (res !== 'confirm') {
        return;
      }
      const { code } = await this.$api.content.patch.petchListDel(row.id);
      if (code === 1) {
        await this.getPatchList(this.patchList.data.id);
        this.$forceUpdate();
      }
    },

    // patchListItem 显示
    patchListItemShow() {
      this.patchListItem.title = '添加碎片内容';
      this.patchListItem.type = 'add';
      this.patchListItem.status = true;
    },
    patchListItemEdit(row) {
      this.patchListItem.title = '修改碎片内容';
      this.patchListItem.data = row;
      this.patchListItem.type = 'edit';
      this.patchListItem.status = true;
    },
    // patchListItem 隐藏
    patchListItemHide() {
      this.patchListItem.status = false;
      this.patchListItem.data = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.mt20 {
  margin-top: 20px;
}
</style>
