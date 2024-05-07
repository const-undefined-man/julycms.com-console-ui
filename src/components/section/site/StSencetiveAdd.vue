<template>
  <el-form ref="form" :rules="rules" :model="form" :disabled="!$auth('site:sencetive:update')" label-width="100px">
    <el-form-item label="添加方式">
      <el-radio-group v-model="addType" :disabled="type !== 'add'">
        <el-radio :label="1">单条添加</el-radio>
        <el-radio :label="2">批量添加</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 单条添加 -->
    <template v-if="addType == 1">
      <el-form-item label="敏感词" prop="word">
        <el-input v-model="form.word" maxlength="20" show-word-limit />
      </el-form-item>
      <el-form-item label="替换词" prop="replaceWord">
        <el-input v-model="form.replaceWord" maxlength="20" show-word-limit />
        <div class="form-tip">替换词可以为空</div>
      </el-form-item>
      <el-form-item label="敏感词类别">
        <el-select v-model="form.classify">
          <el-option v-for="(v, k) in sencetive" :key="k" :label="v.label" :value="v.value"></el-option>
        </el-select>
        <div class="form-tip">一般：用替换词替换；敏感：直接去除</div>
      </el-form-item>
    </template>

    <!-- 批量添加 -->
    <template v-if="addType == 2">
      <el-form-item label="敏感词" prop="words">
        <el-input
          type="textarea"
          :rows="10"
          v-model="form.words"
          resize="none"
          maxlength="500"
          show-word-limit
          placeholder="格式：敏感词,替换词,敏感词类别"
        ></el-input>
        <div class="form-tip">
          1. 一行一条数据<br />
          2. 请使用英文标点“,”<br />
          3. 敏感词类别 {{ sencetiveStr }}
        </div>
      </el-form-item>
    </template>

    <el-row class="text-right">
      <el-button v-auth="['site:sencetive:update']" type="primary" @click="save">确定</el-button>
      <el-button @click="close">取消</el-button>
    </el-row>
  </el-form>
</template>

<script>
import { dialogForm } from '@/mixins/dialogForm.js';
export default {
	mixins: [dialogForm],
	props: {
		sencetive: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			addType: 1,
			form: {
				word: '',
				replaceWord: '',
				classify: '',
				words: '',
			},
			rules: {
				word: [{ required: true, message: '请输入敏感词' }],
				words: { required: true, message: '请输入敏感词' },
			},
			sencetiveStr: '',
		};
	},
	watch: {
		sencetive: {
			handler(val) {
				this.sencetiveStr = val
					.map((v) => {
						return v.value + ':' + v.label;
					})
					.join('; ');
			},
			immediate: true,
		},
	},
	methods: {
		setFromAfter() {
			this.form.classify = this.form.classify + '';
		},
		save() {
			this.$refs.form.validate(async (valid) => {
				if (!valid) {
					return;
				}
				let res = [];
				let data = JSON.parse(JSON.stringify(this.form));

				if (this.addType == 1) {
					delete data.words;
					let row = {
						word: data.word,
						replaceWord: data.replaceWord,
						classify: data.classify,
					};
					if (this.type === 'edit') {
						row.id = data.id;
					}
					res = [row];
				}
				if (this.addType == 2) {
					let rows = data.words.split('\n');
					rows.forEach((v) => {
						let cols = v.split(/[,，]/g);
						res.push({
							word: cols[0],
							replaceWord: cols[1],
							classify: cols[2],
						});
					});
				}

				this.$emit('save', res, this.$refs.form);
			});
		},
	},
};
</script>
