<template>
  <NuxtLink
    :to="to"
    :class="{
      small: hSize === 'small',
      standard: buttonType === 'standard',
      primary: buttonType === 'primary',
      transport: buttonType === 'transport',
      'transport-b': buttonType === 'transport-b'
    }"
    :style="{
      minWidth: `${minWidth}rem`
    }"
    :target="target"
    @keyup.enter="$emit('click')"
    @click="$emit('click')"
  >
    <slot />
  </NuxtLink>
</template>

<script>
export default {
  name: 'SLink',
  props: {
    // value: standard | primary | transport | transport-b
    buttonType: {
      type: String,
      required: false,
      default: 'standard'
    },
    // value: normal | large | x-large | xx-large
    wSize: {
      type: String,
      required: false,
      default: 'normal'
    },
    // value: normal | small
    hSize: {
      type: String,
      required: false,
      default: 'normal'
    },
    to: {
      type: [String, Object],
      required: false,
      default: ''
    },
    target: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      minWidth: 9.6
    };
  },
  created() {
    let minWidth = 9.6;

    switch (this.wSize) {
      case 'normal':
        minWidth = 9.6;
        break;
      case 'large':
        minWidth = 12.8;
        break;
      case 'x-large':
        minWidth = 20.8;
        break;
      case 'xx-large':
        minWidth = 32.0;
        break;
      default:
        minWidth = 9.6;
        break;
    }

    this.minWidth = minWidth;
  }
};
</script>

<style lang="scss" scoped>
a {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  line-height: 2.1rem;
  height: 4.4rem;
  padding: 0 1rem;
  border-radius: 0.3rem;
  background-color: var(--color-white);

  &.standard {
    color: var(--color-default);
    font-weight: 500;
    border: 1px solid var(--color-default);
  }

  &.standard:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  &.primary {
    color: var(--color-white);
    font-weight: 700;
    background-color: #18a0fb;
  }

  &.primary:hover {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), var(--color-blue);
  }

  &.transport {
    color: var(--color-white);
    font-weight: 500;
    border: 1px solid var(--color-white);
    background-color: transparent;
  }

  &.transport-b {
    color: var(--color-default);
    font-weight: 500;
    border: 1px solid var(--color-default);
    background-color: transparent;
  }

  &.small {
    height: 3.2rem;
    font-size: 1.2rem;
  }

  &:disabled {
    color: var(--color-grey-3);
    border: 0;
    background-color: #ddd;
    pointer-events: none;
  }
}
</style>
