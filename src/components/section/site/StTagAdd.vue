<template>
  <el-form
    ref="form"
    :rules="rules"
    :model="form"
    :disabled="!$auth(['content:tag:update'])"
    label-width="120px"
    label-position="left"
  >
    <el-form-item label="tag名称" prop="name">
      <el-input v-model="form.name" maxlength="20" show-word-limit />
    </el-form-item>
    <el-form-item v-if="type === 'edit'" label="首字母" prop="letter">
      <el-input v-model="form.letter" maxlength="1" />
    </el-form-item>
    <el-form-item v-if="type === 'edit'" label="拼音" prop="pinyin">
      <el-input v-model="form.pinyin" maxlength="20" />
    </el-form-item>
    <el-form-item label="SEO标题" prop="seoTitle">
      <el-input v-model="form.seoTitle" maxlength="50" show-word-limit />
    </el-form-item>
    <el-form-item label="SEO关键词" prop="seoKeywords">
      <el-input type="textarea" v-model="form.seoKeywords" :rows="4" resize="none" maxlength="255" show-word-limit />
    </el-form-item>
    <el-form-item label="SEO描述" prop="seoDescription">
      <el-input type="textarea" v-model="form.seoDescription" :rows="4" resize="none" maxlength="255" show-word-limit />
    </el-form-item>

    <el-row class="text-right">
      <el-button v-auth="['content:tag:update']" type="primary" @click="save">确定</el-button>
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
				name: '',
				seoTitle: '',
				seoKeywords: '',
				seoDescription: '',
			},
			rules: {
				name: [{ required: true, message: '请输入tag名称' }],
			},
		};
	},
	methods: {},
};
</script>
