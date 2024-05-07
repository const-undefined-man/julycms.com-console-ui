<template>
  <el-form ref="form" :rules="rules" :model="form" label-width="50px">
    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title" maxlength="20" show-word-limit />
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input type="textarea" resize="none" :rows="3" v-model="form.description" maxlength="255" show-word-limit />
    </el-form-item>
    <el-form-item label="链接" prop="url">
      <el-input type="textarea" resize="none" :rows="3" v-model="form.url" maxlength="255" show-word-limit />
    </el-form-item>
    <el-form-item label="图片">
      <ComUpload v-model="form.img"></ComUpload>
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
				title: '',
				description: '',
				url: '',
				img: {},
			},
			rules: {
				title: { required: true, message: '请输入标题' },
				// eslint-disable-next-line no-useless-escape
				url: [{ pattern: /^(http:\/\/|https:\/\/)([a-zA-Z0-9\_\.]+)\.([a-zA-Z\\.]+)$/, message: '请输入正确的链接' }],
			},
		};
	},
	methods: {},
};
</script>
