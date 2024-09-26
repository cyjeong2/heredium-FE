<template>
  <ClientOnly>
    <div>
      <h3 class="mb-16">예매 옵션 분포</h3>
      <div class="chart-wrap">
        <VueSkeletonLoader v-if="$fetchState.pending" width="100%" height="35rem" :rounded="true" radius="3" />
        <div v-else-if="data.length === 0" class="empty">기간 내 분포 데이터가 없습니다</div>
        <DoughnutChart
          v-else
          :chart-options="chartOptions"
          :chart-data="chartData"
          :plugins="plugins"
          style="max-width: 35rem"
        />
      </div>
    </div>
  </ClientOnly>
</template>

<script>
import VueSkeletonLoader from 'skeleton-loader-vue';
import { threeCommaNum } from '~/assets/js/commons';

export default {
  name: 'ChartByPurchaseOptions',
  components: { VueSkeletonLoader },
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
    }
  },
  data() {
    return {
      startDate: '',
      endDate: '',
      totalValue: 0,
      data: [],
      plugins: [
        {
          beforeInit(chart) {
            const originalFit = chart.legend.fit;

            chart.legend.fit = function fit() {
              originalFit.bind(chart.legend)();
              this.height += 20;
            };
          }
        }
      ],
      chartData: {
        labels: [],
        datasets: [
          {
            data: [],
            totalValue: 0,
            backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
            hoverOffset: 4,
            datalabels: {
              labels: {
                index: {
                  align: 'end',
                  anchor: 'end',
                  color(ctx) {
                    return ctx.dataset.backgroundColor;
                  },
                  font: { size: 13 },
                  formatter(value, ctx) {
                    return ctx.chart.data.labels[ctx.dataIndex];
                  },
                  offset: 8
                },
                name: {
                  align: 'top',
                  font: { size: 14 },
                  backgroundColor() {
                    return 'rgba(0, 0, 0, 0.5)';
                  },
                  color(ctx) {
                    return ctx.dataset.backgroundColor;
                  },
                  formatter(value, ctx) {
                    const totalValue = ctx.chart.data.datasets[0].totalValue;
                    const curValue = ctx.chart.data.datasets[0].data[ctx.dataIndex];
                    const computedRoundsValue = ((curValue / totalValue) * 100).toFixed(2);

                    return `${computedRoundsValue}%`;
                  },
                  borderRadius: 3,
                  marginBottom: 2,
                  padding: 2
                },
                value: {
                  align: 'bottom',
                  font: { size: 12 },
                  color(ctx) {
                    return ctx.dataset.backgroundColor;
                  },
                  formatter(value) {
                    return `${threeCommaNum(value)}명`;
                  },
                  borderRadius: 3,
                  textStrokeColor: 'white',
                  textStrokeWidth: 3,
                  padding: 2
                }
              }
            }
          }
        ]
      },
      chartOptions: {
        responsive: true,
        plugins: {
          datalabels: {
            color: 'white',
            display(ctx) {
              return ctx.dataset.data[ctx.dataIndex] > 10;
            },
            font: {
              weight: 'bold'
            },
            offset: 0,
            padding: 0
          },
          legend: {
            padding: 100
          }
        },
        cutoutPercentage: 8,
        layout: {
          padding: 30
        },
        elements: {
          line: {
            fill: false,
            tension: 0.4
          },
          point: {
            hoverRadius: 7,
            radius: 5
          }
        }
      }
    };
  },
  async fetch() {
    const data = await this.$axios.$get('/admin/statistics/chart/ticket-option', {
      params: {
        startDate: this.exStartDate,
        endDate: this.exEndDate,
        kind: this.kind,
        kindId: this.kindId
      }
    });

    this.data = data;
    this.chartData.datasets[0].totalValue = data.reduce((prev, cur) => prev + cur.value, 0);
    this.chartData.labels = data.map((item) => item.label);
    this.chartData.datasets[0].data = data.map((item) => item.value);
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
  }
};
</script>

<style lang="scss" scoped>
.chart-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: var(--color-white);
  border-radius: 0.3rem;
  border: 1px solid var(--color-grey-2);
}

.tilde-div {
  font-size: 1.3rem;
  font-weight: 500;
  margin: 0 0.8rem;
}

.empty {
  color: var(--color-grey-3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 25.8rem;
  width: 100%;
  font-size: 1.6rem;
  font-weight: 500;
}
</style>
