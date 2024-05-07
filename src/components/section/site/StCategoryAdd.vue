<template>
  <div class="page-st">
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      :disabled="!$auth(['content:category:update'])"
      label-width="110px"
      class="mt15"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="选择模型" prop="siteModel.id">
            <el-select v-model="form.siteModel.id" placeholder="请选择模型" filterable clearable>
              <el-option v-for="(v, k) in listSiteModel" :key="k" :label="v.name" :value="v.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="上级栏目" prop="parent.id">
            <el-popover v-model="showTree" placement="bottom-start" trigger="click" popper-class="cat-popover">
              <el-tree
                highlight-current
                :data="categorys"
                :props="{ label: 'catname', value: 'id' }"
                @node-click="onTree"
              ></el-tree>
              <el-input slot="reference" v-model="catname" readonly placeholder="请选择上级栏目"></el-input>
            </el-popover>
          </el-form-item>
          <el-form-item label="栏目名称" prop="catname">
            <el-input v-model="form.catname" maxlength="64" show-word-limit />
          </el-form-item>
          <el-form-item label="英文名称">
            <el-input v-model="form.catnameEn" maxlength="64" show-word-limit />
          </el-form-item>
          <el-form-item label="栏目目录" prop="catdir">
            <el-input v-model="form.catdir" maxlength="64" show-word-limit />
          </el-form-item>
          <el-form-item label="栏目描述">
            <el-input
              v-model="form.description"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
              maxlength="256"
              resize="none"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="栏目图片">
            <ComUpload v-model="form.cover"></ComUpload>
          </el-form-item>
          <el-form-item label="在导航显示">
            <el-switch v-model="form.display" :inactive-value="0" :active-value="1" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="1">
          <el-form-item label="SEO标题">
            <el-input
              v-model="form.seoTitle"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
              maxlength="128"
              resize="none"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="SEO关键词">
            <el-input
              v-model="form.seoKeywords"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
              maxlength="256"
              resize="none"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="SEO描述">
            <el-input
              v-model="form.seoDescription"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
              maxlength="256"
              resize="none"
              show-word-limit
            />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <el-row class="text-right">
      <el-button v-auth="['content:category:update']" type="primary" @click="save">保存</el-button>
      <el-button @click="close">关闭</el-button>
    </el-row>
  </div>
</template>

<script>
import { dialogForm } from '@/mixins/dialogForm';
export default {
	mixins: [dialogForm],
	props: {
		listCategory: {
			type: Array,
			default: () => [],
		},
		listSiteModel: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			activeName: '0',
			categorys: [],
			catname: '',
			showTree: false,
			form: {
				siteModel: { id: '' },
				parent: { id: 0 },
				catname: '',
				catnameEn: '',
				catdir: '',
				cover: {},
				display: 1,
				seoTitle: '',
				seoKeywords: '',
				seoDescription: '',
			},
			rules: {
				'siteModel.id': [{ required: true, message: '请选择模型', trigger: 'blur' }],
				'parent.id': [{ required: true, message: '请选择上级栏目', trigger: 'blur' }],
				catname: [
					{ required: true, message: '请输入栏目名称', trigger: 'blur' },
					{
						min: 1,
						max: 30,
						message: '长度在 1 到 30 个字符',
						trigger: 'blur',
					},
				],
				catdir: [
					{ required: true, message: '请输入栏目目录', trigger: 'blur' },
					{
						min: 1,
						max: 30,
						message: '长度在 1 到 30 个字符',
						trigger: 'blur',
					},
				],
			},
		};
	},
	watch: {
		listCategory: {
			handler(val) {
				this.categorys = [{ catname: '一级栏目', id: 0 }, ...val];
			},
			immediate: true,
			deep: true,
		},
	},
	methods: {
		setFromAfter() {
			if (this.type === 'edit' && this.data) {
				this.catname = this.data.parent.catname || '一级栏目';
				this.form.cover = this.form.cover || {};
			}
		},
		onTree(e) {
			this.form.parent.id = e.id;
			this.catname = e.catname;
			this.showTree = false;
		},
	},
};
</script>

<style scoped>
.el-form-item {
  width: 500px;
}
</style>
<style>
.cat-popover {
  padding: 0;
}
.cat-popover .popper__arrow {
  left: 30px !important;
}
</style>
