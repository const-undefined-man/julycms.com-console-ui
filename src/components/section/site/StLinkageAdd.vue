<template>
	<el-form
		ref="form"
		:rules="rules"
		:model="form"
		label-position="left"
		label-width="120px"
	>
		<el-form-item label="菜单名称1" prop="name">
			<el-input v-model="form.name" maxlength="50" show-word-limit />
		</el-form-item>
		<el-form-item label="菜单英文名称" prop="nameEn">
			<el-input v-model="form.nameEn" maxlength="50" show-word-limit />
		</el-form-item>
		<el-form-item label="菜单描述">
			<el-input
				type="textarea"
				v-model="form.description"
				:rows="3"
				resize="none"
				maxlength="255"
				show-word-limit
			/>
		</el-form-item>
		<el-form-item label="附加字段" class="args">
			<el-button type="primary" @click="argsAdd">添加</el-button>
			<el-table :data="form.linkageArgs" border stripe>
				<el-table-column prop="name" label="中文名">
					<template slot-scope="scope">
						<el-input v-model="scope.row.name" />
					</template>
				</el-table-column>
				<el-table-column prop="field" label="字段名">
					<template slot-scope="scope">
						<el-input v-model="scope.row.field" />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="50px">
					<template slot-scope="scope">
						<el-popover width="160" v-model="scope.row.popover">
							<p style="margin-bottom: 10px">
								确定要删除吗？ <br />
								删除后数据不可恢复。
							</p>
							<div style="text-align: right">
								<el-button type="text" @click="scope.row.popover = false"
									>取消</el-button
								>
								<el-button type="danger" @click="argsDel(scope)"
									>确定</el-button
								>
							</div>
							<el-button slot="reference" type="text">删除</el-button>
						</el-popover>
					</template>
				</el-table-column>
			</el-table>
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
	data() {
		return {
			form: {
				pid: 0,
				name: '',
				nameEn: '',
				description: '',
				linkageArgs: [],
			},
			rules: {
				modelid: [
					{ required: true, message: '请输入活动名称', trigger: 'blur' },
				],
				parentid: [
					{ required: true, message: '请输入活动名称', trigger: 'blur' },
				],
				catname: [
					{ required: true, message: '请输入活动名称', trigger: 'blur' },
					{
						min: 3,
						max: 30,
						message: '长度在 3 到 30 个字符',
						trigger: 'blur',
					},
				],
				catdir: [
					{ required: true, message: '请输入目录名称', trigger: 'blur' },
					{
						min: 3,
						max: 30,
						message: '长度在 3 到 30 个字符',
						trigger: 'blur',
					},
				],
			},
		};
	},
	methods: {
		/**
		 * 参数添加
		 */
		argsAdd() {
			var arg = { name: '', field: '' };
			this.form.linkageArgs.push(arg);
		},
		/**
		 * 删除参数
		 */
		argsDel(scope) {
			this.form.linkageArgs.splice(scope.$index, 1);
		},
	},
};
</script>

<style lang="scss" scoped>
.el-input {
	max-width: 300px;
}
.el-table {
	margin-top: 15px;
}
</style>
