<template>
  <UserDetail
    v-if="detailData && tableData"
    :page-type="pageType"
    :table-data="tableData"
    :detail-data="detailData"
    @changePage="onChangePage"
    @coffee="onCoffee"
  />
</template>

<script>
import UserDetail from '~/components/admin/page/UserDetail';
const PAGE_TYPE = 'COMMON';
export default {
  name: 'EditPage',
  components: { UserDetail },
  layout: 'admin/default',
  async asyncData({ params, $axios, redirect }) {
    const { id } = params;
    const detailData = await $axios.$get(`/admin/accounts/${id}`).catch(() => {
      redirect('/admin/user/common');
    });

    return { id, detailData };
  },
  data() {
    return {
      pageType: PAGE_TYPE,
      tableData: null,
      detailData: null,
      id: null,
      queryOptions: {
        page: this.$route.query.page || 0,
        size: Number(this.$route.query.size) || 10,
        isCoffee: this.$route.query.isCoffee === 'false'
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

    this.tableData = await this.$axios.$get(`/admin/accounts/${this.id}/tickets`, { params: this.queryOptions });
    this.tableData.startCount = this.tableData.totalElements - (this.tableData.number * this.tableData.size);
  },
  methods: {
    onCoffee(isCoffee) {
      if (!this.$fetchState.pending) {
        this.queryOptions.isCoffee = isCoffee;
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
