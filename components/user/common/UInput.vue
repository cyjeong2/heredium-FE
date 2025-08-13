<template>
  <div
    class="input-wrap"
    :class="{ 'is-error': !!errorMsg, 'h-small': hSmall }"
    :style="{ width: wSize === 'full' ? '100%' : 'auto' }"
  >
    <input
      ref="input"
      :value="value"
      :placeholder="placeholder"
      :readonly="readonly"
      :style="{
        width: `${width}`,
        textAlign: textAlign
      }"
      :type="type"
      :maxlength="maxlength ? maxlength : '524288'"
      :disabled="disabled"
      @input="updateInput"
      @keyup="keyup"
      @keyup.enter="enter"
    />
    <p v-if="!!errorMsg" class="error-msg">{{ errorMsg }}</p>
    <div v-if="subIcon" class="sub-icon">명</div>
  </div>
</template>

<script>
import { threeCommaNum } from '~/assets/js/commons';

export default {
  name: 'UInput',
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
    disabled: {
      type: Boolean,
      required: false,
      default: false
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
    // value: ...working
    wSize: {
      type: String,
      required: false,
      default: 'normal'
    },
    hSmall: {
      type: Boolean,
      required: false,
      default: false
    },
    errorMsg: {
      type: String,
      required: false,
      default: ''
    },
    isCommaNum: {
      type: Boolean,
      required: false,
      default: false
    },
    isNumberOnly: {
      type: Boolean,
      required: false,
      default: false
    },
    textAlign: {
      type: String,
      required: false,
      default: 'left'
    },
    subIcon: {
      type: String, // 명 | ...
      required: false,
      default: ''
    }
  },
  data() {
    return {
      width: ''
    };
  },
  created() {
    let width = '';

    switch (this.wSize) {
      case 'sm':
        width = '16.8rem';
        break;
      case 'normal':
        width = '40rem';
        break;
      case 'full':
        width = '100%';
        break;
      default:
        width = '40rem';
        break;
    }

    this.width = width;
  },
  mounted() {
    if (this.isCommaNum) {
      const $input = this.$refs.input;
      const initValue = this.getThreeCommaNum($input.value);

      if (initValue !== '0') {
        $input.value = initValue;
      }
    }
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

      if (this.isCommaNum) {
        value = this.getCommaNumToNormalNum(value);
        e.target.value = this.getThreeCommaNum(value);
      } else if (this.isNumberOnly) {
        value = this.getNumberOnly(value);
        e.target.value = value;
      }

      return value;
    },
    getThreeCommaNum(value) {
      return threeCommaNum(value);
    },
    getCommaNumToNormalNum(value) {
      return Number(
        value
          .replaceAll(',', '')
          .replaceAll(/[^0-9]+/g, '')
          .replace(/^0+/, '')
      );
    },
    getNumberOnly(value) {
      return value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    }
  }
};
</script>

<style lang="scss" scoped>
.input-wrap {
  position: relative;
  display: inline-block;
}

input {
  color: var(--color-black);
  height: 5.2rem;
  width: 14.4rem;
  font-size: 1.8rem;
  font-weight: 500;
  padding: 0 1.6rem;
  border: 1px solid var(--color-u-grey-2);
  text-align: left;
  background-color: var(--color-white);
  border-radius: 2px;

  &::placeholder {
    color: var(--color-u-grey-2);
  }

  &:read-only {
    outline: 0;
    color: var(--color-grey-3);
    background-color: var(--color-u-grey-1);
  }

  &.is-success {
    border: 0.1rem solid var(--color-green) !important;
  }
}

.is-error {
  input {
    border-color: var(--color-u-error) !important;
  }

  .error-msg {
    color: var(--color-u-error);
    font-size: 1.4rem;
    font-weight: 500;
    line-height: 160%;
    letter-spacing: 0.25px;
    margin-top: 0.7rem;
    text-align: left;
  }
}

.sub-icon {
  color: var(--color-u-grey-2);
  position: absolute;
  top: 1.3rem;
  right: 1.2rem;
  font-weight: 500;
  font-size: 1.4rem;
  line-height: 100%;
}

.h-xs {
  input {
    width: 100% !important;
    height: 3.6rem;
    padding: 0 1.2rem;
    font-size: 1.2rem;
  }
}

.h-small {
  input {
    font-size: 1.4rem;
  }

  .error-msg {
    font-size: 1.2rem;
    margin-top: 0.5rem;
  }
}

.h-m {
  input {
    font-size: 1.4rem;
    height: 4.4rem;
  }
}

@media screen and (min-width: 769px) {
  .h-m {
    input {
      font-size: 1.8rem;
      height: 5.2rem;
    }
  }

  .h-xs {
    input {
      width: 32rem !important;
      height: 4rem;
      padding: 0 1.6rem;
      font-size: 1.4rem;
    }
  }

  .sub-icon {
    top: 1.6rem;
    right: 1.6rem;
    font-size: 1.8rem;
    line-height: 100%;
  }
}

@media screen and (max-width: 768px) {
  input {
    font-size: 1.4rem;
    height: 4rem;
  }

  .error-msg {
    font-size: 1.2rem !important;
    margin-top: 0.5rem !important;
  }
}
</style>
