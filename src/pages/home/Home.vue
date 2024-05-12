<template>
  <el-container>
    <LayAside :data="menus" :actived="tabIndex" @toggle="onToggle"></LayAside>
    <section class="main-container">
      <el-header height="90px">
        <div :class="['header-inner', isCollapse ? 'collapse' : '']">
          <div class="header-bar">
            <el-breadcrumb separator="/" class="bar-left">
              <el-breadcrumb-item :to="{ path: '/home/dashboard' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-for="(v, k) in breadcrumb" :key="k">{{ v }}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="bar-right">
              <el-avatar
                size="small"
                icon="el-icon-user-solid"
                :src="'http://localhost:8090' + user.avatar"
              ></el-avatar>
              <span>{{ user.username }}</span>
              <el-divider direction="vertical"></el-divider>
              <span class="logout" @click="logout">退出</span>
            </div>
          </div>
          <el-tabs v-model="tabIndex" type="card" closable @tab-click="navTabChange" @tab-remove="navTabRemove">
            <el-tab-pane v-for="v in navTab" :key="v.id" :label="v.meta.title" :name="'' + v.id"></el-tab-pane>
          </el-tabs>
        </div>
      </el-header>
      <el-main :class="$route.meta.mainBg ? 'main-bg' : ''">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
      <com-copy />
    </section>
  </el-container>
</template>

<script>
import { getTokenInfo } from '@/libs/token';
import { mapActions, mapGetters } from 'vuex';
import LayAside from '@/components/layout/LayAside.vue';
export default {
  name: 'index',
  components: { LayAside },
  data() {
    return {
      // 左侧菜单是否折叠
      isCollapse: false,
      // 面包屑
      breadcrumb: [],
      // 用户信息
      user: {},
      // 选项卡索引
      tabIndex: '1',
    };
  },
  computed: {
    ...mapGetters('navTab', {
      navTab: 'getTab',
      navTabIndex: 'getTabIndex',
    }),
    ...mapGetters('adminInfo', {
      menus: 'menus',
    }),
  },
  mounted() {
    this.user = getTokenInfo();
    this.initNavTabs();
    this.initNavTabIndex();
  },
  watch: {
    // 监听路由变化，如果是首页，设置navTab的索引为首页
    $route(val) {
      if (val.path === '/home/dashboard') {
        let findRes = this.navTab.find((v) => v.path === val.path);
        this.tabIndex = findRes.id + '';
        this.setTabIndex(findRes.id);
      }

      this.getBreadcrumb();
    },
    // 点击左侧菜单的时候，设置navTab的索引
    navTabIndex(val) {
      if (!val) {
        return;
      }
      this.tabIndex = val + '';
      // 手动点击选项卡
      // let findIndex = this.navTab.findIndex((v) => v.id === val * 1);
      this.navTabChange({ name: val });
    },
  },
  methods: {
    ...mapActions('navTab', ['setTab', 'delTab', 'setTabIndex']),
    // 面包屑
    getBreadcrumb() {
      let names = this.$route.matched.filter((v) => v.name).map((v) => v.name);
      this.breadcrumb = names[0] === 'dashboard' ? [] : names;
    },
    // 左侧菜单切换事件
    onToggle(isCollapse) {
      this.isCollapse = isCollapse;
    },
    // 从localstore读取缓存的数据
    initNavTabs() {
      let cacheNavTab = this.$utils.SStore.get('navTab') || [];
      if (!cacheNavTab.length) {
        return;
      }

      cacheNavTab.forEach((v) => {
        this.setTab(v);
      });
    },
    // 初始化导航索引
    initNavTabIndex() {
      let cacheIndex = this.$utils.SStore.get('tabIndex') || 1;
      let findRes = this.navTab.find((v) => v.id == cacheIndex);
      if (findRes) {
        this.tabIndex = findRes.id + '';
        this.setTabIndex(findRes.id);
      }
    },
    // 选项卡导航 切换
    navTabChange(val) {
      let targetTab;
      if (val.id === 1) {
        targetTab = this.navTab[0];
      } else {
        targetTab = this.navTab.find((v) => v.id == val.name * 1);
      }

      if (targetTab) {
        this.$router.push({
          path: targetTab.path,
        });
        this.tabIndex = targetTab.id + '';
        this.setTabIndex(targetTab.id);
      }
    },
    // 选项卡导航 删除
    navTabRemove(id) {
      let findIndex = this.navTab.findIndex((v) => v.id === id * 1);

      this.delTab(id);
      // 如果删除的是当前选中的选项卡，则显示前一个
      if (id * 1 === this.tabIndex * 1) {
        let prevTab = this.navTab[findIndex - 1];
        this.navTabChange({ name: prevTab.id });
      }
    },
    // 退出登录
    async logout() {
      let res = await this.$confirm('确认要退出吗?', '提示', { type: 'warning' }).catch((err) => err);
      if (res !== 'confirm') {
        return;
      }
      let id = this.user.userId;
      const { code } = await this.$api.common.logout({ id });
      if (code == 1) {
        this.$store.dispatch('adminInfo/clear').then(() => {
          this.$store.dispatch('navTab/initTab');
          this.$router.push('/login');
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
}

.main-container {
  flex: 1;
  overflow: hidden;

  .el-header {
    padding: 0;

    .header-inner {
      position: fixed;
      left: 240px;
      top: 0;
      right: 0;
      z-index: 1000;
      background: #fff;
      box-shadow: 0 1px 4px 0 rgba($color: #000000, $alpha: 0.1);
      transition: left 0.1s linear;
      &.collapse {
        left: 60px;
      }
    }

    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      height: 50px;
      padding: 0 20px;
      line-height: 50px;

      &:before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        background: #ebeef5;
        height: 1px;
        z-index: 2;
      }
      .el-breadcrumb ::v-deep {
        .el-breadcrumb__inner.is-link,
        .el-breadcrumb__inner a {
          font-weight: normal;
        }
      }

      .bar-right {
        display: flex;
        align-items: center;
        height: 50px;
        line-height: 50px;
        padding: 0 0 0 20px;
        .el-avatar {
          margin-right: 10px;
        }
        .logout {
          cursor: pointer;
        }
      }
    }
    .el-tabs ::v-deep {
      .el-tabs__header {
        height: 30px;
        border-bottom: 0 none;
        padding: 5px 20px;
        margin: 0;

        .el-tabs__nav-next,
        .el-tabs__nav-prev {
          line-height: 30px;
          font-size: 20px;
        }
      }
      .el-tabs__nav {
        border: 0 none;
      }

      .el-tabs__item {
        height: 30px;
        line-height: 28px;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        margin-right: 5px;
        border-radius: 2px;
        padding: 0 10px;
        font-weight: normal;
        &:first-child {
          border: 1px solid #e4e7ed;
          .el-icon-close {
            display: none;
          }
        }
        &.is-active {
          padding: 0 10px !important;
          background: #f2f6fc;
          border: 1px solid #008afa;
        }
      }
    }
  }

  .el-main {
    flex: auto;
    padding: 0;
    margin: 20px;

    &.main-bg {
      background: #fff;
      padding: 20px;
      border-radius: 2px;
    }
  }
}
.el-tabs ::v-deep .el-tabs__header .el-tabs__item {
  &:nth-child(2) {
    padding-left: 10px !important;
  }
  &:last-child {
    padding-right: 10px !important;
  }
}
</style>
