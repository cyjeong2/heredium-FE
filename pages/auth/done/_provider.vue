<template><ULoader /></template>

<script>
import ULoader from '~/components/user/common/ULoader.vue';

export default {
  name: 'AuthDoneProvider',
  components: { ULoader },
  layout: 'none',
  asyncData({ req, params, query, redirect }) {
    if (!params.provider) {
      redirect('/auth/login');
    }
    const code = query.code || req.body?.code;

    return { provider: params.provider, code };
  },
  data() {
    return {
      code: '',
      provider: ''
    };
  },
  async mounted() {
    const code = this.code;
    const provider = this.provider;

    await this.$axios
      .$post(`/oauth2/${provider}`, null, { params: { code } })
      .then(async (loginToken) => {
        const { token, isSleeper, name } = loginToken;

        if (isSleeper) {
          await this.$router.push({ name: 'auth-login', params: { token }, query: { name } });
        } else {
          this.$store.commit('service/auth/setAccessToken', token);
          const userInfo = await this.$axios.$get('/user/account/info').catch(() => {});
          this.$store.commit('service/auth/setUserInfo', userInfo);
          await this.$router.push(this.$store.state.deviceInfo.isApp ? '/app' : '/');
        }
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.MESSAGE || '';
        const snsToken = err.response?.data?.BODY || '';

        if (errorMessage === 'USER_NOT_FOUND') {
          this.$router.push({
            name: 'auth-sns-terms-agree',
            params: { snsToken, provider: this.provider }
          });
        } else {
          this.$router.push('/auth/login');
        }

        return null;
      });
  }
};
</script>
