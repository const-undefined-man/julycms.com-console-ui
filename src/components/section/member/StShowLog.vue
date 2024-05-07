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
			fields: [
				{ label: '客户端', prop: 'client' },
				{ label: '类型', prop: 'type' },
				{ label: '时间', prop: 'time', width: 180 },
				{ label: 'ip', prop: 'ip' },
				{ label: '系统', prop: 'os' },
				{ label: '浏览器', prop: 'browser' },
				{ label: '内核', prop: 'core' },
			],
			list: [
				{
					client: 'PC',
					type: '手机',
					time: '2018-09-03 13:25:00',
					ip: '127.0.0.1',
					os: 'Windows NT 6.3; WOW64',
					browser: 'Chrome/51.0.2704.103 Safari/537.36',
					core: 'AppleWebKit/537.36',
				},
				{
					client: '小程序',
					type: '微信',
					time: '2018-09-03 13:25:00',
					ip: '127.0.0.1',
					os: 'weixinX5',
					browser: 'weixinX5',
					core: 'weixinX5',
				},
			],
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
