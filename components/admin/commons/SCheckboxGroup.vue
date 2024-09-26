<template>
  <div>
    <label v-for="item in groupList" :key="item.value">
      <input ref="checkbox" v-model="checkedList" type="checkbox" :value="item.value" @change="onChange" />
      <span class="toggle" />
      <span class="text">{{ item.label }}</span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'SCheckboxGroup',
  props: {
    value: {
      type: Array,
      required: false,
      default: () => []
    },
    groupList: {
      type: Array,
      required: false,
      default: null
    }
  },
  data() {
    return {
      checkedList: this.value || [],
      isChecked: this.value
    };
  },
  watch: {
    value(newValue) {
      if (!newValue || newValue.length === 0) {
        this.checkedList = [];
        [...this.$refs.checkbox].forEach(($checkbox) => {
          $checkbox.checked = false;
        });
      }
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.checkedList);
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
  margin-right: 1.9rem;

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
    border-radius: 0.2rem;
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
    content: '\e912';
    position: absolute;
    top: 50%;
    left: 50%;
    font-family: 'simsimicons', serif;
    font-size: 0.1rem;
    transform: translate(-50%, -50%);
    color: var(--color-white);
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
