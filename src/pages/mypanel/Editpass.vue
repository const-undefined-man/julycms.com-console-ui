<template>
	<div class="page">
		<el-form
			ref="form"
			:rules="rules"
			:model="form"
			label-position="left"
			label-width="120px"
			class="mt15"
		>
			<el-form-item label="旧密码" prop="oldpass">
				<el-input type="password" v-model="form.oldpass" />
			</el-form-item>
			<el-form-item label="新密码" prop="newpass">
				<el-input type="password" v-model="form.newpass"></el-input>
			</el-form-item>
			<el-form-item label="确认新密码" prop="repass">
				<el-input type="password" v-model="form.repass"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">保存</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	data() {
		var validatePass = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入密码'));
			} else {
				if (this.form.repass !== '') {
					this.$refs.form.validateField('repass');
				}
				callback();
			}
		};
		var validateRepass = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请再次输入密码'));
			} else if (value !== this.form.newpass) {
				callback(new Error('两次输入密码不一致!'));
			} else {
				callback();
			}
		};
		
		return {
			form: {
				oldpass: '',
				newpass: '',
				repass: '',
			},
			rules: {
				oldpass: [
					{ required: true, message: '请输密码', trigger: ['blur', 'change'] },
				],
				newpass: [
					{
						required: true,
						validator: validatePass,
						trigger: ['blur', 'change'],
					},
				],
				repass: [
					{
						required: true,
						validator: validateRepass,
						trigger: ['blur', 'change'],
					},
				],
			},
		};
	},
	methods: {
		async onSubmit() {
			var type = 'success';
			var data = this.form;
			var res = await this.$api.user.updatepass({ data: data });
			if (!res.code == 1) {
				type = 'error';
			}
			this.$notify({
				title: '提示',
				message: res.msg,
				type: type,
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.el-form {
	width: 600px;
}
</style>
