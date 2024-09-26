<template>
  <div class="container" />
</template>

<script>
export default {
  name: 'InicisProcess',
  asyncData({ req }) {
    const body = req.body;
    return { body };
  },
  data() {
    return {
      body: null
    };
  },
  mounted() {
    const response = this.$axios
      .$post('/user/tickets', { ...this.body, isMobile: this.$route.query.m === 'true' })
      .catch((err) => {
        console.log(err);
      });
    console.log(response);
  }
};
</script>
