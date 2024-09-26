<template>
  <div />
</template>

<script>
export default {
  name: 'HanaPayEntry',
  layout: 'none',
  async asyncData({ redirect, $axios, query }) {
    let hanaDecryptData;
    let hanaQuery;
    let url = '';

    if (process.client) {
      redirect('/');
    }
    if (process.server) {
      // type: exhibition | program | coffee
      if (!query.message || !query.mac || !query.nonce || !query.type || !query.id) {
        redirect('/');
      }
      url = `/ticketing/${query.type.toLowerCase()}/${query.id}`;
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

    return { hanaDecryptData, hanaQuery, url };
  },
  data() {
    return {
      hanaDecryptData: null,
      hanaQuery: null,
      url: ''
    };
  },
  mounted() {
    this.$store.dispatch('service/auth/adminLogout');
    if (this.hanaDecryptData) {
      this.$store.commit('service/hana/setHanaInfo', this.hanaDecryptData);
      this.$store.commit('service/hana/setIsHanaPay', true);
      this.$store.commit('service/hana/setHanaQuery', this.hanaQuery);
      this.$router.replace(this.url);
    }
  }
};
</script>

<style scoped lang="scss"></style>
