<template>
  <el-form ref="form" :rules="rules" :model="form" label-width="80px">
    <el-row>
      <el-col>
        <el-form-item label="上级菜单">
          <el-cascader
            v-model="form.parent"
            class="full-width"
            filterable
            clearable
            :options="listMenu"
            :props="{ label: 'name', value: 'id', checkStrictly: true }"
            placeholder="请选择上级菜单"
          >
          </el-cascader>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="菜单类型">
          <el-radio-group v-model="form.type">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <div v-if="form.type == 0" :key="pageKey">
        <el-col>
          <el-divider content-position="left">目录信息</el-divider>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="form.name" placeholder="请填写菜单名称" maxlength="30" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单图标" prop="icon">
            <div class="flex-center">
              <el-input
                v-model="form.icon"
                class="flex-1"
                placeholder="请填写菜单图标"
                maxlength="30"
                show-word-limit
              />
              <el-popover placement="top" title="图标名称" width="300" trigger="hover">
                <div class="form-tip">
                  以连字符形式命名，比如：<el-tag>el-icon-setting</el-tag> ； 图标请移步至：
                  <el-link href="https://element.eleme.cn/2.15/#/zh-CN/component/icon" target="_blank"
                    >Element Icon</el-link
                  >
                </div>
                <i slot="reference" class="el-icon-question"></i>
              </el-popover>
            </div>
          </el-form-item>
        </el-col>
      </div>

      <div v-if="form.type == 1" :key="pageKey">
        <el-col>
          <el-divider content-position="left">菜单信息</el-divider>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="form.name" placeholder="请填写菜单名称" maxlength="30" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单图标" prop="icon">
            <div class="flex-center">
              <el-input
                v-model="form.icon"
                class="flex-1"
                placeholder="请填写菜单图标"
                maxlength="30"
                show-word-limit
              />
              <el-popover placement="top" title="图标名称" width="300" trigger="hover">
                <div class="form-tip">
                  以连字符形式命名，比如：<el-tag>el-icon-setting</el-tag> ； 图标请移步至：
                  <el-link href="https://element.eleme.cn/2.15/#/zh-CN/component/icon" target="_blank"
                    >Element Icon</el-link
                  >
                </div>
                <i slot="reference" class="el-icon-question"></i>
              </el-popover>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="路由地址" prop="componentRoute">
            <el-input v-model="form.componentRoute" placeholder="请填写路由地址" maxlength="50" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组件名称" prop="componentName">
            <el-input v-model="form.componentName" placeholder="请填写组件名称" maxlength="30" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组件路径" prop="componentPath">
            <el-input v-model="form.componentPath" placeholder="请填写组件路径" maxlength="50" show-word-limit />
          </el-form-item>
        </el-col>
      </div>

      <div v-if="form.type == 2" :key="pageKey">
        <el-col>
          <el-divider content-position="left">按钮信息</el-divider>
        </el-col>
        <el-col :span="12">
          <el-form-item label="按钮文字" prop="name">
            <el-input v-model="form.name" placeholder="请填写按钮文字" maxlength="30" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权限标识" prop="mark">
            <el-input v-model="form.mark" placeholder="请填写权限标识" maxlength="30" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="按钮风格" prop="style">
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
          <el-form-item label="预览">
            <el-link :underline="false" :type="form.style">{{ form.name || '按钮文字' }}</el-link>
          </el-form-item>
        </el-col>
      </div>
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
	props: {
		data: {
			type: Object,
			default: () => {},
		},
		listMenu: {
			type: Array,
			required: true,
			default: () => [],
		},
	},
	data() {
		return {
			pageKey: 1,
			form: {
				parent: 0,
				type: 0,
				name: '',
				icon: '',
				componentName: '',
				componentPath: '',
				componentRoute: '',
				style: 'default',
				mark: '',
			},
			rules: {
				name: [
					{ required: true, message: '请输入' },
					{ min: 1, max: 30, message: '长度在 1 到 30 个字符' },
				],
				componentRoute: { required: true, message: '请输入' },
				componentPath: { required: true, message: '请输入' },
			},
		};
	},
	watch: {
		data: {
			handler(val) {
				this.$nextTick(() => {
					this.$refs.form.resetFields();
				});
				this.form = Object.assign(this.form, val);
			},
			immediate: true,
			deep: true,
		},
		'form.type'() {
			this.$nextTick(() => {
				this.pageKey = Date.now();
			});
		},
	},
	mounted() {},
	methods: {
		save() {
			this.$refs.form.validate((valid) => {
				if (!valid) {
					return;
				}
				let data = {};
				let form = JSON.parse(JSON.stringify(this.form));
				// 取最后一位值
				if (Array.isArray(form.parent)) {
					form.parent = form.parent.pop();
				}
				// 目录 菜单 按钮 通用字段
				['parent', 'type', 'name', 'icon'].forEach((v) => {
					data[v] = form[v];
				});
				// 菜单
				if (form.type === 1) {
					['componentRoute', 'componentName', 'componentPath'].forEach((v) => {
						data[v] = form[v];
					});
				} else {
					['mark', 'style'].forEach((v) => {
						data[v] = form[v];
					});
				}
				if (form.id) {
					data.id = form.id;
				}
				this.$emit('save', data);
			});
		},
		close() {
			this.$emit('close');
		},
	},
};
</script>

<style lang="scss" scoped>
.el-input,
.el-select {
  vertical-align: top;
}
.el-icon-question {
  margin-left: 10px;
}
</style>
