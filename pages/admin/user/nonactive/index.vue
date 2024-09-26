<template>
  <UserList
    :page-type="pageType"
    :table-data="tableData"
    :query-options="queryOptions"
    @search="onSearch"
    @change="onSelectSizeChange"
    @changePage="onChangePage"
  />
</template>

<script>
import UserList from '~/components/admin/page/UserList';

const PAGE_TYPE = 'NONACTIVE';

export default {
  name: 'NonactiveUserPage',
  components: { UserList },
  layout: 'admin/default',
  data() {
    return {
      tableData: null,
      pageType: PAGE_TYPE,
      queryOptions: {
        page: this.$route.query.page || 0,
        size: Number(this.$route.query.size) || 20,
        text: this.$route.query.text || '',
        searchDateType: this.$route.query.searchDateType || 'CREATED_DATE',
        startDate: this.$route.query.startDate || '',
        endDate: this.$route.query.endDate || '',
        gender: this.$route.query.gender || null,
        isMarketingReceive: this.$route.query.isMarketingReceive || null
      }
    };
  },
  async fetch() {
    this.$router
      .replace({
        path: this.$route.path,
        query: this.queryOptions
      })
      .catch(() => {});

    this.tableData = await this.$axios.$get('/admin/accounts/sleepers', {
      params: {
        ...this.queryOptions,
        startDate: this.queryOptions.startDate ? `${this.queryOptions.startDate} 00:00:00` : '',
        endDate: this.queryOptions.endDate ? `${this.queryOptions.endDate} 23:59:59` : ''
      }
    });
    this.tableData.startCount = this.tableData.totalElements - (this.tableData.number * this.tableData.size);
  },
  methods: {
    onSearch(queryOptions) {
      if (!this.$fetchState.pending) {
        this.queryOptions = queryOptions;
        this.$fetch();
      }
    },
    onSelectSizeChange(size) {
      if (!this.$fetchState.pending) {
        this.queryOptions.size = size;
        this.$fetch();
      }
    },
    onChangePage(page) {
      if (!this.$fetchState.pending) {
        this.queryOptions.page = page;
        this.$fetch();
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
