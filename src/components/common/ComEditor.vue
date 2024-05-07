<template>
  <div class="com-editor">
    <CKEditor v-model="content" :editor="editor.app" :config="editor.config" @ready="onEditorReady" />
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-vue2';
import CKEditorUploadAdapter from '@/libs/CKEditorUploadAdapter';
export default {
  name: 'ComEditor',
  components: { CKEditor: CKEditor.component },
  props: {
    value: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      content: '',
      editor: {
        app: ClassicEditor,
        config: {},
      },
    };
  },
  watch: {
    value: {
      handler(val) {
        this.content = val;
      },
      immediate: true,
    },
    content(val) {
      this.$emit('input', val);
    },
  },
  mounted() {},
  methods: {
    onEditorReady(editor) {
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new CKEditorUploadAdapter({ loader });
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.com-editor ::v-deep .ck-editor__editable {
  min-height: 400px;
}
</style>
