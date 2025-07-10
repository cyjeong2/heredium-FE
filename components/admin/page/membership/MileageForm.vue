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

        <!-- 2. 제목 -->
        <div class="row mb-13">
          <label>제목<b class="must">*</b></label>
          <SSelect
            v-model="form.categoryId"
            :option-list="titleOptions"
            default-text="제목을 선택해주세요"
            w-size="s-large"
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
            maxlength="15"
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
import { CATEGORY_TYPE, PAYMENT_METHOD_TYPE } from '~/assets/js/types';

export default {
  name: 'MileageForm',
  components: { SModal, SSelect, SInput, SButton, SRadio},
  props: {
    accountId: { type: [String, Number] , required: true },
    isShow:    { type: Boolean, default: false }
  },
  data() {
    const initialForm = {
      category:      null,
      categoryId:          null,
      paymentMethod: '0',
      serialNumber:  null,
      paymentAmount:  null,
      mileageAmount: null,
    };
    return {
      initialForm,
      form: { ...initialForm },
      titleOptions: [],
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
    submit() {
      this.form.mileageAmount = Math.floor(this.form.paymentAmount / 1000);
      this.$emit('save', { accountId: this.accountId, ...this.form });
    },
    handleClose() {
      this.$emit('close');
      this.form = { ...this.initialForm };
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
</style>
