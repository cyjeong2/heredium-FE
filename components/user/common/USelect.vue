<template>
  <div
    class="dropdown"
    :class="{ 'is-open': isOpen }"
    :style="{
      width: `${width}`
    }"
    @click="onStopPropagation"
  >
    <div v-if="isHasSlotText" class="txt-body1">
      <slot />
    </div>
    <div
      class="dropdown-wrap"
      :style="{
        width: `${width}`
      }"
    >
      <select
        v-model="selected"
        class="dropdown-btn"
        :disabled="disabled"
        :style="{
          width: `${width}`
        }"
        @click="toggleOn"
        @focusout="toggleOff"
        @change="onSelected"
      >
        <option v-if="defaultText" :value="null" hidden>{{ defaultText }}</option>
        <option v-for="item in optionList" :key="item.value" :value="item.value">{{ item.label }}</option>
      </select>
      <div class="dropdown-icon">
        <template v-if="!isCalIcon">
          <i class="pc uic-arrow_bottom rotate" />
          <i class="m umic-arrow_bottom rotate" />
        </template>
        <template v-else>
          <i class="pc uic-calendar" />
          <i class="m umic-calendar" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'USelect',
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
      default: null
    },
    // value: x-small | small | normal | large | x-large
    wSize: {
      type: String,
      required: false,
      default: ''
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    isCalIcon: {
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
      case 'small':
        width = '25rem';
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

  &.small {
    width: 15.2rem !important;

    .dropdown-wrap,
    .dropdown-btn {
      width: 15.2rem !important;
    }

    .dropdown-icon {
      width: 2rem;
      i {
        font-size: 2rem;
      }
    }
  }

  .label {
    margin-right: 1.2rem;
  }

  .dropdown-wrap {
    position: relative;
  }

  .dropdown-btn {
    color: var(--color-black);
    height: 5.2rem;
    width: 40rem;
    padding: 0 6.4rem 0 1.6rem;
    border: 1px solid var(--color-u-grey-2);
    text-align: left;
    background-color: var(--color-white);
    outline: 0;

    &:disabled {
      color: var(--color-grey-3);
      pointer-events: none;
    }
  }

  .dropdown-icon {
    display: flex;
    position: absolute;
    height: calc(100% - 2px);
    width: 2.4rem;
    align-items: center;
    justify-content: center;
    top: 1px;
    right: 2.1rem;
    font-size: 2.4rem;
    pointer-events: none;
  }

  &.is-open .dropdown-icon i.rotate {
    transform: rotate(-180deg);
  }

  i.m {
    display: none;
  }
}

@media screen and (min-width: 769px) {
  .dropdown-btn {
    font-size: 1.8rem;
  }
}

@media screen and (max-width: 768px) {
  .dropdown-btn {
    height: 4.4rem !important;
    width: 20rem;
    padding: 0 4.8rem 0 1.6rem !important;

    &:disabled {
      color: var(--color-grey-3);
      pointer-events: none;
    }
  }

  .dropdown-icon {
    right: 1.2rem !important;
    font-size: 2rem !important;
  }

  i.pc {
    display: none;
  }

  i.m {
    display: block !important;
  }
}
</style>
