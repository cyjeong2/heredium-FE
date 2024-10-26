export default {
  head() {
    return {
      script: [{ src: 'https://pay.nicepay.co.kr/v1/js/' }]
    };
  },
  data() {
    return {};
  },
  methods: {
    getApiUrl(userType) {
      return userType === 'member'
        ? '/user/tickets/user/valid'
        : userType === 'non-member'
        ? '/user/tickets/non-user/valid'
        : '/user/tickets/hana-bank/valid';
    },
    async requestPayment(data, totalPrice, failUrl, originInfo, userType) {
      const apiUrl = this.getApiUrl(userType);
      const paymentData = await this.$axios.$post(apiUrl, data).catch((err) => {
        const errorMessage = err.response.data?.MESSAGE || '';

        if (errorMessage === 'BAD_VALID') {
          const state = err.response.data.STATE;

          if (state === 1) {
            this.feedbackMsg =
              userType === 'member'
                ? '구매가능한 티켓(4개)을 초과하였어요.'
                : `보유 중인 입장일이 동일한 입장권 : ${err.response.data.BODY}개\n` +
                  '입장일이 동일한 입장권은 최대 4매까지 구매 가능합니다.\n' +
                  '결제를 계속하시려면 구매 수를 변경하거나 입장 일을 다른 날짜로 선택해 주세요.';

            this.isTickedLimit = true;
            this.modal.isFeedback = true;
          } else if (state === 2) {
            this.feedbackMsg = '전시 시작일과 종료일 사이에 존재하지 않는 회차에요.';
            this.modal.isFeedback = true;
            alert('회차가 전시 시작일과 종료일 사이에 존재하지 않음');
          } else if (state === 3) {
            this.feedbackMsg = '예매 오픈일이 지나지 않았거나 회차 시작일이 2주 미만인 티켓이 아니에요.';
            this.modal.isFeedback = true;
          } else if (state === 4) {
            this.feedbackMsg = '회차 종료 1시간 전까지만 예매가 가능해요.';
            this.modal.isFeedback = true;
          } else if (state === 5) {
            this.feedbackMsg = '아쉽지만 선택한 회차가 매진되었어요. 덜 붐비는 회차는 어떠세요?';
            this.modal.isFeedback = true;
          }
        } else {
          alert('알수없는 오류. 다시 시도해주세요.');
        }
      });

      const invalidPaymentData = !paymentData || !paymentData.uuid || !paymentData.amount || !window.AUTHNICE;
      if (invalidPaymentData) {
        alert('결제 오류');
        return;
      }
      if (paymentData.amount !== totalPrice) {
        alert('가격이 일치하지 않습니다.');
        return;
      }

      window.AUTHNICE.requestPay({
        clientId: process.env.NICEPAY_CLIENT_ID,
        method: 'card',
        orderId: paymentData.uuid, // Unique Order ID
        amount: paymentData.amount,
        goodsName: process.env.NICEPAY_PRODUCT_NAME,
        returnUrl: `${window.location.origin}/ticketing/payment-gates-process?type=${originInfo.type}&id=${originInfo.id}&userType=${userType}`,
        fnError(error) {
          console.log('🚀 ~ fnError ~ 73 error:', error);
          if (failUrl) {
            window.location.replace(failUrl);
          } else {
            window.location.replace(`${window.location.origin}/payment/error?error=${error?.resultMsg || ''}`);
          }
        },
        fnSuccess(result) {
          console.log('🚀 ~ serverAuth ~ 81 fnSuccess', result);
        }
      });
    },
    membershipPayment(uuid, amount) {
      console.log('vao');
      const invalidPaymentData = !uuid || !amount || !window.AUTHNICE;
      if (invalidPaymentData) {
        alert('결제 오류');
        return;
      }
      window.AUTHNICE.requestPay({
        clientId: process.env.NICEPAY_CLIENT_ID,
        method: 'card',
        orderId: uuid, // Unique Order ID
        amount,
        goodsName: process.env.NICEPAY_PRODUCT_NAME,
        returnUrl: `${window.location.origin}/mypage/purchase/membership`,
        fnError(error) {
          console.log('🚀 ~ fnError ~ error 99:', error);
          window.location.replace(`${window.location.origin}/payment/error?error=${error?.resultMsg || ''}`);
        },
        fnSuccess(result) {
          console.log('🚀 ~ serverAuth ~ fnSuccess 103:', result);
          this.$axios
            .post('/user/membership/confirm-payment', {
              payRequest: {
                orderId: uuid,
                paymentKey: 'string',
                amount,
                type: 'TOSSPAYMENTS'
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
      });
    }
  }
};
