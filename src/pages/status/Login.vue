<template>
  <div class="page">
    <div class="login">
      <div class="titles">
        <div class="title-main"><img src="../../assets/img/logo.png" alt="JulyCms" />JulyCms</div>
        <div class="title-sub">七月内容管理系统</div>
      </div>
      <el-form ref="form" :rules="rules" :model="form" status-icon>
        <el-form-item size="medium" prop="username">
          <el-input placeholder="账号" prefix-icon="el-icon-user" v-model="form.username" autofocus />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            size="medium"
            type="password"
            placeholder="密码"
            prefix-icon="el-icon-lock"
            auto-complete="off"
            v-model="form.password"
          />
        </el-form-item>
        <el-form-item prop="code" class="form-code">
          <el-input
            size="medium"
            placeholder="验证码"
            prefix-icon="el-icon-thumb"
            v-model="form.code"
            @keyup.enter.native="onSubmit"
          />
          <span class="codeimg" v-html="coder" @click="getCode"></span>
        </el-form-item>
        <el-form-item class="form-sbt">
          <el-button size="medium" type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </div>

    <com-copy />
  </div>
</template>

<script>
export default {
	data() {
		return {
			// 验证码标签
			coder: '',
			form: {
				username: '',
				password: '',
				code: '',
			},
			rules: {
				username: {
					required: true,
					message: '请输入登录账号',
					trigger: ['blur', 'change'],
				},
				password: {
					required: true,
					message: '请输入登录密码',
					trigger: ['blur', 'change'],
				},
				code: {
					required: true,
					message: '请输入验证码',
					trigger: ['blur', 'change'],
				},
			},
		};
	},
	created() {
		this.getCode();
	},
	methods: {
		// 获取验证码
		async getCode() {
			let { code, data } = await this.$api.common.getCode();
			if (code === 1) {
				this.coder = data;
			}
		},
		// 验证表单
		onSubmit() {
			this.$refs['form'].validate(async (valid) => {
				if (!valid) {
					return false;
				}

				const { code, data } = await this.$api.common.login(this.form);

				if (code === 1) {
					this.$cookie.set('userId', data.userId);
					this.$cookie.set('token', data.access_token);
					this.$router.push({ path: '/home' });
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
a {
  color: #999;
  text-decoration: none;
  transition: all 0.3s linear;
}
.login {
  width: 360px;
  margin: 10% auto 0;

  .titles {
    text-align: center;
    line-height: 1.2;
  }
  .title-main {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 25px;
    img {
      width: 48px;
    }

    sup {
      font-size: 15px;
    }
  }
  .title-sub {
    margin-top: 10px;
    font-size: 14px;
    color: #999;
    letter-spacing: 5px;
  }

  .el-form-item {
    margin: 20px 0;
  }

  .form-code {
    .el-input {
      width: 235px !important;
      margin-right: 5px;
    }
    .codeimg {
      display: inline-block;
      height: 36px;
      vertical-align: top;
      cursor: pointer;
    }
  }

  .form-sbt .el-button--primary {
    width: 100%;
  }
}
</style>
