<template>
  <button
    type="button"
    :disabled="disabled"
    :class="{
      small: hSize === 'small',
      standard: buttonType === 'standard',
      primary: buttonType === 'primary',
      transport: buttonType === 'transport',
      'transport-b': buttonType === 'transport-b'
    }"
    :style="{
      minWidth: `${getMinWidth}`
    }"
    @keyup.enter="$emit('click')"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'SButton',
  props: {
    // value: standard | primary | transport | transport-b
    buttonType: {
      type: String,
      required: false,
      default: 'standard'
    },
    // value: small | normal | large | x-large | xx-large
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
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      minWidth: '9.6rem'
    };
  },
  computed: {
    getMinWidth() {
      const wSize = this.wSize;
      let minWidth = '9.6rem';

      switch (wSize) {
        case 'small':
          minWidth = '6.4rem';
          break;
        case 'normal':
          minWidth = '9.6rem';
          break;
        case 'large':
          minWidth = '12.8rem';
          break;
        case 'x-large':
          minWidth = '20.8rem';
          break;
        case 'xx-large':
          minWidth = '32.0rem';
          break;
        case 'full':
          minWidth = '100%';
          break;
        default:
          minWidth = '9.6rem';
          break;
      }

      return minWidth;
    }
  }
};
</script>

<style lang="scss" scoped>
button {
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
