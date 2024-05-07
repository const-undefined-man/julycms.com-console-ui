<template>
  <div class="page">
    <ComSearchBar :data="searchData" @search="onSearch" @clear="clearSearch"></ComSearchBar>

    <ComTable :autoHeight="false" :data="list" :fields="fields" :total="total" @page="onpage" @size="onsize"></ComTable>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { listCommon } from '@/mixins/listCommon.js';
export default {
  name: 'List',
  mixins: [listCommon],
  data() {
    return {
      searchData: [
        [
          { label: 'ID', name: 'id' },
          { label: '大小', name: 'size', type: 'select', options: [] },
          { label: '操作人', name: 'operatorId', type: 'select', options: [] },
          { label: '上传时间', name: 'createdAt', type: 'daterange' },
        ],
      ],
      fields: [
        { type: 'selection' },
        { label: 'ID', prop: 'id', width: 80 },
        { label: '路径', prop: 'url', width: 360 },
        { label: '附件大小', prop: 'size' },
        { label: '附件类型', prop: 'mimetype' },
        { label: '操作人', prop: 'operator.username' },
        { label: '上传时间', prop: 'createdAt' },
        {
          label: '操作',
          type: 'action',
          width: 130,
          actions: [{ text: '删除', auth: ['content:attachement:delete'], fn: this.listDel }],
        },
      ],
    };
  },
  activated() {
    this.getEnums();
    this.getList();
  },
  methods: {
    async getEnums() {
      let filesize = await this.$api.system.dict.values('filesize');
      if (filesize.code === 1) {
        this.$set(this.searchData[0][1], 'options', filesize.data);
      }

      let manager = await this.$api.system.manager.list();
      if (manager.code === 1) {
        const options = manager.data.items.map((v) => {
          return {
            label: v.username,
            value: v.id,
          };
        });
        this.$set(this.searchData[0][2], 'options', options);
      }
    },
    formatCondition(data) {
      if (data.size) {
        data.size = data.size.split('-');
      }
      if (data.createdAt) {
        const date = data.createdAt;
        data.createdAt = [
          dayjs(date[0] + ' 00:00:00').format('YYYY-MM-DD HH:mm:ss'),
          dayjs(date[1] + ' 23:59:59').format('YYYY-MM-DD HH:mm:ss'),
        ];
      }
    },
    formatFileSize(size) {
      const scale = 1000;
      const digitList = ['KB', 'MB', 'GB', 'TB'];
      let _integer = size / scale; //最小单位kb
      let digit = 0;
      while (_integer > scale) {
        _integer = Math.round(_integer / scale);
        digit++;
      }

      return `${_integer}${digitList[digit]}`;
    },
    listItem(item) {
      item.size = this.formatFileSize(item.size);
    },
  },
};
</script>
