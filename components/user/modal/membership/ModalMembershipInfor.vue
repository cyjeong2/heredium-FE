<template>
  <!-- PC 전용 -->
  <UModal v-if="isPCUrl" :is-show="value" class="modal-custom" :hide-edge-close-btn="true" @close="handleClose">
    <template #content>
      <div @mouseleave="handleMouseLeave" @mouseenter="handleMouseEnter">
        <p class="name-membership">{{ dataMembership.membership_name }}</p>
        <p class="title-modal">{{ dataMembership.short_name }}</p>
        <!-- 대상 부분은 v-if 사용해서 처리-->
        <p v-if="dataMembership.code === 1" class="title">대상: 만 19세 이상 회원</p>
        <p v-if="dataMembership.code === 2" class="title"></p>
        <p v-if="dataMembership.code === 3" class="title">대상: 만 19세 미만 회원</p>
        <div class="benefit">
          <div class="benefit-box">
            <!-- coupon 테이블 참조해서 멤버십에 따라 내용 채워지도록 설정 필요. CN PASS / CN PASS+ 는 5 & 6 항목 공통 / STUDENT는 5까지만 존재 -->
            <p v-for="(line, idx) in fullBenefits" :key="idx" class="benefit-content" v-html="`${idx + 1}. ${line}`" />
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
      <p v-if="dataMembership.code === 1" class="title">대상: 만 19세 이상 회원</p>
      <p v-if="dataMembership.code === 2" class="title"></p>
      <p v-if="dataMembership.code === 3" class="title">대상: 만 19세 미만 회원</p>
      <div class="benefit">
        <div class="benefit-box">
          <p v-for="(line, idx) in fullBenefits" :key="idx" class="benefit-content" v-html="`${idx + 1}. ${line}`" />
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
    fullBenefits() {
      const list = [];

      // 1~4: 쿠폰 혜택
      if (this.dataMembership.coffee) {
        list.push(`${this.dataMembership.coffee}% 할인`);
      }
      if (this.dataMembership.artshop) {
        list.push(`${this.dataMembership.artshop}% 할인`);
      }
      if (this.dataMembership.exhibition) {
        list.push(`${this.dataMembership.exhibition}% 할인`);
      }
      if (this.dataMembership.program) {
        list.push(`${this.dataMembership.program}% 할인`);
      }

      if (this.dataMembership.code === 3) {
        // STUDENT
        list.push(`만 19세 도래시 CN PASS 등급 전환`);
      } else {
        // CN PASS / CN PASS+
        list.push(
          `마일리지 적립 시스템<br/>
           • 결제 시 1,000원당 마일리지 1점 적립(백단위 절사)<br/>
           • 마일리지 70점 적립 시 등급 업그레이드`
        );
        list.push(
          `마일리지 적립 방법<br/>
           온라인 결제: 사용일(입장일 기준) 적립<br/>
           현장 결제: 영수증 또는 QR코드 제시를 통한 현장 적립`
        );
      }

      return list;
    },
    isPCUrl() {
      return this.$route.path.includes('/mypage/purchase/membership_pc');
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
    width: 470px !important;
    height: 550px !important;
    max-width: 80vw;
    max-height: 80vh;
  }
  .title-modal {
    font-size: 1.4rem;
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
    margin-bottom: 3.2rem;

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
