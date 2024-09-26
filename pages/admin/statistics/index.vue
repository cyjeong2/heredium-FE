<template>
  <div>
    <div class="top">
      <STitle emoji="chart">통계</STitle>
      <div>
        <SDatepicker v-model="startDate" :max="endDate" @input="getSummaryData" />
        <span class="tilde-div">~</span>
        <SDatepicker v-model="endDate" :min="startDate" @input="getSummaryData" />
      </div>
    </div>
    <div class="two-grid mb-36">
      <div class="summary">
        <h3 class="mb-16">개요</h3>
        <div class="summary-wrap">
          <div v-if="summaryData" class="info-table">
            <div class="row">
              <label>입장</label>
              <div>{{ getThreeCommaNum(summaryData.visitNumber) }}명</div>
            </div>
            <div class="row">
              <label>매출</label>
              <div>{{ getThreeCommaNum(summaryData.totalPrice) }}원</div>
            </div>
            <div class="row">
              <label>회원가입</label>
              <div>{{ getThreeCommaNum(summaryData.signUp) }}명</div>
            </div>
          </div>
        </div>
      </div>
      <ChartByPurchaseOptions :ex-start-date="exStartDate" :ex-end-date="exEndDate" />
    </div>
    <ChartByPeriod :ex-start-date="exStartDate" :ex-end-date="exEndDate" class="mb-36" />
    <ChartByDay :ex-start-date="exStartDate" :ex-end-date="exEndDate" class="mb-36" />
    <ChartByTime :ex-start-date="exStartDate" :ex-end-date="exEndDate" />
  </div>
</template>

<script>
import STitle from '~/components/admin/commons/STitle';
import SDatepicker from '~/components/admin/commons/SDatepicker';
import ChartByPurchaseOptions from '~/components/admin/chart/ChartByPurchaseOptions';
import ChartByPeriod from '~/components/admin/chart/ChartByPeriod';
import ChartByDay from '~/components/admin/chart/ChartByDay';
import ChartByTime from '~/components/admin/chart/ChartByTime';
import { threeCommaNum } from '~/assets/js/commons';

export default {
  name: 'StatisticsPage',
  components: { ChartByTime, ChartByDay, ChartByPeriod, ChartByPurchaseOptions, SDatepicker, STitle },
  layout: 'admin/default',
  data() {
    return {
      startDate: this.$dayjs().subtract(6, 'd').format('YYYY-MM-DD'),
      endDate: this.$dayjs().format('YYYY-MM-DD'),
      summaryData: null
    };
  },
  async fetch() {
    this.summaryData = await this.$axios.$get('/admin/statistics', {
      params: { startDate: this.exStartDate, endDate: this.exEndDate }
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
    justify-content: center;
    flex-direction: column;
    background-color: var(--color-white);
    border-radius: 0.3rem;
    border: 1px solid var(--color-grey-2);
    padding: 2.8rem 3.2rem;
  }

  .info-table .row > div {
    justify-content: flex-end;
  }
}
</style>
