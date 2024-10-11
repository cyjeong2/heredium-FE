<template>
  <main class="container">
    <SideBarMyPage />
    <section>
      <div class="ticketing-head">
        <h2 class="only-pc-flex" @click="goBack"><i class="pc uic-arrow_pre" />쿠폰함</h2>
        <h2 class="only-mobile">Coupon History</h2>
      </div>
      <div class="ticketing-body">
        <div class="contents">
          <CouponList :data="dataListCoupon" :is-history="true" />
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import CouponList from '~/components/user/page/coupon/CouponList.vue';
import SideBarMyPage from '~/components/user/page/SideBarMyPage.vue';

export default {
  name: 'CouponHistory',
  components: { SideBarMyPage, CouponList },
  async asyncData({ $axios }) {
    const dataListCoupon = await $axios.$get('/user/coupons/usage');

    return { dataListCoupon };
  },
  data() {
    return {
      dataListCoupon: null
    };
  },
  methods: {
    goBack() {
      this.$router.push('/mypage/purchase/membership');
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin-bottom: 12rem;
}

.ticketing-head {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    line-height: 1.8rem;
  }
}

.ticketing-body {
  padding-top: 2rem;
  margin-top: 1.3rem;
  border-top: 0.1rem solid var(--color-black);
}

@media screen and (min-width: 769px) {
  .container {
    display: flex;
    margin-bottom: 12.6rem;
    margin-top: 4.8rem;

    > div {
      width: 34.8rem;
      padding-right: 14.8rem;
    }

    > section {
      flex: 1 0 0;
    }
  }

  .ticketing-head {
    padding-bottom: 2.2rem;
    h2 {
      display: flex;
      font-size: 3.2rem;
      font-weight: 500;
      line-height: 150%;
      align-items: center;
      cursor: pointer;
      margin-bottom: 2.2rem;

      i {
        font-size: 3.2rem;
        margin-right: 1.2rem;
      }
    }
  }

  .ticketing-body {
    border-top: 0.1rem solid var(--color-black);
  }
}
</style>
