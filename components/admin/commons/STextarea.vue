<template>
  <div class="textarea" :style="{ height: height }" :class="{ outline: isFocus }">
    <textarea
      :value="value"
      :placeholder="placeholder"
      :readonly="readonly"
      :maxlength="maxlength ? maxlength : '524288'"
      @focusin="isFocus = true"
      @focusout="isFocus = false"
      @input="onInput"
    />
  </div>
</template>

<script>
export default {
  name: 'STextarea',
  props: {
    value: {
      type: String,
      required: false,
      default: ''
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    },
    maxlength: {
      type: String,
      required: false,
      default: ''
    },
    placeholder: {
      type: String,
      required: false,
      default: '텍스트'
    },
    height: {
      type: String,
      required: false,
      default: '25.6rem'
    }
  },
  data() {
    return {
      isFocus: false
    };
  },
  methods: {
    onInput(e) {
      this.$emit('input', e.target.value);
    }
  }
};
</script>

<style lang="scss" scoped>
.textarea {
  padding: 1.2rem 1.6rem;
  border-radius: 0.3rem;
  border: 1px solid var(--color-grey-2);
  background-color: var(--color-white);

  &.outline {
    outline: 5px auto -webkit-focus-ring-color;
  }
}

textarea {
  height: 100%;
  width: 100%;
  border: 0;
  outline: 0;
  resize: none;

  &::-webkit-scrollbar {
    height: 80%;
    margin-right: 12px;
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #d9d9d9;
    border-radius: 8px;
  }
  &::-webkit-scrollbar-track {
    background-color: var(--color-grey-1);
  }
}
</style>
