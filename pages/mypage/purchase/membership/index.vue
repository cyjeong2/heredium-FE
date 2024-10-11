<template>
  <main class="container">
    <SideBarMyPage />
    <section>
      <div class="ticketing-head">
        <h2>Membership and Coupon</h2>
      </div>
      <div class="ticketing-body">
        <div class="box-membership">
          <div class="head">멤버십</div>
          <MembershipInfor :data-merbership="dataMembership" />
        </div>
        <div class="box-coupon">
          <div class="head">쿠폰함</div>
          <div class="contents">
            <CouponList :data="dataListCoupon" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import CouponList from '~/components/user/page/coupon/CouponList.vue';
import MembershipInfor from '~/components/user/page/membership/MembershipInfor.vue';
import SideBarMyPage from '~/components/user/page/SideBarMyPage.vue';

export default {
  name: 'MembershipAndCouponPage',
  components: { SideBarMyPage, MembershipInfor, CouponList },
  async asyncData({ $axios }) {
    const dataListCoupon = await $axios.$get('/user/coupons/usage');
    const dataMembership = await $axios.$get('/user/membership/info');

    return { dataMembership, dataListCoupon };
  },
  data() {
    return {
      dataListCoupon: null,
      dataMembership: null
    };
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

.head {
  font-size: 2rem;
  font-weight: 700;
  padding-left: 8px;
  border-left: 5px solid var(--color-u-primary);
  margin-bottom: 2rem;
}

.ticketing-body {
  padding-top: 3.2rem;
  margin-top: 1.3rem;
  border-top: 0.1rem solid var(--color-black);
}

.box {
  &-membership {
    margin-bottom: 3.2rem;
  }
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
    h2 {
      font-size: 3.2rem;
      font-weight: 500;
      line-height: 150%;
    }
  }

  .ticketing-body {
    padding-top: 2.6rem;
    border-top: 0.1rem solid var(--color-black);
    display: flex;
    column-gap: 2.4rem;
  }

  .head {
    font-size: 2rem;
    font-weight: 700;
    padding-left: 8px;
    border-left: 5px solid var(--color-u-primary);
    margin-bottom: 2rem;
  }

  .box {
    &-membership {
      flex: 1;
    }

    &-coupon {
      flex: 2;
      .contents {
        width: 100%;
      }
    }
  }
}
</style>
