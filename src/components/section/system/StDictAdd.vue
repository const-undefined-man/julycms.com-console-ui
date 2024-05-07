<template>
	<el-form
		ref="form"
		:rules="rules"
		:model="form"
		class="mt15"
	>
		<el-row :gutter="20">
			<el-col :span="12">
				<el-form-item label="字典名称" prop="name">
					<el-input v-model="form.name" maxlength="16" />
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="标识" prop="type">
					<el-input v-model="form.type" maxlength="16" />
				</el-form-item>
			</el-col>
		</el-row>
		<el-form-item label="备注">
			<el-input
				type="textarea"
				resize="none"
				:rows="3"
				show-word-limit
				maxlength="256"
				v-model="form.remark"
			/>
		</el-form-item>
		<el-form-item label="是否启用">
			<el-switch v-model="form.display" :inactive-value="0" :active-value="1" />
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
	name: 'StDictAdd',
	mixins: [dialogForm],
	props: {},
	data() {
		return {
			form: {
				name: '',
				type: '',
				remark: '',
				display: 1
			},
			rules: {
				name: [
					{ required: true, message: '请输入名称' },
					{ min: 1, max: 16, message: '长度在 1 到 16 个字符' },
				],
				type: [
					{ required: true, message: '请输入标识' },
					{ min: 1, max: 16, message: '长度在 1 到 16 个字符' },
				],
			},
		};
	},
	methods: {
	},
};
</script>

<style lang="scss" scoped>
</style>
