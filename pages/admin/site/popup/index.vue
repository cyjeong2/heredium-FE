<template>
  <div>
    <SiteList
      :page-type="pageType"
      :query-options="queryOptions"
      :table-data="tableData"
      @changePage="onChangePage"
      @search="onSearch"
      @progress="onProgress"
      @toggle="onToggle"
    />
  </div>
</template>

<script>
import SiteList from '~/components/admin/page/SiteList';

const PAGE_TYPE = 'POPUP';

export default {
  name: 'PopupPage',
  components: { SiteList },
  layout: 'admin/default',
  data() {
    return {
      tableData: null,
      pageType: PAGE_TYPE,
      queryOptions: {
        text: this.$route.query.text || '',
        size: Number(this.$route.query.size) || 10,
        page: this.$route.query.page || '0',
        isProgress: this.$route.query.isProgress !== 'false',
        isShowDisabled: this.$route.query.isShowDisabled === 'true'
      }
    };
  },
  async fetch() {
    await this.$router
      .replace({
        path: this.$route.path,
        query: {
          ...this.queryOptions,
          size: this.queryOptions.isProgress ? 50 : 10
        }
      })
      .catch(() => {});
    this.tableData = await this.$axios.$get('/admin/popups', { params: this.queryOptions });
    this.tableData.startCount = this.tableData.totalElements - this.tableData.number * this.tableData.size;
  },
  methods: {
    onProgress(isProgress) {
      if (!this.$fetchState.pending) {
        this.queryOptions.isProgress = isProgress;
        this.$fetch();
      }
    },
    onToggle(isShowDisabled) {
      if (!this.$fetchState.panding) {
        this.queryOptions.isShowDisabled = isShowDisabled;
        this.$fetch();
      }
    },
    onSearch(text) {
      if (!this.$fetchState.pending) {
        this.queryOptions.text = text;
        this.queryOptions.page = 0;
        this.$fetch();
      }
    },
    onChangePage(page) {
      if (!this.$fetchState.pending) {
        this.queryOptions.page = page;
        this.queryOptions.page = 0;
        this.$fetch();
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
