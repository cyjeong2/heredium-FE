// 이 파일을 사용되지 않습니다.
// 토스페이를 삽입하기 이전에 이니시스 결제 모듈이 고려되어서 테스트용으로 미리 만들어진 파일 입니다.
// 차후 이니시스 모듈을 재사용 할 수도 있다는 이야기가 있어 파일은 잔존시켜두었습니다.
export default {
  head() {
    return {
      script: [
        { src: 'https://stgstdpay.inicis.com/stdjs/INIStdPay.js' }
        // { src: 'https://stdpay.inicis.com/stdjs/INIStdPay.js' } //운영 js
      ]
    };
  },
  data() {
    return {
      tossPayments: null
    };
  },
  methods: {
    async requestPayment(data, totalPrice, type) {
      const apiUrl =
        type === 'member'
          ? '/user/tickets/user/valid'
          : type === 'non-member '
          ? '/user/tickets/non-user/valid'
          : '/user/tickets/hana-bank/valid';
      const paymentData = await this.$axios.$post(apiUrl, data).catch((err) => {
        const errorMessage = err.response.data?.MESSAGE || '';

        if (errorMessage === 'BAD_VALID') {
          const state = err.response.data.STATE;

          if (state === 1) {
            alert('구매가능한 티켓 4개 초과');
          } else if (state === 2) {
            alert('회차가 전시 시작일과 종료일 사이에 존재하지 않음');
          } else if (state === 3) {
            alert('예매 오픈일이 지나지 않았거나 회차 시작일이 2주 미만인 티켓이 아님');
          } else if (state === 4) {
            alert('회차 종료 1시간 전까지만 예매가능');
          } else if (state === 5) {
            alert('매진된 회차');
          }
        } else {
          alert('알수없는 오류. 다시 시도해주세요.');
        }
      });

      if (!paymentData) {
        return;
      }

      if (paymentData.price !== totalPrice) {
        alert('가격이 일치하지 않습니다.');
        return;
      }

      if (this.$store.state.deviceInfo.isMobile) {
        const payFormData = {
          P_NEXT_URL: `${window.location.origin}/ticketing/inicis-process?m=true`,
          P_INI_PAYMENT: 'Card',
          P_MID: paymentData.mid,
          P_OID: paymentData.oid,
          P_GOODS: paymentData.goodName,
          P_AMT: paymentData.price,
          P_UNAME: paymentData.buyerName,
          P_CHARSET: 'utf8',
          P_NOTI: paymentData.oid
        };
        this.insertFormInput(payFormData).submit();
      } else {
        const payFormData = {
          version: '1.0', //	전문 버전 ["1.0" 고정]
          gopaymethod: 'Card', //	요청지불수단
          mid: paymentData.mid, //	상점아이디
          oid: paymentData.oid, //	주문번호 * 반드시 Unique 값으로 생성 (거래추적 시 사용됨)
          price: paymentData.price, //	결제금액
          timestamp: paymentData.timestamp, //	타임스템프 [TimeInMillis(Long형)]	20
          signature: paymentData.signature, //	SHA256 Hash값 [대상: oid, price, timestamp]   HASH	64
          mKey: paymentData.mkey, //	SHA256 Hash값 [대상: mid 와 매칭되는 signkey]   HASH	64
          currency: 'WON', //	통화구분 ["WON":한화,"USD":달러]
          goodname: paymentData.goodName, //	상품명 * 40Byte 초과 요청시 37Byte + ...으로 자동 변환
          buyername: paymentData.buyerName, //	구매자명 * 30Byte 초과 요청시 30Byte로 자동 변환
          buyertel: paymentData.buyerTel, //	구매자 휴대폰번호 * 숫자와 "-" 만 허용
          buyeremail: paymentData.buyerEmail, //	구매자 이메일주소 * "@", "." 외 특수문자 입력불가
          returnUrl: `${window.location.origin}/ticketing/inicis-process?m=false`, //	결과수신 URL	N/A
          merchantData: null //		가맹점 임의 데이터 (인증결과수신 구간에서 전달) * 한글 입력불가, 한글입력은 urlencode 필수
        };
        this.insertFormInput(payFormData);
        window.INIStdPay.pay('inicis_pay');
      }
    },
    insertFormInput(payFormData) {
      let payForm = document.querySelector('#inicis_pay');
      if (payForm) {
        payForm.innerHTML = '';
      } else {
        payForm = document.createElement('form');
        payForm.setAttribute('method', 'post');
        payForm.setAttribute('id', 'inicis_pay');
        payForm.setAttribute('style', 'display: none');
        if (this.$store.state.deviceInfo.isMobile) {
          payForm.setAttribute('action', 'https://mobile.inicis.com/smart/payment/');
          payForm.setAttribute('accept-charset', 'euc-kr');
        } else {
          payForm.setAttribute('action', '');
        }
        document.getElementsByTagName('body')[0].appendChild(payForm);
      }

      for (const [key, value] of Object.entries(payFormData)) {
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', key);
        input.setAttribute('value', value);
        payForm.appendChild(input);
      }
      return payForm;
    }
  }
};
