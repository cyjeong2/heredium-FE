<template>
  <main class="container">
    <SideBarMyPage />
    <section>
      <div class="ticketing-head"></div>
      <div class="ticketing-body">
        <div class="box-contents">
          <div class="box-membership only-mobile">
            <div class="head-mobile only-mobile">
              <div class="head">멤버십</div>
              <NuxtLink to="/mypage/purchase/membership/coupon-history">
                <span>마일리지 적립 내역</span>
                <i class="m umic-arrow_forward" />
              </NuxtLink>
            </div>
            <MembershipInfor :data-merbership="dataMembership" />
          </div>
          <div v-if="availableCouponsList" class="box-coupon">
            <div class="head-mobile only-mobile">
              <div class="head">쿠폰함</div>
              <NuxtLink to="/mypage/purchase/membership/coupon-history">
                <span>전체 쿠폰 내역</span>
                <i class="m umic-arrow_forward" />
              </NuxtLink>
            </div>
            <p class="only-mobile note-mobile">사용 가능한 쿠폰 리스트입니다.</p>

            <div class="contents">
              <CouponList
                :data="availableCouponsList"
                @refresh-coupon-list="refreshCouponList"
              />
            </div>
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
  data() {
    return {
      dataMembership: null,
      availableCouponsList: null,
    };
  },
  mounted() {
    this.getCouponList();
    this.getMembershipInfor();
  },
  methods: {
    async getCouponList() {
      try {
        const dataListCoupon = await this.$axios.$get('/user/coupons/usage');
        const availableCouponsList = dataListCoupon
          .map((item) => ({
            ...item,
            unused_coupons: item.unused_coupons.filter(
              (coupon) => !coupon.is_expired
            ),
          }))
          .filter((item) => item.unused_coupons.length > 0);

        this.availableCouponsList = availableCouponsList;
      } catch (error) {
        // empty state handling
      }
    },
    async getMembershipInfor() {
      try {
        const dataMembership = await this.$axios.$get('/user/membership/info');
        this.dataMembership = dataMembership;
      } catch (error) {
        this.dataMembership = null;
      }
    },
    refreshCouponList() {
      this.getCouponList();
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin-bottom: 12rem;
}

.head-mobile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.6rem;

  .head {
    font-size: 2rem;
    font-weight: 700;
    padding-left: 8px;
    border-left: 5px solid var(--color-u-primary);
  }

  a {
    display: flex;
    align-items: center;

    span {
      color: var(--color-u-primary);
      font-size: 1.3rem;
      margin-right: 0.4rem;
      margin-top: 0.5rem;
    }

    .umic-arrow_forward {
      width: 8.5px;
      height: 15.5px;
      color: var(--color-u-primary);
    }
  }
}

.note-mobile {
  color: var(--color-u-placeholder);
  margin-bottom: 2.4rem;
}

.contents {
  width: 100%;
}
</style>
