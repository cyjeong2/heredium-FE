<template>
  <div class="membership-option" :class="{ checked: isChecked }" @click="toggleCheck">
    <input type="radio" :value="modelValue" :checked="isChecked" class="hidden-radio" @change="handleChange" />
    <div class="content">
      <div class="label-box">
        <div class="circle" :class="{ active: isChecked }"></div>
        <div class="label">
          <slot name="label"></slot>
        </div>
      </div>
      <div class="price">
        <slot name="price"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MembershipOption',
  props: {
    modelValue: {
      type: [String, Number],
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    change: {
      type: Function,
      required: true
    }
  },
  computed: {
    isChecked() {
      return this.modelValue === this.value;
    }
  },
  methods: {
    toggleCheck() {
      if (!this.isChecked) {
        this.change(this.value);
      }
    },
    handleChange() {
      this.$emit('input', this.value);
    }
  }
};
</script>

<style scoped lang="scss">
.membership-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid transparent;
  padding: 22px 20px;
  transition: border-color 0.3s;
  cursor: pointer;
  background-color: #f7f8f5;
  &.checked {
    border-color: var(--color-u-primary);
  }

  .hidden-radio {
    display: none;
  }

  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    flex-wrap: wrap;
    gap: 8px;

    .label-box {
      display: flex;
      flex-wrap: nowrap;

      .circle {
        width: 24px;
        height: 24px;
        border: 1px solid var(--color-u-grey-2);
        background-color: var(--color-white);
        border-radius: 50%;
        margin-right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s, border-color 0.3s;
      }
      .circle.active {
        border-color: var(--color-u-primary);
        position: relative;
      }
      .circle.active::after {
        position: absolute;
        left: 50%;
        top: 50%;
        content: '';
        width: 10px;
        height: 10px;
        background-color: var(--color-u-primary);
        border-radius: 50%;
        transform: translate(-50%, -50%);
      }

      .label {
        font-size: 1.4rem;
      }
    }

    .price {
      font-size: 2rem;
      font-weight: bold;
    }
  }
}
</style>
