<template><div /></template>
<script>
export default {
  name: 'HanaListEntry',
  layout: 'none',
  async asyncData({ redirect, $axios, query }) {
    let hanaDecryptData;
    let hanaQuery;

    if (process.client) {
      redirect('/');
    }
    if (process.server) {
      if (!query.message || !query.mac || !query.nonce) {
        redirect('/');
      }
      hanaQuery = {
        message: decodeURIComponent(query.message),
        mac: decodeURIComponent(query.mac),
        nonce: decodeURIComponent(query.nonce)
      };
      hanaDecryptData = await $axios.$post('/user/hana-bank/info', hanaQuery).catch((e) => {
        console.log(e);
        // BAD_REQUEST : 잘못된 복호화 데이터
        // TIMEOUT : 30분이 지난 복호화 데이터
      });
    }

    return { hanaDecryptData, hanaQuery };
  },
  data() {
    return {
      hanaDecryptData: null,
      hanaQuery: null
    };
  },
  mounted() {
    this.$store.dispatch('service/auth/adminLogout');
    this.$store.commit('service/non-member-list/setHanaQueryData', this.hanaQuery);
    this.$store.commit('service/non-member-list/setHanaDecryptData', this.hanaDecryptData);
    this.$store.commit('service/non-member-list/setKind', 'HANA');
    this.$router.push('/order-list');
  }
};
</script>
