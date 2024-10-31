<template>
  <div>
    <div class="img-wrap">
      <img :src="couponImageSrc" />
    </div>
    <div class="coupon-detail">
      <p class="name">{{ detailCoupon.name }}</p>
      <div class="discount">
        <div class="date">
          <img src="~assets/img/icon/icon_discount_tag.svg" />
          <span>{{ detailCoupon.discount_percent === 100 ? '무료' : `${detailCoupon.discount_percent}%` }}</span>
        </div>
        <div class="date">
          <img src="~assets/img/icon/icon_calender.svg" />
          <span>{{
            getFormattedDate(detailCoupon.used_coupons[0].delivered_date, detailCoupon.used_coupons[0].expiration_date)
          }}</span>
        </div>
      </div>
      <div class="coupon-remaining">
        <div class="button">
          <UButton class="reservation-btn" disabled> QR코드 </UButton>
        </div>
        <div class="status deactive">
          <span>사용완료</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UButton from '../../common/UButton.vue';
import { getDateCommonDateOutput } from '~/assets/js/commons';
import { imageMixin } from '~/mixins/imageMixin';

export default {
  name: 'CouponCardDisabled',
  components: { UButton },
  mixins: [imageMixin],
  props: {
    detailCoupon: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  data() {
    return {
      isExpired: false,
      detail: {}
    };
  },
  computed: {
    couponImageSrc() {
      return this.getImage(this.detailCoupon.image_url);
    }
  },
  methods: {
    getFormattedDate(startDate, endDate) {
      return getDateCommonDateOutput(startDate, endDate);
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
