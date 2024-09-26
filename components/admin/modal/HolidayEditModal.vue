<template>
  <SModal :is-show="isShow" @close="cancel">
    <template #title>휴관일 일괄 설정</template>
    <template #content>
      <div class="round-modal-edit">
        <div class="select-range mb-24">
          <div class="label">
            <p class="tm-2m">범위 선택<b class="must">*</b></p>
          </div>
          <div>
            <div class="mb-12">
              <SDatepicker v-model="startDate" :max="endDate" w-size="large" />
              <span class="divider tm-1b">~</span>
              <SDatepicker v-model="endDate" :min="startDate" w-size="large" />
            </div>
            <SWeekTab v-model="selectedWeekDay" />
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
import SWeekTab from '~/components/admin/commons/SWeekTab';
import SDatepicker from '~/components/admin/commons/SDatepicker';
import SDialogModal from '~/components/admin/modal/SDialogModal';
import { numberPad } from '~/assets/js/commons';

export default {
  name: 'HolidayEditModal',
  components: { SDialogModal, SDatepicker, SWeekTab, SButton, SModal },
  props: {
    initStartDate: {
      type: String,
      required: false,
      default: ''
    },
    initWeekDays: {
      type: Array,
      required: false,
      default: () => []
    },
    isShow: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      startDate: '',
      endDate: '',
      selectedWeekDayOrigin: [],
      selectedWeekDay: [],
      roundList: [],
      errorModal: {
        isShow: false,
        msg: ''
      }
    };
  },
  computed: {
    deletedWeekDay() {
      return this.selectedWeekDayOrigin.filter((day) => !this.selectedWeekDay.includes(day));
    }
  },
  watch: {
    isShow(newValue) {
      if (newValue) {
        this.resetData();
      }
    }
  },
  methods: {
    cancel() {
      this.$emit('close');
      this.resetData();
    },
    resetData() {
      this.startDate = this.$dayjs(this.initStartDate).format('YYYY-MM-DD');
      this.endDate = this.$dayjs(this.initStartDate).add(10, 'y').format('YYYY-MM-DD');
      this.selectedWeekDay = this.initWeekDays.map((d) => this.$dayjs().day(d).locale('en').format('dddd'));
      this.selectedWeekDayOrigin = [...this.selectedWeekDay];
    },
    isValidate() {
      let isValid = true;

      if (!this.startDate || !this.endDate) {
        this.errorModal.msg = '기간을 선택해 주세요.';
        isValid = false;
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
        const updatedDateList = [];
        const removeDataList = [];

        for (let index = 0; index <= endDate.diff(startDate, 'd'); index++) {
          const newTargetDate = startDate.add(index, 'd');
          const weekDay = newTargetDate.locale('en').format('dddd');
          const formatTargetDate = newTargetDate.format('YYYY-MM-DD');

          if (this.selectedWeekDay.includes(weekDay)) {
            updatedDateList.push(formatTargetDate);
          }
          if (this.deletedWeekDay.includes(weekDay)) {
            removeDataList.push(formatTargetDate);
          }
        }

        this.$emit('setBatchHoliday', { updatedDateList, removeDataList });
        this.$emit('setSelectedDays', { selectedWeekDay: this.selectedWeekDay, startDate: this.startDate });
        this.resetData();
      }
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
}
</style>
