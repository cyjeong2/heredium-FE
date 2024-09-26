<template>
  <label>
    <input
      :value="value"
      type="radio"
      :checked="isChecked"
      :disabled="disabled"
      @change="$emit('change', $event.target.value)"
    />
    <span class="toggle"></span>
    <span v-if="isHasSlotText" class="text"><slot name="default" /></span>
  </label>
</template>

<script>
export default {
  name: 'URadio',
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Boolean],
      required: false,
      default: ''
    },
    modelValue: {
      type: String,
      required: false,
      default: ''
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    isHasSlotText() {
      return !!this.$slots.default;
    },
    isChecked() {
      return this.modelValue === this.value;
    }
  }
};
</script>

<style lang="scss" scoped>
label {
  position: relative;
  align-items: center;
  height: 1.8rem;
  padding-left: 1.4rem;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle {
    position: absolute;
    cursor: pointer;
    width: 1.8rem;
    height: 1.8rem;
    top: 50%;
    left: 0;
    transform: translateY(-62%);
    border: 1px solid var(--color-black);
    border-radius: 50%;
    background-color: var(--color-white);
    transition: 0.15s all ease-out;
  }

  input:checked + .toggle {
    border: 0;
    background-color: var(--color-u-primary);
  }

  input:disabled + .toggle {
    border-color: var(--color-grey-2);
    background-color: var(--color-white);
  }

  input:checked + .toggle::after {
    content: '';
    position: absolute;
    height: 0.8rem;
    width: 0.8rem;
    top: 50%;
    left: 50%;
    font-family: 'simsimicons', serif;
    font-size: 0.1rem;
    transform: translate(-50%, -50%);
    background-color: var(--color-white);
    border-radius: 50%;
    border: 0;
  }

  .text {
    display: inline-flex;
    color: var(--color-black);
    padding-left: 0.7rem;
    font-size: 1.4rem;
    font-weight: 400;
    line-height: 150%;
    cursor: pointer;
    user-select: none;
    transform: translateY(-0.2rem);
  }
}
</style>
