<template>
  <div
    v-if="showCoupon"
    :class="{ checked: isChecked, 'full-width': isSelection }"
    class="coupon-card"
    @click="toggleCheck"
  >
    <div class="img-wrap">
      <img :src="couponImageSrc" />
    </div>
    <div class="coupon-detail">
      <p class="name">{{ detailCoupon.name }}</p>
      <div class="discount">
        <!-- <div v-if="!isSelection" class="date">
          <img src="~assets/img/icon/icon_discount_tag.svg" />
          <span>{{ detailCoupon.discount_percent === 100 ? '무료' : `${detailCoupon.discount_percent}%` }}</span>
        </div> -->
        <div class="date">
          사용기간:
          <span>{{
            getFormattedDate(
              detailCoupon.unused_coupons[0].delivered_date,
              detailCoupon.unused_coupons[0].expiration_date
            )
          }}</span>
        </div>
      </div>
      <div>
        <div class="date">
          사용여부:
          <span v-if="detailCoupon.unused_coupons.length > 0">사용가능</span>
          <span v-else>사용완료</span>
        </div>
      </div>
      <div class="coupon-remaining">
        <div v-if="!isSelection" class="button">
          <UButton
            class="reservation-btn"
            w-size="100"
            :disabled="isExpired || isCouponAwaitingStart || detailCoupon.unused_coupons.length === 0"
            @click="handleOpenModal"
          >
            QR코드
          </UButton>
        </div>
        <!-- <div v-if="isSelection" class="date">
          <img src="~assets/img/icon/icon_discount_tag.svg" />
          <span>{{ detailCoupon.discount_percent === 100 ? '무료' : `${detailCoupon.discount_percent}%` }}</span>
        </div> -->
        <!-- <div v-if="detailCoupon.unused_coupons.length > 0" class="status active">
          <span>사용가능</span>
        </div>
        <div v-else class="status deactive">
          <span>사용완료</span>
        </div> -->
        <!-- <div>
          <span>{{
            detailCoupon.unused_coupons[0].is_permanent ? '상시할인' : `${detailCoupon.unused_coupons.length}회남음`
          }}</span>
        </div> -->
      </div>
      <modal-coupon-infor :detail-coupon="detailCoupon" :open="openModalQr" @close="handleCloseModal" />
    </div>
    <div v-if="isSelection" class="select-box">
      <input type="radio" class="hidden-radio" :value="detailCoupon.id" @change="handleChange" />
      <div class="circle" :class="{ active: isChecked }"></div>
    </div>
  </div>
</template>

<script>
import UButton from '../../common/UButton.vue';
import ModalCouponInfor from '../../modal/coupon/ModalCouponInfor.vue';
import { imageMixin } from '~/mixins/imageMixin';
import { getDateCommonDateOutput } from '~/assets/js/commons';

export default {
  name: 'CouponCard',
  components: { ModalCouponInfor, UButton },
  mixins: [imageMixin],
  props: {
    detailCoupon: {
      type: Object,
      required: false,
      default: () => {}
    },
    isSelection: {
      type: Boolean,
      required: false,
      default: false
    },
    value: {
      type: [String, Number],
      required: false,
      default: ''
    },
    change: {
      type: Function,
      required: true
    },
    modelValue: {
      required: true,
      validator(value) {
        return value === null || ['number', 'string'].includes(typeof value);
      }
    }
  },
  data() {
    return {
      openModalQr: false,
      isExpired: false
    };
  },
  computed: {
    couponImageSrc() {
      return this.getImage(this.detailCoupon.image_url);
    },
    isChecked() {
      return this.modelValue === this.value;
    },
    isCouponAwaitingStart() {
      const deliveredDate = this.detailCoupon?.unused_coupons?.[0].delivered_date;
      if (!deliveredDate) return true;
      const today = this.$dayjs().startOf('day');
      const startDate = this.$dayjs(deliveredDate, 'YYYY-MM-DD HH:mm:ss', true);
      if (!startDate.isValid()) {
        return true;
      }
      return today.isBefore(startDate);
    },
    showCoupon() {
      if (this.isExpired) {
        return false;
      }
      if (this.isSelection && this.isCouponAwaitingStart) {
        return false;
      }
      return true;
    }
  },
  created() {
    this.checkExpiration();
  },
  methods: {
    toggleCheck() {
      if (this.isSelection) {
        this.change(this.value);
      }
    },
    handleChange() {
      this.$emit('input', this.value);
    },
    getFormattedDate(startDate, endDate) {
      return getDateCommonDateOutput(startDate, endDate);
    },
    handleOpenModal() {
      this.openModalQr = true;
    },
    handleCloseModal() {
      this.openModalQr = false;
      this.$emit('refresh-coupon-list');
    },
    checkExpiration() {
      this.isExpired = this.detailCoupon?.unused_coupons?.every((coupon) => coupon.is_expired);
    }
  }
};
</script>

<style lang="scss" scoped>
.coupon {
  &-card {
    display: flex;
    align-items: center;
    margin-bottom: 1.2rem;
    column-gap: 1.2rem;

    &:hover {
      cursor: pointer;
    }

    .img-wrap {
      height: 12rem;
      width: 12rem;

      > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .name {
      font-weight: 700;
      color: var(--color-default);
    }

    .discount {
      display: flex;
      column-gap: 12px;
    }

    .date {
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      column-gap: 4px;
      min-width: 5.2rem;
    }

    &.checked {
      border: 1px solid var(--color-u-primary);
      background-color: #f7f8f5;
    }
  }

  &-detail {
    display: flex;
    flex: 1;
    flex-direction: column;
    row-gap: 8px;
    color: var(--color-u-placeholder);
  }

  &-remaining {
    display: flex;
    align-items: center;
    column-gap: 8px;
    font-size: 1.2rem;

    .button {
      display: block;
      width: 100%;
    }

    .reservation-btn {
      min-width: 83px !important;
      height: 32px;
      font-size: 1.4rem;
      font-weight: 500;
    }

    .status {
      border-radius: 6px;
      padding: 2px 8px;
      width: fit-content;
      font-size: 1.2rem;
      height: 22px;
      display: flex;
      align-items: center;

      &::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 100%;
        display: inline-block;
        margin-right: 6px;
      }
    }

    .active {
      background-color: #f0fdf4;
      color: #15803d;
      border: 1px solid #bbf7d0;

      &::before {
        background-color: #22c55e;
      }
    }

    .deactive {
      background-color: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fecaca;

      &::before {
        background-color: #ef4444;
      }
    }

    & > div:nth-child(2) > span {
      font-size: 1.2rem;
      font-weight: 700;
      margin-right: 3px;
    }
  }

  .button {
    width: 100% !important;
  }
}

.hidden-radio {
  display: none;
}

.circle {
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--color-u-grey-2);
  background-color: var(--color-white);
  border-radius: 50%;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, border-color 0.3s;
}
.circle.active {
  border-color: var(--color-u-primary);
  position: relative;
}
.circle.active::after {
  position: absolute;
  left: 50%;
  top: 50%;
  content: '';
  width: 1rem;
  height: 1rem;
  background-color: var(--color-u-primary);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.select-box {
  flex: 1;
  display: flex;
  justify-content: end;
}

.full-width {
  max-width: unset !important;
}

@media screen and (min-width: 769px) {
  .coupon-card {
    max-width: 400px;
  }
}
</style>
