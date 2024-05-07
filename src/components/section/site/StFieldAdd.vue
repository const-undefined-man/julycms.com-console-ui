<template>
  <el-form ref="form" :rules="rules" :model="form" label-width="100px" label-position="left" class="mt15">
    <el-form-item label="字段类型" prop="type">
      <el-select v-model="form.type" clearable>
        <el-option
          v-for="item in fieldtypes"
          :key="item.value"
          :label="item.label + ' ' + item.value"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="字段名" prop="name">
      <el-input v-model.trim="form.name" clearable />
      <div class="form-tip">只能由英文字母、数字和下划线组成，并且仅能字母开头和结尾</div>
    </el-form-item>
    <el-form-item label="中文名" prop="label">
      <el-input v-model.trim="form.label" clearable />
      <div class="form-tip">例如：文章标题</div>
    </el-form-item>
    <el-form-item label="字段提示" prop="tip">
      <el-input v-model="form.tip" clearable />
      <div class="form-tip">显示在字段别名下方作为表单输入提示</div>
    </el-form-item>
    <el-form-item label="是否必填" prop="allowNull">
      <el-radio-group v-model="form.allowNull">
        <el-radio :label="true">否</el-radio>
        <el-radio :label="false">是</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="数据校验正则" prop="pattern">
      <el-input placeholder="请输入内容" v-model.trim="form.pattern" clearable>
        <el-select slot="append" v-model="form.pattern" placeholder="请选择">
          <el-option v-for="item in patterns" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-input>
      <div class="form-tip">系统将通过此正则校验表单提交的数据合法性，如果不想校验数据请留空</div>
    </el-form-item>
    <el-form-item label="校验失败提示" prop="tiperr">
      <el-input v-model="form.tiperr" clearable />
      <div class="form-tip">数据校验失败的提示信息</div>
    </el-form-item>
    <el-divider content-position="left">表单属性设置</el-divider>
    <!-- 单行文本 -->
    <el-row :gutter="20" v-if="form.type === 'text'">
      <el-col :span="12">
        <el-form-item label="最大输入长度" prop="maxlength">
          <el-input placeholder="请输入" maxlength="5" v-model.trim="form.maxlength"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否密码框">
          <el-radio-group v-model="form.ispass">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 多行文本 -->
    <el-row :gutter="20" v-if="form.type === 'textarea'">
      <el-col :span="12">
        <el-form-item label="最大输入长度" prop="maxlength">
          <el-input placeholder="请输入" maxlength="5" v-model.trim="form.maxlength"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="输入框行数" prop="rows">
          <el-input placeholder="请输入" v-model.trim="form.rows"></el-input>
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
				type: 'text',
				name: null,
				label: null,
				tip: null,
				allowNull: true,
				pattern: null,
				tiperr: null,
				maxlength: null,
				ispass: 0,
				rows: 2,
			},
			rules: {
				type: { required: true, message: '请选择' },
				name: [
					{ required: true, message: '请输入' },
					{ pattern: /^[a-z]\w+[a-z]$/gi, message: '格式错误' },
				],
				label: { required: true, message: '请输入' },
				maxlength: [
					{ type: 'number', min: 0, max: 65535, message: '最大长度支持65535' },
					{
						pattern: /^[1-9](\d+)?$/g,
						message: '只能输入数字，且大于0',
					},
				],
				rows: { pattern: /^[1-9](\d+)?$/g, message: '只能输入数字，且大于0' },
			},
			patterns: [
				{ label: '数字', value: '/^[0-9.-]+$/' },
				{ label: '整数', value: '/^[0-9-]+$/' },
				{ label: '字母', value: '/^[a-z]+$/i' },
				{ label: '整数+字母', value: '/^[0-9a-z]+$/i' },
				{ label: 'email', value: '/^[w-.]+@[w-.]+(.w+)+$/' },
				{ label: 'QQ', value: '/^[0-9]{5,20}$/' },
				{ label: '超级链接', value: '/^https?:///' },
				{ label: '手机号码', value: '/^(1)[0-9]{10}$/' },
				{ label: '电话号码', value: '/^[0-9-]{6,13}$/' },
				{ label: '邮政编码', value: '/^[0-9]{6}$/' },
			],
			fieldtypes: [
				{ label: '单行文本', value: 'text' },
				{ label: '多行文本', value: 'textarea' },
				{ label: '编辑器', value: 'ueditor' },
				{ label: '单选框', value: 'radio' },
				{ label: '多选框', value: 'checkbox' },
				{ label: '下拉框', value: 'select' },
				{ label: '级联选择', value: 'cascader' },
				{ label: '日期选择', value: 'datepicker' },
				{ label: '时间选择', value: 'timepicker' },
				{ label: '日期+时间选择', value: 'datetimepicker' },
				{ label: '图片', value: 'img' },
				{ label: '附件', value: 'attachement' },
			],
		};
	},
	methods: {
		setFromAfter() {
			// console.log(this.form);
			let val = this.form.maxlength;
			this.form.maxlength = !val ? null : +val;
		},
	},
	watch: {
		'form.maxlength'(val) {
			let newVal = this.$utils.onlyNumber(val);
			// console.log(newVal);
			this.form.maxlength = !newVal ? null : +newVal;
		},
	},
};
</script>

<style lang="scss" scoped></style>
