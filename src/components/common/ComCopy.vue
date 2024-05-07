<template>
  <el-footer>
    <p class="links">
      <el-link href="https://www.julycms.com" target="_blank">官网</el-link>
      <el-link href="https://www.julycms.com/getting-started.html" target="_blank">帮助</el-link>
    </p>
    <p>copyright &copy; {{ copyYear }} <a href="https://www.julycms.com" target="_blank">www.julycms.com</a></p>
  </el-footer>
</template>

<script>
export default {
  name: 'ComCopy',
  data() {
    return {
      copyYear: '2024',
    };
  },
  mounted() {
    let curYear = this.$dayjs().year();
    if (curYear > 2024) {
      this.copyYear = this.copyYear + '-' + curYear;
    }
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.el-footer {
  height: auto !important;
  padding: 30px 0 20px;
  text-align: center;
  font-size: 14px;
  color: #999;

  p {
    margin: 10px 0;
  }

  .links .el-link {
    margin: 0 10px;
    font-weight: normal;
  }
}
</style>
