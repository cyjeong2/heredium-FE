<template>
  <UModal :is-show="open" class="modal-custom" hide-edge-close-btn hide-head @close="handleClose">
    <template #content>
      <div class="head">
        <div class="coupon-detail center">
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
        </div>
        <button type="button" class="close-btn" @click="handleClose">
          <i class="ic-close" />
        </button>
      </div>
      <div class="center">
        <QrcodeVue :value="createQrValue" :size="250" level="H" />
      </div>
      <div class="button">
        <u-button button-type="primary" @click="handleClose">OK</u-button>
      </div>
    </template>
  </UModal>
</template>

<script>
import QrcodeVue from 'qrcode.vue';
import UButton from '../../common/UButton.vue';
import UModal from '~/components/user/modal/UModal.vue';
import { getDateCommonDateOutput } from '~/assets/js/commons';

export default {
  name: 'ModalCouponInfor',
  components: { UModal, QrcodeVue, UButton },
  props: {
    detailCoupon: {
      type: Object,
      required: true,
      default: () => {}
    },
    open: {
      type: Boolean,
      required: true,
      default: false
    }
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
    handleClose(event) {
      event.stopPropagation();
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-custom {
  .head {
    position: relative;
    .close-btn {
      position: absolute;
      top: 18%;
      right: -6px;
      transform: translateY(-50%);
      font-size: 2.4rem;
    }
  }
  .coupon {
    &-detail {
      display: flex;
      flex-direction: column;
      row-gap: 8px;
      color: var(--color-u-placeholder);
      border-bottom: 1px solid #d1d5db;
      padding-bottom: 2rem;
      margin-bottom: 2rem;

      .name {
        margin-top: 3.2rem;
        font-weight: 700;
        font-size: 1.8rem;
        color: var(--color-default);
      }
      .date {
        font-size: 1.4rem;
        display: flex;
        align-items: center;
        column-gap: 4px;
      }
    }

    &-remaining {
      display: flex;
      column-gap: 8px;
      font-size: 1.2rem;
      .status {
        border-radius: 6px;
        padding: 2px 8px;
        width: fit-content;
        line-height: initial;
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
  }

  .button {
    margin-top: 2rem;
    margin-bottom: 3.2rem;
    button {
      width: 100% !important;
    }
  }
}
</style>
