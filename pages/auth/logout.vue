<template>
  <div />
</template>

<script>
export default {
  name: 'LogoutPage',
  layout: 'none',
  created() {
    this.$store.dispatch('service/auth/userLogout');
  },
  mounted() {
    this.$router.push(this.$store.state.deviceInfo.isApp ? '/app' : '/');
  }
};
</script>
