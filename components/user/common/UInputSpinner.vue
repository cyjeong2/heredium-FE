<template>
  <div class="input-spinner">
    <button class="minus" :disabled="minusDisabled || disabled" type="button" @click="minus">
      <i class="m umic-minus" />
    </button>
    <div class="txt-body2">{{ value }}</div>
    <button class="plus" :disabled="plusDisabled || disabled" type="button" @click="plus">
      <i class="m umic-plus" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'UInputSpinner',
  props: {
    value: {
      type: Number,
      required: false,
      default: 0
    },
    plusDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    minusDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    minus() {
      const updatedValue = this.value > 0 ? this.value - 1 : 0;
      this.$emit('input', updatedValue);
    },
    plus() {
      const updatedValue = this.value + 1;
      this.$emit('input', updatedValue);
    }
  }
};
</script>

<style lang="scss" scoped>
.input-spinner {
  color: var(--color-u-primary);
  display: flex;
  width: 10.8rem;
  height: 3.6rem;
  border: 1px solid var(--color-u-primary);
  justify-content: space-between;

  > * {
    display: flex;
    flex: 1 1 0;
    align-items: center;
    justify-content: center;
  }

  i {
    font-size: 2.4rem;
  }

  .minus {
    border-right: 1px solid var(--color-u-primary);

    &:disabled {
      color: var(--color-u-grey-1);
    }
  }

  .plus {
    color: var(--color-white);
    background-color: var(--color-u-primary);

    &:disabled {
      color: var(--color-u-grey-1);
      background-color: var(--color-u-grey-2);
    }
  }
}
</style>
