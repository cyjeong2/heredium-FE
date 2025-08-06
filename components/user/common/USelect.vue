<template>
  <div
    ref="root"
    class="dropdown"
    :class="[{ 'is-open': isOpen }, wSize]"
    :style="{ width }"
  >
    <!-- slot 으로 라벨을 넣고 싶을 때 -->
    <div v-if="isHasSlotText" class="txt-body1">
      <slot/>
    </div>

    <div class="dropdown-wrap" :style="{ width }">
      <!-- 선택된 값 표시 버튼 -->
      <div
        class="dropdown-btn"
        :class="{ disabled }"
        :style="{ width }"
        @click.stop="toggle"
      >
        <span class="selected-text">
          {{ currentLabel || defaultText || '선택' }}
        </span>
        <div class="dropdown-icon">
          <!-- PC / 모바일 대응 -->
          <i class="only-pc uic-arrow_bottom rotate" />
          <i class="only-mobile uic-arrow_bottom rotate" />
       </div>
      </div>

      <!-- 커스텀 옵션 리스트 -->
      <ul v-if="isOpen" class="dropdown-menu" :style="{ width }">
        <!-- 기본 힌트 옵션 -->
        <li
          v-if="defaultText"
          class="dropdown-item hint"
          @click.stop="select(null)"
        >
          {{ defaultText }}
        </li>
        <!-- 실제 옵션 -->
        <li
          v-for="item in optionList"
          :key="item.value"
          class="dropdown-item"
          :class="{ selected: item.value === selected }"
          @click.stop="select(item.value)"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'USelect',
  props: {
    value: {
      type: [String, Number, Boolean, null],
      default: null
    },
    optionList: {
      type: Array,
      default: () => []
    },
    defaultText: {
      type: String,
      default: ''
    },
    wSize: {
      type: String,
      default: 'normal' // 'small' | 'normal' | 'full'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isCalIcon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      width: '40rem',
      isOpen: false,
      selected: this.value
    };
  },
  computed: {
    isHasSlotText() {
      return !!this.$slots.default;
    },
    currentLabel() {
      const f = this.optionList.find(o => o.value === this.selected);
      return f ? f.label : '';
    }
  },
  watch: {
    value(v) { this.selected = v; },
    wSize: 'calcWidth'
  },
  mounted() {
    this.calcWidth();
    document.addEventListener('click', this.onClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.onClickOutside);
  },
  methods: {
    calcWidth() {
      switch (this.wSize) {
        case 'small':  this.width = '25rem'; break;
        case 'full':   this.width = '100%'; break;
        default:       this.width = '40rem'; break;
      }
    },
    toggle() {
      if (!this.disabled) this.isOpen = !this.isOpen;
    },
    select(val) {
      if (this.disabled) return;
      this.selected = val;
      this.$emit('input', val);
      this.$emit('change', val);
      this.isOpen = false;
    },
    onClickOutside(e) {
      if (!this.$refs.root.contains(e.target)) {
        this.isOpen = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.dropdown {
  position: relative;
  display: inline-block;
  vertical-align: top;

  &.small { /* wSize="small" */
    width: 25rem !important;
  }
  &.normal {
    width: 40rem;
  }
  &.full { /* wSize="full" */
    width: 100%;
  }

  .dropdown-wrap {
    position: relative;
  }

  .dropdown-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.6rem;
    height: 5.2rem;
    border: 1px solid var(--color-u-grey-2);
    background: var(--color-white);
    color: var(--color-black);
    cursor: pointer;
    user-select: none;

    &.disabled {
      color: var(--color-grey-3);
      background: var(--color-grey-1);
      cursor: not-allowed;
    }

    .selected-text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dropdown-icon {
      flex: 0 0 auto;
      margin-left: 0.8rem;
      i {
        font-size: 2.4rem;
        &.rotate { transition: transform .2s; }
      }
    }
  }

  .dropdown-icon i {
    transform: rotate(-90deg);
    transition: transform .2s;
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 10;
    max-height: 30rem;
    margin: 0;
    padding: 0;
    list-style: none;
    background: var(--color-white);
    border: 1px solid var(--color-u-grey-2);
    overflow-y: auto;
  }

  .dropdown-item {
    padding: 1rem 1.6rem;
    cursor: pointer;
    white-space: nowrap;
    &:hover { background: var(--color-grey-1); }
    &.selected { background: var(--color-grey-2); }
  }

  .dropdown-item.hint {
    font-style: italic;
    color: var(--color-grey-4);
  }
}

/* 기존 pc/m 규칙 복사해서 only-로 하나 더 만들어줍니다 */
i.only-mobile {
  display: none;
}
@media screen and (max-width: 768px) {
  i.only-pc {
    display: none !important;
  }
  i.only-mobile {
    display: block !important;
  }
}
/* 회전 토글은 그대로 */
.dropdown.is-open .dropdown-icon i.rotate {
  transform: rotate(-270deg);
}
</style>
