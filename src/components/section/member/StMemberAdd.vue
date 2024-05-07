<template>
	<el-form
		ref="form"
		:rules="rules"
		:model="form"
		label-position="left"
		label-width="120px"
	>
		<el-form-item label="头像">
			<com-upload></com-upload>
		</el-form-item>
		<el-form-item label="手机号" prop="tel" size="small">
			<el-input v-model="form.tel" name="tel" />
		</el-form-item>
		<el-form-item label="密码" prop="password" size="small">
			<el-input type="password" v-model="form.password" name="password" />
		</el-form-item>

		<el-row class="text-right">
			<el-button type="primary" @click="save">保存</el-button>
			<el-button @click="close">关闭</el-button>
		</el-row>
	</el-form>
</template>

<script>
import { dialogForm } from '@/mixins/dialogForm';
export default {
	mixins: [dialogForm],
	data() {
		return {
			form: {
				avatar: '',
				tel: '',
				password: '',
			},
			rules: {},
		};
	},
	methods: {},
};
</script>
