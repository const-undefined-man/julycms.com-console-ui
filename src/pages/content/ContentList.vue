<template>
  <el-row type="flex" :gutter="20" class="page">
    <el-col :span="4" class="category">
      <el-card shadow="never">
        <template slot="header">选择栏目</template>
        <el-tree
          ref="catTree"
          :indent="14"
          node-key="id"
          :data="tree.data"
          :current-node-key="tree.now"
          :props="tree.defaultProps"
          @node-click="onTreeNode"
        />
      </el-card>
    </el-col>
    <el-col :span="20" class="content">
      <el-card v-if="rightType === 0" shadow="never">
        <!-- 列表 -->
        <template v-if="category.siteModel.mark !== 'page'">
          <el-row slot="header" type="flex" justify="space-between">
            <el-col>{{ category.catname }}</el-col>
            <el-col class="text-right">
              <el-button v-auth="['content:document:create']" type="primary" size="mini" @click="addContent"
                >添加</el-button
              >
            </el-col>
          </el-row>
          <ComSearchBar :data="searchData" @search="onSearch" @clear="onSearchClear"></ComSearchBar>
          <ComTable :data="list" :fields="fields" :total="total"></ComTable>
        </template>

        <!-- 单页 -->
        <template v-if="category.siteModel.mark === 'page'">
          <el-row slot="header" type="flex" justify="space-between">
            <el-col>{{ category.catname }}</el-col>
            <el-col class="text-right">
              <el-button v-auth="['content:document:update']" type="primary" size="mini" @click="onPageSave"
                >保存</el-button
              >
            </el-col>
          </el-row>
          <component :is="comp.id" :data="comp.data" ref="StPage"></component>
        </template>
      </el-card>

      <el-card v-if="rightType === 1" shadow="never">
        <div slot="header" class="flex-center-between">
          <div class="hand" @click="onBack"><i class="el-icon-back"></i>返回</div>
          <el-button type="primary" size="mini" @click="onSave">保存</el-button>
        </div>
        <StAdd
          v-if="['article', 'album'].includes(category.siteModel.mark)"
          ref="StAdd"
          :type="category.siteModel.mark"
          :detail="comp.data"
        ></StAdd>
        <StLink v-if="category.siteModel.mark === 'link'" ref="StAdd" :detail="comp.data"></StLink>
      </el-card>

      <!-- 评论抽屉 -->
      <!-- <el-drawer title="评论抽屉" :visible.sync="comments.status" :size="comments.size" direction="rtl">
        <ComSearchBar :data="searchData" @search="onSearch" @clear="onSearchClear"></ComSearchBar>

        <ComTable :data="list" :fields="fields" :total="100"></ComTable>
      </el-drawer> -->
    </el-col>
  </el-row>
</template>

<script>
import StPage from '@/components/section/content/StPage.vue';
import StAdd from '@/components/section/content/StAdd.vue';
import StLink from '@/components/section/content/StLink.vue';
export default {
  components: { StPage, StAdd, StLink },
  data() {
    return {
      // 左侧栏目分类
      tree: {
        defaultProps: {
          label: 'catname',
        },
        now: '',
        data: [],
      },
      // 选中的栏目
      category: {
        siteModel: {},
      },
      // 右侧显示类型, 两种状态，0 从左侧点击； 1从右侧点击的添加 修改 按钮
      rightType: 0,
      // 右侧 文章模型搜索条件
      searchData: [
        [
          { type: 'number', label: '文章ID', name: 'id' },
          { label: '文章标题', name: 'title' },
        ],
      ],
      fields: [
        // { type: 'selection' },
        { label: 'ID', prop: 'id' },
        {
          label: '标题',
          prop: 'title',
          type: 'link',
          width: 500,
          fn: this.listView,
        },
        { label: '时间', prop: 'createdAt', width: 180 },
        { label: '阅读', prop: 'readNum' },
        { label: '点赞', prop: 'likeNum' },
        {
          label: '是否显示',
          prop: 'display',
          type: 'switch',
          inactiveValue: 0,
          activeValue: 1,
          auth: ['content:document:display'],
          fn: this.toggleDisplay,
        },
        {
          label: '操作',
          type: 'action',
          width: 130,
          actions: [
            { text: '修改', auth: ['content:document:detail'], fn: this.listEdit },
            { text: '删除', auth: ['content:document:delete'], fn: this.listDel },
          ],
        },
      ],

      // 右侧动态组件数据
      comp: {
        id: 'StPage',
        data: null,
      },
      // 评论
      // comments: {
      //   status: false,
      //   size: '800px',
      // },
      list: [],
      total: 0,
    };
  },
  activated() {
    this.getCategorys();
  },
  methods: {
    async getCategorys() {
      const { code, data } = await this.$api.site.category.list();
      if (code === 1) {
        this.tree.data = data;
        this.onTreeNode(data[0]);
      }
    },
    // 总册栏目树点击事件
    onTreeNode(row) {
      this.rightType = 0;
      this.category = row;

      let componentsJson = {
        page: 'stPage',
        album: 'stAdd',
        article: 'stAdd',
      };
      this.comp.id = componentsJson[row.siteModel.mark];
      this.tree.now = row.id;

      this.getContent();
    },
    // 获取栏目内容
    async getContent() {
      const { id, siteModel } = this.category;
      const params = {
        catId: id,
        modelMark: siteModel.mark,
      };
      const { code, data } = await this.$api.content.document.list(params);
      if (code === 1) {
        if (siteModel.mark === 'page') {
          this.comp.data = data;
        } else {
          this.comp.data = null;
          this.list = data.items;
          this.total = data.meta.totalItems;
        }
      }
    },
    // 添加内容的时候
    addContent() {
      this.rightType = 1;
    },
    onBack() {
      this.rightType = 0;
      this.comp.data = null;
    },
    async onSearch(query) {
      const { id, siteModel } = this.category;
      const params = {
        catId: id,
        modelMark: siteModel.mark,
      };
      const { code, data } = await this.$api.content.document.list(params, query);
      if (code === 1) {
        this.list = data.items;
        this.total = data.meta.totalItems;
      }
    },
    onSearchClear() {
      this.onSearch({});
    },
    // 切换显示 与 隐藏
    async toggleDisplay({ id, display }) {
      await this.$api.content.document.display(id, display);
      this.getContent();
    },
    // TODO: 跳转到前相对应的内容详细
    listView(row) {
      console.log(row);
    },
    // 文章 评论
    // listComment(row) {
    //   this.comments.status = true;
    // },
    // 文章 修改
    async listEdit(row) {
      const { code, data } = await this.$api.content.document.detail(row.id);
      if (code === 1) {
        this.comp.data = data;
        this.rightType = 1;
      }
    },
    // 文章 删除
    async listDel(row) {
      let res = await this.$confirm('确定删除该文章吗？', '提示', { type: 'warning' }).catch((err) => err);
      if (res !== 'confirm') {
        return;
      }
      const { code } = await this.$api.content.document.del(row.id);
      if (code === 1) {
        this.$message.success('删除成功');
        this.getContent();
      }
    },
    // 单页保存
    onPageSave() {
      const data = this.$refs.StPage.getData();
      data.category = data.category.id;
      this.$api.content.document.update(data);
    },
    // 文章保存
    async onSave() {
      const data = await this.$refs.StAdd.getData();
      if (!data) {
        return;
      }

      data.category = this.category.id;
      let method = data.id ? 'update' : 'add';
      let { code } = await this.$api.content.document[method](data);
      if (code === 1) {
        this.onBack();
        this.getContent();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 600px;
  .category {
    position: relative;

    .el-card ::v-deep {
      position: absolute;
      left: 10px;
      top: 0;
      right: 0;
      bottom: 0;

      .el-card__header {
        position: relative;
        z-index: 2;
      }

      .el-card__body {
        position: absolute;
        left: 0;
        top: 50px;
        right: 0;
        bottom: 0;
        overflow-y: auto;
      }
    }
  }

  .content {
    .el-card ::v-deep .el-card__header {
      padding: 11px 20px;
      line-height: 28px;
    }
    .com-search-bar ::v-deep .el-form {
      margin-top: 0;
    }
  }
}

.el-tree ::v-deep {
  .el-tree-node.is-current > .el-tree-node__content {
    border-radius: 3px;
    background: #008afa;
    color: #fff;

    .el-tree-node__expand-icon {
      color: #fff;
    }
  }
  .el-tree-node__content {
    height: 26px;
    line-height: 26px;
  }
  .el-tree-node__children {
    background: none;
  }
}

.hand {
  cursor: pointer;
}
</style>
