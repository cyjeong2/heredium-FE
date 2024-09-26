<template>
  <SModal :is-show="isShow" @close="cancel">
    <template #title>{{ isBatch ? '회차 일괄 등록' : '회차 설정' }}</template>
    <template #content>
      <div class="round-modal-edit">
        <div v-if="isBatch" class="select-range mb-24">
          <div class="label">
            <p class="tm-2m">범위 선택<b class="must">*</b></p>
          </div>
          <div>
            <div class="mb-12">
              <SDatepicker v-model="startDate" :min="getStartDateMin()" :max="endDate || exEndDate" w-size="large" />
              <span class="divider tm-1b">~</span>
              <SDatepicker v-model="endDate" :min="getEndDateMin()" w-size="large" />
            </div>
            <SWeekTab v-model="selectedWeekDay" />
          </div>
        </div>
        <div class="round-setting mb-24">
          <div class="top">
            <p class="tm-2m">회차설정<b class="must">*</b></p>
            <SButton v-if="isBatch || !getIsDisabled" w-size="small" h-size="small" @click="addRound">추가</SButton>
          </div>
          <div class="round-list">
            <div v-if="!roundList || !roundList[0]" class="round-item-empty tm-2r">회차 리스트가 없습니다.</div>
            <div v-for="(item, index) in roundList" v-else :key="index" class="round-item">
              <div class="label">
                <p>{{ index + 1 }}회차</p>
              </div>
              <div class="option">
                <div class="option-item">
                  <SSelect
                    v-model="item.hour"
                    :option-list="hourOptions1"
                    w-size="small"
                    :disabled="!isBatch && getIsDisabled"
                    @change="sortRoundList"
                  />
                  <span class="divider tm-1b">:</span>
                  <SSelect
                    v-model="item.min"
                    :option-list="minOptions"
                    w-size="small"
                    :disabled="!isBatch && getIsDisabled"
                    @change="sortRoundList"
                  />
                </div>
                <div class="option-limit">
                  최대 인원
                  <SInput v-model="item.maxPeople" text-align="right" is-comma-num />
                  명
                </div>
              </div>
              <button v-if="!getIsDisabled" type="button" @click="deleteRound(index)"><i class="ic-close" /></button>
            </div>
          </div>
        </div>
        <div class="select-range">
          <div class="label large">
            <p class="tm-2m">마감<b class="must">*</b></p>
          </div>
          <div class="right">
            <SSelect v-model="deadline.hour" :disabled="!isBatch && getIsDisabled" :option-list="hourOptions2" />
            <span class="divider tm-1b">:</span>
            <SSelect v-model="deadline.min" :disabled="!isBatch && getIsDisabled" :option-list="minOptions" />
          </div>
        </div>
      </div>
    </template>
    <template #modal-btn1>
      <SButton @click="cancel">취소</SButton>
    </template>
    <template #modal-btn2>
      <SButton button-type="primary" @click="saveRound">완료</SButton>
    </template>
    <template #etc>
      <SDialogModal no-scroll-lock :is-show="errorModal.isShow" @close="errorModal.isShow = false">
        <template #content>
          {{ errorModal.msg }}
        </template>
        <template #modal-btn2>
          <SButton button-type="primary" @click="errorModal.isShow = false">확인</SButton>
        </template>
      </SDialogModal>
    </template>
  </SModal>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import SModal from '~/components/admin/modal/SModal';
import SButton from '~/components/admin/commons/SButton';
import SWeekTab from '~/components/admin/commons/SWeekTab';
import SDatepicker from '~/components/admin/commons/SDatepicker';
import SInput from '~/components/admin/commons/SInput';
import SDialogModal from '~/components/admin/modal/SDialogModal';
import SSelect from '~/components/admin/commons/SSelect';
import { numberPad } from '~/assets/js/commons';

const DISABLED_ADD_DAY = 90;

export default {
  name: 'RoundModal',
  components: { SSelect, SDialogModal, SInput, SDatepicker, SWeekTab, SButton, SModal },
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
    exState: {
      type: String,
      required: false,
      default: ''
    },
    isShow: {
      type: Boolean,
      required: false,
      default: false
    },
    isBatch: {
      type: Boolean,
      required: false,
      default: false
    },
    currentRoundData: {
      type: Object,
      required: false,
      default: () => null
    }
  },
  data() {
    return {
      hourOptions1: Array.from({ length: 24 }, (_, index) => ({
        label: `${index}`,
        value: index
      })),
      hourOptions2: Array.from({ length: 24 }, (_, index) => ({
        label: `${index + 1}`,
        value: index + 1
      })),
      minOptions: [
        { label: '00', value: 0 },
        { label: '30', value: 30 }
      ],
      startDate: this.$dayjs().format('YYYY-MM-DD'),
      endDate: this.$dayjs().add(30, 'd').format('YYYY-MM-DD'),
      selectedWeekDay: [],
      roundList: [],
      deadline: { hour: 1, min: 0 },
      errorModal: {
        isShow: false,
        msg: ''
      }
    };
  },
  computed: {
    getIsDisabled() {
      let isCanEdit = true;

      if (this.exState !== 'SCHEDULE') {
        const targetDate = this.$dayjs(this.currentRoundData.targetDate);
        let disabledDay = '';

        if (this.exState === 'BOOKING') {
          disabledDay = this.$dayjs(this.exStartDate).add(DISABLED_ADD_DAY, 'd');
        } else if (this.exState === 'PROGRESS' || this.exState === 'TERMINATION') {
          disabledDay = this.$dayjs().add(DISABLED_ADD_DAY, 'd');
        }
        isCanEdit = targetDate.isSameOrAfter(disabledDay, 'day');
      }

      return !isCanEdit;
    }
  },
  watch: {
    isShow() {
      const isBatch = this.isBatch;

      if (!isBatch && this.currentRoundData && this.currentRoundData.rounds[0]) {
        const targetRounds = this.currentRoundData.rounds;
        const deadlineTime = targetRounds[targetRounds.length - 1].endTime;

        this.roundList = targetRounds.map((item) => ({
          id: item.id || null,
          hour: Number(this.$dayjs(item.startTime, 'HH:mm:ss').format('HH')),
          min: Number(this.$dayjs(item.startTime, 'HH:mm:ss').format('mm')),
          maxPeople: item.maxCount,
          ticketTotalCount: item.ticketTotalCount,
          ticketUsedCount: item.ticketUsedCount
        }));
        this.deadline = {
          hour: Number(this.$dayjs(deadlineTime, 'HH:mm:ss').format('HH')),
          min: Number(this.$dayjs(deadlineTime, 'HH:mm:ss').format('mm'))
        };
      } else {
        this.resetData();
      }
    }
  },
  methods: {
    getStartDateMin() {
      let minDate = '';

      if (this.exState === 'SCHEDULE') {
        minDate = this.$dayjs().format('YYYY-MM-DD');
      } else if (this.exState === 'BOOKING') {
        minDate = this.$dayjs(this.exStartDate).add(DISABLED_ADD_DAY, 'd').format('YYYY-MM-DD');
      } else {
        minDate = this.$dayjs().add(DISABLED_ADD_DAY, 'd').format('YYYY-MM-DD');
      }

      return minDate;
    },
    getEndDateMin() {
      let minDate = '';

      if (this.exState === 'SCHEDULE') {
        minDate = this.startDate;
      } else {
        minDate = this.$dayjs().add(DISABLED_ADD_DAY, 'd').format('YYYY-MM-DD');
      }

      return minDate;
    },
    cancel() {
      this.$emit('close');
      this.resetData();
    },
    resetData() {
      this.startDate = this.$dayjs(this.getStartDateMin()).format('YYYY-MM-DD');
      this.endDate = this.$dayjs(this.getStartDateMin()).add(30, 'd').format('YYYY-MM-DD');
      this.selectedWeekDay = [];
      this.deadline = { hour: 1, min: 0 };
      this.roundList = [];
    },
    sortRoundList() {
      this.$nextTick(() => {
        this.roundList = cloneDeep(this.roundList).sort((a, b) => a.hour - b.hour || a.min - b.min);
      });
    },
    addRound() {
      this.roundList.unshift({
        hour: 0,
        min: 0,
        maxPeople: 0
      });
    },
    deleteRound(index) {
      this.roundList.splice(index, 1);
    },
    isValidate() {
      const isCheckTimeOverlap = () => {
        const timeList = this.roundList.map((item) => `${numberPad(item.hour, 2)}${numberPad(item.min, 2)}`);

        return [...new Set(timeList)].length === this.roundList.length;
      };
      const isDeadlineCorrect = () => {
        const lastRound = this.roundList[this.roundList.length - 1];
        const roundTime = Number(`${lastRound.hour}${numberPad(lastRound.min, 2)}`);
        const deadlineTime = Number(`${this.deadline.hour}${numberPad(this.deadline.min, 2)}`);

        return roundTime < deadlineTime;
      };
      let isValid = false;

      if (this.isBatch) {
        if (!this.startDate || !this.endDate) {
          this.errorModal.msg = '기간을 선택해주세요.';
        } else if (!this.selectedWeekDay || !this.selectedWeekDay[0]) {
          this.errorModal.msg = '요일을 선택해주세요.';
        }
      }

      if (this.roundList && this.roundList[0]) {
        if (!isCheckTimeOverlap()) {
          this.errorModal.msg = '중복된 회차가 존재합니다. 중복된 회차를 삭제해 주세요.';
        } else if (!isDeadlineCorrect()) {
          this.errorModal.msg = '마감시간을 마지막 회차의 다음 시간으로 설정해 주세요.';
        } else {
          isValid = true;
        }
      } else {
        isValid = true;
      }

      if (!isValid) {
        this.errorModal.isShow = true;
      }

      return isValid;
    },
    saveRound() {
      if (this.isValidate()) {
        const startDate = this.$dayjs(this.startDate);
        const endDate = this.$dayjs(this.endDate);
        const targetDate = this.currentRoundData.targetDate;
        const removeDateList = [];
        let roundList = [];
        let updatedDateList = [];
        let isSingleModify = false;
        let isDeleteModify = false;

        if (this.isBatch) {
          for (let index = 0; index <= endDate.diff(startDate, 'd'); index++) {
            const newTargetDate = startDate.add(index, 'd');
            const weekDay = newTargetDate.locale('en').format('dddd');
            const formatTargetDate = newTargetDate.format('YYYY-MM-DD');

            if (this.selectedWeekDay.includes(weekDay)) {
              if (this.roundList && this.roundList[0]) {
                const { pushRoundList, pushUpdatedDateList } = this.getComputedRoundList(formatTargetDate);

                roundList = [...roundList, ...pushRoundList];
                updatedDateList = [...updatedDateList, ...pushUpdatedDateList];
              } else {
                removeDateList.push(formatTargetDate);
              }
            }
          }

          isDeleteModify = removeDateList && removeDateList[0];
          updatedDateList = [...new Set(updatedDateList)];
        } else {
          const { pushRoundList } = this.getComputedRoundList(targetDate);

          isSingleModify = true;
          roundList = pushRoundList;
        }

        this.$emit('setBatchRound', {
          roundList,
          updatedDateList,
          removeDateList,
          targetDate,
          isDeleteModify,
          isSingleModify
        });
        this.resetData();
      }
    },
    getComputedRoundList(targetDate) {
      const deadLineTime = this.getPadTime(this.deadline.hour, this.deadline.min);
      const pushRoundList = [];
      const pushUpdatedDateList = [];

      this.roundList.forEach((value, index) => {
        const nextRoundItem = this.roundList[index + 1];
        const formatDate = this.$dayjs(targetDate).format('YYYY-MM-DD');
        const startTime = this.getPadTime(value.hour, value.min);
        const nextStartHour = nextRoundItem ? this.getPadTime(nextRoundItem.hour, nextRoundItem.min) : null;
        const endTime = nextStartHour || deadLineTime;

        pushUpdatedDateList.push(formatDate);
        pushRoundList.push({
          id: value.id || null,
          startDate: `${formatDate} ${startTime}`,
          endDate: `${formatDate} ${endTime}`,
          limitNumber: value.maxPeople,
          ticketTotalCount: value.ticketTotalCount || 0,
          ticketUsedCount: value.ticketUsedCount || 0
        });
      });

      return { pushRoundList, pushUpdatedDateList };
    },
    getPadTime(hour, min) {
      return `${numberPad(hour, 2)}:${numberPad(min, 2)}:00`;
    }
  }
};
</script>

<style lang="scss" scoped>
.round-modal-edit {
  .must {
    color: var(--color-blue);
  }

  .select-range {
    display: flex;

    .label {
      position: relative;
      flex: 1 0 10.4rem;
      max-width: 10.4rem;
      text-align: left;

      p {
        position: absolute;
        top: 1.2rem;
      }

      &.large {
        flex: 1 1 auto;
        max-width: unset;
      }
    }

    .divider {
      margin: 0 1.2rem;
    }
  }

  .round-setting {
    .top {
      position: relative;
      margin-bottom: 1.7rem;

      p {
        text-align: left;
      }

      > button {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
    }

    .round-list {
      max-height: 39.6rem;
      overflow-y: auto;
      margin-right: -1.2rem;
      padding-right: 1.2rem;

      &::-webkit-scrollbar {
        height: 80%;
        margin-right: 12px;
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #d9d9d9;
        border-radius: 8px;
      }

      &::-webkit-scrollbar-track {
        background-color: var(--color-grey-1);
      }
    }

    .round-item-empty {
      color: var(--color-grey-3);
      display: flex;
      align-items: center;
      justify-content: center;
      height: 12.7rem;
      width: 100%;
      border: 1px solid var(--color-grey-2);
    }

    .round-item {
      display: flex;
      margin-bottom: 1.2rem;
      border: 1px solid var(--color-grey-2);
      border-radius: 0.3rem;

      .label {
        position: relative;
        width: 10.4rem;
        padding: 0 2rem;

        p {
          position: absolute;
          top: 2.5rem;
        }
      }

      .option {
        flex: 1 1 auto;
        padding: 1.2rem 0;

        .option-item {
          display: flex;
          align-items: center;
          margin-bottom: 1.3rem;
        }

        .option-limit {
          display: flex;
          align-items: center;

          input {
            margin: 0 0.8rem 0 2rem;
          }
        }
      }

      .divider {
        margin: 0 1.2rem;
      }

      > button {
        width: 4.1rem;
        border-radius: 0 0.3rem 0.3rem 0;
        background-color: var(--color-grey-1);
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
