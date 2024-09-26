<template>
  <SModal :is-show="isShow" @close="cancel">
    <template #title>
      {{ isNew ? '프로그램 일정 등록' : '프로그램 회차 수정' }}
      <span v-if="!isNew" class="nt-3">({{ $dayjs(selectedDate).format('YY.MM.DD') }})</span>
    </template>
    <template #content>
      <div class="program-modal-edit">
        <div v-if="isNew" class="row mb-12">
          <div class="label large">
            <p class="tm-2m">진행일<b class="must">*</b></p>
          </div>
          <div class="right">
            <SDatepicker v-model="selectedDate" />
          </div>
        </div>
        <div class="row mb-12">
          <div class="label large">
            <p class="tm-2m">프로그램시간<b class="must">*</b></p>
          </div>
          <div class="right">
            <div class="mb-12">
              <span class="mr-16">시작</span>
              <SSelect
                v-model="startHour"
                :option-list="hourOptions1"
                w-size="x-small"
                default-text="-"
                :disabled="getIsDisabled()"
              />
              <span class="divider tm-1b">:</span>
              <SSelect
                v-model="startMin"
                :option-list="minOptions"
                w-size="x-small"
                default-text="-"
                :disabled="getIsDisabled()"
              />
            </div>
            <div>
              <span class="mr-16">마감</span>
              <SSelect
                v-model="endHour"
                :option-list="hourOptions2"
                w-size="x-small"
                default-text="-"
                :disabled="getIsDisabled()"
              />
              <span class="divider tm-1b">:</span>
              <SSelect
                v-model="endMin"
                :option-list="minOptions"
                w-size="x-small"
                default-text="-"
                :disabled="getIsDisabled()"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="label large">
            <p class="tm-2m">최대인원<b class="must">*</b></p>
          </div>
          <div class="right max-input">
            <SInput v-model="maxCount" text-align="right" is-comma-num />
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
import SModal from '~/components/admin/modal/SModal';
import SButton from '~/components/admin/commons/SButton';
import SDialogModal from '~/components/admin/modal/SDialogModal';
import SDatepicker from '~/components/admin/commons/SDatepicker';
import SInput from '~/components/admin/commons/SInput';
import SSelect from '~/components/admin/commons/SSelect';
import { numberPad } from '~/assets/js/commons';

export default {
  name: 'ProgramEditModal',
  components: { SSelect, SInput, SDatepicker, SDialogModal, SButton, SModal },
  props: {
    isShow: {
      type: Boolean,
      required: false,
      default: false
    },
    isNew: {
      type: Boolean,
      required: false,
      default: false
    },
    exState: {
      type: String,
      required: false,
      default: ''
    },
    exStartDate: {
      type: String,
      required: false,
      default: ''
    },
    currentRoundData: {
      type: Object,
      required: false,
      default: () => null
    },
    modifyRoundData: {
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
      originIndex: null,
      id: null,
      selectedDate: '',
      startHour: 0,
      startMin: 0,
      endHour: 1,
      endMin: 0,
      maxCount: 0,
      errorModal: {
        isShow: false,
        msg: ''
      }
    };
  },
  watch: {
    isShow() {
      if (this.isNew) {
        this.resetData();
        this.selectedDate = this.currentRoundData.targetDate;
      } else {
        const [startHour, startMin] = this.modifyRoundData.startTime.split(':');
        const [endHour, endMin] = this.modifyRoundData.endTime.split(':');

        this.originIndex = this.modifyRoundData.dataIndex;
        this.id = this.modifyRoundData.id;
        this.startHour = Number(startHour);
        this.startMin = Number(startMin);
        this.endHour = Number(endHour);
        this.endMin = Number(endMin);
        this.maxCount = this.modifyRoundData.maxCount;
        this.selectedDate = this.modifyRoundData.date;
      }
    }
  },
  methods: {
    resetData() {
      this.originIndex = null;
      this.id = null;
      this.selectedDate = '';
      this.startHour = 0;
      this.startMin = 0;
      this.endHour = 1;
      this.endMin = 0;
      this.maxCount = 0;
    },
    getIsDisabled() {
      if (this.isNew) {
        return false;
      }
      const DISABLED_ADD_DAY = 90;
      const programState = this.exState;
      let getIsDisabled = false;

      if (programState !== 'SCHEDULE') {
        const targetDate = this.$dayjs(this.modifyRoundData.date);
        let disabledDay = '';

        if (programState === 'BOOKING') {
          disabledDay = this.$dayjs(this.exStartDate).add(DISABLED_ADD_DAY, 'd');
        } else if (programState === 'PROGRESS' || programState === 'TERMINATION') {
          disabledDay = this.$dayjs().add(DISABLED_ADD_DAY, 'd');
        }
        getIsDisabled = !targetDate.isSameOrAfter(disabledDay, 'day');
      }

      return getIsDisabled;
    },
    cancel() {
      this.$emit('close');
      this.resetData();
    },
    isValidate() {
      let isValid = false;

      if (!this.selectedDate) {
        this.errorModal.msg = '진행일을 선택해 주세요.';
      } else if (this.startHour == null || this.startMin == null) {
        this.errorModal.msg = '프로그램 시작시간을 선택해 주세요.';
      } else if (this.endHour == null || this.endMin == null) {
        this.errorModal.msg = '프로그램 마감시간을 선택해 주세요.';
      } else if (!this.isValidTimeOrder()) {
        this.errorModal.msg = '시작 시간은 마감 시간을 이전으로 선택해 주세요.';
      } else {
        isValid = true;
      }

      if (isValid === false) {
        this.errorModal.isShow = true;
      }

      return isValid;
    },
    isValidTimeOrder() {
      const date = this.selectedDate;
      const startDate = this.$dayjs(`${date} ${this.getPadTime(this.startHour, this.startMin)}`);
      const endDate = this.$dayjs(`${date} ${this.getPadTime(this.endHour, this.endMin)}`);

      return endDate.isAfter(startDate, 'minute');
    },
    saveRound() {
      if (this.isValidate()) {
        const roundData = this.getComputedRoundData();
        const modifyIndex = this.originIndex;

        this.$emit('setRound', { roundData, modifyIndex });
        this.resetData();
      }
    },
    getComputedRoundData() {
      const date = this.selectedDate;

      return {
        id: this.id && null,
        startDate: `${date} ${this.getPadTime(this.startHour, this.startMin)}`,
        endDate: `${date} ${this.getPadTime(this.endHour, this.endMin)}`,
        limitNumber: Number(this.maxCount),
        ticketTotalCount: 0,
        ticketUsedCount: 0
      };
    },
    getPadTime(hour, min) {
      return `${numberPad(hour, 2)}:${numberPad(min, 2)}:00`;
    }
  }
};
</script>

<style lang="scss" scoped>
.program-modal-edit {
  .must {
    color: var(--color-blue);
  }

  .row {
    display: flex;

    .label {
      position: relative;
      flex: 1 0 10.4rem;
      max-width: 10.4rem;
      text-align: left;

      > p {
        margin-top: 1rem;
      }
    }

    .right {
      flex: 1 1 auto;
      text-align: left;

      > div {
        display: flex;
        align-items: center;
      }

      &.max-input input {
        width: 100%;
      }
    }

    .divider {
      margin: 0 1.2rem;
    }
  }
}
</style>
