<template>
  <PurchaseAllList
    :year-options="yearOptionList"
    :list-data="listData"
    :page-type="pageType"
    :query-options="queryOptions"
    @changePage="onChangePage"
    @changeYear="onChangeYear"
    @goDetail="setSessionData"
  />
</template>

<script>
import PurchaseAllList from '~/components/user/page/PurchaseAllList';
const PAGE_TYPE = 'ALL';
export default {
  name: 'MyPagePurchaseAllListPage',
  components: { PurchaseAllList },
  async asyncData({ $axios, query }) {
    const yearOptionList = await $axios.$get(`/user/account/tickets/year`, {
      params: {
        kinds: ['EXHIBITION', 'PROGRAM']
      }
    });

    query.year = yearOptionList[0];

    return { yearOptionList };
  },
  data() {
    return {
      pageType: PAGE_TYPE,
      listData: null,
      yearOptionList: null,
      queryOptions: {
        page: this.$route.query.page || '0',
        year: Number(this.$route.query.year) || null
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
    this.listData = await this.$axios.$get('/user/account/tickets', {
      params: {
        ...this.queryOptions,
        size: 10,
        kinds: ['EXHIBITION', 'PROGRAM']
      }
    });

    if (process.client) {
      this.$nextTick(() => {
        this.setScrollY();
      });
    }
  },
  methods: {
    onChangePage(page) {
      if (!this.$fetchState.pending) {
        this.setSessionData(true);
        this.queryOptions.page = page;
        this.$fetch();
      }
    },
    onChangeYear(year) {
      if (!this.$fetchState.pending) {
        this.setSessionData(true);
        this.queryOptions.page = 0;
        this.queryOptions.year = year;
        this.$fetch();
      }
    },
    setSessionData(isReset) {
      const saveData = JSON.stringify({
        scrollY: isReset ? 0 : window.scrollY
      });

      sessionStorage.setItem(this.$route.path, saveData);
    },
    setScrollY() {
      const sessionData = sessionStorage.getItem(this.$route.path);

      if (sessionData && window) {
        const savedData = JSON.parse(sessionData);

        window.scrollTo(0, savedData.scrollY);
        sessionStorage.removeItem(this.$route.path);
      }
    }
  }
};
</script>
