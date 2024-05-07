<template>
	<el-form ref="form" :model="form">
		<el-form-item class="power">
			<el-cascader-panel
				v-model="form.menuId"
				:options="listMenu"
				:props="defaultProps"
			></el-cascader-panel>
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
		listMenu: {
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
				menuId: [],
			},
			defaultProps: {
				value: 'id',
				label: 'name',
				multiple: true,
			},
		};
	},
};
</script>
