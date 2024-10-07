<template>
  <KeepAlive>
    <UModal :is-show="open" class="modal-custom" @close="handleClose">
      <template #title>
        <p class="center title-modal">헤레디움 멤버십</p>
      </template>
      <template #content>
        <div class="center qr-box">
          <p class="name-membership">등급 : {{ dataMerbership.name }}</p>
          <p>유효기간: {{ getFormattedDate(dataMerbership.startDate, dataMerbership.endDate) }}</p>
          <QrcodeVue :value="createQrValue" :size="250" level="H" />
        </div>
        <div class="benefit">
          <p class="title">이용가능 혜택</p>
          <div class="benefit-box">
            <div v-for="(item, index) in dataMerbership.benefits" :key="index" class="benefit-card">
              <p class="benefit-card-name">{{ item.coupon_name }}</p>
              <p class="benefit-card-quantity">{{ item.quantity }}</p>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </KeepAlive>
</template>

<script>
import QrcodeVue from 'qrcode.vue';
import UModal from '~/components/user/modal/UModal.vue';
import { getDateCommonDateOutput } from '~/assets/js/commons';
export default {
  name: 'ModalMembershipInfor',
  components: { UModal, QrcodeVue },
  props: {
    dataMerbership: {
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
      const { id, uuid } = this.dataMerbership;

      return uuid ? JSON.stringify({ id, uuid }) : '';
    }
  },
  methods: {
    getFormattedDate(startDate, endDate) {
      return getDateCommonDateOutput(startDate, endDate);
    },
    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-custom {
  .title-modal {
    margin-top: 2rem;
  }

  .qr-box {
    color: var(--color-u-placeholder);
    border-bottom: 1px solid #d1d5d8;
    padding-bottom: 2rem;

    .name-membership {
      font-weight: bold;
      color: var(--color-u-primary);
    }

    & > p:nth-child(2) {
      margin-bottom: 2rem;
    }
  }

  .benefit {
    margin-top: 2rem;
    margin-bottom: 3.2rem;

    .title {
      font-size: 1.8rem;
      font-weight: 700;
      margin-top: 8px;
    }

    &-box {
      display: flex;
      justify-content: space-between;
      column-gap: 1.2rem;
    }

    &-card {
      padding: 7px 8px;
      background-color: #f7f8f5;
      flex: 1;

      &-name {
        color: var(--color-u-placeholder);
      }

      &-quantity {
        font-weight: 700;
        font-size: 1.8rem;
      }
    }
  }
}
</style>
