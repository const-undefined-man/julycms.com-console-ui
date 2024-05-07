<template>
  <el-aside :width="isCollapse ? '60px' : '240px'">
    <section class="aside-inner" :style="{ width: isCollapse ? '60px' : '240px' }">
      <div class="logo">
        <img src="../../assets/img/logo.png" alt="julyCms" />
        <span v-show="!isCollapse">JulyCms</span>
      </div>
      <div class="menus">
        <el-menu
          background-color="#001529"
          text-color="#fff"
          active-text-color="#fff"
          unique-opened
          :default-active="actived"
          :collapse="isCollapse"
          :collapse-transition="false"
        >
          <menu-tree :data="data"></menu-tree>
        </el-menu>
      </div>
      <div class="toggle" @click="onToggle">
        <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
      </div>
    </section>
  </el-aside>
</template>

<script>
export default {
	name: 'LayAside',
	props: {
		actived: {
			type: String,
			default() {
				return '';
			},
		},
		data: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
			isCollapse: false,
		};
	},
	mounted() {},
	methods: {
		onToggle() {
			this.isCollapse = !this.isCollapse;
			this.$emit('toggle', this.isCollapse);
		},
	},
};
</script>

<style lang="scss" scoped>
.el-aside {
  background: #001529;
  color: rgba($color: #fff, $alpha: 0.5);
  transition: width 0.1s linear;

  .aside-inner {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #001529;
    transition: width 0.1s linear;
  }

  .logo {
    display: flex;
    align-items: center;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #fff;

    img {
      width: 32px;
      margin: 0 12px;
    }
  }
  .menus {
    flex: 1 1 0%;
    overflow: hidden auto;

    ::v-deep .el-menu {
      border-right: 0 none !important;
      .is-opened .el-menu {
        .el-submenu__title,
        .el-menu-item {
          background: #000c17 !important;
          &.is-active {
            background: #008afa !important;
          }
        }
      }
      .el-submenu__title,
      .el-menu-item {
        height: 40px;
        line-height: 40px;

        &.is-active {
          background: #008afa !important;
        }

        .i-icon {
          line-height: 1;
          margin-right: 20px;
        }
      }
    }

    ::v-deep .el-menu--collapse {
      width: 60px;

      .title,
      .el-submenu__icon-arrow {
        display: none;
      }
    }
  }

  .toggle {
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    cursor: pointer;
    text-align: center;
    font-size: 20px;
  }
}
</style>
