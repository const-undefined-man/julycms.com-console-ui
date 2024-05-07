<template>
  <div class="page-st">
    <ComTable :data="list" :fields="fields" :total="100"></ComTable>
  </div>
</template>

<script>
export default {
	name: 'StShowArticle',
	data() {
		return {
			headerRight: [{ text: '添加', to: '/content/content_add' }],
			searchData: [
				[
					{ type: 'number', label: '文章ID', name: 'id' },
					{ label: '文章标题', name: 'title' },
				],
			],
			fields: [
				{ label: '访问对象', prop: 'target', type: 'link', fn: this.listShow },
				{ label: '时间', prop: 'time', width: 180 },
				{ label: '停留时长', prop: 'stay' },
				{ label: 'ip', prop: 'ip' },
				{ label: '系统', prop: 'os' },
				{ label: '浏览器', prop: 'browser' },
				{ label: '内核', prop: 'core' },
			],
			list: [],
		};
	},
	methods: {
		listShow() {},
		actionEdit() {},
		actionDel() {},
	},
};
</script>

<style scoped></style>
