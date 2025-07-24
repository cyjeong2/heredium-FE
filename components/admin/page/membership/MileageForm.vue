<template>
  <div>
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
              :class="{ 'is-error': error?.category || feedback?.category }"
            />
          </div>

          <!-- 2. 제목 -->
          <div class="row mb-13">
            <label>제목<b class="must">*</b></label>
            <SSelect
              v-model="form.categoryId"
              :option-list="titleOptions"
              default-text="제목을 선택해주세요"
              w-size="s-large"
              :class="{ 'is-error': error?.categoryId || feedback?.categoryId }"
            />
          </div>

          <!-- 3. 결제방법 -->
          <div class="row mb-13">
            <label>결제방법<b class="must">*</b></label>
            <div class="options">
              <SRadio
                v-for="opt in paymentMethodOptions"
                :key="opt.value"
                v-model="form.paymentMethod"
                :value="opt.value"
                :class="{ 'is-error': error?.paymentMethod || feedback?.paymentMethod }"
              >
                {{ opt.label }}
              </SRadio>
            </div>
          </div>

          <!-- 4. 일련번호 -->
          <div class="row mb-13">
            <label>일련번호<b class="must">*</b></label>
            <SInput
              v-model="form.serialNumber"
              placeholder="하나나문자+5자리(영문) 또는 오프라인"
              w-size="s-large"
              maxlength="20"
              :class="{ 'is-error': error?.serialNumber || feedback?.serialNumber }"
            />
          </div>

          <!-- 5. 결제금액 -->
          <!-- -입력 못하도록 -->
          <div class="row">
            <label>결제금액<b class="must">*</b></label>
            <SInput
              v-model.number="form.paymentAmount"
              type="text"
              is-numeric
              text-align="right"
              placeholder="결제금액을 입력해주세요"
              w-size="s-large"
              is-comma-num
              :class="{ 'is-error': error?.paymentAmount || feedback?.paymentAmount }"
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
    <SDialogModal :is-show="isShowErrorModal" @close="isShowErrorModal = false">
      <template #content>{{ errorMsg }}</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="isShowErrorModal = false">확인</SButton>
      </template>
    </SDialogModal>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import SModal from '~/components/admin/modal/SModal';
import SSelect from '~/components/admin/commons/SSelect';
import SInput from '~/components/admin/commons/SInput';
import SButton from '~/components/admin/commons/SButton';
import SRadio from '~/components/admin/commons/SRadio';
import SDialogModal from '~/components/admin/modal/SDialogModal';
import { CATEGORY_TYPE, PAYMENT_METHOD_TYPE } from '~/assets/js/types';

export default {
  name: 'MileageForm',
  components: { SModal, SSelect, SInput, SButton, SRadio, SDialogModal },
  props: {
    accountId: { type: [String, Number] , required: true },
    isShow:    { type: Boolean, default: false },
    error:     { type: Object, default: () => ({}) }
  },
  data() {
    const initialForm = {
      category:      null,
      categoryId:    null,
      paymentMethod: null,
      serialNumber:  '',
      paymentAmount:  null,
      mileageAmount: null,
    };
    return {
      initialForm,
      form: { ...initialForm },
      titleOptions: [],
      feedback: {},
      errorMsg: '',
      isShowErrorModal: false,
    };
  },
  computed: {
    categoryOptions() {
      return Object.entries(CATEGORY_TYPE).map(([value, label]) => ({
        label,
        value: Number(value)
      }));
    },
    paymentMethodOptions() {
      return Object.entries(PAYMENT_METHOD_TYPE).map(([value, label]) => ({
        label,
        value
      }));
    }
  },
  watch: {
    // 2) 모달이 열릴 때마다 초기화
    isShow(newVal) {
      if (newVal) {
        this.form = { ...this.initialForm };
        this.titleOptions = [];
      }else{
        this.feedback = {};
        this.errorMsg = '';
        this.isShowErrorModal = false;
      }
    },
    // category가 바뀔 때마다 호출
    'form.category'(newCategory) {
      this.form.categoryId = null;        // 이전 선택 초기화
      this.titleOptions = [];        // 이전 옵션 초기화
      if (newCategory == null) return;

      // API 요청
      this.$axios.$get(`/admin/membershipMileage/category/${newCategory}`)
      .then(items => {
        this.titleOptions = items.map(item => ({
          label: item.title,
          value: item.id
        }));
      })
      .catch(() => {
        this.titleOptions = [];
      });
    }
  },
  methods: {
    validateItem(){
      const fb = {};

      if (this.form.category   == null)               fb.category = true;
      if (this.form.categoryId == null)               fb.categoryId = true;
      if (this.form.paymentMethod == null)            fb.paymentMethod = true;
      if (! (String(this.form.serialNumber).trim()) ) fb.serialNumber = true;
      if (!(this.form.paymentAmount > 0))             fb.paymentAmount = true;

      return isEmpty(fb) ? null : fb;
    },
    submit() {
      const fb = this.validateItem();

      if (fb) {
        this.feedback = fb;
        this.errorMsg = '필수 입력 항목을 모두 채워주세요.';
        this.isShowErrorModal = true;
        return;
      }

      this.form.mileageAmount = Math.floor(this.form.paymentAmount / 1000);
      this.$emit('save', { accountId: this.accountId, ...this.form });
    },
    handleClose() {
      this.$emit('close');
      this.form = { ...this.initialForm };
      this.feedback = {};            // 에러 표시 초기화
      this.errorMsg = '';
      this.isShowErrorModal = false;
    },
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
.is-error {
  border-color: #d93025 !important;
}
</style>
