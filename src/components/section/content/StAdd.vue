<template>
  <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="120px" class="mt15">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="0">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        <el-form-item label="封面图片">
          <com-upload v-model="form.cover"></com-upload>
        </el-form-item>
        <el-form-item label="内容" class="editor" prop="content.content">
          <CKEditor
            v-model="form.content.content"
            :editor="editor.app"
            :config="editor.config"
            @ready="onEditorReady"
          />
        </el-form-item>
        <el-form-item label="标签" prop="tag">
          <el-select v-model="form.tag" multiple placeholder="请选择">
            <el-option v-for="item in tags" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane v-if="type === 'album'" label="图集信息" name="1">
        <el-form-item label="图集内容"><el-button type="primary" @click="onAlbumAdd">添加</el-button></el-form-item>
        <el-form-item
          v-for="(v, k) in form.albums"
          :key="k"
          label=" "
          class="albums-item"
          :prop="'albums.' + k + '.img.url'"
          :rules="{ required: true, message: '图片不能为空' }"
        >
          <com-upload v-model="v.img"></com-upload>
          <div class="con">
            <el-input v-model="v.description" type="textarea" :autosize="{ minRows: 5, maxRows: 5 }" show-word-limit />
          </div>
          <div class="btns">
            <el-button :disabled="k == 0" icon="el-icon-top" circle @click="onAlbumUp(k)"></el-button>
            <el-button
              :disabled="k == form.albums.length - 1"
              icon="el-icon-bottom"
              circle
              @click="onAlbumDown(k)"
            ></el-button>
            <el-divider direction="vertical"></el-divider>
            <el-popconfirm title="确定删除吗？" @confirm="onAlbumDel(k)">
              <el-button slot="reference" type="danger" icon="el-icon-delete" circle></el-button>
            </el-popconfirm>
          </div>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="文章配置" name="2">
        <el-form-item label="SEO标题">
          <el-input v-model="form.seoTitle" maxlength="28" show-word-limit />
        </el-form-item>
        <el-form-item label="SEO关键词">
          <el-input v-model="form.seoKeywords" type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" show-word-limit />
        </el-form-item>
        <el-form-item label="SEO描述">
          <el-input
            v-model="form.seoDescription"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            show-word-limit
          />
        </el-form-item>
        <!-- <el-form-item label="作者" prop="author">
					<el-input v-model="form.author" />
				</el-form-item> -->
        <el-form-item label="浏览量" prop="readNum">
          <el-input v-model="form.readNum" />
        </el-form-item>
        <el-form-item label="点赞量" prop="likeNum">
          <el-input v-model="form.likeNum" />
        </el-form-item>
        <!-- <el-form-item label="发布时间" prop="seo_description">
					<el-date-picker v-model="form.showtime" type="date" placeholder="选择日期" />
					<div class="form-tip">如果设置了发布时间，文章将会在目标时间发布</div>
				</el-form-item> -->
        <!-- <el-form-item label="阅读权限" prop="arcrank">
					<el-select v-model="form.arcrank" placeholder="阅读权限">
						<el-option label="开放浏览" value="1" />
						<el-option label="青铜会员" value="2" />
						<el-option label="白银会员" value="3" />
						<el-option label="黄金会员" value="4" />
						<el-option label="钻石会员" value="4" />
					</el-select>
				</el-form-item> -->
      </el-tab-pane>
    </el-tabs>
  </el-form>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-vue2';
import CKEditorUploadAdapter from '@/libs/CKEditorUploadAdapter';
export default {
  name: 'StAdd',
  components: { CKEditor: CKEditor.component },
  props: {
    type: {
      type: String,
      default: 'content',
    },
    detail: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      activeName: '0',
      editor: {
        app: ClassicEditor,
        config: {},
      },
      tags: [],
      form: {
        title: '',
        description: '',
        cover: {},
        content: {
          content: '',
        },
        albums: [],
        tag: [],
        seoTitle: '',
        seoKeywords: '',
        seoDescription: '',
        readNum: 999,
        likeNum: 999,
      },
      rules: {
        title: [{ required: true, message: '请输入标题' }],
        content: {
          content: [{ required: true, message: '请输入内容' }],
        },
      },
    };
  },
  watch: {
    detail: {
      handler(val) {
        this.form = Object.assign(this.form, val);
        this.form.cover = this.form.cover || {};
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    onEditorReady(editor) {
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new CKEditorUploadAdapter({ loader });
      };
    },
    onAlbumAdd() {
      this.form.albums.push({
        img: { url: '' },
        description: '',
        listorder: this.form.albums.length + 1,
      });
      this.$forceUpdate();
    },
    onAlbumDel(index) {
      this.form.albums.splice(index, 1);
      this.$forceUpdate();
    },
    onAlbumUp(index) {
      const { albums } = this.form;
      [albums[index], albums[index - 1]] = [albums[index - 1], albums[index]];
      this.$forceUpdate();
    },
    onAlbumDown(index) {
      const { albums } = this.form;
      [albums[index], albums[index + 1]] = [albums[index + 1], albums[index]];
      this.$forceUpdate();
    },
    async getData() {
      let valid = false;
      try {
        valid = await this.$refs.form.validate();
      } catch (error) {
        valid = false;
      }

      return valid ? this.form : false;
    },
  },
};
</script>

<style lang="scss" scoped>
.editor ::v-deep .ck-editor__editable {
  min-height: 400px;
}
.el-date-editor ::v-deep .el-input {
  width: 193px;
}
.page ::v-deep .editor .el-form-item__content {
  width: auto;
}
.albums-item ::v-deep .el-form-item__content {
  display: flex;
  align-items: center;
  .con {
    width: 400px;
    margin: 0 20px;
  }
}
.albums-item.is-error ::v-deep .el-textarea__inner {
  border-color: #dcdfe6;
}
</style>
