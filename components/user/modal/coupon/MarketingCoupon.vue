<template>
  <div v-if="isShow" class="modal-wrap" @click.self="close">
    <div class="modal-inner">
      <div class="head">{{ title }}</div>
      <div class="body" body-scroll-lock-ignore>
        <div class="content-wrap">
          <!-- coupons 배열을 v-for 로 반복 -->
          <div
            v-for="coupon in coupons"
            :key="coupon.id"
            class="coupon-item"
          >
            <img
              :src="`${$store.state.BASE_URL}${coupon?.imageUrl}`"
              :alt="coupon?.name"
              class="coupon-card"
              style="width: 65px; height: 65px;"
            />
            <p class="coupon-name">[{{ coupon?.name }}] 쿠폰 발급!</p>
            <!-- <img src="~assets/img/pc/logo.svg" alt="HEREDIUM 로고" class="logo" width="130" height="120" /> -->
          </div>
        </div>
        <p style='font-size: 2.0rem; font-weight: 600; text-align: center;' class="note">
          발급된 쿠폰은 [Mypage → 쿠폰함] 에서 <br/> 확인 가능합니다.
        </p>
        <p style='text-align: center; margin-top: 15px;' class="market-note">{{ marketNote }}</p>
      </div>
      <div class="foot">
        <UButton @click="close">{{ confirmText }}</UButton>
      </div>
    </div>
  </div>
</template>

<script>
import UButton from '~/components/user/common/UButton';

export default {
  name: 'CouponIssuedModal',
  components: { UButton },
  props: {
    isShow: { type: Boolean, default: false },
    title: { type: String, default: '마케팅 동의 쿠폰 발급 완료' },
    coupons: { type: Array, default: () => [] },
    couponName: { type: String, default: '커피 1잔 무료' },
    marketNote: {
      type: String,
      default: '*본 쿠폰은 마케팅 수신동의에 따른 혜택입니다.'
    },
    confirmText: { type: String, default: '확인' }
  },
  methods: {
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-wrap {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 500;
}
.modal-inner {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #fff;

  .head {
    padding: 2rem;
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    border-bottom: 1px solid var(--color-u-grey-1);
  }
  .body {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;

    .content-wrap {
      border-radius: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.6rem; /* 아이템 간 간격 */

      .logo {
        width: 8rem;
        margin-bottom: 2rem;
      }
      .coupon-name {
        font-size: 1.8rem;
        font-weight: 700;
        margin-bottom: 1.2rem;
      }
      .note .market-note {
        font-size: 1.4rem;
        color: var(--color-u-grey-3);
      }
    }
  }
  .foot {
    padding: 1.4rem 2rem;
    border-top: 1px solid var(--color-u-grey-1);
    background: #fff;
    display: flex;
    justify-content: center;

    button {
      width: 100%;
      max-width: 20rem;
    }
  }
}

@media screen and (min-width: 769px) {
  .modal-inner {
    width: 50rem;
    height: auto;
    margin: auto;
    top: 50%; left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    box-shadow: 0 1rem 3rem rgba(0,0,0,0.175);

    .head {
      padding: 2.2rem 3.6rem;
      font-size: 2.4rem;
    }
    .body {
      max-height: 49rem;
      padding: 2.4rem 3.6rem;

      .content-wrap {
        border-radius: 0.8rem;
      }
    }
    .foot {
      padding: 1.4rem 3.2rem 1.4rem;
      justify-content: space-between;

      button {
        max-width: none;
        flex: 1;
      }
    }
  }
}

/* 각 쿠폰 아이템 박스 스타일 */
.coupon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f0f0f0;
  border: 1px solid #e0e0e0;
  border-radius: 0.8rem;
  padding: 1.6rem 2rem;
  width: 100%;
  max-width: 32rem; /* 원하시는 최대 너비 */
  box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.05);
  text-align: center;
}

/* 쿠폰 이미지 */
.coupon-card {
  width: 8rem;
  height: auto;
  margin-bottom: 1rem;
}

/* 쿠폰 이름 */
.coupon-name {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
}

/* 설명 텍스트 */
.market-note {
  font-size: 1.4rem;
  color: var(--color-u-grey-3);
  margin-bottom: 0;
}

/* 최하단 일반 안내 */
.note {
  font-size: 1.4rem;
  color: var(--color-u-grey-5);
  margin-top: 2rem;
}
</style>
