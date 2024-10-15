<template>
  <KeepAlive>
    <div class="container center">
      <div class="head center">
        <h2>쿠폰 선택</h2>
      </div>
      <div class="content center">
        <p>쿠폰은 1개만 선택할 수 있습니다.</p>
        <CouponList :data="dataListCoupon" :is-selection="true" />
        <UButton class="button mb-28 center" w-size="100">쿠폰 사용</UButton>
      </div>
    </div>
  </KeepAlive>
</template>

<script>
import UButton from '~/components/user/common/UButton.vue';
import CouponList from '~/components/user/page/coupon/CouponList.vue';

export default {
  name: 'CouponSelection',
  components: { CouponList, UButton },
  async asyncData({ $axios }) {
    const dataListCoupon = await $axios.$get('/user/coupons/usage');

    return { dataListCoupon };
  },
  data() {
    return {
      dataListCoupon: null
    };
  }
};
</script>

<style lang="scss" scoped>
.container {
  .head {
    margin-top: 3.2rem;
    h2 {
      margin-bottom: 2.4rem;
    }
  }

  .content {
    & > p:first-child {
      margin-bottom: 2.4rem;
      color: var(--color-u-placeholder);
    }
  }

  .button {
    height: 4.8rem;
    font-size: 1.6rem;
    margin-top: 2.4rem;
  }
}
</style>
