<template>
  <p
    :class="{
      schedule: type === 'SCHEDULE',
      booking: type === 'BOOKING',
      progress: type === 'PROGRESS',
      end: type === 'TERMINATION'
    }"
  >
    {{ getLabel(type) }}
  </p>
</template>

<script>
import { EXHIBITION_STATE_TYPE } from '~/assets/js/types';

export default {
  name: 'STag',
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
p {
  display: inline-flex;
  color: var(--color-black);
  border: 1px solid var(--color-black);
  line-height: 2.8rem;
  border-radius: 0.3rem;
  font-weight: 500;
  padding: 0 0.8rem;

  &.booking {
    color: var(--color-green);
    border-color: var(--color-green);
  }

  &.progress {
    color: var(--color-blue);
    border-color: var(--color-blue);
  }

  &.end {
    color: var(--color-grey-3);
    border-color: var(--color-grey-3);
  }
}
</style>
