<template>
  <div></div>
</template>

<script>
export default {
  name: 'NiceUserSuccessPage',
  mounted() {
    if (this.$route.query.returnUrl) {
      this.$router.replace({
        name: this.$route.query.returnUrl,
        params: {
          ...this.$route.query
        }
      });
    } else {
      this.$router.replace('/');
    }
  }
};
</script>

<style scoped lang="scss"></style>
