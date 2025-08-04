<template>
  <!-- PC 전용 -->
  <UModal v-if="isPCUrl" :is-show="value" class="modal-custom" :hide-edge-close-btn="true" @close="handleClose">
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
  <UModal v-else :is-show="value" class="modal-custom only-mobile" @close="handleClose">
    <template #content>
      <p class="name-membership">{{ dataMembership.membership_name }}</p>
      <p class="title-modal">{{ dataMembership.short_name }}</p>
      <!-- 대상 부분은 v-if 사용해서 처리-->
      <div class="benefit">
        <div class="benefit-box"></div>
      </div>
    </template>
  </UModal>
</template>

<script>
import UModal from '~/components/user/modal/UModal.vue';
export default {
  name: 'ModalMembershipInfor',
  components: { UModal },
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
      return this.$route.path.includes('/mypage/purchase/membership_pc');
    }
  },
  mounted() {
    console.log('[ModalMembershipInfor] dataMembership:', this.dataMembership);
  },
  beforeDestroy() {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }
  },
  methods: {
    handleClose() {
      this.$emit('input', false);
    },
    handleMouseLeave() {
      this.closeTimer = setTimeout(() => {
        this.handleClose();
      }, 200);
    },
    handleMouseEnter() {
      // 마우스가 다시 들어오면 닫기 타이머 취소
      if (this.closeTimer) {
        clearTimeout(this.closeTimer);
        this.closeTimer = null;
      }
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
    display: flex;
    flex-direction: row;
  }
  .title-modal {
    display: flex;
    align-items: center;
    font-size: 1.8rem;
    column-gap: 1rem;

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
::v-deep .modal-wrap {
  background-color: transparent !important;
  z-index: 9999 !important;
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
</style>
