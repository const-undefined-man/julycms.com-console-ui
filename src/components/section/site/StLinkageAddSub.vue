<template>
	<el-form
		ref="form"
		:rules="rules"
		:model="form"
		label-position="left"
		label-width="120px"
		class="mt15"
	>
		<el-form-item label="菜单名称2" prop="name">
			<el-input v-model="form.name" maxlength="50" show-word-limit />
		</el-form-item>
		<el-form-item label="菜单英文名称" prop="nameEn">
			<el-input v-model="form.nameEn" maxlength="50" show-word-limit />
		</el-form-item>
		<el-form-item label="菜单描述">
			<el-input
				type="textarea"
				v-model="form.description"
				maxlength="255"
				show-word-limit
			/>
		</el-form-item>
		<el-form-item label="附加字段" class="args">
			<el-table :data="form.linkageArgs" border stripe>
				<el-table-column prop="name" label="中文名"></el-table-column>
				<el-table-column prop="field" label="字段名"></el-table-column>
				<el-table-column label="字段值">
					<template slot-scope="scope">
						<el-input v-model="scope.row.value" />
					</template>
				</el-table-column>
				<el-table-column prop="date" label="操作" width="50px">
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
			// 父级菜单名称
			parentName: '',
			form: {
				pid: 0,
				name: '',
				nameEn: '',
				description: '',
				linkageArgs: [],
			},
			rules: {
				name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
			},
		};
	},
	methods: {
		setFromAfter() {
			if (this.data) {
				if (this.type === 'add') {
					this.form.pid = this.data.id;
					delete this.form.id;
				}
				this.parentName = this.data.name;
				this.form.linkageArgs = this.data.linkageArgs.map((v) => {
					v.linkageArgId = v.id;
					delete v.id;
					
					return v;
				});
			}
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
</style>
