<template>
  <div class="container">
    <template v-if="detailData">
      <h1>{{ detailData.title }}</h1>
      <div class="img">
        <QrcodeVue :value="createQrValue" :size="172" level="H" />
      </div>
      <dl class="info">
        <dt>입장권 아이디</dt>
        <dd>{{ detailData.uuid }}</dd>
        <dt>입장 일시</dt>
        <dd>{{ getTicketDateFormat() }}</dd>
        <dt>예매 내역</dt>
        <dd>
          <span v-for="(item, index) in detailData.prices" :key="item.type">
            {{ item.type }} <b>{{ item.number }}</b
            >{{ detailData.prices.length - 1 === index ? '' : ', ' }}
          </span>
        </dd>
        <dt>상태</dt>
        <dd>
          <b>{{ getState(detailData.state) }}</b>
        </dd>
      </dl>
      <ul class="content bullet">
        <li>입장 시간을 꼭 지켜주시기 바랍니다.</li>
        <li>
          입장 마감 시간은 예매하신 관람시간부터 30분까지입니다. (예. 12시 회차 티켓 구매 시, 12시부터 12시 30분까지
          입장 가능)
        </li>
        <li>헤레디움 미술관에서 입장권 QR코드를 체크 후 입장 가능합니다.</li>
        <li>
          헤레디움 미술관에서 QR코드를 체크 후 입장 시 입장권은 <strong>사용완료</strong> 상태가 되어 재 사용할 수
          없습니다.
        </li>
        <li>선물받은 티켓은 구매자만 환불이 가능하며 환불할 경우 사용할 수 없습니다.</li>
        <li>입장일이 지나 “기간만료”상태가 된 티켓은 사용할 수 없습니다.</li>
        <li>궁금한 사항은 0507-1422-2075 로 문의해주시기 바랍니다.</li>
      </ul>
      <div class="bottom-img">
        <img class="thumbnail" :src="$store.state.BASE_URL + detailData.thumbnail.resizeImage.medium" alt="" />
        <NuxtLink to="/" target="_blank">
          <img class="logo" src="~assets/img/pc/logo.svg" alt="" />
        </NuxtLink>
      </div>
    </template>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue';
import { dayOfWeekNumberToKoName } from '~/assets/js/converter';
import { USER_PAYMENT_TYPE } from '~/assets/js/types';

export default {
  name: 'TicketQR',
  components: { QrcodeVue },
  layout: 'none',
  async asyncData({ query, $axios }) {
    const code = query.code;
    const detailData = await $axios.$get(`/user/tickets/info/${code}`).catch(() => {});

    return { code, detailData };
  },
  data() {
    return {
      code: null,
      detailData: null
    };
  },
  computed: {
    createQrValue() {
      const { id, uuid } = this.detailData;

      return uuid ? JSON.stringify({ id, uuid }) : '';
    }
  },
  mounted() {
    if (!this.code || !this.detailData) {
      alert('올바른 QR 코드가 아닙니다.');
      this.$router.push('/');
    }
  },
  methods: {
    getTicketDateFormat() {
      const { startDate, endDate } = this.detailData;
      const targetDate = this.$dayjs(startDate).format('YYYY-MM-DD');
      const weekOfDay = dayOfWeekNumberToKoName(this.$dayjs(startDate).day());
      const startTime = this.$dayjs(startDate).format('HH:mm');
      const endTime = this.$dayjs(endDate).format('HH:mm');

      return `${targetDate} (${weekOfDay}) ${startTime} ~ ${endTime}`;
    },
    getState(item) {
      return USER_PAYMENT_TYPE[item];
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  max-width: 50rem;
}

h1 {
  color: var(--color-default);
  padding: 1.6rem 2rem;
  font-size: 2rem;
  font-style: normal;
  font-weight: 700;
  line-height: 100%;
  letter-spacing: -0.05rem;
  margin: 0 -2rem;
  border-bottom: 1px solid var(--color-default);
}

.img {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6.4rem;
}

.info {
  display: grid;
  grid-template-columns: 9.8rem 1fr;
  row-gap: 1.2rem;
  padding: 2rem 0;
  margin-bottom: 5.6rem;
  border-top: 1px solid var(--color-u-grey-2);
  border-bottom: 1px solid var(--color-u-grey-2);

  dt {
    font-size: 1.4rem;
    font-style: normal;
    font-weight: 700;
    line-height: 160%;
    letter-spacing: -0.05rem;
  }
  dd {
    font-size: 1.4rem;
    font-style: normal;
    font-weight: 500;
    line-height: 160%; /* 2.24rem */
  }

  b {
    color: var(--color-u-primary);
    font-weight: 700;
  }
}

ul {
  margin-bottom: 6.4rem;

  li {
    font-size: 1.6rem;
    letter-spacing: -0.05rem;

    strong {
      color: var(--color-u-primary);
      font-weight: 500;
    }
  }

  li + li {
    margin-top: 0.6rem;
  }
}

.bottom-img {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 -2rem;

  .thumbnail {
    object-fit: cover;
    margin-bottom: 2rem;
    width: 100%;
  }

  .logo {
    width: 10rem;
    padding: 2rem 0;
  }
}
</style>
