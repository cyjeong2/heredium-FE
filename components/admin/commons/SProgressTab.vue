<template>
  <div class="tabs">
    <div class="tab" :class="{ 'is-active': value }">
      <button class="h3" @click="onInput(true)">{{ label[0] }}</button>
    </div>
    <div class="tab" :class="{ 'is-active': !value }">
      <button class="h3" @click="onInput(false)">{{ label[1] }}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SProgressTab',
  props: {
    value: {
      type: Boolean,
      required: false,
      default: true
    },
    label: {
      type: Array,
      required: false,
      default: () => ['진행', '종료']
    }
  },
  methods: {
    onInput(isProgress) {
      this.$emit('input', isProgress);
    }
  }
};
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  border-bottom: 0.1rem solid var(--color-grey-2);

  .tab {
    display: flex;
    justify-content: center;
    min-width: 12rem;
    padding: 1rem 2rem 1.4rem;
    color: var(--color-grey-3);

    &.is-active {
      color: var(--color-blue);
      border-bottom: 0.2rem solid var(--color-blue);
    }
  }
}
</style>
