<template>
  <label>
    <input
      :value="value"
      type="radio"
      :checked="isChecked"
      :disabled="disabled"
      @change="onChange"
    />
    <span class="toggle"></span>
    <span v-if="isHasSlotText" class="text"><slot name="default" /></span>
  </label>
</template>

<script>
export default {
  name: 'SRadio',
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Number, Boolean],
      required: false,
      default: ''
    },
    modelValue: {
      type: [String, Number, Boolean],
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
  },
  methods: {
    onChange(e) {
      let raw = e?.target?.value;

      // value의 타입에 맞춰 캐스팅
      if (typeof this.value === 'number') {
        const n = Number(raw);
        raw = Number.isNaN(n) ? raw : n;
      } else if (typeof this.value === 'boolean') {
        raw = (raw === 'true'); // 라디오 value가 'true'/'false'일 때
      }
      // 문자열인 경우는 그대로

      this.$emit('change', raw); // Vue2 v-model 이벤트
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
    transform: translateY(-50%);
    border: 1px solid var(--color-black);
    border-radius: 50%;
    background-color: var(--color-white);
    transition: 0.15s all ease-out;
  }

  input:checked + .toggle {
    border: 0;
    background-color: var(--color-blue);
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
