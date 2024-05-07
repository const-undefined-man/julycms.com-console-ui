<template>
  <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="120px" class="mt15">
    <el-form-item label="头像">
      <com-upload v-model="form.attachement"></com-upload>
      <div class="form-tip">只能上传jpg/png/gif文件，且不超过2M</div>
    </el-form-item>
    <el-form-item label="选择角色" prop="roles">
      <el-cascader v-model="form.roles" :options="listRole" :props="defaultProps"></el-cascader>
    </el-form-item>
    <el-form-item label="姓名" prop="realname">
      <el-input v-model="form.realname" maxlength="30" />
    </el-form-item>
    <el-form-item label="登录账号" prop="username">
      <el-input v-model="form.username" maxlength="30" />
    </el-form-item>
    <el-form-item label="登录密码" prop="password">
      <el-input type="password" min="6" maxlength="20" v-model="form.password" name="password" show-password />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" max="32" />
    </el-form-item>
    <el-form-item label="手机号码" prop="phoneNumber">
      <el-input v-model="form.phoneNumber" maxlength="11" />
    </el-form-item>

    <el-row class="text-right">
      <el-button type="primary" @click="save">确定</el-button>
      <el-button @click="close">取消</el-button>
    </el-row>
  </el-form>
</template>

<script>
import { dialogForm } from '@/mixins/dialogForm.js';
export default {
  mixins: [dialogForm],
  props: {
    // 权限列表
    listRole: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      form: {
        attachement: {},
        roles: '',
        realname: '',
        username: '',
        password: '',
        email: '',
        phoneNumber: '',
      },
      rules: {
        roles: { required: true, message: '请选择角色' },
        realname: [
          { required: true, message: '请输入管理员真实姓名' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符' },
        ],
        username: [
          { required: true, message: '请输入管理员登录账号' },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符' },
        ],
        password: [
          { required: true, message: '请输入管理员密码' },
          { min: 5, max: 20, message: '长度在 6 到 20 个字符' },
        ],
      },
      defaultProps: {
        value: 'id',
        label: 'name',
        checkStrictly: true,
        multiple: true,
        emitPath: false,
      },
    };
  },
  watch: {
    'form.password'(val) {
      if (this.form.id) {
        // 只有在输入的时候进行校验
        this.rules.password[0].required = val.length > 0;
      }
    },
  },
  methods: {
    setFromAfter() {
      if (!this.form.id) {
        return;
      }
      this.rules.password[0].required = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-cascader {
  width: 100%;
}
</style>
