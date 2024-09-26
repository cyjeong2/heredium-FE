<template>
  <span :class="{ 'is-big': isBig }" />
</template>

<script>
export default {
  name: 'SDivLine',
  props: {
    isBig: {
      type: Boolean,
      required: false,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
span {
  height: 1.6rem;
  width: 1px;
  border-right: 1px solid var(--color-grey-2);
  margin: 0 0.8rem;

  &.is-big {
    height: 4.4rem;
    margin: 0 2.8rem;
  }
}
</style>
