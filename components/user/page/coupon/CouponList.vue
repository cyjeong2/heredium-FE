<template>
  <KeepAlive>
    <div class="center box">
      <div v-if="data.length === 0">
        <no-coupon />
      </div>
      <div v-else>
        <coupon-card
          v-for="(item, index) in data"
          :key="index"
          class="coupon-card"
          :is-history="isHistory"
          :detail-coupon="item"
          :is-selection="isSelection"
          :value="item.id"
          :model-value="selectedCouponId"
          :change="updateSelection"
          @refresh-coupon-list="handleRefreshCouponList"
        />
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
    },
    isSelection: {
      type: Boolean,
      required: false,
      default: false
    },
    selectedCouponId: {
      type: Number,
      required: false,
      default: null
    }
  },
  data() {
    return {};
  },
  methods: {
    updateSelection(id) {
      this.$emit('toggle-coupon-select', id);
    },
    handleRefreshCouponList() {
      this.$emit('refresh-coupon-list');
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
