<template>
  <div></div>
</template>

<script>
export default {
  name: 'ConfirmPayment',
  layout: 'none',
  asyncData({ req }) {
    const requestBody = req?.body || null;
    return {
      paymentData: requestBody
    };
  },
  data() {
    return {
      paymentData: null
    };
  },
  created() {},
  mounted() {
    const paymentMethod = this.$route.query?.['payment-type'] || 'TOSSPAYMENTS';
    switch (paymentMethod) {
      case 'TOSSPAYMENTS':
        this.handleConfirmPaymentViaTossPay(paymentMethod);
        break;
      case 'TOSSPAYMENTS_IOS':
        this.handleConfirmPaymentViaTossPay(paymentMethod);
        break;
      case 'TOSSPAYMENTS_ANDROID':
        this.handleConfirmPaymentViaTossPay(paymentMethod);
        break;
      case 'NICEPAYMENTS':
        this.handleConfirmPaymentViaNicePay();
        break;
    }
  },
  methods: {
    handleConfirmPaymentViaNicePay() {
      if (!this.paymentData) {
        this.$router.push(`/payment/error`);
        return null;
      }
      if (Number(this.paymentData?.authResultCode) === '0000') {
        this.$router.push(`/payment/error?error=${this.paymentData?.authResultMsg}`);
        return null;
      }
      this.handleConfirmPayment(
        this.paymentData.orderId,
        this.paymentData.tid,
        this.paymentData.amount,
        'NICEPAYMENTS'
      );
    },
    handleConfirmPaymentViaTossPay(paymentMethod) {
      const { orderId, paymentKey, amount } = this.$route.query;
      if (!orderId || !paymentKey || !amount) {
        this.$router.push(`/payment/error?error=잘못 된 접근 입니다.`);
        return null;
      }
      this.handleConfirmPayment(orderId, paymentKey, amount, paymentMethod);
    },
    handleConfirmPayment(orderId, paymentKey, amount, paymentMethod) {
      this.$axios
        .post('/user/membership/confirm-payment', {
          payRequest: {
            orderId,
            paymentKey,
            amount,
            type: paymentMethod
          }
        })
        .then(() => {
          this.$router.push('/mypage/purchase/membership');
        })
        .catch((err) => {
          const errorMessage = err.response.data?.MESSAGE || '';
          this.$router.push(`/payment/error?error=${errorMessage}`);
        });
    }
  }
};
</script>
