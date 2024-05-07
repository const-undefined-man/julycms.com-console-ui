<template>
	<el-form
		ref="form"
		:rules="rules"
		:model="form"
		label-position="left"
		label-width="120px"
	>
		<el-form-item label="角色图标">
			<com-upload v-model="form.icon"></com-upload>
		</el-form-item>
		<el-form-item label="角色名称" prop="rolename" size="small">
			<el-input v-model="form.rolename" name="rolename" />
		</el-form-item>
		<el-form-item label="角色积分" prop="integral" size="small">
			<el-input v-model="form.integral" name="integral" />
			<div class="form-tip">满足该角色所需要的积分</div>
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
				icon: '',
				rolename: '',
				integral: '',
			},
			rules: {},
		};
	},
	methods: {},
};
</script>
