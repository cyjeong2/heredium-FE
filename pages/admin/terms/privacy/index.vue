<template>
  <TermsList
    :page-type="pageType"
    :table-data="tableData"
    @dropdownChange="onDropdown"
    @search="onSearch"
    @changePage="onChangePage"
  />
</template>

<script>
import TermsList from '~/components/admin/page/TermsList';

const PAGE_TYPE = 'PRIVACY';

export default {
  name: 'TermsPage',
  components: { TermsList },
  layout: 'admin/default',
  data() {
    return {
      tableData: null,
      pageType: PAGE_TYPE,
      queryOptions: {
        type: PAGE_TYPE,
        text: this.$route.query.text || '',
        size: Number(this.$route.query.size) || 20,
        page: this.$route.query.page || '0'
      }
    };
  },
  async fetch() {
    await this.$router
      .replace({
        path: this.$route.path,
        query: this.queryOptions
      })
      .catch(() => {});

    this.tableData = await this.$axios.$get('/admin/policies', { params: this.queryOptions }).then((tableData) => ({
      ...tableData,
      startCount: tableData.totalElements - tableData.number * tableData.size
    }));
  },
  methods: {
    onDropdown(count) {
      if (!this.$fetchState.pending) {
        this.queryOptions.size = count;
        this.queryOptions.page = 0;
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
        this.$fetch();
      }
    }
  }
};
</script>
