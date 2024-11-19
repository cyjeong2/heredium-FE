<template>
  <SModal :is-show="true" width="1200px" @close="onclose">
    <template #title>법인회원 등록</template>
    <template #content>
      <div class="content">
        <div class="field-group">
          <label class="mr-24"> 법인 항목 추가 </label>
          <SInput
            v-model="companyName"
            w-size="large"
            :class="{ 'is-error': isSubmitted && feedback.companyName }"
            :disabled="disabled"
          />
        </div>
        <div class="field-group coupon-list">
          <CouponEditor
            v-for="(coupon, couponIndex) in coupons"
            :key="couponIndex"
            :coupon="coupon"
            :show-add-button="couponIndex === coupons.length - 1"
            :error="isSubmitted && feedback?.coupons?.[couponIndex]"
            @add-coupon="handleAddCoupon(membershipIndex)"
            @update-coupon="(e) => handleUpdateCoupon(e, couponIndex)"
          />
        </div>
      </div>
    </template>
    <template #modal-btn1>
      <SButton button-type="primary" @click="handleCreateCouponCompany">확인</SButton>
    </template>
  </SModal>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import SInput from '../commons/SInput.vue';
import SModal from './SModal.vue';
import CouponEditor from '~/components/admin/page/membership/CouponEditor.vue';
import { COUPON_DEFAULT } from '~/assets/js/types';
import SButton from '~/components/admin/commons/SButton';
import { API_ERROR } from '~/utils/message';

export default {
  name: 'CouponCorporate',
  components: { SModal, SInput, CouponEditor, SButton },
  data() {
    return {
      companyName: '',
      coupons: [cloneDeep(COUPON_DEFAULT)],
      feedback: {},
      isSubmitted: false
    };
  },
  methods: {
    onclose() {
      this.$emit('close');
    },
    handleUpdateCoupon(newCouponData, couponIndex) {
      this.coupons[couponIndex] = cloneDeep(newCouponData);
    },
    handleAddCoupon(membershipIndex) {
      this.coupons.push(cloneDeep(COUPON_DEFAULT));
    },
    validateCouponItem(couponItem) {
      const feedback = {};
      if (!couponItem.name) {
        feedback.name = true;
      }
      if (!couponItem.coupon_type) {
        feedback.couponType = true;
      }
      if (!couponItem.discount_percent || isNaN(Number(couponItem.discount_percent))) {
        feedback.discountPercent = true;
      } else if (Number(couponItem.discount_percent) > 100) {
        feedback.discountPercent = true;
      }
      if (!couponItem.period_in_days || isNaN(Number(couponItem.period_in_days))) {
        feedback.periodInDays = true;
      }
      if (!couponItem.image_url) {
        feedback.imageUrl = true;
      }
      if (!couponItem.is_permanent) {
        if (!couponItem.number_of_uses || isNaN(Number(couponItem.number_of_uses))) {
          feedback.numberOfUses = true;
        }
      }
      if (isEmpty(feedback)) {
        return null;
      }
      return feedback;
    },
    validateForm() {
      let isValid = true;
      const feedback = { coupons: [] };
      if (!this.companyName) {
        feedback.companyName = true;
        isValid = false;
      }
      for (let couponIndex = 0; couponIndex < this.coupons.length; couponIndex++) {
        const couponItem = this.coupons[couponIndex];
        const couponFeedback = this.validateCouponItem(couponItem);
        feedback.coupons[couponIndex] = couponFeedback;
      }
      const emptyErrorCoupon = feedback.coupons.every((couponFeedback) => !couponFeedback);
      if (!emptyErrorCoupon) {
        isValid = false;
      } else {
        feedback.coupons = [];
      }
      this.feedback = feedback;
      return isValid;
    },
    async handleCreateCouponCompany() {
      this.isSubmitted = true;
      const isValidForm = this.validateForm();
      if (!isValidForm) {
        return null;
      }
      try {
        const requestBody = {
          name: this.companyName,
          coupons: this.coupons
        };
        await this.$axios.post('/admin/companies', requestBody);
        this.onclose();
      } catch (error) {
        alert(API_ERROR);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.content,
.field-group {
  width: 100%;
  text-align: start;
}
.content {
  max-height: 80vh;
  overflow-y: auto;
}
.field-group + .field-group {
  margin-top: 24px;
}
.coupon-list > div + div {
  margin-top: 12px;
}
</style>
