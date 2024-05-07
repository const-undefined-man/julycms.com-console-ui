<template>
<el-select v-model="val">
	<el-option v-for="(v, k) in list" :key="k" :label="v.label" :value="v.value"></el-option>
</el-select>
</template>

<script>
export default {
	name: 'ComDict',
	props: {
		type: {
			type: String,
			default: () => ''
		}
	},
	data() {
		return {
			val: '',
			list: []
		};
	},
	watch: {
		type: {
			handler(val) {
				if (!val) {
					return;
				}

				this.getDictValues();
			},
			immediate: true
		}
	},
	mounted() {

	},
	methods: {
		async getDictValues() {
			let {code, data} = await this.$api.system.dict.values(this.type);
			if(code == 1) {
				this.list = data;
			}
		}
	},
};
</script>

<style lang="scss" scoped>

</style>