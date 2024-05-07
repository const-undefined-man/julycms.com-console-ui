<template>
  <el-row class="page" :gutter="20">
    <el-col :span="8">
      <el-card shadow="naver">
        <template slot="header">我的资料</template>
        <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="120px" class="mt15">
          <el-form-item label="头像" prop="avatar">
            <com-upload v-model="form.avatar" :data="uploadData"></com-upload>
          </el-form-item>
          <el-form-item label="姓名" prop="realname">
            <el-input v-model="form.realname" />
          </el-form-item>
          <el-form-item label="我的角色">
            <el-input v-model="info.rolename" :disabled="true" />
          </el-form-item>
          <el-form-item label="登录账号">
            <el-input v-model="info.username" :disabled="true" />
          </el-form-item>
          <el-form-item label="最后登录时间">
            <el-input v-model="info.lastLoginTime" :disabled="true" />
          </el-form-item>
          <el-form-item label="最后登录IP">
            <el-input v-model="info.lastLoginIp" :disabled="true" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card shadow="naver">
        <template slot="header">操作记录</template>
        <ComTable :data="list" :fields="fields" :total="total" @page="onpage" @size="onsize"></ComTable>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { listCommon } from '@/mixins/listCommon.js';
export default {
	mixins: [listCommon],
	data() {
		return {
			info: {
				rolename: '',
				username: '',
				lastLoginTime: '',
				lastLoginIp: '',
			},
			form: {
				realname: '',
				avatar: '',
			},
			rules: {
				name: [
					{ required: true, message: '请输入管理员真实姓名' },
					{ min: 2, max: 30, message: '长度在 2 到 30 个字符' },
				],
				avatar: { required: true, message: '请上传头像' },
			},
			fields: [
				{ label: '操作', prop: 'description', width: 150 },
				{ label: '链接', prop: 'url' },
				{ label: 'IP', prop: 'ip', width: 120 },
				{ label: '时间', prop: 'createdAt', width: 160 },
			],
			// 上传附加参数
			uploadData: {
				userId: '',
				module: '系统管理',
				category: '管理员管理',
			},
			// 请求API信息
			api: ['system', 'log', 'mylog'],
		};
	},
	activated() {
		this.userId = this.$cookie.get('userId');
		this.uploadData.userId = this.userId;
		this.getUserinfo();
		this.getList();
	},
	methods: {
		// 获取详细信息
		async getUserinfo() {
			const res = await this.$api.system.manager.detail({ userId: this.userId });
			if (res.code == 1) {
				const {
					avatar,
					realname,

					username,
					lastLoginTime,
					lastLoginIp,
				} = res.data;
				// const rolename = roles.map((v) => {
				// 	return v.rolename;
				// });
				this.info = {
					rolename: '',
					username,
					lastLoginTime,
					lastLoginIp,
				};
				this.form = { avatar, realname };
			}
		},
		// 修改信息
		onSubmit() {
			this.$refs.form.validate(async (valid) => {
				if (!valid) {
					return;
				}

				let res = await this.$api.system.manager.updateField(this.form);
				if (res.code === 1) {
					this.$notify.success({
						title: '提示',
						message: '操作成功',
					});
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped></style>
