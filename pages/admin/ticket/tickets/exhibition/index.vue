<template>
  <Tickets
    page-title="전시 입장권"
    page-type="exhibition"
    :ignore-state-list="['ISSUANCE']"
    :fetch-query-options="queryOptions"
    :fetch-table-data="tableData"
    @search="onSearch"
    @page="onPage"
  />
</template>

<script>
import Tickets from '~/components/admin/page/Tickets';

export default {
  name: 'AllPage',
  components: { Tickets },
  layout: 'admin/default',
  data() {
    return {
      queryOptions: {
        searchDateType: this.$route.query.searchDateType || 'CREATED_DATE',
        startDate: this.$route.query.startDate || '',
        endDate: this.$route.query.endDate || '',
        type: this.$route.query.type || 'NORMAL',
        kinds: 'EXHIBITION',
        state: typeof this.$route.query.state === 'string' ? [this.$route.query.state] : this.$route.query.state || [],
        text: this.$route.query.text || '',
        size: Number(this.$route.query.size) || 20,
        page: Number(this.$route.query.page) || 0
      },
      tableData: null
    };
  },
  async fetch() {
    await this.$router
      .replace({
        path: this.$route.path,
        query: this.queryOptions
      })
      .catch(() => {});

    this.tableData = await this.$axios
      .$get('/admin/tickets', {
        params: {
          ...this.queryOptions,
          startDate: this.queryOptions.startDate ? `${this.queryOptions.startDate} 00:00:00` : '',
          endDate: this.queryOptions.endDate ? `${this.queryOptions.endDate} 23:59:59` : ''
        }
      })
      .then((tableData) => {
        tableData.content = tableData.content.map((item) => ({
          ...item,
          isChecked: false,
          isDisabled: !this.getIsCanRefund(item)
        }));
        tableData.startCount = tableData.totalElements - tableData.number * tableData.size;

        return tableData;
      });
  },
  methods: {
    getIsCanRefund(item) {
      const isInviteTicket = item.type === 'INVITE';
      const isCanNotRefundState =
        item.state === 'USER_REFUND' || item.state === 'ADMIN_REFUND' || item.state === 'USED';

      return !(isInviteTicket || isCanNotRefundState);
    },
    onPage(page) {
      if (!this.$fetchState.pending) {
        this.queryOptions.page = page;
        this.$fetch();
      }
    },
    onSearch() {
      if (!this.$fetchState.pending) {
        this.$fetch();
      }
    }
  }
};
</script>
