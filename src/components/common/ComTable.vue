<template>
  <div class="com-table">
    <el-table
      :border="border"
      stripe
      :data="data"
      row-key="id"
      :lazy="lazy"
      :load="load"
      @selection-change="listSelect"
      @row-click="listClick"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :default-expand-all="isopen || false"
      style="width: 100%"
      :max-height="tableHeight"
    >
      <template v-for="(item, index) in fields">
        <slot v-if="item.slot" :name="item.slot"></slot>
        <!-- index -->
        <el-table-column
          v-else-if="item.type === 'index'"
          :key="'index' + index"
          :width="item.width ? item.width + 'px' : ''"
          :label="item.label"
          align="center"
          type="index"
        >
        </el-table-column>
        <!-- checkbox -->
        <el-table-column
          v-else-if="item.type === 'selection'"
          :key="'check' + index"
          type="selection"
          :width="item.width ? item.width + 'px' : ''"
          :selectable="item.fn"
        >
        </el-table-column>
        <!-- expand -->
        <el-table-column v-else-if="item.type === 'expand' && !item.ismenu" type="expand" :key="'expand' + index">
          <template slot-scope="scope">
            <template v-for="(sub, m) in item.props">
              <el-row :key="m">
                <el-col :span="2">{{ sub.label }}：</el-col>
                <el-col :span="22" class="moreinfo">{{ scope.row[sub.prop] }}</el-col>
              </el-row>
              <el-divider v-if="m < item.props.length - 1" :key="m"></el-divider>
            </template>
          </template>
        </el-table-column>
        <!-- expandTable -->
        <el-table-column v-else-if="item.type === 'expandTable'" type="expand" :key="'expandTable' + index">
          <template slot-scope="scope">
            <el-table :data="scope.row[item.prop]" :show-header="false">
              <el-table-column
                v-for="(sub, key) in item.fields"
                :key="'expandTableItem' + key"
                :width="sub.width ? sub.width + 'px' : ''"
              >
                <template slot-scope="scopeSub">
                  <template v-if="sub.enum">
                    {{ sub.enum[scopeSub.row[sub.prop]] }}
                  </template>
                  <template v-else>
                    {{ scopeSub.row[sub.prop] }}
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <!-- link -->
        <template v-else-if="item.type === 'link'">
          <el-table-column
            v-if="$auth(item.auth)"
            :label="item.label"
            :key="'link' + index"
            :show-overflow-tooltip="item.tip || false"
            :width="item.width ? item.width + 'px' : ''"
            class-name="link-cell"
          >
            <template slot-scope="scope">
              <el-tooltip v-if="item.tipText" effect="dark" :content="item.tipText" placement="top">
                <el-link :underline="false" :type="item.style || 'primary'" @click="item.fn(scope.row)">
                  {{ scope.row[item.prop] }}
                </el-link>
              </el-tooltip>
              <el-link v-else :underline="false" :type="item.style || 'primary'" @click="item.fn(scope.row)">
                {{ scope.row[item.prop] }}
              </el-link>
            </template>
          </el-table-column>
        </template>
        <!-- avatar -->
        <el-table-column
          v-else-if="item.type === 'avatar'"
          :label="item.label"
          :key="'avatar' + index"
          class-name="avatar-cell"
          :width="item.width ? item.width + 'px' : ''"
        >
          <template slot-scope="scope">
            <el-avatar
              :size="50"
              shape="square"
              icon="el-icon-user-solid"
              :src="scope.row[item.prop] || avatar"
            ></el-avatar>
          </template>
        </el-table-column>
        <!-- icon -->
        <el-table-column
          v-else-if="item.type === 'icon'"
          :label="item.label"
          :key="'icon' + index"
          :width="item.width ? item.width + 'px' : ''"
        >
          <template slot-scope="scope">
            <i :class="scope.row[item.prop]" @click="listItemEvent(item, scope.row)" />
          </template>
        </el-table-column>
        <!-- switch -->
        <template v-else-if="item.type === 'switch'">
          <el-table-column
            v-if="$auth(item.auth)"
            :label="item.label"
            :key="'switch' + index"
            :width="item.width ? item.width + 'px' : ''"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row[item.prop]"
                :inactive-value="item.inactiveValue"
                :active-value="item.activeValue"
                @change="listItemEvent(item, scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
        </template>
        <!-- input -->
        <template v-else-if="item.type === 'input'">
          <el-table-column
            v-if="$auth(item.auth)"
            :label="item.label"
            :key="'input' + index"
            :width="item.width ? item.width + 'px' : ''"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row[item.prop]" @change="listItemEvent(item, scope.row)"></el-input>
            </template>
          </el-table-column>
        </template>
        <!-- html -->
        <el-table-column
          v-else-if="item.type === 'html'"
          :label="item.label"
          :key="'html' + index"
          :width="item.width ? item.width + 'px' : ''"
        >
          <template slot-scope="scope">
            <div class="html-cell" v-html="scope.row[item.prop]"></div>
          </template>
        </el-table-column>
        <!-- 其他文本类型 -->
        <el-table-column
          v-else-if="item.type === 'enum'"
          :key="'eunm' + index"
          :label="item.label"
          :show-overflow-tooltip="item.tip || false"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          :width="item.width ? item.width + 'px' : ''"
        >
          <template slot-scope="scope">
            {{ item.enum[scope.row[item.prop]] }}
          </template>
        </el-table-column>
        <!-- action -->
        <el-table-column
          v-else-if="item.type === 'action'"
          :key="'action' + index"
          :label="item.label"
          :width="item.width"
          class-name="actions link-cell"
          fixed="right"
        >
          <template slot-scope="scope">
            <template v-for="(action, n) in item.actions">
              <el-link
                v-if="!('show' in action) || scope.row[action.show]"
                v-auth="action.auth || []"
                :key="'action' + n"
                :underline="false"
                :type="action.style || 'primary'"
                :disabled="scope.row[action.disabled] || false"
                @click="action.fn(scope.row, scope.$index)"
              >
                {{ action.text }}
              </el-link>
            </template>
          </template>
        </el-table-column>
        <!-- 其他文本类型 -->
        <el-table-column
          v-else
          :key="index"
          :label="item.label"
          :show-overflow-tooltip="item.tip || false"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          :width="item.width ? item.width + 'px' : ''"
          :prop="item.prop"
        >
        </el-table-column>
      </template>
    </el-table>

    <!-- 分页 -->
    <el-row type="flex" justify="space-between" class="list-ft" v-if="total > 0">
      <el-col :span="6">
        <el-button
          v-for="(item, key) in actions"
          :key="key"
          :type="item.style || 'danger'"
          @click="item.fn(listSelects)"
        >
          {{ item.text }}
        </el-button>
      </el-col>
      <el-col :span="18">
        <el-pagination
          v-if="total"
          background
          layout="->, total, sizes, prev, pager, next, jumper"
          :total="total"
          :current-page="pageNo"
          :page-sizes="pagesizes"
          :page-size="pagesize"
          :pager-count="pageCount"
          @current-change="onPage"
          @size-change="onSizeChange"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
	name: 'ComTable',
	props: {
		isopen: {
			required: false,
			type: Boolean,
			default() {
				return false;
			},
		},
		border: {
			required: false,
			type: Boolean,
			default() {
				return true;
			},
		},
		// 表格头部统计信息
		headerText: {
			required: false,
			type: String,
			default() {
				return '';
			},
		},
		// 字段说明
		fieldsDesc: {
			required: false,
			type: Array,
			default() {
				return [];
			},
		},
		// data item 包含 label prop tip type
		data: {
			required: true,
			type: Array,
			default() {
				return [];
			},
		},
		// 显示的字段
		fields: {
			required: true,
			type: Array,
			default() {
				return [];
			},
		},
		// 是否自动适应高度
		autoHeight: {
			required: false,
			type: Boolean,
			default() {
				return true;
			},
		},
		// 表格高度
		height: {
			required: false,
			type: Number,
			default() {
				return 400;
			},
		},
		// 是否懒加载
		lazy: {
			required: false,
			type: Boolean,
			default() {
				return false;
			},
		},
		// 懒加载函数
		load: {
			required: false,
			type: Function,
			default() {
				return () => {};
			},
		},
		// 总过有多少条数据
		total: {
			required: false,
			type: Number,
			default() {
				return 0;
			},
		},
		// 当前分页
		currPage: {
			required: false,
			type: Number,
			default() {
				return 1;
			},
		},
		// 页码按钮数
		pageCount: {
			required: false,
			type: Number,
			default() {
				return 5;
			},
		},
		// 批量操作列表
		actions: {
			required: false,
			type: Array,
			default() {
				return [
					// {
					//   text: '删除',
					//   style: 'danger',
					//   fn: () => {}
					// }
				];
			},
		},
	},
	data() {
		return {
			listSelects: [],
			avatar: require('@/assets/img/avatar.jpg'),
			pageNo: 1,
			pagesizes: [10, 20, 30, 50, 100, 200, 500],
			pagesize: 10,
			tableHeight: 300,
		};
	},
	mounted() {
		if (this.autoHeight) {
			this.handleTableHeight();
		} else {
			this.tableHeight = this.height;
		}
	},
	methods: {
		handleTableHeight() {
			let _this = this;
			let fixHeight = 0;
			window.onresize = () => {
				let timer = setTimeout(function () {
					let searchBar = document.getElementById('com-search-bar');
					let headerBar = document.getElementById('com-header-bar');
					if (searchBar) {
						fixHeight += searchBar.offsetHeight;
					}
					if (headerBar) {
						fixHeight += headerBar.offsetHeight;
					}
					_this.tableHeight = window.innerHeight - fixHeight - 38;
					if (_this.total <= 0) {
						_this.tableHeight += 53;
					}
					if (_this.tableHeight < 300) {
						_this.tableHeight = 300;
					}
					window.clearTimeout(timer);
				}, 100);
			};
			window.onresize();
		},
		// 列表选择
		listSelect(rows) {
			this.listSelects = rows;
			this.$emit('listSelect', rows);
		},
		// 列表点击事件
		listClick(row, column, event) {
			this.$emit('listClick', row, column, event);
		},
		// 分页
		onPage(pageno) {
			this.pageNo = pageno;

			this.$emit('page', pageno);
		},
		// 每页显示数量改变事件
		onSizeChange(size) {
			this.pageNo = 1;
			this.pagesize = size;

			this.$emit('size', size);
		},
		// 单元格内容点击事件
		listItemEvent(item, row) {
			item.fn && item.fn(row);
		},
	},
	watch: {
		currPage(val) {
			this.pageNo = val;
		},
		total() {
			this.handleTableHeight();
		},
	},
};
</script>

<style lang="scss" scoped>
.el-icon-top,
.el-icon-bottom {
  font-size: 20px;
  cursor: pointer;
}
.el-table ::v-deep {
  .moreinfo {
    word-break: break-all;
  }
  .el-divider {
    margin: 15px 0;
  }
  .link-cell .el-link {
    font-weight: normal;
  }
  .link-cell .el-tooltip .el-link {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cell.el-tooltip {
    max-width: 240px;
  }
  .cell {
    .el-icon-check,
    .el-icon-success,
    .el-icon-circle-check {
      color: #008afa;
    }
  }
  .cell {
    .el-icon-close,
    .el-icon-error,
    .el-icon-circle-close {
      color: #f56c6c;
    }
  }
}

.expandTable ::v-deep .el-table .el-table__expanded-cell[class*='cell'] {
  padding: 0;
}

.actions .cell .el-link:nth-child(n + 2) {
  margin-left: 10px;
}

.list-ft {
  margin: 15px 0;
}

.cell span {
  margin-right: 10px;
  font-size: 12px;
  color: #999;
}
</style>
