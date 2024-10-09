<template>
  <KeepAlive>
    <div class="center no-coupon">
      <div>
        <img src="~assets/img/icon/icon_error.svg" />
      </div>
      <div class="content">
        <div class="center">
          <p>보유하고 있는 쿠폰이 없습니다.</p>
        </div>
      </div>
    </div>
  </KeepAlive>
</template>

<script>
export default {
  name: 'NoCoupon'
};
</script>

<style lang="scss" scoped>
.no-coupon {
  padding: 8.5rem 0;
  color: var(--color-u-placeholder);

  .content {
    margin-top: 2rem;
  }
}
</style>
