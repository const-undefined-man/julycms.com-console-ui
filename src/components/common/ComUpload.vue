<template>
  <div class="com-upload">
    <el-upload
      ref="elUpload"
      :action="url"
      :headers="headers"
      :data="data"
      :show-file-list="false"
      :before-upload="uploadBefore"
      :accept="accept.join(',')"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :disabled="disabled"
      :auto-upload="autoUpload"
      :class="['upload-' + type]"
    >
      <template v-if="type === 'card'">
        <el-image v-if="imgUrl" :src="imgUrl" fit="contain"></el-image>
        <i v-else class="el-icon-plus upload-icon"></i>
      </template>
      <template v-if="type === 'button'">
        <el-button type="primary">{{ text }}</el-button>
      </template>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'ComUpload',
  props: {
    // 回显图片地址
    value: {
      type: Object,
      required: false,
      default() {
        return {
          url: null,
          size: 0,
          mimetype: '',
          // 操作人类型；0 未知； 1 管理员；2 用户
          operatorType: 0,
        };
      },
    },
    // 文件大小 单位M
    size: {
      type: Number,
      required: false,
      default() {
        return 2;
      },
    },
    // 上传url
    url: {
      type: String,
      required: false,
      default() {
        return this.$api.common.uploadUrl;
      },
    },
    // 视图类型
    type: {
      type: String,
      required: false,
      validator(val) {
        return ['card', 'button', 'text', 'text-icon'].indexOf(val) !== -1;
      },
      default() {
        return 'card';
      },
    },
    // 允许上传的文件格式
    accept: {
      type: Array,
      required: false,
      default() {
        return ['image/jpeg', 'image/png', '.jpeg', '.png'];
      },
    },
    // 按钮的文字
    text: {
      type: String,
      required: false,
      default() {
        return '上传';
      },
    },
    // 上传文件附带参数
    data: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    // 个别组件的上传前的验证
    beforeUpload: {
      type: Function,
      required: false,
      default() {
        return () => {};
      },
    },
    // 是否在选取文件后立即进行上传
    autoUpload: {
      type: Boolean,
      required: false,
      default() {
        return true;
      },
    },
  },
  data() {
    return {
      headers: {},
      uploadFile: null,
      imgUrl: '',
      loading: false,
    };
  },
  watch: {
    value(val) {
      this.imgUrl = val.url ? process.env.VUE_APP_API_URL + val.url : '';
    },
  },
  mounted() {
    this.headers.Authorization = 'Bearer ' + this.$utils.getToken();
    this.imgUrl = this.value.url ? process.env.VUE_APP_API_URL + this.value.url : '';
  },
  methods: {
    // 手动调用上传，同时提供给父级组件调用
    upload() {
      this.$refs.elUpload.upload();
    },
    // 图片上传之前对图片大小 和 类型进行验证
    async uploadBefore(file) {
      // console.log('uploadBefore: ', file);
      let isType = this.accept.indexOf(file.type) >= 0;
      let formats = [];
      this.accept.forEach((item) => {
        if (item.indexOf('.') >= 0) {
          formats.push(item.split('.')[1]);
        }
      });
      if (!isType) {
        this.$alert(`上传的文件只能是 ${formats.join('/')} 格式!`);

        return false;
      }
      let isPass = true;
      this.beforeUpload && (isPass = await this.beforeUpload(file));
      if (!isPass) {
        this.uploadFile = null;

        return false;
      }
      let isLtSize = file.size < 1024 * 1024 * this.size;
      if (!isLtSize) {
        this.$alert('上传的文件大小不能超过 ' + this.size + 'MB!');

        return false;
      }

      if (isType && isLtSize) {
        this.loading = this.$loading();
        this.uploadFile = file;
      } else {
        this.uploadFile = null;
      }

      return isType && isLtSize;
    },
    uploadSuccess(res) {
      if (res.code === 1) {
        this.imgUrl = process.env.VUE_APP_API_URL + res.data;
        let attachment = Object.assign(this.value, {
          url: res.data,
          size: this.uploadFile.size,
          mimetype: this.uploadFile.type,
          operatorType: 1,
        });
        this.$emit('input', attachment);
      } else {
        this.$notify.error(res.msg);
      }
      this.loading.close();
    },
    uploadError() {
      // console.log(err);
      this.loading.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.com-upload {
  display: inline-block;
  vertical-align: top;
}
.com-upload ::v-deep .el-upload-list--picture-card .el-upload-list__item {
  width: 118px;
  height: 118px;
}
.com-upload ::v-deep .el-upload-list--picture-card .el-progress,
.com-upload ::v-deep .el-upload-list--picture-card .el-progress-circle {
  width: 100px !important;
  height: 100px !important;
}
.com-upload ::v-deep .el-image {
  width: 120px;
  height: 120px;
}
.upload-card {
  height: 120px;
}

.upload-card ::v-deep .el-upload {
  width: 118px;
  height: 118px;
  border: 1px dashed #c0ccda;
  border-radius: 5px;
  line-height: 118px;
  overflow: hidden;

  .upload-icon {
    font-size: 30px;
    color: #c0ccda;
  }

  &:hover {
    border-color: #008afa;
  }
}
</style>
