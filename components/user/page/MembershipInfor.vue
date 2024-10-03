<template>
  <KeepAlive>
    <div class="container">
      <div class="center">
        <div>
          <img v-if="!dataMerbership" src="~assets/img/icon/icon_no_membership.svg" />
          <img v-else src="~assets/img/icon/icon_active_membership.svg" />
        </div>
        <div class="content">
          <div v-if="!dataMerbership" class="center">
            <p>멤버십 회원이 아닙니다.</p>
            <p>헤레디움 멤버십 가입을 통해 다양한 혜택을 누려보세요!</p>
          </div>
          <div v-else class="center">
            <p class="name-membership">등급 : {{ dataMerbership.name }}</p>
            <p>유효기간: {{ getFormattedDate(dataMerbership.startDate, dataMerbership.endDate) }}
            </p>
          </div>
        </div>
        <UButton class="button" @click="getMembershipDetail">{{ dataMerbership ? '멤버십 QR코드' : '멤버십 가입하러 가기' }}
        </UButton>

        <UModal :is-show="openModalQR" class="modal-custom" @close="openModalQR = false">
          <template #title>
            <p class="center title-modal">헤레디움 멤버십</p>
          </template>
          <template #content>
            <div class="center qr-box">
              <p class="name-membership">등급 : {{ dataMerbership.name }}</p>
              <p>유효기간: {{ getFormattedDate(dataMerbership.startDate, dataMerbership.endDate) }} </p>
              <QrcodeVue :value="createQrValue" :size="172" level="H" />
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
      </div>
    </div>
  </KeepAlive>
</template>

<script>
import QrcodeVue from 'qrcode.vue';
import UButton from '~/components/user/common/UButton';
import { getDateCommonDateOutput } from '~/assets/js/commons';
import UModal from '~/components/user/modal/UModal';

export default {
  name: 'MembershipInfor',
  components: { UButton, UModal, QrcodeVue },
  props: {
    dataMerbership: {
      type: Object,
      required: false,
      default: () => { },
    },
  },
  data() {
    return {
      openModalQR: false
    }
  },
  computed: {
    createQrValue() {
      const { id, uuid } = this.dataMerbership;

      return uuid ? JSON.stringify({ id, uuid }) : '';
    }
  },
  mounted() {
    console.log('dataMerbership', this.dataMerbership);
  },
  methods: {
    getFormattedDate(startDate, endDate) {
      return getDateCommonDateOutput(startDate, endDate);
    },
    getMembershipDetail() {
      if (!this.dataMerbership) {
        this.$router.push(`/membership/registration`);
      } else {
        this.openModalQR = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #f3f4f6;
  padding: 4rem 1.6rem 1.6rem;

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
}

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

    &>p:nth-child(2) {
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
      column-gap: 1.2rem
    }

    &-card {
      padding: 7px 8px;
      background-color: #F7F8F5;
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
