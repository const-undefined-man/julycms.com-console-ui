<template>
  <div class="com-action-bar" id="com-action-bar">
    <template v-for="(item, key) in data">
      <!-- button -->
      <template v-if="!item.type || item.type === 'button'">
        <el-button
          size="mini"
          :key="key"
          :disabled="item.disabled"
          :type="item.style || 'default'"
          v-auth="item.auth || []"
          @click="btnClick(item)"
          >{{ item.text }}</el-button
        >
      </template>
      <!-- line -->
      <template v-if="item.type === 'line'">
        <el-divider :key="key" direction="vertical"></el-divider>
      </template>
      <!-- space -->
      <template v-if="item.type === 'space'">
        <span :key="key" class="space"></span>
      </template>
      <!-- dropdown -->
      <template v-if="item.type === 'dropdown'">
        <el-dropdown size="mini" placement="bottom" :key="key" split-button v-auth="item.auth || []" @command="item.fn">
          {{ item.text }}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(dropdown, index) in item.data"
              :disabled="dropdown.disabled"
              :command="dropdown"
              :key="index"
            >
              {{ dropdown.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <!-- popover-tree -->
      <template v-if="item.type === 'popover-tree'">
        <el-popover
          v-model="showTree"
          :key="key"
          v-auth="item.auth || []"
          placement="bottom-start"
          trigger="click"
          popper-class="cat-popover"
        >
          <el-button slot="reference" size="mini" :disabled="item.disabled">{{ item.text }}</el-button>
          <el-tree
            highlight-current
            :data="item.data"
            :key="item.key"
            :props="{ label: 'catname', value: 'id' }"
            @node-click="onTree($event, item)"
          >
            <span :class="{ 'custom-tree-node': true, disabled: node.disabled }" slot-scope="{ node }">
              {{ node.label }}
            </span>
          </el-tree>
        </el-popover>
      </template>
    </template>
  </div>
</template>

<script>
export default {
	name: 'ComPageHeader',
	props: {
		data: {
			type: Array,
			required: false,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
			showTree: false,
		};
	},
	methods: {
		btnClick(item) {
			item.fn && item.fn();

			if (item.to) {
				this.$store.dispatch('navTab/setTab', {
					index: 'addCategoty',
					catname: item.text,
					path: item.to,
				});
				this.$store.dispatch('navTab/setTabIndex', 'addCategoty');
				this.$router.push({
					path: item.to,
				});
			}
		},
		onTree(e, item) {
			this.showTree = false;
			item.fn(e);
		},
	},
};
</script>

<style scoped lang="scss">
.com-action-bar {
  margin-bottom: 15px;
}
.com-action-bar .space {
  margin: 0 5px;
}
.el-dropdown-menu,
.el-tree {
  max-height: 300px;
  overflow-y: auto;
}
.disabled {
  cursor: not-allowed;
  color: #ddd;
}
</style>
