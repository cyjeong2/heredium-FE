<template>
  <label
    :style="{
      width: `${width}rem`
    }"
  >
    <button type="button" class="search" @click="onSearch"><i class="ic-search" /></button>
    <input
      ref="searchInput"
      type="search"
      :value="value"
      :placeholder="placeholder"
      @input="onInput"
      @keyup="onKeyup"
      @keyup.enter="onSearch"
    />
    <button v-if="value" class="clear" type="button" aria-label="clear" @click="onClearValue">
      <i class="ic-close" />
    </button>
  </label>
</template>

<script>
export default {
  name: 'SSearchBar',
  props: {
    value: {
      type: [String, Number],
      required: false,
      default: ''
    },
    placeholder: {
      type: String,
      required: false,
      default: '검색어를 입력해주세요'
    },
    // value: small | normal | large | x-large | xx-large | xxx-large
    wSize: {
      type: String,
      required: false,
      default: 'xxx-large'
    }
  },
  data() {
    return {
      width: 20
    };
  },
  created() {
    let width = 74.4;

    switch (this.wSize) {
      case 'small':
        width = 15.2;
        break;
      case 'normal':
        width = 20;
        break;
      case 'large':
        width = 32;
        break;
      case 'x-large':
        width = 46.0;
        break;
      case 'xx-large':
        width = 58.4;
        break;
      case 'xxx-large':
        width = 74.4;
        break;
      default:
        width = 20;
        break;
    }

    this.width = width;
  },
  methods: {
    onClearValue() {
      this.$emit('input', '');
    },
    onInput(e) {
      this.$emit('input', e.target.value);
    },
    onKeyup(e) {
      this.$emit('keyup', e.target.value);
    },
    onSearch() {
      this.$emit('search');
    }
  }
};
</script>

<style lang="scss" scoped>
label {
  display: flex;
  position: relative;
  height: 4.4rem;
  border: 1px solid var(--color-grey-2);
  border-radius: 0.3rem;

  .search {
    display: flex;
    position: absolute;
    font-size: 2.4rem;
    top: 0;
    left: 0;
    height: 100%;
    width: 4rem;
    align-items: center;
    justify-content: center;
  }

  input {
    font-size: 1.4rem;
    width: 100%;
    padding: 0 4rem;
    background-color: var(--color-white);

    &::placeholder {
      color: var(--color-grey-3);
    }
  }

  .clear {
    display: flex;
    position: absolute;
    font-size: 2.4rem;
    top: 0;
    right: 0;
    height: 100%;
    width: 4rem;
    align-items: center;
    justify-content: center;
  }

  input::-ms-clear,
  input::-ms-reveal,
  input::-webkit-search-decoration,
  input::-webkit-search-cancel-button,
  input::-webkit-search-results-button,
  input::-webkit-search-results-decoration {
    display: none;
  }
}
</style>
