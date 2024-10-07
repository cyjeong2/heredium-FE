<template>
  <KeepAlive>
    <div class="container">
      <div class="center">
        <div v-if="data.length === 0">
          <no-coupon />
        </div>
        <div v-else>
          <div v-for="(item, index) in data" :key="index">
            <coupon-card :detail-coupon="item" />
          </div>
        </div>
      </div>
    </div>
  </KeepAlive>
</template>

<script>
import CouponCard from './CouponCard.vue';
import NoCoupon from './NoCoupon.vue';

export default {
  name: 'CouponList',
  components: { NoCoupon, CouponCard },
  props: {
    data: {
      type: Array,
      required: false,
      default: () => []
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 4rem 1.6rem 1.6rem;
}
</style>
