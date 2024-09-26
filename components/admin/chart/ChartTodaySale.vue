<template>
  <ClientOnly>
    <div>
      <h3 class="mb-16">일별 매출 현황</h3>
      <div class="wrap mb-24">
        <div class="top mb-24">
          <div class="left">
            <SMonthpicker v-model="date" @input="onChangeMonth" />
          </div>
          <div class="right">
            <p>판매</p>
            <div class="price">
              <span>{{ total }}</span
              >원
            </div>
          </div>
        </div>
        <BarChart
          v-show="!$fetchState.pending"
          :chart-data="chartData"
          :chart-options="chartOptions"
          :plugins="plugins"
          style="width: 100%; height: 35rem"
        />
        <VueSkeletonLoader v-if="$fetchState.pending" width="100%" height="35rem" :rounded="true" radius="3" />
      </div>
    </div>
  </ClientOnly>
</template>

<script>
import VueSkeletonLoader from 'skeleton-loader-vue';
import { threeCommaNum } from '~/assets/js/commons';
import SMonthpicker from '~/components/admin/commons/SMonthpicker';

export default {
  name: 'ChartTodaySale',
  components: { SMonthpicker, VueSkeletonLoader },
  data() {
    return {
      date: this.$dayjs().format('YYYY-MM'),
      width: null,
      height: null,
      chartData: {
        labels: [],
        datasets: [
          {
            label: '',
            data: [],
            backgroundColor: '#18A0FB'
          }
        ]
      },
      chartOptions: {
        plugins: {
          legend: {
            display: false
          },
          datalabels: {
            display: false
          },
          tooltip: {}
        },
        maxBarThickness: '8',
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            },
            title: {
              display: true,
              text: '(day)',
              align: 'end'
            }
          },
          y: {
            alignToPixels: true,
            suggestedMin: 10,
            suggestedMax: 10,
            ticks: {
              stepSize: 1
            }
          }
        }
      },
      plugins: [{}],
      dateType: 'DAY',
      computedData: []
    };
  },
  async fetch() {
    const date = this.$dayjs(this.date).format('YYYY-MM');
    const startDate = this.$dayjs(date).startOf('M');
    const endDate = this.$dayjs(date).endOf('M');
    const chartData = await this.$axios.$get('/admin/statistics/chart', {
      params: {
        startDate: startDate.format('YYYY-MM-DD 00:00:00'),
        endDate: endDate.format('YYYY-MM-DD 23:59:59'),
        type: 'PRICE',
        dateType: 'DAY'
      }
    });
    const computedData = [];

    for (let index = 0; index <= endDate.diff(startDate, 'd'); index++) {
      const newTargetDate = startDate.add(index, 'd').format('YYYY-MM-DD');

      computedData.push({
        label: newTargetDate,
        value: chartData.find((item) => item.label === newTargetDate)?.value || 0
      });
    }

    this.computedData = computedData;
    this.chartData.labels = computedData.map((item) => item.label);
    this.chartData.datasets[0].data = computedData.map((item) => item.value);
  },
  computed: {
    total() {
      const total = this.computedData.reduce((prev, cur) => prev + cur.value, 0);

      return threeCommaNum(total);
    }
  },
  methods: {
    onChangeMonth() {
      if (!this.$fetchState.pending) {
        this.$fetch();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  padding: 2.8rem 3.2rem;
  background-color: var(--color-white);
  border-radius: 0.3rem;
  border: 1px solid var(--color-grey-2);

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .right {
      display: flex;
      align-items: center;
      font-weight: 500;
      font-size: 1.6rem;

      .price {
        display: flex;
        align-items: flex-end;
        margin-left: 1.6rem;

        > span {
          font-size: 2.4rem;
          margin-right: 0.4rem;
          line-height: 3.2rem;
        }
      }
    }

    .date-tab {
      display: flex;

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4rem;
        font-weight: 500;
        line-height: 2.1rem;
        width: 9.6rem;
        height: 4.4rem;
        padding: 0 1rem;
        background-color: var(--color-grey-2);
        border: 1px solid var(--color-grey-2);

        &.active {
          background-color: var(--color-white);
        }

        &:first-child {
          border-radius: 0.3rem 0 0 0.3rem;
        }

        &:last-child {
          border-radius: 0 0.3rem 0.3rem 0;
        }
      }
    }
  }
}
</style>
