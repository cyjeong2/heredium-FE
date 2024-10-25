<template>
  <KeepAlive>
    <div class="center">
      <div>
        <img src="~assets/img/icon/icon_active_membership.svg" />
      </div>
      <div class="content">
        <div class="center">
          <p class="name-membership">등급 : {{ dataMerbership.membership_name || '회사 멤버십' }}</p>
          <p>유효기간: {{ getFormattedDate(dataMerbership.registration_date, dataMerbership.expiration_date) }}</p>
        </div>
      </div>
      <UButton class="button" @click="handleOpenModal">멤버십 QR코드 </UButton>
      <modal-membership-infor :data-merbership="dataMerbership" :open="openModalQr" @close="handleCloseModal" />
    </div>
  </KeepAlive>
</template>

<script>
import ModalMembershipInfor from '../../modal/membership/ModalMembershipInfor.vue';
import UButton from '~/components/user/common/UButton';
import { getDateCommonDateOutput } from '~/assets/js/commons';

export default {
  name: 'MembershipInfor',
  components: { UButton, ModalMembershipInfor },
  props: {
    dataMerbership: {
      type: Object,
      required: false,
      default: () => {}
    },
    open: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      openModalQr: false
    };
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
.content {
  width: 250px;
  text-align: center;
  margin-top: 2rem;
  color: var(--color-u-placeholder);
  margin-bottom: 3.2rem;

  .name-membership {
    font-weight: bold;
    color: #4c5540;
  }
}

.button {
  width: 100% !important;
}
</style>
