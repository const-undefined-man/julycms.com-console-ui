<template>
  <div class="menu-tree">
    <template v-for="(v, k) in data">
      <el-submenu v-if="v.children && v.children.length" :index="v.id + ''" :key="k">
        <template slot="title">
          <i v-if="v.meta.icon" :class="v.meta.icon" />
          <span class="title">{{ v.meta.title }}</span>
        </template>
        <menu-tree :data="v.children"></menu-tree>
      </el-submenu>
      <el-menu-item v-else :key="'item-' + k" :index="v.id + ''" @click="toggleTab(v)">
        <i v-if="v.meta.icon" :class="v.meta.icon" />
        <span class="title">{{ v.meta.title }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
	name: 'MenuTree',
	props: {
		// 菜单数据
		data: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {};
	},
	computed: {
		...mapGetters('navTab', {
			navTab: 'getTab',
		}),
	},
	mounted() {},
	methods: {
		...mapActions('navTab', ['setTab', 'setTabIndex']),
		toggleTab(row) {
			let findRes = this.navTab.find((v) => v.id == row.id);
			if (findRes) {
				this.$router.push({
					path: row.path,
				});
			} else {
				this.setTab(row);
			}
			this.setTabIndex(row.id);
		},
	},
};
</script>

<style lang="scss" scoped></style>
