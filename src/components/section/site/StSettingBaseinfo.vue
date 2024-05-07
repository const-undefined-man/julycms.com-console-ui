<template>
  <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="120px">
    <el-form-item label="站点名称" prop="siteTitle">
      <el-input v-model.trim="form.siteTitle" maxlength="30" />
    </el-form-item>
    <el-form-item label="SEO标题">
      <el-input
        type="textarea"
        v-model.trim="form.seoTitle"
        maxlength="256"
        resize="none"
        show-word-limit
        :autosize="{ minRows: 3, maxRows: 5 }"
      />
    </el-form-item>
    <el-form-item label="SEO关键词">
      <el-input
        type="textarea"
        v-model.trim="form.seoKeywords"
        maxlength="256"
        resize="none"
        show-word-limit
        :autosize="{ minRows: 3, maxRows: 5 }"
      />
    </el-form-item>
    <el-form-item label="SEO描述">
      <el-input
        type="textarea"
        v-model.trim="form.seoDescription"
        maxlength="256"
        resize="none"
        show-word-limit
        :autosize="{ minRows: 3, maxRows: 5 }"
      />
    </el-form-item>

    <el-form-item v-auth="['site:setting:update']">
      <el-button type="primary" @click="save">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
	props: {
		data: {
			required: true,
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
			form: {
				siteTitle: '',
				seoTitle: '',
				seoKeywords: '',
				seoDescription: '',
			},
			rules: {
				siteTitle: { required: true, message: '请输入站点名称' },
			},
		};
	},
	watch: {
		data() {
			this.data.forEach((v) => {
				this.form[v.name] = v.value;
			});
		},
	},
	methods: {
		save() {
			this.$refs.form.validate((valid) => {
				if (!valid) {
					return;
				}

				const data = JSON.parse(JSON.stringify(this.data));
				const form = JSON.parse(JSON.stringify(this.form));
				data.forEach((v) => {
					delete v.water;
					v.value = form[v.name];
				});
				this.$emit('save', data);
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.el-form-item {
  width: 500px;
}
</style>
