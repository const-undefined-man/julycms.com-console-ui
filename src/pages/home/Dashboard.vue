<template>
  <div class="page">
    <el-row :gutter="15">
      <el-col :span="6">
        <div class="card count">
          <div class="hd">总揽</div>
          <div class="bd">
            <div class="item">
              <div class="key">文章</div>
              <div class="val">{{ dashboard.count.document }}</div>
            </div>
            <div class="item">
              <div class="key">栏目</div>
              <div class="val">{{ dashboard.count.category }}</div>
            </div>
            <div class="item">
              <div class="key">标签</div>
              <div class="val">{{ dashboard.count.tag }}</div>
            </div>
            <div class="item">
              <div class="key">附件</div>
              <div class="val">{{ dashboard.count.attachement }}</div>
            </div>
          </div>
        </div>
        <div class="card quick">
          <div class="hd">快捷操作</div>
          <template v-for="(v, k) in menus">
            <div v-if="v.quickmenu" class="bd" :key="k">
              <el-divider content-position="left">{{ v.name }}</el-divider>
              <template v-for="(sv, sk) in v.children">
                <div class="item" v-if="sv.quickmenu" :key="sk" @click="navTabChange(sv)">{{ sv.name }}</div>
              </template>
            </div>
          </template>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="card">
          <div class="hd">文章点击量(最近30天)</div>
          <div class="bd liner-chart" ref="chartvisitor"></div>
        </div>
        <el-row :gutter="15">
          <el-col :span="12">
            <div class="card">
              <div class="hd">栏目文章占比</div>
              <div class="bd pie-chart" ref="chartcategory"></div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="card">
              <div class="hd">热门文章</div>
              <div class="bd">
                <ComTable :border="false" :data="dashboard.hotArticle" :fields="fields"></ComTable>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import * as echarts from 'echarts';
export default {
	name: 'Index',
	data() {
		return {
			dashboard: {
				count: {},
				hotArticle: [],
				clickCount: [],
			},
			fields: [
				{ label: '排序', type: 'index' },
				{ label: '文章标题', prop: 'title', width: 300, tip: true },
				{ label: '点击量', prop: 'count' },
			],
		};
	},
	computed: {
		...mapGetters('adminInfo', {
			menus: 'menus',
		}),
		...mapGetters('navTab', {
			navTab: 'getTab',
		}),
	},
	activated() {
		this.getCount();
	},
	methods: {
		...mapActions('navTab', ['setTab', 'setTabIndex']),
		async getCount() {
			const { code, data } = await this.$api.common.dashboard();
			if (code === 1) {
				this.dashboard = data;

				this.initContentVisitor();
				this.initCategory();
			}
		},
		initContentVisitor() {
			const xData = this.dashboard.clickCount.map((v) => v.date);
			const yData = this.dashboard.clickCount.map((v) => v.count);
			const chart = echarts.init(this.$refs.chartvisitor);
			chart.setOption({
				grid: {
					top: '10%',
					left: 0,
					right: '1%',
					bottom: 0,
					containLabel: true,
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'line',
					},
				},
				color: ['#36f'],
				xAxis: {
					type: 'category',
					data: xData,
					axisLabel: {
						color: '#999',
					},
					axisLine: {
						lineStyle: {
							color: '#ebeef5',
							type: 'dashed',
						},
					},
				},
				yAxis: {
					type: 'value',
					splitLine: {
						lineStyle: {
							color: '#ebeef5',
							type: 'dashed',
						},
					},
				},
				series: [
					{
						data: yData,
						type: 'line',
						smooth: true,
						areaStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 0,
									color: 'rgba(51, 102, 255, .3)',
								},
								{
									offset: 1,
									color: 'rgba(255,255,255,0)',
								},
							]),
						},
					},
				],
			});
		},
		initCategory() {
			const data = this.dashboard.categoryCount
				.filter((v) => v.contentCount > 0)
				.map((v) => {
					return {
						name: v.categoryName,
						value: v.contentCount,
					};
				});
			const chart = echarts.init(this.$refs.chartcategory);
			chart.setOption({
				color: ['#36f', '#21CCFF', '#6161fa', '#86DF6C', '#33D1C9', '#F77234', '#722ED1'],
				tooltip: {
					trigger: 'item',
				},
				grid: {
					top: '10%',
					left: 0,
					right: '3%',
					bottom: 0,
					containLabel: true,
				},
				series: [
					{
						type: 'pie',
						radius: ['50%', '70%'],
						avoidLabelOverlap: false,
						data,
					},
				],
			});
		},
		navTabChange(val) {
			this.$router.push({
				path: val.path,
			});
			this.setTabIndex(val.id);
			this.setTab(val);
		},
	},
};
</script>

<style lang="scss" scoped>
.count {
  .bd {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;

    .item {
      border-radius: 5px;
      .key,
      .val {
        margin: 15px;
      }
      .key {
        color: rgba($color: #000000, $alpha: 0.6);
      }
      .val {
        font-size: 30px;
      }
    }
    .item:nth-child(1) {
      background: linear-gradient(rgb(242, 249, 254) 0%, rgb(230, 244, 254) 100%);
    }
    .item:nth-child(2) {
      background: linear-gradient(rgb(245, 254, 242) 0%, rgb(230, 254, 238) 100%);
    }
    .item:nth-child(3) {
      background: linear-gradient(rgb(247, 247, 255) 0%, rgb(236, 236, 255) 100%);
    }
    .item:nth-child(4) {
      background: linear-gradient(rgb(242, 249, 254) 0%, rgb(230, 244, 254) 100%);
    }
  }
}
.card {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 5px;
  margin-bottom: 15px;
  .hd {
    margin: 15px;
    font-weight: bold;
  }
  .bd {
    margin: 15px;
  }
}

.quick .bd {
  display: flex;
  flex-wrap: wrap;
  gap: 0 10px;
  .item {
    padding: 8px 12px;
    margin: 5px 0;
    background: #ebeef5;
    border-radius: 5px;
    cursor: pointer;
  }
}

.liner-chart {
  height: 240px;
}
.pie-chart {
  height: 245px;
}
</style>
