<template>
  <KeepAlive>
    <div class="center box">
      <div v-if="data.length === 0">
        <no-coupon />
      </div>
      <div v-else>
        <div v-for="(item, index) in data" :key="index">
          <coupon-card :is-history="isHistory" :detail-coupon="item" />
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
    },
    isHistory: {
      type: Boolean,
      required: false,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  & > div {
    height: 100%;
    width: 100%;
  }
}
</style>
