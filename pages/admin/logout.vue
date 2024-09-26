<template>
  <div>로그아웃</div>
</template>

<script>
export default {
  name: 'AuthLogout',
  layout: 'none',
  created() {
    this.$store.commit('service/auth/setAdminAccessToken', null);
    this.$router.push('/admin/login');
  }
};
</script>
