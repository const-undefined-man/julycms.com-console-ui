<template>
  <el-form ref="form" :rules="rules" :model="form" class="mt15">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="名称" prop="label">
          <el-input v-model="form.label" maxlength="16" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="字典值" prop="value">
          <el-input v-model="form.value" maxlength="32" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="颜色风格" prop="style">
          <el-select v-model="form.style">
            <el-option label="默认" value="default"></el-option>
            <el-option label="主要" value="primary"></el-option>
            <el-option label="成功" value="success"></el-option>
            <el-option label="信息" value="info"></el-option>
            <el-option label="警告" value="danger"></el-option>
            <el-option label="危险" value="warning"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="排序" prop="listorder">
          <el-input v-model="form.listorder" maxlength="3" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="是否启用">
      <el-switch v-model="form.display" :inactive-value="0" :active-value="1" />
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
	name: 'StDictValueAdd',
	mixins: [dialogForm],
	props: {},
	data() {
		return {
			form: {
				label: '',
				value: '',
				style: 'default',
				listorder: 99,
				display: 1,
			},
			rules: {
				label: [
					{ required: true, message: '请输入名称' },
					{ min: 1, max: 16, message: '长度在 1 到 16 个字符' },
				],
				value: [
					{ required: true, message: '请输入字典值' },
					{ min: 1, max: 32, message: '长度在 1 到 16 个字符' },
				],
			},
		};
	},
	methods: {},
};
</script>

<style lang="scss" scoped></style>
