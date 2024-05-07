<template>
  <div class="com-search-bar" id="com-search-bar">
    <el-form inline :label-width="labelWidth" :model="search" :disabled="isDisable">
      <el-row v-for="(row, index) in data" :key="index">
        <el-form-item
          v-for="(col, subIndex) in row"
          :key="subIndex"
          :label="col.label"
          :class="{ 'el-form-item__lager': col.size == 'large' }"
        >
          <template v-if="!col.type || col.type === 'input'">
            <el-input
              :clearable="!isDisable"
              :placeholder="col.placeholder || '请输入' + col.label"
              :key="subIndex"
              :maxlength="col.maxlength"
              v-model="search[col.name]"
            ></el-input>
          </template>
          <template v-if="col.type === 'number'">
            <el-input
              :clearable="!isDisable"
              :placeholder="col.placeholder || '请输入' + col.label"
              :key="subIndex"
              :maxlength="col.maxlength"
              v-model.number="search[col.name]"
              @input="verifyID($event, col)"
            ></el-input>
          </template>
          <template v-if="col.type === 'textarea'">
            <el-input
              :clearable="!isDisable"
              resize="none"
              :placeholder="col.placeholder || '请输入' + col.label"
              :key="subIndex"
              v-model="search[col.name]"
              type="textarea"
              :rows="3"
            ></el-input>
          </template>
          <template v-if="col.type === 'select'">
            <el-select
              :placeholder="col.placeholder || '请选择' + col.label"
              v-model="search[col.name]"
              :key="subIndex"
              clearable
              :filterable="col.filterable || false"
              :multiple="col.multiple || false"
              :remote="col.remote || false"
              :remote-method="col.remoteMethod"
              @change="selectChange($event, col)"
            >
              <el-option v-for="(opt, o) in col.options" :key="o" :label="opt.label" :value="opt.value"></el-option>
            </el-select>
          </template>
          <template v-if="col.type === 'cascader'">
            <el-cascader
              :placeholder="col.placeholder || '请选择' + col.label"
              v-model="search[col.name]"
              :key="subIndex"
              :props="col.props"
              clearable
            >
            </el-cascader>
          </template>
          <template v-if="col.type === 'daterange'">
            <el-date-picker
              :key="subIndex"
              v-model="search[col.name]"
              type="daterange"
              clearable
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="daterangeOpt"
            ></el-date-picker>
          </template>
          <template v-if="col.type === 'date'">
            <el-date-picker
              type="date"
              clearable
              v-model="search[col.name]"
              value-format="yyyy-MM-dd"
              :picker-options="daterangeOpt"
              :placeholder="col.placeholder || '请选择' + col.label"
            ></el-date-picker>
          </template>
          <template v-if="col.type === 'radio-button'">
            <el-radio-group v-model="search[col.name]">
              <el-radio-button v-for="(opt, o) in col.options" :key="o" :label="opt.value">{{
                opt.name
              }}</el-radio-button>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onClear">清除</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
	name: 'ComSearchBar',
	props: {
		/**
     * 一个二维数组
     * [
     *   [
     *     { type: 'input', label: '手机号', name: 'id' },
     *     { type: 'input', label: '邮箱', name: 'name' },
     *     { type: 'select', label: '用户状态', name: 'authority', options: [{ text: '全部', value: 1 }] },
     *   ],
     *   [
     *     { type: 'input', label: '用户ID', name: 'nickname' },
     *     { type: 'input', label: '用户昵称', name: 'nickname' },
     *     { type: 'input', label: '真实姓名', name: 'nickname' },
     *   ]
     * ]
     */
		data: {
			required: true,
			type: Array,
			default() {
				return {};
			},
		},
		// 是否禁用当前所有检索条件
		isDisable: {
			required: false,
			type: Boolean,
			default() {
				return false;
			},
		},
		// lable宽度
		labelWidth: {
			required: false,
			type: String,
			default() {
				return '80px';
			},
		},
		// 是否处理大于当前日期的限制
		dateCheck: {
			required: false,
			type: Boolean,
			default() {
				return true;
			},
		},
	},
	data() {
		return {
			daterangeOpt: {},
			search: {},
		};
	},
	mounted() {
		this.handlerDate();
	},
	methods: {
		handlerDate() {
			if (this.dateCheck) {
				this.daterangeOpt.disabledDate = function (date) {
					return new Date(date).getTime() > new Date().getTime();
				};
			} else {
				this.daterangeOpt.disabledDate = function () {
					return false;
				};
			}
		},
		initActionVal() {
			this.action.forEach((row) => {
				row.forEach((col) => {
					if (col.name) {
						this.$set(this.search, col.name, col.value !== null ? col.value : null);
					}
				});
			});
			this.$emit('init', this.search);
		},
		// 下拉框改变事件
		selectChange($event, col) {
			col.fn && col.fn($event);
		},
		// input 改变事件
		verifyID(val, col) {
			col.fn && col.fn(val, col);
			// eslint-disable-next-line
      let newVal = val.replace(/^0|[^\d+]|[`,\.eE\-\+]/g, '');
			this.search[col.name] = newVal;
			this.$set(this.search, col.name, newVal);
		},
		onSearch() {
			this.$emit('search', this.search);
		},
		onClear() {
			this.data.forEach((row) => {
				row.forEach((col) => {
					if (col.name) {
						this.$set(
							this.search,
							col.name,
							col.value !== null ? (typeof col.value === 'string' ? col.value.trim() : col.value) : null
						);
					}
				});
			});
			this.$emit('clear');
		},
	},
	watch: {
		// 监听一下search，在改变的时候回传出去
		search: {
			handler: function (val) {
				this.$emit('change', val);
			},
			deep: true,
		},
		data: {
			handler(val) {
				val.forEach((row) => {
					row.forEach((col) => {
						if (col.name) {
							this.$set(this.search, col.name, col.value !== null ? col.value : null);
						}
					});
				});
				this.$emit('init', this.search);
			},
			deep: true,
			immediate: true,
		},
	},
};
</script>

<style lang="scss" scoped>
.el-form ::v-deep {
  .el-form-item {
    margin-bottom: 15px;

    .el-button {
      vertical-align: top;
    }

    .el-input,
    .el-select,
    .el-date-editor--daterange.el-input__inner {
      width: 220px;
    }
  }
  .el-form-item__lager .el-form-item__content {
    width: 447px;
    .el-input {
      width: 100%;
    }
  }
}
</style>
