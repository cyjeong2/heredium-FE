<template>
  <span
    class="status-tag"
    :class="{
      schedule: type === 'SCHEDULE',
      booking: type === 'BOOKING',
      progress: type === 'PROGRESS',
      end: type === 'TERMINATION'
    }"
  >
    {{ getLabel(type) }}
  </span>
</template>

<script>
import { EXHIBITION_STATE_TYPE } from '~/assets/js/types';

export default {
  name: 'UTag',
  props: {
    // SCHEDULE | BOOKING | PROGRESS | TERMINATION
    type: {
      type: String,
      required: false,
      default: 'SCHEDULE'
    }
  },
  methods: {
    getLabel(type) {
      return EXHIBITION_STATE_TYPE[type];
    }
  }
};
</script>

<style lang="scss" scoped>
span {
  display: inline-flex;
  color: var(--color-u-primary);
  border: 1px solid var(--color-u-primary);
  height: 2.8rem;
  font-weight: 700 !important;
  padding: 0 1rem;
  align-items: center;
  justify-content: center;
  background-color: var(--color-white);

  &.booking {
    color: var(--color-white);
    background-color: var(--color-u-primary);
  }

  &.progress {
    color: var(--color-white);
    background-color: var(--color-u-primary);
  }

  &.end {
    color: var(--color-white);
    border-color: var(--color-u-grey-3);
    background-color: var(--color-u-grey-3);
  }
}
</style>
