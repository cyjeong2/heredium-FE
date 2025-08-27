<template>
  <div class="benefit-container">
    <div class="benefit-thumbnail">
      <SImageUploadRepresentative
        :image-src="couponEditor.image_url"
        type="SMALL"
        :class="{ 'is-error': error?.imageUrl || feedbackError?.imageUrl }"
        :disabled="disabled"
        @image-uploaded="updateThumbnail"
        @image-removed="removeThumbnail"
      />
    </div>
    <div class="benefit-information">
      <div class="coupon-name">
        <label>쿠폰명<b class="must">*</b></label>
        <div class="field-value">
          <SDropdown
            v-if="!mode"
            v-model="dropdownValue"
            :option-list="couponListOptions"
            default-text='선택'
            placeholder="쿠폰을 선택하세요"
            w-size="x-large"
          />
          <SInput
            v-else
            v-model="couponEditor.name"
            placeholder="쿠폰명을 입력하세요"
            :disabled="disabled"
            w-size="x-large"
            :class="{ 'is-error': error?.name || feedbackError?.name }"
          />
        </div>
      </div>
      <div v-if="isCouponDate" class="field-group">
        <label>사용기간<b class="must">*</b></label>
        <s-flex-input-grid>
          <template #input>
            <div v-if="!couponEditor.is_recurring && !couponEditor.marketing_consent_benefit">
              <SDatepicker
                v-model="couponEditor.start_date"
                :readonly="disabled"
                :max="couponEditor.end_date"
                :min="couponEditor.start_date? couponEditor.start_date : minDate"
                :class="{ 'is-error': error?.start_date || feedbackError?.start_date }"
              />
              <span class="ml-8 mr-8">~</span>
              <SDatepicker
                v-model="couponEditor.end_date"
                :readonly="disabled"
                :min="couponEditor.start_date ? couponEditor.start_date : minDate"
                :class="{ 'is-error': error?.end_date || feedbackError?.end_date }"
              />
            </div>
            <div v-else class="field-value">
              <SInput
                v-model="couponEditor.period_in_days"
                :disabled="disabled"
                :class="{ 'is-error': error?.periodInDays || feedbackError?.periodInDays }"
                is-comma-num
                w-size="large"
              />
            </div>
          </template>
        </s-flex-input-grid>
      </div>
      <div class="field-group">
        <label>마케팅수신 동의 혜택</label>
        <div class="field-value checkbox-group">
          <SCheckbox v-model="couponEditor.marketing_consent_benefit" :disabled="disabled" />
        </div>
      </div>
      <div class="field-group">
        <label>쿠폰종류<b class="must">*</b></label>
        <div class="field-value input-group">
          <SDropdown
            v-model="couponEditor.coupon_type"
            :disabled="disabled"
            :class="{ 'is-error': error?.couponType || feedbackError?.couponType }"
            :option-list="couponTypeOptionList"
            w-size="large"
          ></SDropdown>
        </div>
      </div>
      <div class="field-group">
        <label>정기발송 유무</label>
        <div class="field-value checkbox-group">
          <SCheckbox v-model="couponEditor.is_recurring" :disabled="disabled" />
        </div>
      </div>
      <div class="field-group">
        <label>사용횟수</label>
        <div class="field-value input-group">
          <s-flex-input-grid>
            <template #input>
              <s-flex-input-grid>
                <template #input>
                  <SInput
                    v-model="couponEditor.number_of_uses"
                    is-comma-num
                    w-size="full"
                    maxlength="2"
                    :disabled="couponEditor.is_permanent || disabled"
                    :class="{ 'is-error': error?.numberOfUses || feedbackError?.numberOfUses }"
                  />
                </template>
                <template #content>회</template>
              </s-flex-input-grid>
            </template>
            <template #content>
              <div style="display: flex;">
                <SCheckbox v-model="couponEditor.is_permanent" :disabled="disabled" />
                <p>상시할인</p>
              </div>
              </template>
          </s-flex-input-grid>
        </div>
      </div>
      <div v-if="couponEditor.is_recurring" class="field-group">
        <label>정기발송 대상</label>
        <div class="field-value">
          <SMultiSelectDropdown
            v-model="couponEditor.recipient_type"
            :option-list="recipientTypeOptions"
            :disabled="disabled"
            :class="{ 'is-error': error?.recipient_type || feedbackError?.recipient_type }"
            default-text="선택"
            @input="$emit('update:recipientType', $event)"
          />
        </div>
      </div>
      <div v-else class="field-group">
         <label></label>
        <div class="field-value"></div>
      </div>
      <div class="field-group">
        <label>할인율<b class="must">*</b></label>
        <div class="field-value input-group">
          <s-flex-input-grid>
            <template #input>
              <SDiscountInput
                v-model="couponEditor.discount_percent"
                :class="{ 'is-error': error?.discountPercent || feedbackError?.discountPercent }"
                maxlength="3"
                w-size="large"
                :disabled="disabled"
              />
            </template>
            <template #content>%</template>
          </s-flex-input-grid>
        </div>
      </div>
      <div v-if="couponEditor.is_recurring" class="field-group">
        <label>정기발송 주기</label>
        <div class="field-value">
          <SDropdown
            v-model="couponEditor.send_day_of_month"
            :option-list="sendIntervalOptions"
            :class="{ 'is-error': error?.sendDayOfMonth || feedbackError?.sendDayOfMonth }"
            w-size="large"
            :disabled="disabled"
          />
        </div>
      </div>

      <div v-if="!disabled" class="right" :style="{ marginTop: isCouponDate ? '0px' : '60px' }">
        <SButton v-if="showDeleteButton" button-type="standard" w-size="medium" @click="handleDeleteCoupon"
          >쿠폰삭제</SButton
        >
        <SButton v-if="showAddButton" button-type="primary" w-size="medium" @click="handleAddNewCoupon"> 쿠폰추가 </SButton>
      </div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import SButton from '../../commons/SButton.vue';
import SCheckbox from '../../commons/SCheckbox.vue';
import SImageUploadRepresentative from '../../commons/SImageUploadRepresentative.vue';
import SInput from '../../commons/SInput.vue';
import SDropdown from '../../commons/SDropdown.vue';
import SDatepicker from '../../commons/SDatepicker.vue';
import SFlexInputGrid from '../../commons/SFlexInputGrid.vue';
import SDiscountInput from '../../commons/SDiscountInput.vue';
import { COUPON_DEFAULT, COUPON_TYPE_OPTION_LIST } from '~/assets/js/types';
import { getErrorCouponEditor } from '~/utils/coupon';
import { minDate } from '~/assets/js/commons';
import SMultiSelectDropdown from '~/components/admin/commons/SMultiSelectDropdown.vue'

export default {
  name: 'CouponEditor',
  components: {
    SImageUploadRepresentative,
    SCheckbox,
    SInput,
    SButton,
    SDropdown,
    SDatepicker,
    SFlexInputGrid,
    SDiscountInput,
    SMultiSelectDropdown,
  },
  props: {
    coupon: {
      type: Object,
      required: false,
      default: null
    },
    error: {
      type: Object,
      required: false,
      default: undefined
    },
    showAddButton: {
      type: Boolean,
      required: false,
      default: false
    },
    showDeleteButton: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isIssuance: {
      type: Boolean,
      required: false,
      default: false
    },
    validateBeforeAddNewCoupon: {
      type: Boolean,
      required: false,
      default: false
    },
    refreshTime: {
      type: Number,
      required: false,
      default: 0
    },
    isCouponDate: {
      type: Boolean,
      required: false,
      default: true,
    },
    couponList: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,  // null | 'add' | 'edit'
      default: null
    },
    selectedCouponId: {
      type: [String, Number],
      default: null
    },
  },
  data() {
    return {
      couponEditor: {},
      couponTypeOptionList: COUPON_TYPE_OPTION_LIST,
      feedbackError: {},
      minDate: null,
      recipientTypeOptions: [
        { value: 1, label: '마케팅 동의' },
        { value: 2, label: '마케팅 미동의' },
        // 값 변경
        { value: 6, label: '멤버십(CN PASS)' },
        { value: 7, label: '멤버십(CN PASS+)' },
        { value: 8, label: '멤버십(CN PASS STUDENT)' },
      ],
      sendIntervalOptions: Array.from({ length: 31 }, (_, i) => ({
        value: i + 1,
        label: `매월 ${i + 1}일`
      })),
      backupSelectedCouponId: null,
      backupCouponData: null,
    };
  },
  computed: {
    dropdownValue: {
      get() { return this.selectedCouponId },
      set(v) { this.$emit('update:selectedCouponId', v) }
    },
    couponListOptions() {
      return this.couponList.map(coupon => ({
        label: coupon.name,
        value: coupon.coupon_id
      }));
    },
  },
  watch: {
    // 마케팅 동의 체크했을 때
    'couponEditor.marketing_consent_benefit'(newVal) {
      if (newVal) {
        this.couponEditor.is_recurring = false;
      }
    },
    // 정기발송 유무 체크했을 때
    'couponEditor.is_recurring'(newVal) {
      if (newVal) {
        this.couponEditor.marketing_consent_benefit = false;
      }
    },
    selectedCouponId(newVal) {
      const selected = this.couponList.find(c => c.coupon_id === Number(newVal));
      if (selected) {
        this.couponEditor = {
          ...cloneDeep(selected),
          // BOTH of these must be real Date objects:
          start_date: selected.start_date
            ? this.$dayjs(selected.start_date).format('YYYY-MM-DD')
            : '',
          end_date: selected.end_date
            ? this.$dayjs(selected.end_date).format('YYYY-MM-DD')
            : '',
          is_recurring:             !!selected.is_recurring,
          recipient_type:           Array.isArray(selected.recipient_type)
                                    ? selected.recipient_type
                                    : selected.recipient_type != null
                                      ? [selected.recipient_type]
                                      : [],
          send_day_of_month:        selected.send_day_of_month ?? 1,
          marketing_consent_benefit: !!selected.marketing_consent_benefit
        };
      }
    },
    couponEditor: {
      deep: true,
      handler(newVal) {
        this.$emit('update-coupon', cloneDeep(newVal))
      }
    },
    // recipient_type 만 분리해서 emit
    'couponEditor.recipient_type'(newVal) {
      this.$emit('update:recipientType', newVal);
    },
    refreshTime: {
      handler(newVal) {
        this.couponEditor = cloneDeep(this.coupon || COUPON_DEFAULT);
      },
    },
    error: {
      handler() {
        this.feedbackError = {};
      },
    },
    couponList: {
      immediate: true,
      handler(newList) {
        // mode가 없고 아직 선택된 쿠폰이 없을 때만
        if (!this.mode && newList.length > 0 && this.selectedCouponId == null) {
          this.$emit('update:selectedCouponId', newList[0].coupon_id)
        }
      }
    },
  },
  created() {
    this.couponEditor = cloneDeep(this.coupon || COUPON_DEFAULT);
    this.minDate = minDate;
    this.couponEditor.is_recurring = false;
    this.couponEditor.send_day_of_month = this.sendIntervalOptions[0].value; // 매월
    this.couponEditor.marketing_consent_benefit = false;
  },
  methods: {
    updateThumbnail(e) {
      this.couponEditor.image_url = e.resizeImage.small;
    },
    removeThumbnail() {
      this.couponEditor.image_url = '';
    },
    handleAddNewCoupon() {
      if (!this.validateBeforeAddNewCoupon) {
        this.$emit('add-coupon');
        return null;
      }

      const feedbackError = getErrorCouponEditor(this.couponEditor, this.isIssuance);
      if (!feedbackError) {
        this.$emit('add-coupon');
        this.feedbackError = {};
        return null;
      }

      this.feedbackError = feedbackError;
    },
    handleDeleteCoupon() {
      this.$emit('delete-coupon');
    }
  }
};
</script>

<style scoped lang="scss">
.benefit-container {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background: #eff6ff;
  gap: 24px;

  .benefit-thumbnail {
    flex: 0 0 400px; /* 썸네일 영역 너비 고정 */
  }

  .benefit-information {
    display: grid;
    grid-template-columns: 80px 1fr 100px 1fr; /* 레이블(110) + 입력(1fr) */
    column-gap: 20px;
    row-gap: 16px;
    width: 65%;
    min-width: 400px; /* 너무 작아지지 않도록 최소폭 */

    /* 쿠폰명만 full-width */
    .coupon-name {
      display: flex;
      grid-column: 1 / -1;
      align-items: center;

      label{
        width: 101px;
      }
      .field-value{
        width: 80%;
      }
    }

    /* 1. field-group 레이블과 값 세로 중앙 정렬 */
    .field-group > label,
    .field-group > .field-value {
      display: flex;
      align-items: center;
    }

    /* 2. 체크박스 전용 스타일 */
    .field-value.checkbox-group {
      /* checkbox만 들어가는 field-value 에 적용 */
      justify-content: flex-start;  /* 필요에 따라 왼쪽 정렬 */
      > * {
        margin-right: 8px;          /* 체크박스와 텍스트 간 간격 */
      }
    }

    .field-group {
      display: contents; /* 자식(label, .field-value) 그리드에 직접 노출 */
      & > label {
        display: flex;
        align-items: center;
      }
      .input-group {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        input {
          width: calc(100% - 170px);
        }
        p {
          display: inline;
          margin-left: 8px;
        }
      }
    }
    label {
      display: flex;
      align-items: center;
      font-weight: 500;
    }
    .field-value {
      width: 100%;
    }

    /* 버튼 행은 맨 마지막에 full-width 로 정렬 */
    .button-row {
      grid-column: 1 / -1;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }
    .input-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      input {
        width: calc(100% - 170px);
      }
      p {
        display: inline;
        margin-left: 8px;
      }
    }
  }

  .must {
    color: var(--color-blue);
    margin-left: 4px;
  }
}

/* make the dropdown fill its grid‐cell / column */
.benefit-information .dropdown {
  position: relative;
  width: 100%;
  overflow: visible; /* allow menu to spill out */
}

/* the button itself should also stretch */
.benefit-information .dropdown-btn {
  width: 100%;
}

/* and ensure the menu is at least as wide as its button,
   and that long text doesn’t wrap into multiple lines */
.benefit-information .dropdown-menu {
  min-width: 100%;
  white-space: nowrap;
}
</style>
