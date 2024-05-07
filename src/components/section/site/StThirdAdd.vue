<template>
	<el-form ref="form" :rules="rules" :model="form" label-width="100px">
		<el-row>
			<el-col :span="12">
				<el-form-item label="标题" prop="title">
					<el-input
						v-model="form.title"
						placeholder="请输入"
						maxlength="32"
						show-word-limit
					/>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="应用场景" prop="scene">
					<el-input
						v-model="form.scene"
						placeholder="请输入"
						maxlength="128"
						show-word-limit
					/>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="产品地址" prop="componyUrl">
					<el-input
						v-model="form.componyUrl"
						placeholder="http(s)://xxx"
						maxlength="256"
						show-word-limit
					/>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="管理账号">
					<el-input
						v-model="form.account"
						placeholder="请输入"
						maxlength="32"
						show-word-limit
					/>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="产品所属公司" prop="compony">
					<el-input
						v-model="form.compony"
						placeholder="请输入"
						maxlength="64"
						show-word-limit
					/>
				</el-form-item>
			</el-col>
			<el-col>
				<el-form-item label="添加额外参数">
					<el-button @click="argsAdd">添加</el-button>
				</el-form-item>
				<el-form-item class="args">
					<el-table :data="form.thirdArgs" border stripe>
						<el-table-column prop="date" label="参数名称">
							<template slot-scope="scope">
								<el-input
									v-model="scope.row.title"
									maxlength="32"
									show-word-limit
								/>
							</template>
						</el-table-column>
						<el-table-column prop="date" label="key">
							<template slot-scope="scope">
								<el-input
									v-model="scope.row.key"
									maxlength="16"
									show-word-limit
								/>
							</template>
						</el-table-column>
						<el-table-column prop="date" label="value">
							<template slot-scope="scope">
								<el-input
									v-model="scope.row.value"
									maxlength="128"
									show-word-limit
								/>
							</template>
						</el-table-column>
						<el-table-column prop="date" label="备注">
							<template slot-scope="scope">
								<el-input
									v-model="scope.row.remark"
									maxlength="64"
									show-word-limit
								/>
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
			</el-col>
		</el-row>

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
				title: '',
				scene: '',
				compony: '',
				componyUrl: '',
				account: '',
				thirdArgs: []
			},
			rules: {
				title: [
					{
						required: true,
						message: '请输入名称',
						trigger: ['blur', 'change']
					}
				],
				scene: [
					{
						required: true,
						message: '请输入应用场景',
						trigger: ['blur', 'change']
					}
				],
				componyUrl: {
					type: 'url',
					message: 'url格式错误',
					trigger: ['blur', 'change']
				}
			}
		};
	},
	mounted() {},
	methods: {
		setFromAfter() {
			const args = this.form.thirdArgs;
			this.form.thirdArgs = args ? args : [];
		},
		// 参数添加
		argsAdd() {
			var arg = { title: '', key: '', value: '', remark: '' };
			this.form.thirdArgs.push(arg);
		},
		// 删除参数
		argsDel(scope) {
			this.form.thirdArgs.splice(scope.$index, 1);
		}
	}
};
</script>

<style lang="scss" scoped>
.args ::v-deep .el-form-item__content {
	margin-left: 0 !important;
}
</style>
