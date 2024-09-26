<template>
  <label
    :style="{
      width: `${width}`
    }"
    :class="{ 'border-style': borderStyle }"
  >
    <button v-if="value" type="button" class="init" @click.stop.prevent="onReset">
      <span>초기화</span>
    </button>
    <button type="button" class="search" @click="onSearch">
      <i class="pc uic-search" />
      <i class="m umic-header_search" />
    </button>
    <input
      ref="searchInput"
      type="search"
      :value="value"
      :placeholder="placeholder"
      @input="onInput"
      @keyup="onKeyup"
      @keyup.enter="onSearch"
    />
  </label>
</template>

<script>
export default {
  name: 'USearch',
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
    // value: 100, small | normal | large | x-large | xx-large | xxx-large
    wSize: {
      type: String,
      required: false,
      default: 'normal'
    },
    borderStyle: {
      type: Boolean,
      required: false,
      default: false
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
      case '100':
        width = '100%';
        break;
      case 'normal':
        width = '66.4rem';
        break;
      case 'full':
        width = '100%';
        break;
      default:
        width = '66.4rem';
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
    onSearch(e) {
      this.$emit('search', e);
    },
    onReset(e) {
      this.$emit('reset', e);
    }
  }
};
</script>

<style lang="scss" scoped>
label {
  display: flex;
  position: relative;
  height: 5.9rem;
  border-bottom: 1px solid var(--color-black);

  .search {
    display: flex;
    position: absolute;
    font-size: 2.4rem;
    top: 0;
    right: 0;
    height: 100%;
    padding: 0 0.8rem;
    align-items: center;
    justify-content: center;
  }

  .init {
    position: absolute;
    top: 0;
    right: 5.2rem;
    height: 100%;

    span {
      position: relative;
      display: block;
      width: 2rem;
      height: 2rem;
      background: var(--color-u-grey-2);
      border-radius: 50%;
      text-indent: -9999px;

      &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0.1rem;
        height: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        background-color: var(--color-white);
      }

      &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0.1rem;
        height: 50%;
        transform: translate(-50%, -50%) rotate(135deg);
        background-color: var(--color-white);
      }
    }
  }

  input {
    font-size: 2.4rem;
    font-weight: 500;
    width: 100%;
    padding: 0.2rem 4rem 2rem 1.6rem;
    background-color: var(--color-white);
    outline: 0;

    &::placeholder {
      color: var(--color-u-grey-2);
    }
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

label.border-style {
  border: 1px solid var(--color-black);

  .search {
    padding: 0 2rem 0 1rem;
  }

  .init {
    position: absolute;
    top: 0;
    right: 5.4rem;
    height: 100%;
  }

  input {
    font-size: 2rem;
    padding: 0 5.2rem 0 2rem;
  }
}

label.search-bar {
  .search {
    i {
      &.m {
        font-size: 2.8rem;
      }
    }
  }
  input {
    padding: 0.8rem;
    font-size: 1.8rem;
    font-weight: 400;
  }
}

i.m {
  display: none;
}

@media screen and (max-width: 768px) {
  label {
    height: 4.4rem;
  }

  label.border-style {
    .search {
      padding: 0 1.2rem 0 1rem;
    }

    .init {
      right: 5.2rem;
    }

    input {
      font-size: 1.4rem;
      padding: 0 8rem 0 1.2rem;
    }
  }

  i.m {
    display: block;
  }

  i.pc {
    display: none;
  }
}

@media screen and (min-width: 1025px) {
  label.search-bar {
    .search {
      i {
        &.pc {
          font-size: 3.2rem;
        }
      }
    }
    input {
      padding: 0.8rem 1.6rem;
      font-size: 2.4rem;
    }
  }
}
</style>
