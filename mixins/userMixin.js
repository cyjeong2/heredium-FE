export const userMixin = {
  methods: {
    checkUserLogin(option) {
      if (!this.checkLogged()) {
        const callbackUrl = option?.callbackUrl;
        if (callbackUrl) {
          this.$router.replace(`/auth/login?redirectPage=${callbackUrl}`);
        } else {
          this.$router.replace(`/auth/login`);
        }
        return false;
      }
      return true;
    },
    checkLogged() {
      return !!this.getAccessToken();
    },
    getAccessToken() {
      return this.$store.getters['service/auth/getAccessToken'];
    }
  }
};
