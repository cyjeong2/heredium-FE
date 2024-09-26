<template>
  <ClientOnly>
    <div>
      <h3 class="mb-16">기간별 통계</h3>
      <SMultiProgressTab v-model="tabSelected" :option-list="tabList" class="mb-24" @input="onTabSelected" />
      <div class="wrap mb-24">
        <div class="top mb-24">
          <div class="left">
            {{ $dayjs(exStartDate).format('YYYY-MM-DD') }} ~ {{ $dayjs(exEndDate).format('YYYY-MM-DD') }}
          </div>
          <div class="right">
            <div class="date-tab">
              <button type="button" :class="{ active: dateType === 'DAY' }" @click="onDateTypeSelected('DAY')">
                Day
              </button>
              <button type="button" :class="{ active: dateType === 'MONTH' }" @click="onDateTypeSelected('MONTH')">
                Month
              </button>
            </div>
            <SButton button-type="primary" @click="estimateExcel">다운로드</SButton>
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
      <div v-if="!$fetchState.pending" class="info-table">
        <div class="row all-title">
          <label>순위</label>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
        </div>
        <div class="row all-contents">
          <label>날짜</label>
          <div>{{ getRankData(0, 'label') }}</div>
          <div>{{ getRankData(1, 'label') }}</div>
          <div>{{ getRankData(2, 'label') }}</div>
          <div>{{ getRankData(3, 'label') }}</div>
          <div>{{ getRankData(4, 'label') }}</div>
        </div>
        <div class="row all-contents">
          <label>{{ tabSelectedName }}</label>
          <div>{{ getRankData(0, 'value') }}</div>
          <div>{{ getRankData(1, 'value') }}</div>
          <div>{{ getRankData(2, 'value') }}</div>
          <div>{{ getRankData(3, 'value') }}</div>
          <div>{{ getRankData(4, 'value') }}</div>
        </div>
      </div>
      <VueSkeletonLoader
        v-else
        width="100%"
        height="16.5rem"
        :rounded="true"
        radius="3"
        style="margin-bottom: 1.6rem"
      />
    </div>
  </ClientOnly>
</template>

<script>
import VueSkeletonLoader from 'skeleton-loader-vue';
import SMultiProgressTab from '~/components/admin/commons/SMultiProgressTab';
import { CHART_TYPE } from '~/assets/js/types';
import SButton from '~/components/admin/commons/SButton';

export default {
  name: 'ChartByPeriod',
  components: { SButton, SMultiProgressTab, VueSkeletonLoader },
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
      rankingData: [],
      computedData: []
    };
  },
  async fetch() {
    const startDate = this.$dayjs(this.exStartDate);
    const endDate = this.$dayjs(this.exEndDate);
    const dateType = this.dateType === 'DAY' ? 'd' : 'M';
    const formatDate = dateType === 'd' ? 'YYYY-MM-DD' : 'YYYY-MM';
    const chartData = await this.$axios.$get('/admin/statistics/chart', {
      params: {
        startDate: this.exStartDate,
        endDate: this.exEndDate,
        kind: this.kind,
        kindId: this.kindId,
        type: this.tabSelected,
        dateType: this.dateType
      }
    });
    const computedData = [];

    for (let index = 0; index <= endDate.diff(startDate, dateType); index++) {
      const newTargetDate = startDate.add(index, dateType).format(formatDate);

      computedData.push({
        label: newTargetDate,
        value: chartData.find((item) => item.label === newTargetDate)?.value || 0
      });
    }

    this.computedData = computedData;
    this.rankingData = [...computedData].sort((a, b) => b.value - a.value).slice(0, 5);
    this.chartData.labels = computedData.map((item) => item.label);
    this.chartData.datasets[0].data = computedData.map((item) => item.value);
  },
  head: {
    script: [
      { src: 'https://unpkg.com/xlsx/dist/shim.min.js' },
      { src: 'https://unpkg.com/xlsx/dist/xlsx.full.min.js' },
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js'
      }
    ]
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
    },
    tabSelectedName() {
      return CHART_TYPE[this.tabSelected];
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
    },
    onDateTypeSelected(type) {
      this.dateType = type;
      this.$fetch();
    },
    getRankData(index, target) {
      return this.rankingData[index] && this.rankingData[index].value > 0
        ? this.rankingData[index][target].toLocaleString()
        : '-';
    },
    /* eslint-disable */
    estimateExcel() {
      const excelBaseListData = this.computedData;
      const stringToArrayBuffer = (stringData) => {
        const buffer = new ArrayBuffer(stringData.length);
        const view = new Uint8Array(buffer);
        let i = 0;

        for (i; i < stringData.length; i++) {
          view[i] = stringData.charCodeAt(i) & 0xff;
        }

        return buffer;
      };
      const excelHandler = {
        excelData: [],
        add(item) {
          this.excelData.push(item);
        },
        getExcelFileName() {
          return '기간별 통계.xlsx';
        },
        getSheetName() {
          return 'Sheet1';
        },
        getExcelData() {
          return this.excelData;
        },
        getWorksheet() {
          return XLSX.utils.json_to_sheet(this.getExcelData());
        }
      };

      excelBaseListData.forEach((value) => {
        excelHandler.add({
          날짜: value.label,
          값: value.value
        });
      });
      const workBook = XLSX.utils.book_new();
      const newWorksheet = excelHandler.getWorksheet();

      XLSX.utils.book_append_sheet(workBook, newWorksheet, excelHandler.getSheetName());
      const workBookOutput = XLSX.write(workBook, {
        bookType: 'xlsx',
        type: 'binary'
      });

      window.saveAs(
        new Blob([stringToArrayBuffer(workBookOutput)], {
          type: 'application/octet-stream'
        }),
        excelHandler.getExcelFileName()
      );
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

.info-table .row {
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
</style>
