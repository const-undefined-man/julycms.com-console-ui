<template>
  <div class="page">
    <ComActionBar :data="actionData"></ComActionBar>

    <ComTable :data="list" :fields="fields" :total="total" @page="onpage" @size="onsize"></ComTable>

    <!-- 添加 -->
    <ComDialog :title="add.title" :visible.sync="add.status" :width="add.width" @close="addHide">
      <StManageAdd
        :visible.sync="add.status"
        :data="add.data"
        :listRole="add.list"
        :type="add.type"
        @close="addHide"
        @save="addSave"
      ></StManageAdd>
    </ComDialog>
  </div>
</template>

<script>
import StManageAdd from '@/components/section/system/StManageAdd.vue';
import { listCommon } from '@/mixins/listCommon.js';
export default {
  components: { StManageAdd },
  mixins: [listCommon],
  data() {
    return {
      actionData: [{ text: '添加', style: 'primary', auth: ['system:manager:create'], fn: this.addShow }],
      fields: [
        { label: 'ID', prop: 'id', width: 80 },
        { label: '头像', prop: 'avatar', type: 'avatar' },
        { label: '登录账号', prop: 'username' },
        { label: '所属角色', prop: 'roleName' },
        { label: '真实姓名', prop: 'realname' },
        { label: '手机号码', prop: 'phoneNumber' },
        { label: '邮箱', prop: 'email' },
        { label: '创建时间', prop: 'createdAt', width: 160 },
        { label: '最后登录IP', prop: 'lastLoginIp' },
        { label: '最后登录时间', prop: 'lastLoginTime' },
        {
          label: '操作',
          type: 'action',
          width: 180,
          actions: [
            { text: '修改', fn: this.listEdit, show: 'showEdit', auth: ['system:manager:detail'] },
            { text: '重置密码', fn: this.listReset, show: 'showReset', auth: ['system:manager:reset-pass'] },
            { text: '删除', fn: this.listDel, show: 'showDel', auth: ['system:manager:delete'] },
          ],
        },
      ],
      add: {
        title: '添加管理员',
        status: false,
        width: 500,
        type: 'add',
        list: [],
      },
      userInfo: this.$utils.getTokenInfo(),
    };
  },
  activated() {
    this.getList();
  },
  methods: {
    // 处理列表字段
    listItem(item) {
      const roleName = item.roles.map((v) => {
        return v.name;
      });

      item.avatar = process.env.VUE_APP_API_URL + (item.avatar?.url || '');
      item.roleName = roleName.join(',');

      // 操作按钮是否显示对应的字段
      item.showEdit = item.isAdmin === 0 || (item.isAdmin === 1 && item.id == this.userInfo.userId);
      item.showDel = item.isAdmin === 0 && item.id != this.userInfo.userId;
      item.showReset = item.isAdmin === 0;
    },
    // 加载完列表之后的钩子函数
    async listAfter() {
      let {
        code,
        data: { items },
      } = await this.$api.system.role.list();
      if (code === 1) {
        this.add.list = items;
      }
    },
    // 添加弹窗 打开
    addShow() {
      this.add.type = 'add';
      this.add.data = {};
      this.add.title = '添加管理员';
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
      data.roles = data.roles.map((v) => {
        return { id: v };
      });
      if (this.add.type === 'edit' && !data.password) {
        delete data.password;
      }
      if (!data.email) {
        delete data.email;
      }
      if (!data.phoneNumber) {
        delete data.phoneNumber;
      }
      let res = await this.$api.system.manager[method](data);
      if (res.code === 1) {
        this.addHide();
        this.getList();
      }
    },
    async listEdit(row) {
      let { code, data } = await this.$api.system.manager.detail(row.id);
      if (code === 1) {
        // 处理角色
        data.roles = data.roles.map((v) => {
          return v.id;
        });

        // 密码
        data.password = data.password || '';

        // 删除多余字段
        ['lastLoginIp', 'lastLoginTime'].forEach((v) => {
          delete data[v];
        });

        this.add.data = data;
        this.add.data.attachement = data.attachement || {
          url: '',
          size: 0,
          mimetype: '',
        };
        this.add.type = 'edit';
        this.add.title = `修改【${row.realname || row.username}】`;
        this.add.status = true;
      }
    },
    listReset(row) {
      this.api = ['system', 'manager', 'resetPass'];
      this.listCommonDel(row.id, '确认操作', `此操作将会吧管理员【${row.username}】的密码改为julycms`);
    },
  },
};
</script>

<style lang="scss" scoped></style>
