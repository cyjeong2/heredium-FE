<template>
  <div>
    <form ref="form" name="form_chk" method="post">
      <input type="hidden" name="m" value="checkplusService" />
      <input type="hidden" name="recvMethodType" value="get" />
      <input type="hidden" name="email" :value="email" />
      <input type="hidden" name="EncodeData" :value="encodeData" />
    </form>
  </div>
</template>

<script>
export default {
  name: 'NicePopup',
  layout: 'none',
  asyncData({ req }) {
    const encodeData = req.body.EncodeData;
    const email = req.body.email;
    // console.log(req.body);
    return { encodeData, email };
  },
  data() {
    return {
      open: '',
      email: '',
      encodeData: ''
    };
  },
  mounted() {
    const form = this.$refs.form;
    form.action = 'https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb';
    form.submit();
  }
};
</script>

<style scoped lang="scss"></style>
