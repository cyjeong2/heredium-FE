<template>
  <SModal :is-show="isShow" @close="handleClose">
    <template #title>마일리지 등록</template>

    <template #content>
      <div class="mileage-modal">
        <!-- 1. 카테고리 -->
        <div class="row mb-13">
          <label>카테고리<b class="must">*</b></label>
          <SSelect
            v-model="form.category"
            :option-list="categoryOptions"
            default-text="카테고리를 선택해주세요"
            w-size="s-large"
          />
        </div>

        <!-- 2. 구분 -->
        <div class="row mb-13">
          <label>구분<b class="must">*</b></label>
          <SSelect
            v-model="form.type"
            :option-list="typeOptions"
            default-text="구분을 선택해주세요"
            w-size="s-large"
          />
        </div>

        <!-- 3. 결제방법 -->
        <div class="row mb-13">
          <label>결제방법<b class="must">*</b></label>
          <div class="options">
            <SRadio v-model="form.paymentMethod" value="ONLINE">온라인</SRadio>
            <SRadio v-model="form.paymentMethod" value="OFFLINE">오프라인</SRadio>
          </div>
        </div>

        <!-- 4. 일련번호 -->
        <div class="row mb-13">
          <label>일련번호<b class="must">*</b></label>
          <SInput
            v-model="form.serialNumber"
            placeholder="하나나문자+5자리(영문) 또는 오프라인"
            w-size="s-large"
            maxlength="15"
          />
        </div>

        <!-- 5. 적립마일리지 -->
        <div class="row">
          <label>적립마일리지<b class="must">*</b></label>
          <SInput
            v-model.number="form.mileage"
            type="text"
            is-numeric
            text-align="right"
            placeholder="숫자를 입력해주세요"
            w-size="s-large"
            :min="-99"
            :max="99"
          />
        </div>
      </div>
    </template>

    <template #modal-btn1>
      <SButton @click="handleClose">취소</SButton>
    </template>
    <template #modal-btn2>
      <SButton button-type="primary" @click="submit">등록</SButton>
    </template>
  </SModal>
</template>

<script>
import SModal from '~/components/admin/modal/SModal';
import SSelect from '~/components/admin/commons/SSelect';
import SInput from '~/components/admin/commons/SInput';
import SButton from '~/components/admin/commons/SButton';
import SRadio from '~/components/admin/commons/SRadio';

export default {
  name: 'MileageForm',
  components: { SModal, SSelect, SInput, SButton, SRadio },
  props: {
    accountId: { type: [String, Number] , required: true },
    isShow:    { type: Boolean, default: false }
  },
  data() {
    const initialForm = {
      category:      null,
      type:          null,
      paymentMethod: 'ONLINE',
      serialNumber:  '',
      mileage:       null
    };
    return {
      initialForm,
      form: { ...initialForm },
      categoryOptions: [
        { label: '멤버십', value: 'MEMBERSHIP' },
        { label: '프로그램', value: 'PROGRAM' },
        /* … */
      ],
      typeOptions: [
        { label: '자동', value: 'AUTO' },
        { label: '수동', value: 'MANUAL' },
        /* … */
      ]
    };
  },
  watch: {
    // 2) 모달이 열릴 때마다 초기화
    isShow(newVal) {
      if (newVal) {
        this.form = { ...this.initialForm };
      }
    }
  },
  methods: {
    submit() {
      // 간단 검증
      console.log('this.accountId', this.accountId)
      if (!this.form.category || !this.form.type || !this.form.mileage) {
        return alert('필수 항목을 모두 입력해주세요.');
      }
      this.$emit('save', { accountId: this.accountId, ...this.form });
    },
    handleClose() {
      this.$emit('close');
      this.form = { ...this.initialForm };
    }
  }
};
</script>

<style scoped>
.mileage-modal .row {
  display: flex;
  align-items: center;
}
.mileage-modal .row > label {
  width: 10rem;            /* 레이블 영역 너비 고정 */
  flex-shrink: 0;
}
.mileage-modal .row .options {
  display: flex;
  gap: 1rem;
}
.w-full {
  width: 100%;
}
.mb-13 {
  margin-bottom: 2.0rem;
}
.must {
  color: var(--color-blue);
}
</style>
