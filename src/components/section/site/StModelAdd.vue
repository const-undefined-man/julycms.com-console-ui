<template>
  <el-form
    ref="form"
    :rules="rules"
    :model="form"
    :disabled="!$auth('site:model:update')"
    label-width="80px"
    label-position="left"
  >
    <el-form-item label="模型名称" prop="name">
      <el-input v-model="form.name" placeholder="模型名称，比如：文章模型" maxlength="16" show-word-limit />
    </el-form-item>
    <el-form-item label="模型标识" prop="mark">
      <el-input v-model="form.mark" placeholder="数据库表名称，比如：article" maxlength="16" show-word-limit />
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input
        v-model="form.description"
        type="textarea"
        resize="none"
        placeholder="描述信息"
        maxlength="128"
        show-word-limit
      />
    </el-form-item>

    <el-row class="text-right">
      <el-button v-aut="['site:model:update']" type="primary" @click="save">确定</el-button>
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
				mark: '',
				description: '',
			},
			rules: {
				name: [{ required: true, message: '模型名称不能为空' }],
				mark: [
					{ required: true, message: '模型标识不能为空' },
					{ pattern: /[a-z0-9_]/gi, message: '表名只能是 字母 数字 下划线' },
				],
			},
		};
	},
	methods: {},
};
</script>

<style lang="scss" scoped></style>
