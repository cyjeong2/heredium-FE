<template>
  <div></div>
</template>

<script>
export default {
  name: 'NiceFailure',
  layout: 'none',
  mounted() {
    const closePopup = () => {
      const windowLocation = window.location;
      opener.location.href = `${windowLocation.protocol}//${windowLocation.host}/admin/password-not-found`;
      window.close();
    };

    closePopup();
  }
};
</script>

<style scoped lang="scss"></style>
