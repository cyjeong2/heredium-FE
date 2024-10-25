<template>
  <div class="container">
    <template v-if="errReason">
      <h1>결제에 실패하였습니다.</h1>
      <h2>결제 실패 메세지: {{ errReason }}</h2>
    </template>
    <template v-else>
      <h1>{{ paymentData.kind === 'COFFEE' ? '주문이 완료되었습니다.' : '예매가 확정되었습니다.' }}</h1>
      <h2>{{ paymentData.title }}</h2>
      <div class="info-wrap">
        <div class="row">
          <div class="label">{{ paymentData.kind === 'COFFEE' ? '주문' : '입장권' }} 아이디</div>
          <div class="content">{{ paymentData.uuid }}</div>
        </div>
        <div class="row">
          <div class="label">{{ paymentData.kind === 'COFFEE' ? '수령' : '입장' }} 일시</div>
          <div class="content">{{ getTicketDateFormat() }}</div>
        </div>
        <div class="row">
          <div class="label">금액</div>
          <div class="content">{{ paymentData.price.toLocaleString() }}원</div>
        </div>
        <div class="row">
          <div class="label">예매 내역</div>
          <div class="content">
            <span v-for="(item, index) in paymentData.prices" :key="item.type">
              {{ item.type }} <b>{{ item.number }}</b
              >{{ paymentData.prices.length - 1 === index ? '' : ', ' }}
            </span>
          </div>
        </div>
      </div>
      <div class="btn-area">
        <UButton button-type="secondary" @click="goMore"
          >{{ paymentData.kind === 'COFFEE' ? '주문 계속하기' : '전시·프로그램 둘러보기' }}
        </UButton>
        <UButton @click="goCheck">{{ paymentData.kind === 'COFFEE' ? '주문' : '예매' }} 확인하기</UButton>
      </div>
    </template>
  </div>
</template>

<script>
import UButton from '~/components/user/common/UButton.vue';
import payMixin from '~/store/tosspaymentsMixin';
import { dayOfWeekNumberToKoName } from '~/assets/js/converter';

export default {
  name: 'TicketingResult',
  components: { UButton },
  mixins: [payMixin],
  asyncData({ query, params, redirect, store }) {
    const isFreeResult = !!query?.free;
    let errReason = '';
    let paymentData = null;
    let userType;

    if (query.errReason) {
      errReason = query.errReason;
    } else if (!isFreeResult) {
      if (!query.paymentDataJSON) {
        redirect('/ticketing');
      }

      paymentData = JSON.parse(query.paymentDataJSON);
    } else if (isFreeResult && params && params.data) {
      paymentData = params.data;
    } else {
      redirect('/ticketing');
    }

    if (query.userType === 'hana' || store.getters['service/hana/getIsHanaPay']) {
      userType = 'hana';
    } else if (query.userType === 'non-member' || store.getters['service/non-member-list/getHanaDecryptData']) {
      userType = 'non-member';
    }

    return { paymentData, errReason, userType };
  },
  data() {
    return {
      paymentData: null,
      errReason: null,
      userType: false,
      hanaData: null,
      nonMemberData: null
    };
  },
  created() {
    if (this.userType === 'hana') {
      this.$store.commit('service/hana/setIsHanaPay', true);
      this.$store.commit('service/hana/setTargetData', { title: this.paymentData.title });
    }
  },
  beforeDestroy() {
    this.$store.dispatch('service/non-member-pay/clearState');
    this.$store.dispatch('service/hana/clearHanaStore');
    localStorage.removeItem('nonMemberData');
    localStorage.removeItem('hanaQueryData');
    localStorage.removeItem('hanaEncryptData');
  },
  methods: {
    getTicketDateFormat() {
      const { startDate, endDate } = this.paymentData;
      const targetDate = this.$dayjs(startDate).format('YYYY-MM-DD');
      const weekOfDay = dayOfWeekNumberToKoName(this.$dayjs(startDate).day());
      const startTime = this.$dayjs(startDate).format('HH:mm');
      const endTime = this.$dayjs(endDate).format('HH:mm');

      return `${targetDate} (${weekOfDay}) ${startTime} - ${endTime}`;
    },
    goMore() {
      const url = this.paymentData.kind === 'COFFEE' ? '/coffee' : '/ticketing';

      this.$router.push(url);
    },
    goCheck() {
      let url = '/order-list';

      if (this.userType === 'non-member') {
        const nonMemberData = JSON.parse(localStorage.getItem('nonMemberData'));

        this.$store.commit('service/non-member-list/setKind', 'NON_MEMBER');
        this.$store.commit('service/non-member-list/setUserData', nonMemberData);
      } else if (this.userType === 'hana') {
        const hanaQueryData = JSON.parse(localStorage.getItem('hanaQueryData'));
        const hanaDecryptData = JSON.parse(localStorage.getItem('hanaEncryptData'));

        this.$store.commit('service/non-member-list/setKind', 'HANA');
        this.$store.commit('service/non-member-list/setHanaQueryData', hanaQueryData);
        this.$store.commit('service/non-member-list/setHanaDecryptData', hanaDecryptData);
      } else {
        url = this.paymentData.kind === 'COFFEE' ? '/mypage/purchase/coffee' : '/mypage/purchase/all';
      }

      this.$router.push(url);
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  font-style: normal;
  font-weight: 700;
  font-size: 2.4rem;
  line-height: 160%;
  text-align: center;
  letter-spacing: -1px;
  margin-top: 3.2rem;
  margin-bottom: 2rem;
}

h2 {
  font-weight: 700;
  font-size: 18px;
  line-height: 100%;
  margin-bottom: 2.4rem;
  text-align: center;
}

.info-wrap {
  border-top: 1px solid var(--color-black);
  border-bottom: 1px solid var(--color-black);
  padding: 2.4rem 0;

  .row {
    display: flex;
    margin-bottom: 2rem;

    &:last-child {
      margin-bottom: 0;
    }

    .label {
      width: 8.3rem;
      font-weight: 700;
      font-size: 1.4rem;
      line-height: 100%;
      min-width: 8rem;
      margin-right: 1.7rem;
    }

    .content {
      flex: 1 0 0;
      font-weight: 400;
      font-size: 1.4rem;
      line-height: 100%;
    }
  }

  b {
    color: var(--color-u-primary);
    font-weight: 500;
  }
}

.btn-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1.6rem;
  margin-top: 4rem;
  margin-bottom: 12rem;

  button {
    min-height: 4.4rem;
    height: auto;
    word-break: keep-all;
    width: 100%;
    min-width: auto !important;
  }
}

@media screen and (min-width: 769px) {
  .container {
    max-width: 43.6rem;
  }

  h1 {
    font-size: 4.2rem;
    line-height: 150%;
    margin-top: 12.4rem;
    margin-bottom: 2.4rem;
  }

  h2 {
    font-weight: 700;
    font-size: 2rem;
    line-height: 150%;
    margin-bottom: 3.6rem;
  }

  .info-wrap {
    padding: 2.8rem 0;

    .row {
      margin-bottom: 1.6rem;

      .label {
        font-size: 1.6rem;
        line-height: 160%;
        width: 9.5rem;
        margin-right: 2.1rem;
      }

      .content {
        font-size: 1.6rem;
        line-height: 160%;
      }
    }
  }

  .btn-area {
    grid-column-gap: 1.6rem;
    margin-top: 3.6rem;
    margin-bottom: 16.2rem;

    button {
      height: 5.2rem;
      font-size: 1.8rem;
      font-weight: 500;
      width: 100%;
      padding: 0;
      letter-spacing: -0.5px;
    }
  }
}
</style>
