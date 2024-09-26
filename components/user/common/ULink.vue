<template>
  <NuxtLink
    :to="to"
    :class="{
      small: hSize === 'small',
      primary: buttonType === 'primary',
      secondary: buttonType === 'secondary',
      chart: buttonType === 'chart'
    }"
    :style="{
      minWidth: `${getMinWidth}`,
      width: `${width}`
    }"
    :target="target"
    @keyup.enter="$emit('click', $event)"
    @click="$emit('click', $event)"
  >
    <slot />
  </NuxtLink>
</template>

<script>
export default {
  name: 'ULink',
  props: {
    // value: primary(default) | secondary | chart
    buttonType: {
      type: String,
      required: false,
      default: 'primary'
    },
    // value: primary(default) | secondary | chart
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
      width: 'auto'
    };
  },
  computed: {
    getMinWidth() {
      const wSize = this.wSize;
      let minWidth = '';

      switch (wSize) {
        case 'xsm':
          minWidth = '10.4rem';
          break;
        case 'sm':
          minWidth = '12.8rem';
          break;
        case 'common1':
          minWidth = '15.2rem';
          break;
        case 'common2':
          minWidth = '20.8rem';
          break;
        case 'lg':
          minWidth = '22rem';
          break;
        case 'xlg':
          minWidth = '43.2rem';
          break;
        case 'xxlg':
          minWidth = '54.8rem';
          break;
        case '100':
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.width = '100%';
          minWidth = 'auto';
          break;
        default:
          minWidth = 'auto';
          break;
      }

      return minWidth;
    }
  }
};
</script>

<style lang="scss" scoped>
a {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 160%;
  height: 5.2rem;
  padding: 0 1.2rem;
  letter-spacing: 0.25px;

  &.primary {
    color: var(--color-white);
    font-weight: 700;
    background-color: var(--color-u-primary);
  }

  &.secondary {
    color: var(--color-u-primary);
    border: 1px solid var(--color-u-primary);
    background-color: transparent;
  }

  &.chart {
    color: #000;
    border: 1px solid var(--color-u-grey-2);
  }

  &.small {
    height: 4rem;
    font-size: 1.4rem;
  }

  &:disabled {
    color: var(--color-u-grey-2);
    border: 0;
    background-color: var(--color-u-grey-1);
    pointer-events: none;
  }
}

@media screen and (max-width: 768px) {
  a {
    height: 4.4rem;
    font-size: 1.4rem;
    padding: 0 0.8rem;
  }
}
</style>
