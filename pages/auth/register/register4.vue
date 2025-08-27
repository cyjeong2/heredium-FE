<template>
  <main class="container">
    <div style="margin-top: 4rem;">
      <img class="m" src="~assets/img/pc/logo.svg" alt="" width="92" height="45" />
      <img class="pc" src="~assets/img/pc/logo.svg" alt="" width="92" height="45" />
    </div>
    <h2>헤레디움<br/> 회원가입을 축하합니다!</h2>
    <p>헤레디움의 다양한 전시 프로그램을 만나보세요.</p>
    <ULink :to="$store.state.deviceInfo.isApp ? '/app' : '/'">시작</ULink>
    <!-- 쿠폰 모달 -->
    <!-- <MarketingCoupon
      :is-show="showCouponModal"
      :coupons="coupons"
      @close="closeCouponModal"
    /> -->
  </main>
</template>

<script>
import ULink from '~/components/user/common/ULink';
// import MarketingCoupon from '~/components/user/modal/coupon/MarketingCoupon.vue';

export default {
  name: 'Register4Page',
  // MarketingCoupon
  components: { ULink },
  data() {
    return {
      showCouponModal: false,
      // coupons: [],
    };
  },
  mounted() {
    // 마케팅 동의 시 쿠폰 모달 보여주기
    const isMarketing = localStorage.getItem('isMarketing');
    if (isMarketing === 'true') {
      this.showCouponModal = true;
    }
    localStorage.removeItem('snsInfo');
  },
  // created() {
  //   // 1) 쿼리로 넘어온 coupons(JSON)를 파싱
  //   const raw = this.$route.query.coupons;
  //   if (raw) {
  //     try {
  //       this.coupons = JSON.parse(decodeURIComponent(raw));
  //       if (this.coupons.length > 0) {
  //         this.showCouponModal = true;
  //       }
  //     } catch (err) {
  //       console.warn('쿠폰 데이터 파싱 실패:', err);
  //     }
  //   }
  // },
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

h2 {
  margin: 4.2rem 0 2rem;
  font-size: 2.5rem;
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
  font-size: 1.3rem;
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
    margin: 5.4rem 0 2.4rem;
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
