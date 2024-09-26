<template>
  <div></div>
</template>

<script>
export default {
  name: 'NiceSuccess',
  layout: 'none',
  data() {
    return {
      email: null,
      encodeData: null,
      findPwResult: null,
      token: null,
      userId: null
    };
  },
  async fetch() {
    if (this.$route.query.email) {
      const findPwResult = await this.$axios.get('/admin/auth/find/pw/phone', {
        params: {
          encodeData: this.$route.query.EncodeData,
          email: this.$route.query.email
        }
      });
      this.token = findPwResult.data;
    } else {
      const findIdResult = await this.$axios.get('/admin/auth/find/id', {
        params: {
          encodeData: this.$route.query.EncodeData
        }
      });
      this.userId = findIdResult.data;
    }
  },
  mounted() {
    const closePopup = () => {
      if (this.token) {
        window.opener.postMessage({ token: this.token, code: 'FIND_PW', state: 'SUCCESS' }, '*');
        window.close();
      } else if (this.userId) {
        window.opener.postMessage({ id: this.userId, code: 'FIND_ID', state: 'SUCCESS' }, '*');
        window.close();
      } else {
        this.$router.push('/nice/nice-failure');
      }
    };

    closePopup();
  }
};
</script>

<style scoped lang="scss"></style>
