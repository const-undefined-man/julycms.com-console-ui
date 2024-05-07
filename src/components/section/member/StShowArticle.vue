<template>
  <div class="page-st">
    <ComSearchBar :data="searchData" @search="onSearch" @clear="clearSearch"></ComSearchBar>

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
				{ type: 'selection' },
				{ label: 'ID', prop: 'id' },
				{
					label: '标题',
					prop: 'title',
					type: 'link',
					width: 500,
					fn: this.listView,
				},
				{ label: '时间', prop: 'date', width: 180 },
				{ label: '点击', prop: 'clicks' },
				{ label: '评论', prop: 'cmts', type: 'link', fn: this.listComment },
				{ label: '是否显示', prop: 'display', type: 'switch' },
				{
					label: '操作',
					type: 'action',
					width: 130,
					actions: [
						{ text: '修改', fn: this.listEdit },
						{ text: '删除', fn: this.listDel },
					],
				},
			],
			list: [],
		};
	},
	methods: {
		actionComment() {},
		actionEdit() {},
		actionDel() {},
	},
};
</script>

<style scoped></style>
