<template>
  <div class="dropdown" :class="{ 'is-open': isOpen }" @click.stop>
    <!-- (1) 슬롯 라벨 -->
    <div v-if="$slots.default" class="label">
      <slot />
    </div>

    <div class="dropdown-wrap">
      <!-- (2) 토글 버튼 -->
      <button
        class="dropdown-btn"
        :disabled="disabled"
        :style="{ width: `${width}rem` }"
        @click.stop="toggleMenu"
      >
        {{ displayLabel }}
      </button>
      <div class="dropdown-icon">
        <i class="ic-expand-more" />
      </div>

      <!-- (3) 메뉴 -->
      <div v-if="isOpen" class="dropdown-menu">
        <!-- 전체 선택/해제 -->
        <div class="dropdown-item all-select" @click.stop>
          <label>
            <input
              type="checkbox"
              :checked="allSelected"
              :disabled="disabled"
              @change.stop.prevent="toggleAll"
            />
            <span>전체</span>
          </label>
        </div>
        <hr />

        <!-- 옵션 리스트 -->
        <div
          v-for="opt in optionList"
          :key="opt.value"
          class="dropdown-item"
        >
          <label @click.stop>
            <input
              v-model="internalValue"
              type="checkbox"
              :value="opt.value"
              :disabled="disabled"
            />
            <span>{{ opt.label }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SMultiSelectDropdown',
  props: {
    // Vue2 기본 v-model prop
    value: {
      type: Array,
      default: () => []
    },
    optionList: {
      type: Array,
      default: () => []
    },
    defaultText: {
      type: String,
      default: '선택'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    wSize: {
      type: String,
      default: 'x-large'
    }
  },
  data() {
    return {
      isOpen: false,
      // (A) 부모 value 를 복사해서 내부로 관리
      internalValue: [...this.value],
      width: 15.2
    };
  },
  computed: {
    // 체크된 항목들의 라벨을 보여줌
    displayLabel() {
      const labels = this.optionList
        .filter(o => this.internalValue.includes(o.value))
        .map(o => o.label);
      return labels.length ? labels.join(', ') : this.defaultText;
    },
    // 전체 선택 여부
    allSelected() {
      return this.internalValue.length === this.optionList.length;
    }
  },
  watch: {
    // 부모에서 value 가 바뀌면 internalValue 동기화
    value(newVal) {
      this.internalValue = [...newVal];
    },
  },
  created() {
    // wSize 에 따라 버튼 너비 조절
    const sizes = {
      'x-small': 9.5,
      small: 12.2,
      normal: 15.2,
      large: 20,
      'x-large': 33
    };
    this.width = sizes[this.wSize] || 15.2;
  },
  mounted() {
    document.addEventListener('click', this.onOutsideClick);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onOutsideClick);
  },
  methods: {
    toggleMenu() {
      if (!this.disabled) {
        const willClose = this.isOpen;
        this.isOpen = !this.isOpen;
        // 메뉴가 닫힐 때 한 번만 부모에 전달
        if (willClose) {
          this.$emit('input', this.internalValue);
        }
      }
    },
    onOutsideClick(e) {
      this.isOpen = false;
      // 메뉴가 닫힐 때 한번만 emit
      this.$emit('input', this.internalValue);
    },
    toggleAll() {
      this.internalValue = this.allSelected
        ? []
        : this.optionList.map(o => o.value);
    }
  }
};
</script>

<style scoped lang="scss">
.dropdown {
  position: relative;
  display: inline-flex;
  align-items: center;

  .label {
    font-size: 1.4rem;
    margin-right: 1.2rem;
  }

  .dropdown-wrap {
    position: relative;
  }

  .dropdown-btn {
    color: var(--color-black);
    height: 4.4rem;
    width: 14.4rem;
    padding: 0 4.2rem 0 1.6rem;
    border: 1px solid var(--color-grey-2);
    border-radius: 0.3rem;
    text-align: left;
    background-color: var(--color-white);
    overflow: visible;
    height: auto;
    max-height: 8rem;
    padding: 0.8rem 1.6rem;
    white-space: normal;
    text-overflow: unset;

    &:disabled {
      color: var(--color-grey-3);
      pointer-events: none;
    }
  }

  .dropdown-icon {
    display: flex;
    position: absolute;
    height: calc(100% - 2px);
    width: 4.1rem;
    align-items: center;
    justify-content: center;
    top: 1px;
    right: 1px;
    font-size: 2.4rem;
    background-color: var(--color-grey-1);
    pointer-events: none;

    i {
      transition: 0.15s all ease-in-out;
    }
  }

  .dropdown-menu {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: calc(100% + 0.6rem);
    left: 0;
    max-height: 20rem;
    overflow-y: auto;
    min-width: 100%;
    width: max-content;
    z-index: 10;
    border: 1px solid var(--color-grey-2);
    background-color: var(--color-white);

    .dropdown-item {
      padding: 0.6rem 1rem;
      display: flex;
      align-items: center;
      font-size: 1.4rem;
      width: 200px;
      cursor: pointer;

      &:hover { background: var(--color-grey-1); }

      &.all-select {
        font-weight: bold;
      }

      label {
        display: flex;
        align-items: center;

        input { margin-right: 0.6rem; }
      }
    }

    hr {
      margin: 0.4rem 0;
      border: none;
      border-top: 1px solid var(--color-grey-2);
    }

    & > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 4rem;
      font-size: 1.4rem;
      padding: 0.5rem 1.6rem;
      text-align: left;
      gap: 1rem;

      &:hover {
        background-color: var(--color-grey-1);
      }
    }

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

  &.is-open {
    .dropdown-btn {
      border: 1px solid var(--color-blue);
    }

    .dropdown-icon {
      color: var(--color-white);
      background-color: var(--color-blue);

      i {
        transform: rotate(-180deg);
      }
    }
  }
}
</style>
