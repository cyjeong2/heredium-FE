<template>
  <PurchaseList :list-data="listData" :page-type="pageType" @changePage="onChangePage" @goDetail="setSessionData" />
</template>

<script>
import PurchaseList from '~/components/user/page/PurchaseList';
const PAGE_TYPE = 'COFFEE';
export default {
  name: 'PurchaseCoffeePage',
  components: { PurchaseList },
  data() {
    return {
      listData: null,
      pageType: PAGE_TYPE,
      queryOptions: {
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
    this.listData = await this.$axios.$get('/user/account/tickets', {
      params: {
        ...this.queryOptions,
        size: 10,
        kinds: 'COFFEE'
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

<style lang="scss" scoped></style>
