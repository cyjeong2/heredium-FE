<template>
  <Nuxt />
</template>

<script>
import '~/assets/style/admin/style.scss';

export default {
  name: 'AdminNoneLayout',
  head() {
    return {
      title: '헤레디움(관리자)'
    };
  }
};
</script>
