<template>
  <div class="page">
    <ComSearchBar :data="searchData" @search="onSearch" @clear="clearSearch"></ComSearchBar>

    <ComActionBar :data="actionData"></ComActionBar>

    <ComTable
      :autoHeight="false"
      :data="list"
      :fields="fields"
      :total="total"
      @page="onpage"
      @size="onsize"
      @listSelect="onListSelect"
    >
      <el-table-column slot="status" label="操作结果">
        <template slot-scope="scope">
          <el-tag :type="['danger', 'success'][scope.row.status]">{{ ['失败', '成功'][scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
    </ComTable>
  </div>
</template>

<script>
import { listCommon } from '@/mixins/listCommon.js';
export default {
  name: 'LogActionList',
  mixins: [listCommon],
  data() {
    return {
      searchData: [
        [
          { type: 'select', label: '用户名', name: 'username' },
          { type: 'daterange', label: '时间段', name: 'createdAt' },
        ],
      ],
      actionData: [
        { text: '删除', style: 'danger', disabled: true, auth: ['system:operation-log:batchDel'], fn: this.listBatDel },
        { text: '清除日志', style: 'danger', auth: ['system:operation-log:clear'], fn: this.listClear },
      ],
      fields: [
        { type: 'selection' },
        { label: 'ID', prop: 'id', width: 80 },
        { label: '用户名', prop: 'username' },
        { label: '模块', prop: 'module' },
        { label: '操作', prop: 'operation' },
        { slot: 'status' },
        { label: 'ip', prop: 'ip' },
        { label: '地点', prop: 'address' },
        { label: '系统', prop: 'os' },
        { label: '浏览器', prop: 'browser' },
        { label: '耗时', prop: 'taketime' },
        { label: '时间', prop: 'createdAt', width: 160 },
        {
          label: '操作',
          type: 'action',
          actions: [{ text: '删除', auth: ['system:operation-log:delete'], fn: this.listDel }],
        },
      ],
      selected: [],
    };
  },
  activated() {
    this.getEnums();
    this.getList();
  },
  methods: {
    async getEnums() {
      let manager = await this.$api.system.manager.list();
      if (manager.code === 1) {
        const options = manager.data.items.map((v) => {
          return {
            label: v.username,
            value: v.username,
          };
        });
        this.$set(this.searchData[0][0], 'options', options);
      }
    },
    formatCondition(data) {
      if (data.createdAt) {
        const date = data.createdAt;
        data.createdAt = [
          this.$dayjs(date[0] + ' 00:00:00').format('YYYY-MM-DD HH:mm:ss'),
          this.$dayjs(date[1] + ' 23:59:59').format('YYYY-MM-DD HH:mm:ss'),
        ];
      }
    },
    listItem(item) {
      item.taketime += '毫秒';
    },
    // 列表选中事件
    onListSelect(rows) {
      const ids = rows.map((v) => v.id);
      this.selected = ids;
      this.$set(this.actionData[0], 'disabled', !ids.length);
    },
    // 批量 删除
    async listBatDel() {
      let res = await this.$confirm('确定删除选择的数据吗？', '提示', { type: 'warning' }).catch((err) => err);
      if (res !== 'confirm') {
        return;
      }
      await this.$api.system.operationlog.batDel({ ids: this.selected });
      this.getList();
    },
    // 清除
    async listClear() {
      let res = await this.$confirm('确定要清除所有的记录吗？', '提示', { type: 'warning' }).catch((err) => err);
      if (res !== 'confirm') {
        return;
      }
      await this.$api.system.operationlog.clear();
      this.getList();
    },
  },
};
</script>

<style scoped></style>
