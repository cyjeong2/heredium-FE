<template>
  <KeepAlive>
    <div class="center no-coupon">
      <div>
        <picture>
          <source srcset="~/assets/img/mobile/noresult.png" media="(max-width: 768px)" />
          <source srcset="~/assets/img/pc/noresult.png" media="(min-width: 769px)" />
          <img src="~/assets/img/mobile/noresult.png" alt="" />
        </picture>
      </div>
      <div class="content">
        <div class="center">
          <p>보유하고 있는 마일리지가 없습니다.</p>
        </div>
      </div>
    </div>
  </KeepAlive>
</template>

<script>
export default {
  name: 'NoMileage'
};
</script>

<style lang="scss" scoped>
.no-coupon {
  padding: 1.5rem 0;

  .content {
    font-size: 1.6rem;
    font-weight: 500;
  }
}
</style>
