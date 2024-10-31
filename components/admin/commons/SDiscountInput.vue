<template>
  <input
    ref="input"
    :value="displayValue"
    :placeholder="placeholder"
    :readonly="readonly"
    :class="{ 'is-error': isError }"
    :style="{
      minWidth: `${minWidth}`,
      textAlign: textAlign
    }"
    :type="type"
    :maxlength="maxlength ? maxlength : '524288'"
    @input="updateInput"
    @keyup="keyup"
    @keyup.enter="enter"
  />
</template>

<script>
import { threeCommaNum } from '~/assets/js/commons';

export default {
  name: 'SDiscountInput',
  props: {
    value: {
      type: [String, Number],
      required: false,
      default: ''
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    },
    type: {
      type: String,
      required: false,
      default: 'text'
    },
    maxlength: {
      type: String,
      required: false,
      default: ''
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    },
    // value: small | normal | large | x-large | xx-large | xxx-large
    wSize: {
      type: String,
      required: false,
      default: 'normal'
    },
    isError: {
      type: Boolean,
      required: false,
      default: false
    },
    textAlign: {
      type: String,
      required: false,
      default: 'left'
    }
  },
  data() {
    return {
      minWidth: '20rem'
    };
  },
  computed: {
    displayValue() {
      if (this.value === 100) {
        return '무료';
      }
      return this.value;
    }
  },
  created() {
    let minWidth = '9.6rem';

    switch (this.wSize) {
      case 'x-small':
        minWidth = '9.6rem';
        break;
      case 'small':
        minWidth = '15.2rem';
        break;
      case 'normal':
        minWidth = '20rem';
        break;
      case 'large':
        minWidth = '32rem';
        break;
      case 'x-large':
        minWidth = '46.0rem';
        break;
      case 'xx-large':
        minWidth = '58.4rem';
        break;
      case 'xxx-large':
        minWidth = '74.4rem';
        break;
      case 'full':
        minWidth = '100%';
        break;
      default:
        minWidth = '20rem';
        break;
    }

    this.minWidth = minWidth;
  },
  methods: {
    updateInput(e) {
      this.$emit('input', this.getComputedValue(e));
    },
    keyup(e) {
      this.$emit('keyup', this.getComputedValue(e));
    },
    enter(e) {
      this.$emit('enter', this.getComputedValue(e));
    },
    getComputedValue(e) {
      let value = e.target.value;
      if (value === '무료') {
        return 100;
      }

      if (isNaN(Number(value))) {
        e.target.value = '';
        return '';
      }

      value = this.getReplaceNum(value);
      if (value > 100) {
        e.target.value = '무료';
        return 100;
      }

      e.target.value = String(threeCommaNum(value));
      return value;
    },
    getReplaceNum(value) {
      let replaceNum = value
        .replaceAll(',', '')
        .replaceAll(/[^0-9]+/g, '')
        .replace(/^0+/, '');

      if (replaceNum.length > 8) {
        replaceNum = replaceNum.slice(0, 8);
      }

      return Number(replaceNum);
    },
    toNumber(value) {
      return value.replace(/\D+/g, '');
    }
  }
};
</script>

<style lang="scss" scoped>
input {
  color: var(--color-black);
  height: 4.4rem;
  width: 14.4rem;
  font-size: 1.4rem;
  padding: 0 1.6rem;
  border: 1px solid var(--color-grey-2);
  border-radius: 0.3rem;
  text-align: left;
  background-color: var(--color-white);

  &::placeholder {
    color: var(--color-grey-3);
  }

  &:read-only {
    outline: 0;
    color: var(--color-grey-2);
  }

  &.is-error {
    border: 1px solid var(--color-red) !important;
  }

  &.is-success {
    border: 0.1rem solid var(--color-green) !important;
  }
}
</style>
