<template>
  <div class="st-page">
    <el-form ref="form" :model="form" label-position="left" label-width="120px" class="mt15">
      <el-form-item label="标题" size="small">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="描述" size="small">
        <el-input v-model="form.description" type="textarea" />
      </el-form-item>
      <el-form-item label="内容" class="editor">
        <CKEditor v-model="form.content.content" :editor="editor.app" :config="editor.config" @ready="onEditorReady" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-vue2';
import CKEditorUploadAdapter from '@/libs/CKEditorUploadAdapter';
export default {
  name: 'StPage',
  components: { CKEditor: CKEditor.component },
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          content: {
            content: '',
          },
        };
      },
    },
  },
  data() {
    return {
      form: {
        title: '',
        content: {
          content: '',
        },
      },
      editor: {
        app: ClassicEditor,
        config: {},
      },
    };
  },
  watch: {
    data: {
      handler(val) {
        val && this.init();
      },
      deep: true,
    },
  },
  methods: {
    init() {
      this.form = JSON.parse(JSON.stringify(this.data));
    },
    onEditorReady(editor) {
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new CKEditorUploadAdapter({ loader });
      };
    },
    getData() {
      return JSON.parse(JSON.stringify(this.form));
    },
  },
};
</script>

<style scoped>
.editor >>> .ck-editor__editable {
  min-height: 400px;
}
</style>
