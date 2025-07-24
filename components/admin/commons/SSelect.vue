<template>
  <div class="dropdown" :class="{ 'is-open': isOpen }" @click="onStopPropagation">
    <div v-if="isHasSlotText" class="label">
      <slot />
    </div>
    <div class="dropdown-wrap">
      <select
        v-model="selected"
        class="dropdown-btn"
        :disabled="disabled"
        :style="{
          width: `${width}rem`
        }"
        @click="toggleOn"
        @focusout="toggleOff"
        @change="onSelected"
      >
      <option disabled :value="null">{{ defaultText }}</option>
      <option v-for="item in optionList" :key="item.value" :value="item.value">{{ item.label }}</option>
      </select>
      <div class="dropdown-icon">
        <i class="ic-expand-more" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SSelect',
  props: {
    value: {
      type: [String, Number, Boolean, null],
      required: false,
      default: null
    },
    // optionList: [{ value: '', label: '' }]
    optionList: {
      type: Array,
      required: false,
      default: () => []
    },
    defaultText: {
      type: String,
      required: false,
      default: '옵션선택'
    },
    // value: x-small | small | normal | large | x-large
    wSize: {
      type: String,
      required: false,
      default: 'normal'
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      width: 15.2,
      isOpen: false,
      selected: null
    };
  },
  computed: {
    isHasSlotText() {
      return !!this.$slots.default;
    }
  },
  watch: {
    value(newValue) {
      this.selected = newValue;
    }
  },
  created() {
    let width = '';

    switch (this.wSize) {
      case 'x-small':
        width = 9.5;
        break;
      case 'small':
        width = 12.2;
        break;
      case 'normal':
        width = 15.2;
        break;
      case 'large':
        width = 20;
        break;
      case 'x-large':
        width = 46;
        break;
      case 's-large':
        width = 30;
        break;
      default:
        width = 15.2;
        break;
    }
    this.width = width;
    this.selected = this.value;
  },
  methods: {
    toggleOn() {
      this.isOpen = true;
    },
    toggleOff() {
      this.isOpen = false;
    },
    onStopPropagation(e) {
      e.stopPropagation();
    },
    onToggleMenu() {
      this.isOpen = !this.isOpen;
    },
    onSelected() {
      const value = this.selected;

      this.isOpen = false;
      this.$emit('input', value);
      this.$emit('change');
    }
  }
};
</script>

<style lang="scss" scoped>
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
    outline: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

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
