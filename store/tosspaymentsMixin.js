export default {
  head() {
    return {
      script: [{ src: 'https://js.tosspayments.com/v1/payment' }]
    };
  },
  data() {
    return {
      tossPayments: null,
      error: null,
      payType: '',
      urlSuccess: ''
    };
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
      this.initPayments();

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

      if (!paymentData) {
        return;
      }

      if (paymentData.amount !== totalPrice) {
        alert('가격이 일치하지 않습니다.');
        return;
      }

      // 이 mixin의 this.tossPayments인 점 유의.
      // 토스페이 모듈이 정한 값대로 아래 값을 넣음.
      await this.tossPayments
        .requestPayment('카드', {
          amount: paymentData.amount,
          orderId: paymentData.uuid,
          orderName: paymentData.title.substring(0, 100),
          customerName: paymentData.name,
          customerEmail: paymentData.email,
          cardInstallmentPlan: 0,
          successUrl: `${window.location.origin}/ticketing/tosspayments-process?type=${originInfo.type}&id=${originInfo.id}&userType=${userType}`,
          failUrl
        })
        .catch((error) => {
          if (error.code === 'USER_CANCEL') {
            // 결제 고객이 결제창을 닫았을 때 에러 처리
          }
        });
    },
    async membershipPayment(uuid, amount) {
      this.initPayments();
      const invalidPaymentData = !uuid || !amount || !this.tossPayments;
      if (invalidPaymentData) {
        alert('결제 오류');
        return;
      }

      const userInfo = this.$store.getters['service/auth/getUserInfo'];

      // console.log('this.deviceInfo', this.$store.state.deviceInfo);
      // console.log('this.payType', this.payType);
      this.urlSuccess = `${window.location.origin}/payment/confirm-payment-membership?payment-type=${this.payType}`;
      await this.tossPayments
        .requestPayment('카드', {
          amount,
          orderId: uuid,
          orderName: 'Payment for register membership',
          customerName: userInfo.name || '',
          customerEmail: userInfo.email || '',
          cardInstallmentPlan: 0,
          successUrl: `${window.location.origin}/payment/confirm-payment-membership?payment-type=${this.payType}`,
          failUrl: `${window.location.origin}/membership/registration`
        })
        .catch((err) => {
          const errorString = String(err);
          // console.log('🚀 ~ membershipPayment ~ errorString:', errorString);
          switch (errorString) {
            case 'Error: 결제가 취소되었습니다.':
              break;

            default:
              this.$router.push('/payment/error');
              break;
          }
        });
    },
    initPayments() {
      let payType = 'TOSSPAYMENTS';
      if (!this.tossPayments) {
        let clientKey = process.env.TOSSPAYMENTS_CLIENT_KEY;
        if (this.$store.state.deviceInfo.isApp) {
          if (this.$store.state.deviceInfo.isIOS) {
            payType = 'TOSSPAYMENTS_IOS';
            clientKey = process.env.TOSSPAYMENTS_IOS_CLIENT_KEY;
          } else if (this.$store.state.deviceInfo.isAndroid) {
            payType = 'TOSSPAYMENTS_ANDROID';
            clientKey = process.env.TOSSPAYMENTS_ANDROID_CLIENT_KEY;
          }
        }
        this.payType = payType;
        this.tossPayments = window.TossPayments(clientKey);
      }
    }
  }
};
