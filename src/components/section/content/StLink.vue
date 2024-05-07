<template>
  <div class="st-link">
    <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="120px" class="mt15">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" name="title" />
      </el-form-item>
      <el-form-item label="logo">
        <com-upload v-model="form.cover"></com-upload>
      </el-form-item>
      <el-form-item label="链接地址" prop="link.url">
        <el-input v-model="form.link.url" />
      </el-form-item>
      <el-form-item label="是否追踪" prop="link.follow">
        <el-radio-group v-model="form.link.follow">
          <el-radio :label="0">不追踪</el-radio>
          <el-radio :label="1">追踪</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="打开方式" prop="link.target">
        <el-radio-group v-model="form.link.target">
          <el-radio :label="0">本页面（_self）</el-radio>
          <el-radio :label="1">新窗口（_blank）</el-radio>
          <el-radio :label="2">父级页面（_parent）</el-radio>
          <el-radio :label="3">顶级页面（_top）</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
	name: 'StLink',
	props: {
		detail: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			form: {
				title: '',
				cover: {},
				link: {
					url: '',
					follow: 0,
					target: 0,
				},
			},
			rules: {
				title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
				'link.url': [
					{ required: true, message: '请输入链接', trigger: 'blur' },
					{ pattern: /^(http|https):\/\/([\w.]+\/?)\S*$/, message: '请输入正确的链接', trigger: 'blur' },
				],
				'link.follow': [{ required: true, message: '请选择是否追踪', trigger: 'change' }],
				'link.target': [{ required: true, message: '请选择打开方式', trigger: 'change' }],
			},
		};
	},
	watch: {
		detail: {
			handler(val) {
				val && this.init();
			},
			immediate: true,
			deep: true,
		},
	},
	methods: {
		init() {
			// console.log(this.detail);
			this.form = JSON.parse(JSON.stringify(this.detail));
		},
		async getData() {
			let valid = false;
			try {
				valid = await this.$refs.form.validate();
			} catch (error) {
				valid = false;
			}

			return valid ? this.form : false;
		},
	},
};
</script>

<style scoped></style>
