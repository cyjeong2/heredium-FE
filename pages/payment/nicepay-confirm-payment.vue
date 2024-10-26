<template>
  <div />
</template>

<script>
export default {
  name: 'ConfirmPayment',
  layout: 'none',
  asyncData({ req }) {
    const requestBody = req?.body || null;
    return {
      paymentData:
        {
          amount: '100',
          authResultCode: '0000',
          authResultMsg: '인증 성공',
          authToken: 'NICEUNTT615D7F1E74A05FE84AB1F44AF9DD4E98',
          clientId: 'S2_f43c2b9aabd54f59a75a11d47c3987f0',
          orderId: '3ed5a3d3-e13f-46f6-9896-40ac17e9527d',
          signature: '0f04f2138353ab4d34ab0beeb46394b5d0edb83cab5c5f0f90c1bbd63eb3e150',
          tid: 'UT0016010m01012410261951172417'
        } || requestBody
    };
  },
  data() {
    return {
      paymentData: null
    };
  },
  created() {},
  mounted() {
    this.handleConfirmPayment();
  },
  methods: {
    handleConfirmPayment() {
      if (!this.paymentData) {
        this.$router.push(`/payment/error`);
        return null;
      }
      console.log('fghjk', typeof this.paymentData, this.paymentData);
      if (Number(this.paymentData?.authResultCode) === '0000') {
        this.$router.push(`/payment/error?error=${this.paymentData?.authResultMsg}`);
        return null;
      }
      this.$axios
        .post('/user/membership/confirm-payment', {
          payRequest: {
            orderId: this.paymentData.orderId,
            paymentKey: this.paymentData.tid,
            amount: this.paymentData.amount,
            type: 'NICEPAYMENTS'
          }
        })
        .then(() => {
          this.$router.push('/mypage/purchase/membership');
        })
        .catch((err) => {
          const errorMessage = err.response.data?.MESSAGE || '';
          console.log('🚀 ~ fnSuccess ~ errorMessage 118:', errorMessage);
          this.$router.push(`/payment/error?error=${errorMessage}`);
        });
    }
  }
};
</script>
