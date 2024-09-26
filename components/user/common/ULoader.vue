<template>
  <span class="loader" />
</template>

<script>
export default {
  name: 'ULoader'
};
</script>

<style lang="scss" scoped>
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid var(--color-u-grey-1);
  border-bottom-color: var(--color-u-primary);
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
