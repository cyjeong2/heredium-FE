<template>
  <div>
    <h1>Mypage</h1>
    <section class="tab-sec">
      <div class="only-mobile">
        <div class="tabs page">
          <nuxt-link class="tab" :to="'/mypage/purchase/all'" :class="{ 'nuxt-link-active': isCoffeePurchase }">
            구매내역
          </nuxt-link>
          <NuxtLink class="tab" to="/mypage/info">내 정보 수정</NuxtLink>
        </div>
        <div class="tabs grid col-xs-3">
          <NuxtLink to="/mypage/purchase/all" class="tab">전시·프로그램</NuxtLink>
          <NuxtLink to="/mypage/purchase/coffee" class="tab">커피</NuxtLink>
          <NuxtLink to="/mypage/purchase/membership" class="tab">멤버십·쿠폰함</NuxtLink>
        </div>
      </div>
      <div class="only-pc pc-tabs">
        <h2>구매내역</h2>
        <NuxtLink to="/mypage/purchase/all" class="tab">전시·프로그램</NuxtLink>
        <NuxtLink to="/mypage/purchase/coffee" class="tab">커피</NuxtLink>
        <NuxtLink to="/mypage/purchase/membership" class="tab">멤버십·쿠폰함</NuxtLink>
        <NuxtLink to="/mypage/info" class="big-tab">내 정보 수정</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'SideBarMyPage',
  computed: {
    isCoffeePurchase() {
      const pathElementList = this.$route.path.split('/');

      return (
        (pathElementList.includes('purchase') && pathElementList.includes('coffee')) ||
        (pathElementList.includes('purchase') && pathElementList.includes('membership'))
      );
    }
  }
};
</script>

<style scoped lang="scss">
h1 {
  margin: 3.2rem 0 4rem;
  font-size: 5rem;
  font-weight: 700;
  line-height: 2.8rem;
}

.tabs {
  &.page {
    display: flex;
    margin-bottom: 2rem;

    .tab + .tab {
      margin-left: 2.4rem;
    }

    .tab {
      font-size: 1.8rem;
      font-weight: 500;
      line-height: 1.8rem;
      color: var(--color-grey-4);

      &.nuxt-link-active {
        color: var(--color-u-primary);
        font-weight: 700;
      }
    }
  }

  &.grid {
    margin-bottom: 4rem;

    .tab + .tab {
      border-left: none;
    }

    .tab {
      padding: 1.3rem 1.6rem;
      border: 0.1rem solid var(--color-grey-2);
      font-size: 1.4rem;
      font-weight: 700;
      line-height: 1.4rem;
      text-align: center;
      color: var(--color-grey-3);

      &.nuxt-link-active {
        background-color: var(--color-u-primary);
        color: var(--color-white);
      }
    }
  }
}

@media screen and (min-width: 769px) {
  h1 {
    margin: 0 0 4.7rem;
    font-size: 4.2rem;
    line-height: 150%;
  }

  .pc-tabs {
    h2 {
      font-size: 1.8rem;
      font-weight: 700;
      line-height: 160%;
      letter-spacing: 0.25px;
      border-bottom: 1px solid var(--color-black);
      padding-bottom: 1rem;
      margin-bottom: 1.3rem;
    }

    a {
      display: block;
      font-size: 1.6rem;
      font-weight: 500;
      line-height: 160%;
      letter-spacing: 0.25px;
      margin-bottom: 2.6rem;

      &.nuxt-link-active {
        color: var(--color-u-primary);
        font-weight: 700;
      }

      &.big-tab {
        font-size: 1.8rem;
        font-weight: 700;
        line-height: 160%;
        letter-spacing: 0.25px;
      }
    }
  }
}
</style>
