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
      <el-table-column slot="status" label="状态">
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
  name: 'LogLoginList',
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
        { text: '删除', style: 'danger', disabled: true, auth: ['system:login-log:batchDel'], fn: this.listBatDel },
        { text: '清除日志', style: 'danger', auth: ['system:login-log:clear'], fn: this.listClear },
      ],
      fields: [
        { type: 'selection' },
        { label: 'ID', prop: 'id', width: 80 },
        { label: '管理员', prop: 'username' },
        { label: '登录IP', prop: 'ip' },
        { label: '登录地点', prop: 'address', width: 200, tip: true },
        { label: '操作系统', prop: 'os' },
        { label: '浏览器', prop: 'browser' },
        { label: '状态', slot: 'status' },
        { label: '操作信息', prop: 'description' },
        { label: '时间', prop: 'createdAt', width: 160 },
        {
          label: '操作',
          type: 'action',
          actions: [{ text: '删除', auth: ['system:login-log:delete'], fn: this.listDel }],
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
      await this.$api.system.loginlog.batDel({ ids: this.selected });
      this.getList();
    },
    // 清除
    async listClear() {
      let res = await this.$confirm('确定要清除所有的记录吗？', '提示', { type: 'warning' }).catch((err) => err);
      if (res !== 'confirm') {
        return;
      }
      await this.$api.system.loginlog.clear();
      this.getList();
    },
  },
};
</script>

<style scoped></style>
