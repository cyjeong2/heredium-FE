<template>
  <main class="container">
    <SideBarMyPage />
    <section>
      <div class="ticketing-head">
        <h2 class="only-pc">멤버십</h2>
      </div>
      <div class="ticketing-body">
        <div class="ticketing-info only-pc-flex">
          <div class="left">
            <i class="pc uic-info" />
            <p>현재 적용된 멤버십</p>
          </div>
          <NuxtLink :to="'/mypage/purchase/membership/coupon-history'" class="only-pc-flex">
            <span>마일리지 적립 내역 </span> <i class="pc uic-arrow_next" />
          </NuxtLink>
        </div>
        <div class="box-contents">
          <div class="box-membership">
            <div class="head">멤버십</div>
            <MembershipInfor :data-merbership="dataMembership" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import MembershipInfor from '~/components/user/page/membership/MembershipInfor.vue';
import SideBarMyPage from '~/components/user/page/SideBarMyPage.vue';

export default {
  name: 'MembershipAndCouponPage',
  components: { SideBarMyPage, MembershipInfor },
  data() {
    return {
      dataMembership: null,
      availableCouponsList: null,
      baseUrl: '/mypage/purchase/membership/coupon-histoty'
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
            unused_coupons: item.unused_coupons.filter((coupon) => !coupon.is_expired)
          }))
          .filter((item) => item.unused_coupons.length > 0);

        this.availableCouponsList = availableCouponsList;
      } catch (error) {
        // show empty coupon
      }
    },
    async getMembershipInfor() {
      try {
        const dataMembership = await this.$axios.$get('/user/membership/info');
        this.dataMembership = dataMembership;
      } catch (error) {
        // show empty
        this.dataMembership = null;
      }
    },
    refreshCouponList() {
      this.getCouponList();
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

.head-mobile {
  display: flex;
  align-content: center;
  justify-content: space-between;

  span {
    color: var(--color-u-primary);
  }

  .umic-arrow_forward {
    width: 8.5px;
    height: 15.5px;
    color: var(--color-u-primary);
  }

  a {
    display: flex;
    align-content: center;
    justify-content: space-between;
  }
}

.note-mobile {
  color: var(--color-u-placeholder);
  margin-bottom: 2.4rem;
}

.head {
  font-size: 2rem;
  font-weight: 700;
  padding-left: 8px;
  border-left: 5px solid var(--color-u-primary);
  margin-bottom: 2rem;
}

.ticketing-body {
  .ticketing-info {
    display: flex;
    align-items: center;
    margin-bottom: 4rem;
    padding: 1.6rem 1.6rem 1.7rem;
    background: rgba(235, 235, 235, 0.4);

    .left {
      display: flex;
      align-items: center;
    }

    i {
      margin-right: 0.8rem;
      font-size: 2rem;
    }

    p {
      font-size: 1.2rem;
      font-weight: 500;
      line-height: 1.2rem;

      strong {
        display: inline-flex;
        transform: translateY(0.1rem);
        font-weight: 700;
      }
    }
  }
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
    margin-top: 2.6rem;
    border-top: 0.1rem solid var(--color-black);

    .ticketing-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
      padding: 1.6rem 2rem;

      i {
        font-size: 2.4rem;
      }

      p {
        font-size: 1.4rem;
        font-weight: 500;
        line-height: 160%;
      }

      a {
        font-size: 1.4rem;
        line-height: 160%;

        i {
          margin-left: 0.4rem;
          margin-right: 0;
          font-size: 2.4rem;
        }
      }
    }
  }

  .box-contents {
    display: flex;
    column-gap: 2.4rem;
    .box-membership {
      max-width: 50%;
    }
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
