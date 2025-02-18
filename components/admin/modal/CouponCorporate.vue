<template>
  <SModal :is-show="true" width="1200px" @close="onclose">
    <template v-if="mode === 'create'" #title>법인 항목 추가</template>
    <template v-else #title>기업 회원 이름 업데이트</template>

    <template #content>
      <div class="content">
        <div class="field-group">
          <label class="mr-24">법인 회원 이름</label>
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
            :key="coupon.id || coupon.tempId"
            :coupon="coupon"
            :show-add-button="couponIndex === coupons.length - 1"
            :show-delete-button="coupons.length > 1"
            :error="isSubmitted && feedback?.coupons?.[couponIndex]"
            @add-coupon="handleAddCoupon(membershipIndex)"
            @update-coupon="(e) => handleUpdateCoupon(e, couponIndex)"
            @delete-coupon="() => handleDeleteCoupon(couponIndex)"
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
  props: {
    initialValue: {
      type: Object,
      required: false,
      default: undefined
    },
    mode: {
      type: String, // create | update
      require: true,
      default: 'create'
    },
    onSuccess: {
      type: Function,
      require: false,
      default: undefined
    }
  },
  data() {
    return {
      id: this.$props.initialValue?.companyId || '',
      companyName: this.$props.initialValue?.companyName || '',
      coupons: this.$props.initialValue?.companyCoupons || [cloneDeep(COUPON_DEFAULT)],
      feedback: {},
      isSubmitted: false,
      deletedCoupons: []
    };
  },
  methods: {
    onclose() {
      this.$emit('close');
    },
    handleUpdateCoupon(newCouponData, couponIndex) {
      this.coupons[couponIndex] = cloneDeep(newCouponData);
    },
    handleDeleteCoupon(couponIndex) {
      if (this.coupons[couponIndex].id) {
        this.deletedCoupons.push(this.coupons[couponIndex]);
      }
      this.coupons.splice(couponIndex, 1);
    },
    handleAddCoupon(membershipIndex) {
      this.coupons.push(cloneDeep({ ...COUPON_DEFAULT, tempId: Date.now() }));
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

        if (this.mode === 'create') {
          await this.$axios.post('/admin/companies', requestBody);
        } else {
          await this.$axios.put(`/admin/companies/${this.id}/detail`, {
            id: this.id,
            ...requestBody,
            coupons: [...requestBody.coupons, ...this.deletedCoupons.map((item) => ({ ...item, is_deleted: true }))]
          });
        }

        this.onSuccess?.();
        this.onclose();
      } catch (error) {
        alert(error.response.data?.BODY || API_ERROR);
      } finally {
        this.isSubmitted = false;
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
