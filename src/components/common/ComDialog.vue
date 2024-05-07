<template>
	<el-dialog
		:title="title"
		append-to-body
		:width="width + 'px'"
		:visible.sync="visible"
		:before-close="dialogClose"
		:close-on-click-modal="false"
		:destroy-on-close="true"
		@close="dialogClose"
	>
		<slot></slot>
	</el-dialog>
</template>

<script>
export default {
	name: 'ComDialog',
	props: {
		visible: {
			required: true,
			type: Boolean,
			default() {
				return false;
			},
		},
		title: {
			required: false,
			type: String,
			default() {
				return '';
			},
		},
		width: {
			required: false,
			type: Number,
			default() {
				return 600;
			},
		},
	},
	data() {
		return {};
	},
	methods: {
		// 关闭
		dialogClose() {
			this.$emit('update:visible', false);
			this.$emit('close');
		},
	},
	watch: {
		visible(val) {
			this.$emit('update:visible', val);
		},
	},
};
</script>

<style lang="scss" scoped>
.el-dialog__wrapper ::v-deep {
	.el-dialog {
		padding: 0;
		border-radius: 3px;
	}
	.el-dialog__title {
		font-weight: bold;
	}
	.el-dialog__body {
		padding: 10px 20px 20px;
	}
}
</style>
