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
        </div>
        <div class="head">멤버십</div>
        <div class="box-contents">
          <div class="box-membership">
            <MembershipInfor :data-membership="dataMembership" />
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
  async asyncData({ $axios }) {
    const dataMembership = await $axios.$get('/user/membership/info');
    return { dataMembership };
  },
  data() {
    return {
      dataMembership: null,
      availableCouponsList: null,
      baseUrl: '/mypage/purchase/membership/coupon-history'
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
    width: 100%;
    display: flex; // <-- 추가!
    justify-content: center; // 가로 중앙 정렬
    align-items: center; // 세로 중앙 정렬 (필요 시)

    .box-membership {
      max-width: 35%;
    }
  }

  .head {
    font-size: 2rem;
    font-weight: 700;
    padding-left: 8px;
    border-left: 5px solid var(--color-u-primary);
    margin-bottom: 2rem;
  }
}
</style>
