<template>
  <div class="page">
    <el-tabs v-model="index" @tab-click="onTab">
      <el-tab-pane v-for="(v, k) in tabs" :label="v" :name="k + ''" :key="k">
        <component :is="component[k]" :data="setting" @save="onSave"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import StSettingBaseinfo from '@/components/section/site/StSettingBaseinfo.vue';

export default {
	components: { StSettingBaseinfo },
	data() {
		return {
			tabs: ['基本信息'],
			component: ['StSettingBaseinfo'],
			index: '0',
			setting: [],
		};
	},
	activated() {
		this.getInfo();
	},
	methods: {
		// 获取设置信息
		async getInfo() {
			const { code, data } = await this.$api.site.setting.list({ type: this.index });
			if (code === 1) {
				this.setting = data;
			}
		},
		onTab({ index }) {
			this.index = index;
			this.getInfo();
		},
		// 保存设置信息
		onSave(data) {
			this.$api.site.setting.update({ fields: data });
		},
	},
};
</script>
