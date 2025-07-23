<template>
  <KeepAlive>
    <div class="center">
      <div class="membership-image-box" @click="handleOpenModal">
        <img src="~assets/img/membership-logo-icon.png" />
      </div>
      <div class="content">
        <div class="center">
          <p class="name-membership">{{ membershipNameDisplay }}</p>
          <!-- <p>유효기간: {{ getFormattedDate(dataMembership.registration_date, dataMembership.expiration_date) }}</p> -->
        </div>
      </div>
      <!-- <UButton class="button" @click="handleOpenModal">멤버십 QR코드 </UButton> -->
      <modal-membership-infor v-model="openModal" :data-membership="dataMembership" />
    </div>
  </KeepAlive>
</template>

<script>
import ModalMembershipInfor from '../../modal/membership/ModalMembershipInfor.vue';
import { MembershipType } from '~/assets/js/membership';
import { getDateCommonDateOutput } from '~/assets/js/commons';

export default {
  name: 'MembershipInfor',
  components: { ModalMembershipInfor },
  props: {
    dataMembership: {
      type: Object,
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
      openModal: false
    };
  },
  computed: {
    membershipNameDisplay() {
      const defaultMembershipName = '회사 멤버십';
      const registrationType = this.dataMembership?.registration_type;
      const companyName = this.dataMembership?.company_name;
      const membershipName = this.dataMembership?.membership_name;
      if (registrationType === MembershipType?.company) {
        return companyName || defaultMembershipName;
      }
      if (registrationType === MembershipType?.registration) {
        return membershipName || defaultMembershipName;
      }
      return defaultMembershipName;
    }
  },
  methods: {
    getFormattedDate(startDate, endDate) {
      return getDateCommonDateOutput(startDate, endDate);
    },
    handleOpenModal() {
      this.openModal = true;
    },
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
.membership-image-box {
  border: 1px solid transparent;
  transition: border-color 0.3s ease;
}

.membership-image-box:hover {
  border: 1px solid black
}

.button {
  width: 100% !important;
}
img {
  object-fit: contain;
  max-width: 100%;
}
</style>
