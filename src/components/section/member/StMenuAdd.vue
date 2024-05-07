<template>
	<el-form
		ref="form"
		:rules="rules"
		:model="form"
		label-width="120px"
		label-position="left"
		class="mt15"
	>
		<el-form-item label="上级栏目" size="small">
			<el-select
				v-model="form.parentid"
				placeholder="请选择上级栏目"
				name="parentid"
			>
				<el-option label="娱乐" value="1" />
				<el-option label="├ 娱乐资讯" value="2" />
				<el-option label="├ 明星资讯" value="3" />
				<el-option label="├ 娱乐八卦" value="4" />
				<el-option label="网站介绍" value="5" />
				<el-option label="├ 关于我们" value="6" />
				<el-option label="├ 联系方式" value="7" />
				<el-option label="├ 版权声明" value="8" />
				<el-option label="├ 招聘信息" value="9" />
				<el-option label="电影" value="10" />
				<el-option label="体育" value="11" />
				<el-option label="资讯" value="12" />
			</el-select>
		</el-form-item>
		<el-form-item label="栏目名称" size="small">
			<el-input v-model="form.catname" name="catname" />
		</el-form-item>
		<el-form-item label="英文目录" size="small">
			<el-input v-model="form.catdir" name="catdir" />
		</el-form-item>
		<el-form-item label="栏目描述">
			<el-input
				type="textarea"
				name="catdesc"
				:autosize="{ minRows: 3, maxRows: 5 }"
				v-model="form.catdesc"
			/>
		</el-form-item>
		<el-form-item label="栏目图标">
			<el-input v-model="form.icon" name="icon" />
		</el-form-item>
		<el-form-item label="是否显示">
			<el-switch v-model="form.ismenu" name="ismenu" />
		</el-form-item>
	</el-form>
</template>

<script>
export default {
	data() {
		return {
			form: {
				parentid: '',
				catname: '',
				catdir: '',
				catdesc: '',
				icon: '',
				ismenu: true,
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
	methods: {},
};
</script>
