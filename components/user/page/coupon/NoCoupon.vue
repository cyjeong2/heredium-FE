<template>
  <KeepAlive>
    <div class="center">
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
.content {
  width: 250px;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 3.2rem;
  color: var(--color-u-placeholder);
}
</style>
