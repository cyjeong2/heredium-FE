<template>
  <div>
    <div class="top">
      <div class="left">
        <STitle emoji="calendar">휴관일 설정</STitle>
        <p class="bt-1m">휴관일로 지정된 날에는 사용자가 전시, 프로그램 예매를 할 수 없습니다.</p>
      </div>
      <SButton button-type="primary" @click="isShowSaveModal = true">완료</SButton>
    </div>
    <div class="holiday">
      <div class="menu">
        <div class="year-nav">
          <button type="button" @click="setYear()"><i class="ic-arrow-left" /></button>
          <p class="nt-1">{{ currentYear }}</p>
          <button type="button" @click="setYear(true)"><i class="ic-arrow-right" /></button>
        </div>
        <SButton @click="isShowEditModal = true">휴관일 일괄 설정</SButton>
      </div>
      <ClientOnly>
        <div v-if="isDataLoading" class="holiday-list">
          <div v-for="item in 12" :key="item">
            <VueSkeletonLoader width="472px" height="338px" :rounded="true" radius="3" />
          </div>
        </div>
        <div v-else class="holiday-list">
          <VCalendar
            v-for="item in monthList"
            :key="$dayjs(item).format('YYYY-MM-DD')"
            :masks="masks"
            :from-date="item"
            class="calendar"
          >
            <template #header-title="{ month }">
              <div>{{ getMonthLabel(month) }}</div>
            </template>
            <template #day-content="{ day }">
              <div
                v-if="day.inMonth"
                class="calendar-custom"
                :class="{ 'is-selected': getToggleState(day.id) }"
                @click="onDayClick(day)"
              >
                <div>{{ day.day }}</div>
              </div>
            </template>
          </VCalendar>
        </div>
      </ClientOnly>
    </div>
    <HolidayEditModal
      :is-show="isShowEditModal"
      :init-start-date="lastExStartDate"
      :init-week-days="lastSelectedDays"
      @close="isShowEditModal = false"
      @setBatchHoliday="setBatchHoliday"
      @setSelectedDays="setSelectedDays"
    />
    <SDialogModal :is-show="isShowSaveModal" @close="isShowSaveModal = false">
      <template #content>
        휴관일 설정을 저장 하시겠습니까?<br />
        결제된 예매가 있는 날이 휴관일로 설정되어도 예매가 자동 취소되지 않습니다.
      </template>
      <template #modal-btn1>
        <SButton @click="isShowSaveModal = false">취소</SButton>
      </template>
      <template #modal-btn2>
        <SButton button-type="primary" :disabled="isConfirmPending" @click="saveData">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="isShowDoneModal" @close="refreshPage">
      <template #content>저장되었습니다.</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="refreshPage">확인</SButton>
      </template>
    </SDialogModal>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import VueSkeletonLoader from 'skeleton-loader-vue';
import STitle from '~/components/admin/commons/STitle';
import SButton from '~/components/admin/commons/SButton';
import HolidayEditModal from '~/components/admin/modal/HolidayEditModal';
import { numberPad } from '~/assets/js/commons';
import { weekOfDayNameToNumber } from '~/assets/js/converter';
import SDialogModal from '~/components/admin/modal/SDialogModal';

export default {
  name: 'HolidayPage',
  components: { SDialogModal, HolidayEditModal, SButton, STitle, VueSkeletonLoader },
  layout: 'admin/default',
  async asyncData({ $axios }) {
    const lastExStartDate = await $axios.$get('/admin/holidays/last-start-date');
    const lastSelectedDays = await $axios.$get('/admin/holidays/days');

    return { lastExStartDate, lastSelectedDays };
  },
  data() {
    return {
      lastExStartDate: '',
      lastSelectedDays: [],
      holidayData: {},
      addList: [],
      deleteList: [],
      currentYear: Number(this.$dayjs().format('YYYY')),
      masks: { title: 'MMMM' },
      isShowEditModal: false,
      isShowSaveModal: false,
      isShowDoneModal: false,
      isDataLoading: true,
      loadCount: 0,
      isConfirmPending: false
    };
  },
  async fetch() {
    this.isDataLoading = true;
    const holidayData = cloneDeep(this.holidayData);
    const currentYear = this.currentYear;
    const newHolidayData = await this.$axios.$get('/admin/holidays', {
      params: { startDate: `${currentYear}-01-01`, endDate: `${currentYear}-12-31` }
    });

    if (!holidayData[currentYear]) {
      holidayData[currentYear] = this.getInitYearData(currentYear);
    }

    newHolidayData.forEach((date) => {
      const isModified = holidayData[currentYear][date].isModified;

      holidayData[currentYear][date] = {
        date,
        isSelected: isModified ? holidayData[currentYear][date].isSelected : true,
        isDelete: holidayData[currentYear][date].isDelete,
        isFetchData: true,
        isModified
      };
    });

    this.holidayData = holidayData;
    this.isDataLoading = false;
  },
  computed: {
    monthList() {
      const currentYear = this.currentYear;

      return Array.from({ length: 12 }, (_, index) => index).map((value) => new Date(currentYear, value, 1));
    }
  },
  methods: {
    getInitYearData(currentYear) {
      const newYearObject = {};
      const startDate = this.$dayjs(`${currentYear}-01-01`);
      const endDate = this.$dayjs(`${currentYear}-12-31`);

      for (let index = 0; index <= endDate.diff(startDate, 'd'); index++) {
        const newTargetDate = startDate.add(index, 'd');
        const formatTargetDate = newTargetDate.format('YYYY-MM-DD');

        newYearObject[formatTargetDate] = {
          date: formatTargetDate,
          isSelected: false,
          isDelete: false,
          isModified: false,
          isFetchData: false
        };
      }

      return newYearObject;
    },
    getMonthLabel(month) {
      const dummyDate = `2022-${this.getMonthNumberPad(month)}-01`;

      return this.$dayjs(dummyDate).format('MMMM');
    },
    getToggleState(date) {
      const year = this.$dayjs(date).format('YYYY');

      return this.holidayData[year][date].isSelected;
    },
    setYear(isAdd) {
      if (!this.$fetchState.pending) {
        this.currentYear = isAdd ? this.currentYear + 1 : this.currentYear - 1;
        this.$fetch();
      }
    },
    onDayClick({ id }) {
      const targetDateData = this.holidayData[this.currentYear][id];

      this.holidayData[this.currentYear][id] = {
        date: targetDateData.date,
        isSelected: !targetDateData.isSelected,
        isDelete: targetDateData.isFetchData && !targetDateData.isSelected === false,
        isModified: targetDateData.isFetchData !== !targetDateData.isSelected,
        isFetchData: targetDateData.isFetchData
      };
    },
    getMonthNumberPad(value) {
      return numberPad(value, 2);
    },
    setSelectedDays({ selectedWeekDay, startDate }) {
      this.lastSelectedDays = selectedWeekDay.map((dayName) => weekOfDayNameToNumber(dayName));
      this.lastExStartDate = startDate;
    },
    setBatchHoliday({ updatedDateList, removeDataList }) {
      const holidayData = cloneDeep(this.holidayData);

      if (updatedDateList) {
        updatedDateList.forEach((date) => {
          const year = this.$dayjs(date).format('YYYY');

          if (!holidayData[year]) {
            holidayData[year] = this.getInitYearData(year);
          }

          holidayData[year][date] = {
            date,
            isFetchData: holidayData[year][date].isFetchData,
            isModified: true,
            isDelete: false,
            isSelected: true
          };
        });
      }

      if (removeDataList) {
        removeDataList.forEach((date) => {
          const year = this.$dayjs(date).format('YYYY');

          if (!holidayData[year]) {
            holidayData[year] = this.getInitYearData(year);
          }

          holidayData[year][date] = {
            date,
            isFetchData: holidayData[year][date].isFetchData,
            isModified: true,
            isDelete: true,
            isSelected: false
          };
        });
      }

      this.holidayData = holidayData;
      this.isShowEditModal = false;
    },
    saveData() {
      this.isConfirmPending = true;
      const holidayData = cloneDeep(this.holidayData);
      const formData = {
        days: this.lastSelectedDays,
        delete: [],
        insert: []
      };

      Object.values(holidayData).forEach((yearData) => {
        Object.values(yearData).forEach((dateData) => {
          if (dateData.isModified && dateData.isSelected) {
            formData.insert.push(dateData.date);
          } else if (dateData.isModified && !dateData.isSelected) {
            formData.delete.push(dateData.date);
          }
        });
      });

      this.$axios
        .$post('/admin/holidays', formData)
        .then(() => {
          this.isShowSaveModal = false;
          this.isShowDoneModal = true;
        })
        .catch(() => {
          alert('저장 에러 발생');
        });

      this.isConfirmPending = false;
    },
    refreshPage() {
      window.location.reload();
    }
  }
};
</script>

<style lang="scss" scoped>
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.6rem;

  .left {
    display: flex;
    align-items: center;
  }

  h1 {
    margin-bottom: 0;
    margin-right: 1.8rem;
  }

  p {
    margin-top: 1rem;
  }
}

.holiday {
  background-color: var(--color-white);
  padding: 3.1rem 3.6rem 3.6rem;
  box-shadow: 0 0.1rem 0.7rem rgba(0, 0, 0, 0.1);
  border-radius: 0.3rem;

  .menu {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2.8rem;

    .year-nav {
      display: flex;

      p {
        margin: 0 3.5rem;
      }
    }
  }

  .holiday-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2.4rem;
  }
}

.calendar {
  display: inline-flex;
  position: relative;
  color: var(--color-black);
  justify-self: center;

  .ic-arrow-left,
  .ic-arrow-right {
    color: var(--color-white);
    font-size: 2.2rem;
  }

  &::v-deep {
    .vc-popover-content {
      border-radius: 0.3rem;
      border-color: var(--color-grey-2);
    }

    .vc-arrow {
      display: none;
    }

    .vc-header {
      height: 4.4rem;
      padding: 0;
      background-color: var(--color-blue);
      border-radius: 0.3rem 0.3rem 0 0;

      .vc-title {
        color: var(--color-white);
        font-size: 1.4rem;
        pointer-events: none;
      }
    }

    .vc-weeks {
      padding: 1.5rem 2.6rem 1.8rem;

      .vc-weekday {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-black);
        height: 1.8rem;
        width: 6rem;
        font-size: 1.2rem;
        font-weight: 400;
        padding: 0;
        margin-bottom: 1.5rem;
      }

      .vc-day {
        height: 3.4rem;
        width: 6rem;
        margin-bottom: 0.4rem;
      }

      .vc-day.is-not-in-month *[data-v-4420d078] {
        color: var(--color-grey-3) !important;
        opacity: 1;
      }

      .vc-day-content {
        color: var(--color-black);
        border-radius: 0 !important;
        font-size: 1.2rem;
        font-weight: 400;
        height: 100%;
        width: 100%;

        &:hover {
          border-radius: 0;
        }
      }

      .vc-highlight-base-start,
      .vc-highlight-base-middle,
      .vc-highlight-base-end {
        width: 100% !important;
      }

      .vc-highlights + span.vc-day-content.vc-focusable {
        color: var(--color-blue) !important;
      }

      .vc-highlight {
        height: 3.4rem;
        width: 6rem;
        border-radius: 0 !important;
        border-color: var(--color-blue) !important;
        border-width: 1px !important;
        background-color: #ebf7ff !important;
      }
    }

    .calendar-custom {
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      font-size: 1.2rem;
      font-weight: 400;
      cursor: pointer;

      &:hover {
        background-color: var(--color-grey-1);
      }

      &.is-selected {
        color: var(--color-blue);
        background-color: #ebf7ff !important;
      }
    }
  }
}

@media (max-width: 1900px) {
  .holiday-list {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 2.4rem;
  }
}

@media screen and (max-width: 1680px) {
  .holiday-list {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 1rem;
  }

  .holiday {
    padding: 2rem;
  }
}
</style>
