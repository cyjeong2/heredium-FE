<template>
  <div class="week-tab">
    <button
      v-for="(item, index) in weekArray"
      :key="item.value"
      :class="{ selected: item.isSelected }"
      type="button"
      @click="onToggleDay(index)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'SWeekTab',
  props: {
    value: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      weekArray: [
        {
          label: '일',
          value: 'Sunday',
          isSelected: false
        },
        {
          label: '월',
          value: 'Monday',
          isSelected: false
        },
        {
          label: '화',
          value: 'Tuesday',
          isSelected: false
        },
        {
          label: '수',
          value: 'Wednesday',
          isSelected: false
        },
        {
          label: '목',
          value: 'Thursday',
          isSelected: false
        },
        {
          label: '금',
          value: 'Friday',
          isSelected: false
        },
        {
          label: '토',
          value: 'Saturday',
          isSelected: false
        }
      ]
    };
  },
  created() {
    if (this.value != null) {
      this.value.forEach((value) => {
        const targetDay = this.weekArray.find((day) => day.value === value);

        if (targetDay) {
          targetDay.isSelected = true;
        }
      });
    }
  },
  methods: {
    onToggleDay(index) {
      this.weekArray[index].isSelected = !this.weekArray[index].isSelected;
      const selectedList = this.weekArray.filter((day) => day.isSelected).map((day) => day.value);

      this.$emit('input', selectedList);
    }
  }
};
</script>

<style lang="scss" scoped>
.week-tab {
  display: inline-flex;
  height: 4.4rem;
  border: 1px solid var(--color-grey-2);
  border-radius: 0.3rem;

  button {
    color: var(--color-grey-3);
    border-right: 1px solid var(--color-grey-2);
    height: 100%;
    width: 5.2rem;
    background-color: var(--color-white);
    font-weight: 500;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }

    &:last-child {
      border: 0;
    }

    &:first-child,
    &:last-child {
      color: var(--color-red);
    }

    &.selected {
      color: var(--color-white);
      background-color: var(--color-blue);

      &:hover {
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), var(--color-blue);
      }
    }
  }
}
</style>
