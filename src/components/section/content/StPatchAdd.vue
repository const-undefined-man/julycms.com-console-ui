<template>
  <el-form ref="form" :rules="rules" :model="form" label-width="50px">
    <el-form-item label="名称" prop="title">
      <el-input v-model="form.title" maxlength="32" show-word-limit />
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input type="textarea" resize="none" :rows="3" v-model="form.description" maxlength="255" show-word-limit />
    </el-form-item>
    <el-form-item label="类型">
      <el-radio-group v-model="form.type">
        <el-radio :label="0">富文本</el-radio>
        <el-radio :label="1">列表数据</el-radio>
      </el-radio-group>
      <div class="form-tip">
        富文本：可以自定义一段富文本数据，灵活性较强 <br />
        列表数据：包含 标题、描述、链接、图片 的数据，适合列表形式
      </div>
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
	name: 'StPatchAdd',
	mixins: [dialogForm],
	props: {
		data: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			form: {
				title: '',
				description: '',
				type: 0,
			},
			rules: {
				title: { required: true, message: '请输入标题' },
			},
		};
	},
};
</script>

<style lang="scss" scoped></style>
