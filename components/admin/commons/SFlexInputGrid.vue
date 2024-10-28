<template>
  <div class="box">
    <div class="item">
      <slot name="input" />
    </div>
    <slot name="content" />
  </div>
</template>

<script>
export default {
  name: 'SFlexInputGrid'
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  align-items: center;
  gap: 12px;
  .item {
    flex: 1;
  }
}
</style>
