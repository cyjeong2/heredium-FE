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
      <div class="field-group">
        <label>쿠폰명<b class="must">*</b></label>
        <div class="field-value">
          <SInput
            v-model="couponEditor.name"
            :disabled="disabled"
            :class="{ 'is-error': error?.name || feedbackError?.name }"
            w-size="large"
          />
        </div>
      </div>
      <div v-if="isCouponDate" class="field-group">
        <label>사용기간<b class="must">*</b></label>
        <s-flex-input-grid>
          <template #input>
            <div v-if="isIssuance">
              <SDatepicker
                v-model="couponEditor.start_date"
                :max="couponEditor.end_date"
                :min="minDate"
                :class="{ 'is-error': error?.start_date || feedbackError?.start_date }"
              />
              <span class="ml-8 mr-8">~</span>
              <SDatepicker
                v-model="couponEditor.end_date"
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
              <div>
                <SCheckbox v-model="couponEditor.is_permanent" :disabled="disabled" />
                <p>상시할인</p>
              </div>
              </template>
          </s-flex-input-grid>
        </div>
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
    SDiscountInput
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
  },
  data() {
    return {
      couponEditor: {},
      couponTypeOptionList: COUPON_TYPE_OPTION_LIST,
      feedbackError: {},
      minDate: null
    };
  },

  watch: {
    couponEditor: {
      handler(newVal) {
        this.$emit('update-coupon', newVal);
      },
      deep: true
    },
    refreshTime: {
      handler(newVal) {
        this.couponEditor = cloneDeep(this.coupon || COUPON_DEFAULT);
      },
      deep: true
    },
    error: {
      handler() {
        this.feedbackError = {};
      },
      deep: true
    }
  },
  created() {
    this.couponEditor = cloneDeep(this.coupon || COUPON_DEFAULT);
    this.minDate = minDate;
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
  padding: 12px 20px;
  gap: 60px;
  background-color: #eff6ff !important;
  .benefit-thumbnail {
    width: 471px;
  }
  .benefit-information {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    flex: 1;
    .field-group {
      display: grid;
      grid-template-columns: 110px 1fr;
      gap: 12px;
      & > label {
        display: flex;
        align-items: center;
      }
      .field-value {
        width: 100%;
      }
      input {
        width: 100%;
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
  }
  .right {
    display: flex;
    justify-content: end;

    :last-child {
      margin-left: 8px;
    }
  }
  .must {
    color: var(--color-blue);
  }
}
</style>
