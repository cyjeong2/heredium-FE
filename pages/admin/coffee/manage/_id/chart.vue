<template>
  <div>
    <div class="top">
      <NuxtLink :to="`/admin/coffee/manage/${id}`" class="prev-page">
        <i class="ic-arrow-left" />
      </NuxtLink>
      <STitle emoji="chart">판매 통계</STitle>
      <div>
        <SDatepicker v-model="startDate" :max="endDate" @input="getSummaryData" />
        <span class="tilde-div">~</span>
        <SDatepicker v-model="endDate" :min="startDate" @input="getSummaryData" />
      </div>
    </div>
    <div class="two-grid mb-36">
      <div class="summary">
        <h3 class="mb-16">개요</h3>
        <div v-if="summaryData" class="summary-wrap">
          <div class="summary-top mb-24">
            <div class="left">
              수령<b class="nt-1">{{ getThreeCommaNum(summaryData.visitNumber) }}</b>
              <span>명</span>
              <SDivLine />
              총 예매<b class="nt-1">{{ getThreeCommaNum(summaryData.bookingNumber) }}</b>
              <span>명</span>
            </div>
            <div class="right">
              <span class="nt-1">{{ getThreeCommaNum(summaryData.totalPrice) }}</span
              >원
            </div>
          </div>
          <div class="info-table">
            <div class="row all-title">
              <div>옵션</div>
              <div>개별 단가</div>
              <div>판매</div>
              <div>취소</div>
              <div>판매 금액</div>
            </div>
            <div v-for="(item, index) in summaryData.ticketPriceInfo" :key="index" class="row all-contents">
              <div>{{ item.type }}</div>
              <div>{{ item.unitPrice ? getThreeCommaNum(item.unitPrice) + '원' : '-' }}</div>
              <div>{{ item.saleNumber ? getThreeCommaNum(item.saleNumber) + '명' : '-' }}</div>
              <div>{{ item.refundNumber ? getThreeCommaNum(item.refundNumber) + '명' : '-' }}</div>
              <div>{{ item.totalPrice ? getThreeCommaNum(item.totalPrice) + '원' : '-' }}</div>
            </div>
          </div>
        </div>
      </div>
      <ChartByPurchaseOptions :ex-start-date="exStartDate" :ex-end-date="exEndDate" kind="EXHIBITION" :kind-id="id" />
    </div>
    <ChartByPeriod
      :ex-start-date="exStartDate"
      :ex-end-date="exEndDate"
      kind="EXHIBITION"
      :kind-id="id"
      is-hide-sign-up
      class="mb-36"
    />
    <ChartByDay
      :ex-start-date="exStartDate"
      :ex-end-date="exEndDate"
      kind="EXHIBITION"
      :kind-id="id"
      is-hide-sign-up
      class="mb-36"
    />
    <ChartByTime
      :ex-start-date="exStartDate"
      :ex-end-date="exEndDate"
      kind="EXHIBITION"
      :kind-id="id"
      is-hide-sign-up
    />
  </div>
</template>

<script>
import STitle from '~/components/admin/commons/STitle.vue';
import SDatepicker from '~/components/admin/commons/SDatepicker.vue';
import ChartByPurchaseOptions from '~/components/admin/chart/ChartByPurchaseOptions.vue';
import SDivLine from '~/components/admin/commons/SDivLine.vue';
import ChartByPeriod from '~/components/admin/chart/ChartByPeriod.vue';
import ChartByDay from '~/components/admin/chart/ChartByDay.vue';
import ChartByTime from '~/components/admin/chart/ChartByTime.vue';
import { threeCommaNum } from '~/assets/js/commons';

export default {
  name: 'ChartPage',
  components: { ChartByTime, ChartByDay, ChartByPeriod, SDivLine, ChartByPurchaseOptions, SDatepicker, STitle },
  layout: 'admin/default',
  asyncData({ params }) {
    return { id: Number(params.id) };
  },
  data() {
    return {
      id: null,
      startDate: this.$dayjs().subtract(6, 'd').format('YYYY-MM-DD'),
      endDate: this.$dayjs().format('YYYY-MM-DD'),
      summaryData: null
    };
  },
  async fetch() {
    this.summaryData = await this.$axios.$get('/admin/statistics/summary', {
      params: { startDate: this.exStartDate, endDate: this.exEndDate, kind: 'COFFEE', kindId: this.id }
    });
  },
  computed: {
    exStartDate() {
      return this.startDate ? this.$dayjs(this.startDate).format('YYYY-MM-DD 00:00:00') : '';
    },
    exEndDate() {
      return this.endDate ? this.$dayjs(this.endDate).format('YYYY-MM-DD 23:59:59') : '';
    }
  },
  methods: {
    getThreeCommaNum(num) {
      return threeCommaNum(num);
    },
    getSummaryData() {
      if (this.startDate && this.endDate && !this.$fetchState.pending) {
        this.$fetch();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.top {
  display: flex;
  align-items: center;
  margin-bottom: 1.7rem;

  .prev-page {
    margin-right: 2.2rem;

    > i {
      font-size: 4.8rem;
    }
  }

  h1 {
    margin-bottom: 0;
    margin-right: 3rem;
  }
}

.two-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2.8rem;
}

.tilde-div {
  font-size: 1.3rem;
  font-weight: 500;
  margin: 0 0.8rem;
}

.summary {
  display: flex;
  flex-direction: column;

  .summary-wrap {
    flex: 1 0 auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: var(--color-white);
    border-radius: 0.3rem;
    border: 1px solid var(--color-grey-2);
    padding: 2.8rem 3.2rem;

    .summary-top {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    .left {
      font-weight: 500;
      font-size: 1.6rem;

      .nt-1 {
        margin-left: 1.6rem;
      }
    }

    .right {
      font-weight: 500;
      font-size: 1.6rem;

      .nt-1 {
        color: var(--color-blue);
        margin-right: 0.4rem;
      }
    }
  }

  .info-table .row {
    & > *:first-child {
      border-left: 1px solid var(--color-grey-2);
    }

    &.all-title {
      height: 4.4rem;

      > * {
        color: var(--color-grey-4);
        background-color: #fafafa;
        justify-content: center;
        font-size: 1.4rem;
        font-weight: 500;
        min-height: auto;
        border-right: 1px solid var(--color-grey-2);

        &:last-child {
          border-right: 0;
        }
      }
    }

    &.all-contents * {
      color: var(--color-black);
      background-color: var(--color-white);
      font-size: 1.4rem;
      font-weight: 500;
      justify-content: flex-end;
      border-right: 1px solid var(--color-grey-2);

      &:last-child {
        border-right: 0;
      }

      &:first-child {
        justify-content: center;
      }
    }
  }
}
</style>
