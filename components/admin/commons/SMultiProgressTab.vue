<template>
  <div class="tabs">
    <div
      v-for="(item, index) in optionList"
      :key="item.value"
      class="tab"
      :class="{ 'is-active': value === item.value }"
    >
      <button class="h3" @click="onInput(index)">{{ item.label }}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SMultiProgressTab',
  props: {
    value: {
      type: [String, Number],
      required: false,
      default: null
    },
    // optionList: [{ value: '', label: '' }]
    optionList: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  methods: {
    onInput(index) {
      const selectedValue = this.optionList[index].value;

      this.$emit('input', selectedValue);
    }
  }
};
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  border-bottom: 0.1rem solid var(--color-grey-2);
  overflow-x: auto;

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

    button {
      max-width: 27rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
