<template>
  <ClientOnly>
    <div>
      <h3 class="mb-16">시간별 분포</h3>
      <SMultiProgressTab v-model="tabSelected" :option-list="tabList" class="mb-24" @input="onTabSelected" />
      <div class="wrap mb-24">
        <div class="top mb-24">
          <div class="left">
            {{ $dayjs(exStartDate).format('YYYY-MM-DD') }} ~ {{ $dayjs(exEndDate).format('YYYY-MM-DD') }}
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
import SMultiProgressTab from '~/components/admin/commons/SMultiProgressTab';
import { CHART_TYPE } from '~/assets/js/types';

export default {
  name: 'ChartByTime',
  components: { SMultiProgressTab, VueSkeletonLoader },
  props: {
    exStartDate: {
      type: String,
      required: false,
      default: ''
    },
    exEndDate: {
      type: String,
      required: false,
      default: ''
    },
    kind: {
      type: String,
      required: false,
      default: null
    },
    kindId: {
      type: Number,
      required: false,
      default: null
    },
    isHideSignUp: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      tabSelected: Object.keys(CHART_TYPE)[0],
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
              text: '(hour)',
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
    const chartData = await this.$axios.$get('/admin/statistics/chart', {
      params: {
        startDate: this.exStartDate,
        endDate: this.exEndDate,
        kind: this.kind,
        kindId: this.kindId,
        type: this.tabSelected,
        dateType: 'HOUR'
      }
    });
    const computedData = Array.from({ length: 24 }, (_, index) => index).map((value) => ({
      label: value,
      value: 0
    }));

    chartData.forEach((value) => {
      computedData[Number(value.label)].value = value.value;
    });
    this.computedData = computedData;
    this.chartData.labels = computedData.map((item) => item.label);
    this.chartData.datasets[0].data = computedData.map((item) => item.value);
  },
  computed: {
    tabList() {
      const tabList = Object.entries(CHART_TYPE).map(([key, value]) => ({
        value: key,
        label: value
      }));

      if (this.isHideSignUp) {
        tabList.splice(
          tabList.findIndex((item) => item.value === 'SIGN_UP'),
          1
        );
      }

      return tabList;
    }
  },
  watch: {
    exStartDate() {
      if (this.exStartDate && this.exEndDate) {
        this.$fetch();
      }
    },
    exEndDate() {
      if (this.exStartDate && this.exEndDate) {
        this.$fetch();
      }
    }
  },
  methods: {
    onTabSelected() {
      this.$fetch();
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

    .left {
      font-weight: 500;
      font-size: 2.4rem;
    }

    .right {
      display: flex;

      > button {
        margin-left: 2rem;
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
