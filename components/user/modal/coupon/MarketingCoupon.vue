<template>
  <div v-if="isShow" class="modal-wrap" @click.self="close">
    <div class="modal-inner">
      <div class="head">{{ title }}</div>
      <div class="body" body-scroll-lock-ignore>
        <div class="content-wrap">
          <img src="~assets/img/pc/logo.svg" alt="HEREDIUM 로고" class="logo" width="130" height="120" />
          <p class="coupon-name">{{ couponName }}</p>
          <p class="market-note">{{ marketNote }}</p>
          <p class="note">{{ note }}</p>
        </div>
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
    title: { type: String, default: '쿠폰 발급 완료' },
    couponName: { type: String, default: '커피 1잔 무료' },
    note: {
      type: String,
      default: '발급된 쿠폰은 [MYPAGE > 쿠폰함]에서 확인 가능합니다.'
    },
    marketNote: {
      type: String,
      default: '마케팅정보 수집이용동의에 따라 쿠폰이 발급되었습니다.'
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
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding-bottom: 4rem;

      .logo {
        width: 8rem;
        margin-bottom: 2rem;
      }
      .coupon-name {
        font-size: 1.8rem;
        font-weight: 700;
        margin-bottom: 4rem;
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
      padding: 3.2rem 3.6rem;
      font-size: 2.4rem;
    }
    .body {
      max-height: 40rem;
      padding: 2.4rem 3.6rem;

      .content-wrap {
        padding: 2.4rem;
        background: rgba(235,235,235,0.4);
        border: 1px solid var(--color-u-grey-1);
        border-radius: 0.8rem;
      }
    }
    .foot {
      padding: 0 3.2rem 3.6rem;
      margin-top: 3.6rem;
      justify-content: space-between;

      button {
        max-width: none;
        flex: 1;
      }
    }
  }
}
</style>
