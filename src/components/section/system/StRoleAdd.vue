<template>
  <el-form v-if="visible" ref="form" :rules="rules" :model="form" label-position="top" class="mt15">
    <el-row :gutter="20">
      <el-col :span="18">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="是否启用">
          <el-switch v-model="form.status" :inactive-value="0" :active-value="1" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="角色描述">
      <el-input type="textarea" resize="none" :rows="3" v-model="form.description" />
    </el-form-item>

    <el-form-item label="后台权限">
      <el-cascader-panel v-model="form.menus" :options="listMenus" :props="defaultProps"></el-cascader-panel>
    </el-form-item>

    <!-- <el-form-item label="栏目权限">
			<el-cascader-panel
				v-model="form.categorys"
				:options="listCategorys"
				:props="defaultProps"
			></el-cascader-panel>
		</el-form-item> -->

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
		// 后台菜单
		menus: {
			type: Array,
			required: true,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
			form: {
				name: '',
				description: '',
				status: 1,
				menus: [],
			},
			rules: {
				name: [
					{ required: true, message: '请输入角色名称' },
					{ min: 1, max: 30, message: '长度在 1 到 30 个字符' },
				],
			},
			listMenus: [],
			defaultProps: {
				value: 'id',
				label: 'name',
				checkStrictly: true,
				emitPath: false,
				multiple: true,
			},
		};
	},
	methods: {
		// 设置表单后的钩子函数
		setFromAfter() {
			this.form.menus = this.form.menus.map((v) => v.id);
			this.listMenus = JSON.parse(JSON.stringify(this.menus));
			this.formatList(this.listMenus);
		},
		// 设置禁用的数据
		formatList(data) {
			data.forEach((item) => {
				if (!item.children.length) {
					delete item.children;
				} else {
					this.formatList(item.children);
				}
			});
		},
		// 保存之前 格式化数据
		saveBefore(data) {
			data.menus = data.menus.map((v) => {
				return { id: v };
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.el-cascader-panel {
  overflow: hidden;
}
</style>
