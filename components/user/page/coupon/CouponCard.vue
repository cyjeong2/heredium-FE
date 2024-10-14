<template>
  <div v-if="!isExpired" class="coupon-card">
    <div class="img-wrap">
      <img :src="couponImageSrc" />
    </div>
    <div class="coupon-detail">
      <p class="name">{{ detailCoupon.name }}</p>
      <p v-if="!isHistory" class="date">
        <img src="~assets/img/icon/icon_calender.svg" />
        <span>{{
          getFormattedDate(
            detailCoupon.unused_coupons[0].delivered_date,
            detailCoupon.unused_coupons[0].expiration_date
          )
        }}</span>
      </p>
      <div class="coupon-remaining">
        <div class="button">
          <UButton
            v-if="!isHistory"
            class="reservation-btn"
            :disabled="isExpired || detailCoupon.unused_coupons.length === 0"
            @click="handleOpenModal"
          >
            QR코드
          </UButton>
          <UButton v-else class="reservation-btn" disabled> QR코드 </UButton>
        </div>
        <div v-if="!isHistory && detailCoupon.unused_coupons.length > 0" class="status active">
          <span>사용완</span>
        </div>
        <div v-else class="status deactive">
          <span>사용완료</span>
        </div>
        <div>
          <span>{{ detail.length }}</span
          >회남음
        </div>
      </div>
      <modal-coupon-infor :detail-coupon="detailCoupon" :open="openModalQr" @close="handleCloseModal" />
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
    isHistory: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      openModalQr: false,
      isExpired: false,
      detail: {}
    };
  },
  computed: {
    createQrValue() {
      const { id, uuid } = this.detailCoupon;
      return uuid ? JSON.stringify({ id, uuid }) : '';
    },
    couponImageSrc() {
      return this.getImage(this.detailCoupon.image_url);
    }
  },
  created() {
    this.checkExpiration();

    if (this.isHistory) {
      this.detail = this.detailCoupon.used_coupons;
    } else {
      this.detail = this.detailCoupon.unused_coupons;
    }
  },
  methods: {
    getFormattedDate(startDate, endDate) {
      return getDateCommonDateOutput(startDate, endDate);
    },
    handleOpenModal() {
      this.openModalQr = true;
    },
    handleCloseModal() {
      this.openModalQr = false;
    },
    checkExpiration() {
      const endDateTime = new Date(this.detailCoupon.unused_coupons[0].expiration_date);
      const today = new Date();
      this.isExpired = endDateTime < today;
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
      height: 10.4rem;
      width: 10rem;

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

    .date {
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      column-gap: 4px;
      /* color: var(--color-u-placeholder); */
    }
  }

  &-detail {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    color: var(--color-u-placeholder);
  }

  &-remaining {
    display: flex;
    align-items: center;
    column-gap: 8px;

    .button {
      display: flex;
      align-items: center;
    }

    .reservation-btn {
      min-width: 83px !important;
      height: 22px;
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
</style>
