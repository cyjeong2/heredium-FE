<template>
  <!-- PC 전용 -->
  <UModal
    v-if="isPCUrl"
    :is-show="value"
    class="modal-custom only-pc"
    :hide-edge-close-btn="true"
    :background-white="true"
    @close="handleClose"
  >
    <template #content>
      <div @mouseleave="handleMouseLeave" @mouseenter="handleMouseEnter">
        <div class="title-modal">
          <img v-if="dataMembership.code === 1" src="~assets/img/Brown.png" class="membership-icon" />
          <img v-if="dataMembership.code === 2" src="~assets/img/Terracotta.png" class="membership-icon" />
          <img v-if="dataMembership.code === 3" src="~assets/img/Green.png" class="membership-icon" />
          <span class="name-membership">
            {{ dataMembership.name }} 님의 현재 등급은 <B>{{ dataMembership.membership_name }}</B> 입니다.
          </span>
        </div>
        <div class="benefit">
          <div class="benefit-box">
            <div class="benefit-box">
              <div class="benefit-row">
                <div class="left">
                  <img src="~assets/img/Brown.png" class="membership-icon2" />
                  <div class="name_target">
                    <p class="membership-name">CN PASS</p>
                    <p class="membership-target">만 19세 이상 회원</p>
                  </div>
                </div>
                <div class="right">
                  <p class="benefit-info">전시, 프로그램, 카페, 아트숍</p>
                  <p class="benefit-discount"><b>10%</b> 할인</p>
                </div>
              </div>

              <div class="benefit-row">
                <div class="left">
                  <img src="~assets/img/Terracotta.png" class="membership-icon2" />
                  <div class="name_target">
                    <p class="membership-name">CN PASS PLUS</p>
                    <p class="membership-target">마일리지 70점 달성 CN PASS 회원</p>
                  </div>
                </div>
                <div class="right">
                  <p class="benefit-info">전시, 프로그램, 카페, 아트숍</p>
                  <p class="benefit-discount"><b>15%</b> 할인</p>
                </div>
              </div>

              <div class="benefit-row">
                <div class="left">
                  <img src="~assets/img/Green.png" class="membership-icon2" />
                  <div class="name_target">
                    <p class="membership-name">CN PASS STUDENT</p>
                    <p class="membership-target">만 19세 미만 회원</p>
                  </div>
                </div>
                <div class="right">
                  <p class="benefit-info">전시, 프로그램, 카페, 아트숍</p>
                  <p class="benefit-discount"><b>10%</b> 할인</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UModal>
  <!-- 모바일 전용 -->
  <UModal
    v-else
    :is-show="value"
    class="modal-custom only-mobile"
    :hide-head="false"
    :hide-edge-close-btn="false"
    :background-white="false"
    @close="handleClose"
  >
    <template #title>
      <div class="title-modal only-mobile">
        <img v-if="dataMembership.code === 1" src="~assets/img/Brown.png" class="membership-icon" />
        <img v-if="dataMembership.code === 2" src="~assets/img/Terracotta.png" class="membership-icon" />
        <img v-if="dataMembership.code === 3" src="~assets/img/Green.png" class="membership-icon" />
        <span class="name-membership only-mobile">
          {{ dataMembership.name }} 님의 현재 등급은<br />
          <B>{{ dataMembership.membership_name === 'CN PASS PLUS' ? 'CN PASS+' : dataMembership.membership_name }}</B>
          입니다.
        </span>
      </div>
    </template>

    <template #content>
      <div class="benefit only-mobile">
        <div class="benefit-box only-mobile">
          <div class="benefit-row only-mobile">
            <img src="~assets/img/Brown.png" class="membership-icon2 only-mobile" />
            <div class="name_target">
              <p class="membership-name only-mobile"><B>CN PASS</B></p>
              <p class="membership-target only-mobile">만 19세 이상 회원</p>
              <p class="benefit-info only-mobile">전시, 프로그램, 카페, 아트숍 <b>10%</b> 할인</p>
            </div>
          </div>

          <div class="benefit-row only-mobile">
            <img src="~assets/img/Terracotta.png" class="membership-icon2" />
            <div class="name_target only-mobile">
              <p class="membership-name only-mobile"><B>CN PASS+</B></p>
              <p class="membership-target only-mobile">마일리지 70점 달성 CN PASS 회원</p>
              <p class="benefit-info only-mobile">전시, 프로그램, 카페, 아트숍 <b>15%</b> 할인</p>
            </div>
          </div>

          <div class="benefit-row only-mobile">
            <img src="~assets/img/Green.png" class="membership-icon2" />
            <div class="name_target only-mobile">
              <p class="membership-name only-mobile"><B>CN PASS STUDENT</B></p>
              <p class="membership-target only-mobile">만 19세 미만 회원</p>
              <p class="benefit-info only-mobile">전시, 프로그램, 카페, 아트숍 <b>10%</b> 할인</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script>
import UModal from '~/components/user/modal/UModal.vue';
export default {
  name: 'ModalMembershipInfor',
  components: { UModal },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    dataMembership: {
      type: Object,
      default: () => {}
    },
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      closeTimer: null
    };
  },
  computed: {
    isPCUrl() {
      return this.$route.path.includes('/mypage/purchase/membership_pc') || this.$route.path.includes('/mypage/purchase/coupon_pc');
    }
  },
  beforeDestroy() {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }
  },
  methods: {
    handleClose() {
      this.$emit('input', false);
      this.$emit('close');
    },
    handleMouseLeave() {
       this.$emit('hover-out')
    },
    handleMouseEnter() {
      this.$emit('hover-in');
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-custom {
  ::v-deep .modal-inner {
    width: 530px !important;
    height: 410px !important;
    max-width: 80vw;
    max-height: 80vh;
    border-radius: 24px;
    position: absolute;
    flex-direction: row;

    top: 60% !important;
    left: 60% !important;
    transform: translateX(-50%, 50%) !important;
  }
  .title-modal {
    display: flex;
    align-items: center;
    font-size: 1.8rem;
    column-gap: 1rem;
    padding: 0 !important;

    .membership-icon {
      width: 36px;
      height: 36px;
      object-fit: contain;
    }
  }
  .qr-box {
    color: var(--color-u-placeholder);
    border-bottom: 1px solid #d1d5d8;
    padding-bottom: 2rem;

    .name-membership {
      color: var(--color-u-primary);
      font-size: 1.2rem;
    }

    & > p:nth-child(2) {
      margin-bottom: 2rem;
    }
  }

  .benefit {
    margin-top: 2rem;

    &-box {
      display: flex;
      justify-content: space-between;
      column-gap: 1.2rem;
      background-color: #e6e6e6;
      border-radius: 24px;
      padding: 1.2rem;
    }

    &-card {
      padding: 7px 8px;
      background-color: solid #f7f8f5;
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
.benefit-box {
  display: flex;
  flex-direction: column;
  background-color: #e6e6e6;
  border-radius: 24px;
  padding: 1.6rem;
  row-gap: 1.6rem;

  .benefit-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .membership-icon2 {
    width: 24px;
    height: 24px;
    margin-top: 15px;
    object-fit: contain;
  }
  .left {
    display: flex;
    column-gap: 0.8rem;

    .membership-name {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: -0.7rem;
    }

    .membership-target {
      font-size: 11px;
      color: #7a7a7a;
    }
  }

  .right {
    flex: 1;
    .benefit-info {
      font-size: 14px;
      margin-bottom: -0.7rem;
    }

    .benefit-discount {
      font-size: 14px;
      b {
        font-weight: bold;
      }
    }
  }
}

.title {
  font-size: 1.3rem;
}
.benefit-box {
  display: flex;
  flex-direction: column;
}
.benefit-content {
  display: block;
  font-size: 1.3rem;
}

// 모바일 CSS
.modal-custom.only-mobile {
  ::v-deep .modal-inner {
    width: 90% !important;
    max-width: 90vw;
    height: 57% !important;
    border-radius: 24px;
    position: absolute;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
  }

  .title-modal.only-mobile {
    display: flex;
    align-items: left;
    justify-content: left;
    column-gap: 1rem;
    padding: 20px 0;

    .membership-icon {
      width: 36px;
      height: 36px;
      object-fit: contain;
    }

    .name-membership {
      font-size: 1.8rem;
      font-weight: normal;
      text-align: left;
      line-height: 1.4;

      b {
        font-weight: bold;
      }
    }
  }

  .benefit.only-mobile {
    margin-top: -1.2rem;

    .benefit-box.only-mobile {
      display: flex;
      flex-direction: column;
      background-color: #e6e6e6;
      border-radius: 24px;
      padding: 1.6rem;
      row-gap: 2.5rem;
    }

    .benefit-row.only-mobile {
      display: flex;
      align-items: flex-start;
      column-gap: 0.8rem;

      .membership-icon2 {
        width: 36px;
        height: 36px;
        margin-top: 5px;
        object-fit: contain;
      }

      .name_target.only-mobile {
        display: flex;
        flex-direction: column;
        column-gap: -3rem !important;
      }

      .membership-name.only-mobile {
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 0.5rem;
      }

      .membership-target.only-mobile {
        font-size: 11px;
        color: #7a7a7a;
        margin-bottom: 0.5rem;
      }

      .benefit-info.only-mobile {
        font-size: 12px;
        margin-bottom: 0;
      }
    }
  }
}
.modal-custom.only-mobile ::v-deep .modal-wrap {
  pointer-events: auto !important;
}
.modal-custom.only-mobile ::v-deep .close-btn {
  pointer-events: auto !important;
}
</style>
