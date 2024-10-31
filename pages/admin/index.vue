<template>
  <div>
    <div class="title mb-24">
      <STitle emoji="bar-chart">Today</STitle>
      <p class="today nt-2">{{ $dayjs().format('YYYY-MM-DD') }}</p>
    </div>
    <div class="mb-36">
      <SDashboardCard :card-list="cardList" />
    </div>
    <div class="mb-28">
      <SMultiProgressTab v-model="selectedProject" :option-list="projectList" class="mb-24" @input="onChangeProject" />
      <div class="round">
        <div>
          <h3 class="mb-16">회차</h3>
        </div>
        <div v-if="selectedTabData" class="round-inner">
          <div class="mr-28">
            <SCalendar
              :ex-start-date="selectedTabData.startDate"
              :ex-end-date="selectedTabData.endDate"
              :holiday-list="selectedTabData.holidayList"
              :computed-round-data="computedRoundData"
              :selected-round-date="selectedRoundDate"
              @onSelectedDate="onSelectedDate"
            />
          </div>
          <div class="round-wrap">
            <p class="h4">
              {{ $dayjs(selectedRoundDate).format('YYYY년 MM월 DD일') }}
              <span v-if="currentRoundData" class="ml-8 bt-2r">총 {{ currentRoundData.rounds.length }}회차</span>
            </p>
            <div class="round-list">
              <template v-if="currentRoundData && currentRoundData.rounds">
                <div v-if="!currentRoundData.rounds || !currentRoundData.rounds[0]" class="round-item-empty">
                  리스트가 없습니다.
                </div>
                <div v-for="(item, index) in currentRoundData.rounds" :key="item.startDate" class="round-item">
                  <p class="count">{{ index + 1 }}</p>
                  <p class="time nt-3">
                    {{ $dayjs(item.startTime, 'HH:mm:ss').format('HH:mm') }} ~
                    {{ $dayjs(item.endTime, 'HH:mm:ss').format('HH:mm') }}
                  </p>
                  <div class="personnel">
                    <div class="bt-1m">
                      입장<span class="nt-3 ml-8">{{
                        item.ticketUsedCount > 999 ? '999+' : item.ticketUsedCount
                      }}</span>
                    </div>
                    <SDivLine />
                    <div class="bt-1m">
                      입장예정<span class="nt-3 ml-8">{{
                        item.ticketTotalCount > 999 ? '999+' : item.ticketTotalCount
                      }}</span>
                    </div>
                    <SDivLine />
                    <div class="bt-1m">
                      최대인원<span class="nt-3 ml-8">{{ item.maxCount > 999 ? '999+' : item.maxCount }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="selectedProject" class="note mb-36">
      <h3 class="mb-24">비고<SButton button-type="primary" @click="updateNote">수정</SButton></h3>
      <STextarea v-model="dashboardNote" />
    </div>
    <div class="chart">
      <ChartTodaySale />
      <ChartTodayRegister />
    </div>
    <SDialogModal :is-show="isShowSaveModal" @close="isShowSaveModal = false">
      <template #content>비고가 수정되었습니다.</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="isShowSaveModal = false">확인</SButton>
      </template>
    </SDialogModal>
  </div>
</template>

<script>
import STitle from '~/components/admin/commons/STitle';
import SDashboardCard from '~/components/admin/commons/SDashboardCard';
import { dashboardCountToList, roundsToHashTable } from '~/assets/js/converter';
import SMultiProgressTab from '~/components/admin/commons/SMultiProgressTab';
import { LOG_TYPE } from '~/assets/js/types';
import SButton from '~/components/admin/commons/SButton';
import STextarea from '~/components/admin/commons/STextarea';
import ChartTodaySale from '~/components/admin/chart/ChartTodaySale';
import ChartTodayRegister from '~/components/admin/chart/ChartTodayRegister';
import SCalendar from '~/components/admin/commons/SCalendar';
import SDivLine from '~/components/admin/commons/SDivLine';
import SDialogModal from '~/components/admin/modal/SDialogModal';

export default {
  name: 'DashBoardPage',
  components: {
    SDialogModal,
    SDivLine,
    SCalendar,
    ChartTodayRegister,
    ChartTodaySale,
    STextarea,
    SButton,
    SMultiProgressTab,
    SDashboardCard,
    STitle
  },
  layout: 'admin/default',
  async asyncData({ $axios, store, redirect, params, query }) {
    // console.log('🚀 ~ asyncData ~ params:', params);
    // console.log('🚀 ~ asyncData ~ query:', query);
    const adminInfo = await store.getters['service/auth/getAdminUserInfo'];
    const auth = adminInfo.auth || adminInfo.role;

    if (auth === 'COFFEE') {
      redirect('/admin/coffee/manage');
    } else {
      const dashboardData = await $axios.$get('/admin/dashboard');

      return { dashboardData };
    }
  },
  data() {
    return {
      dashboardData: null,
      selectedProject: null,
      projectData: {},
      selectedRoundDate: null,
      selectedProjectData: null,
      dashboardNote: '',
      isShowSaveModal: false
    };
  },
  async fetch() {
    if (this.selectedProject && !this.projectData[this.selectedProject]) {
      const [type, id] = this.selectedProject.split('-');
      const apiUrl = type === 'EXHIBITION' ? 'exhibitions' : 'programs';

      this.projectData[this.selectedProject] = await this.$axios
        .$get(`/admin/${apiUrl}/${id}/rounds`)
        .then(async (data) => ({
          ...data,
          holidayList: await this.$axios.$get(`/admin/holidays`, {
            params: {
              startDate: this.$dayjs(data.startDate).format('YYYY-MM-DD'),
              endDate: this.$dayjs(data.endDate).format('YYYY-MM-DD')
            }
          })
        }));
    }

    this.selectedProjectData = this.projectData[this.selectedProject];
    this.dashboardNote = this.projectData[this.selectedProject].note;

    if (!this.selectedRoundDate) {
      this.selectedRoundDate = this.$dayjs().format('YYYY-MM-DD');
    }
  },
  computed: {
    cardList() {
      return dashboardCountToList(this.dashboardData.count);
    },
    projectList() {
      return this.dashboardData.todayProjects.map((project) => ({
        value: `${project.type}-${project.id}`,
        label: `${LOG_TYPE[project.type]} | ${project.title}`
      }));
    },
    selectedTabData() {
      return (
        this.selectedProjectData ?? {
          startDate: '',
          endDate: '',
          holidayList: [],
          rounds: []
        }
      );
    },
    computedRoundData() {
      const rounds = this.selectedTabData.rounds;

      return roundsToHashTable(rounds, this.$dayjs);
    },
    currentRoundData() {
      const defaultData = {
        targetDate: this.selectedRoundDate,
        allMaxCount: 0,
        allTicketingCount: 0,
        rounds: [],
        isHasOverbooking: false
      };

      return this.computedRoundData[this.selectedRoundDate] || defaultData;
    }
  },
  created() {
    const firstProject = this.dashboardData?.todayProjects[0];

    if (firstProject) {
      const { type, id } = firstProject;

      this.selectedProject = `${type}-${id}` ?? null;
    }
  },
  methods: {
    onChangeProject() {
      console.log('!');

      if (!this.$fetchState.pending) {
        this.$fetch();
      }
    },
    onSelectedDate(selectedDate) {
      this.selectedRoundDate = selectedDate;
    },
    async updateNote() {
      const [type, id] = this.selectedProject.split('-');
      const apiUrl = type === 'EXHIBITION' ? 'exhibitions' : 'programs';

      await this.$axios.$put(`/admin/${apiUrl}/${id}/note`, { data: this.dashboardNote }).then(() => {
        this.isShowSaveModal = true;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;

  h1 {
    margin-bottom: 0;
    margin-right: 1rem;
  }

  .today {
    display: flex;
    color: var(--color-white);
    width: 12rem;
    height: 3.6rem;
    align-items: center;
    justify-content: center;
    border-radius: 1.8rem;
    background-color: var(--color-black);
  }
}

.round {
  .round-inner {
    display: flex;
    align-items: flex-end;
  }

  .round-wrap {
    flex: 1 1 0;

    > p {
      > span {
        color: rgba(0, 0, 0, 0.4);
      }
    }
  }

  .round-list {
    height: 55.1rem;
    background-color: var(--color-white);
    overflow-y: auto;
    margin-top: 1rem;
    border-radius: 0.3rem;
    border: 1px solid var(--color-grey-2);
  }

  .round-item-empty {
    color: var(--color-grey-3);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 53.7rem;
    width: 100%;
    font-size: 1.6rem;
    font-weight: 500;
  }

  .round-item {
    display: flex;
    border-bottom: 1px solid var(--color-grey-2);
    padding-right: 6.2rem;
    align-items: center;

    .count {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-grey-4);
      min-height: 5.5rem;
      width: 5.5rem;
      background-color: #fafafa;
      border-right: 1px solid var(--color-grey-2);
    }

    .time {
      flex: 1 1 0;
      padding: 0 2rem;
    }

    .personnel {
      display: flex;
      align-items: center;

      .bt-1m {
        width: 9.6rem;
      }

      .nt-3 {
        color: var(--color-blue);
      }
    }
  }
}

.note {
  h3 {
    position: relative;

    > a,
    > button {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
    }
  }
}

.chart {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2.8rem;
}
</style>
