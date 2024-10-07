<template>
  <div class="coupon-card" @click="handleOpenModal">
    <div class="img-wrap">
      <img :src="detailCoupon.img" />
    </div>
    <div class="coupon-detail">
      <p class="name">{{ detailCoupon.name }}</p>
      <p class="date">
        <img src="~assets/img/icon/icon_calender.svg" />
        <span>{{ getFormattedDate(detailCoupon.startDate, detailCoupon.endDate) }}</span>
      </p>
      <div class="coupon-remaining">
        <div v-if="detailCoupon.isActive" class="status active">
          <span>사용완</span>
        </div>
        <div v-else class="status deactive">
          <span>사용완료</span>
        </div>
        <div>
          <span>{{ detailCoupon.quantity }}</span
          >회남음
        </div>
      </div>
      <modal-coupon-infor :detail-coupon="detailCoupon" :open="openModalQr" @close="handleCloseModal" />
    </div>
  </div>
</template>

<script>
import ModalCouponInfor from '../../modal/coupon/ModalCouponInfor.vue';
import { getDateCommonDateOutput } from '~/assets/js/commons';

export default {
  name: 'CouponCard',
  components: { ModalCouponInfor },
  props: {
    detailCoupon: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  data() {
    return {
      openModalQr: false
    };
  },
  computed: {
    createQrValue() {
      const { id, uuid } = this.detailCoupon;
      return uuid ? JSON.stringify({ id, uuid }) : '';
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
    column-gap: 8px;
    .status {
      border-radius: 6px;
      padding: 2px 8px;
      width: fit-content;
      font-size: 1.2rem;
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
