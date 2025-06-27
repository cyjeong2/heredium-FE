<template>
  <main class="container">
    <h1>회원 가입에 성공하셨어요!</h1>
    <div>
      <img class="m" src="~assets/img/mobile/register_img.png" alt="" width="120" height="120" />
      <img class="pc" src="~assets/img/pc/register_img.png" alt="" width="144" height="144" />
    </div>
    <p>헤레디움과 함께 해주셔서 감사해요!<br />지금 헤레디움의 다양한 서비스를 경험해보세요!</p>
    <ULink :to="$store.state.deviceInfo.isApp ? '/app' : '/'">메인으로 이동</ULink>
    <!-- 쿠폰 모달 -->
    <MarketingCoupon
      :is-show="showCouponModal"
      @close="closeCouponModal"
    />
  </main>
</template>

<script>
import ULink from '~/components/user/common/ULink';
import MarketingCoupon from '~/components/user/modal/coupon/MarketingCoupon.vue';

export default {
  name: 'Register4Page',
  components: { ULink, MarketingCoupon },
  data() {
    return {
      showCouponModal: false,
    };
  },
  mounted() {
    // 마케팅 동의 시 쿠폰 모달 보여주기
    const isMarketing = localStorage.getItem('isMarketing');
    if (isMarketing === 'true') {
      this.showCouponModal = true;
    }
    localStorage.removeItem('isMarketing');
  },
  methods: {
    closeCouponModal() {
      this.showCouponModal = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin-bottom: 12rem;
}

.pc {
  display: none;
}

h1 {
  margin: 3.2rem 0 2rem;
  font-size: 2.8rem;
  font-weight: 700;
  text-align: center;
  line-height: 2.8rem;
}

div {
  display: flex;
  justify-content: center;
  margin-bottom: 1.2rem;
}

p {
  font-size: 1.4rem;
  font-weight: 500;
  text-align: center;
  line-height: 2.24rem;
}

a {
  margin-top: 4rem;
}

@media screen and (min-width: 768px) {
  .m {
    display: none;
  }

  .pc {
    display: block;
  }

  h1 {
    margin: 12.4rem 0 2.4rem;
    font-size: 4.2rem;
    line-height: 6.3rem;
  }

  div {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }

  p {
    font-size: 1.6rem;
    line-height: 2.6rem;
    letter-spacing: 0.025rem;
  }

  a {
    width: 21rem !important;
    min-width: 21rem !important;
    margin: 3.2rem auto 0;
  }
}
</style>
