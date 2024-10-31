<template>
  <main class="container">
    <SideBarMyPage />
    <section>
      <div class="ticketing-head">
        <h2 class="only-pc-flex" @click="goBack"><i class="pc uic-arrow_pre" />전체 쿠폰 내역</h2>
        <h2 class="only-mobile">전체 쿠폰 내역</h2>
      </div>
      <div class="ticketing-body">
        <div class="contents">
          <div v-if="!dataListCoupon || dataListCoupon?.length === 0"><no-coupon /></div>
          <div v-else>
            <CouponCard
              v-for="item in availableCouponsList"
              :key="`coupon-${item.id}-${item.unused_coupons?.length}`"
              class="coupon-card"
              :detail-coupon="item"
              @refresh-coupon-list="refreshCouponList"
            />

            <CouponCardDisabled
              v-for="(item, index) in usedCouponsList"
              :key="index"
              class="coupon-card"
              :detail-coupon="item"
            />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import CouponCard from '~/components/user/page/coupon/CouponCard.vue';
import CouponCardDisabled from '~/components/user/page/coupon/CouponCardDisabled.vue';
import NoCoupon from '~/components/user/page/coupon/NoCoupon.vue';
import SideBarMyPage from '~/components/user/page/SideBarMyPage.vue';

export default {
  name: 'CouponHistory',
  components: { SideBarMyPage, CouponCardDisabled, NoCoupon, CouponCard },

  data() {
    return {
      dataListCoupon: null,
      availableCouponsList: null,
      usedCouponsList: null
    };
  },
  mounted() {
    this.getCouponList();
  },
  methods: {
    async getCouponList() {
      try {
        const dataListCoupon = await this.$axios.$get('/user/coupons/usage');

        const usedCouponsList = dataListCoupon.filter((item) => item.used_coupons?.length > 0);
        const availableCouponsList = dataListCoupon
          .map((item) => ({
            ...item,
            unused_coupons: item.unused_coupons.filter((coupon) => !coupon.is_expired)
          }))
          .filter((item) => item.unused_coupons.length > 0);

        this.dataListCoupon = dataListCoupon;
        this.availableCouponsList = availableCouponsList;
        this.usedCouponsList = usedCouponsList;
        console.log('availableCouponsList', availableCouponsList);
      } catch (error) {
        // show empty coupon
      }
    },
    refreshCouponList() {
      this.getCouponList();
    },
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
