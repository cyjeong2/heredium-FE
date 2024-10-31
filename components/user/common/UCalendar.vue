<template>
  <client-only>
    <VCalendar class="calendar" :from-page="fromPage" :attributes="attributes" :masks="masks" transition="fade">
      <template #header-left-button>
        <button type="button"><i class="m umic-arrow_backward" /></button>
      </template>
      <template #header-right-button>
        <button type="button"><i class="m umic-arrow_forward" /></button>
      </template>
      <template #day-content="{ day }">
        <div
          class="calendar-custom"
          :class="{
            'is-disabled': getIsDisabledDay(day.id),
            'is-sold-out': getIsSoldOutDay(day.id),
            'is-selected': day.id === selectedDate
          }"
          @click="onSelectDate(day.id)"
        >
          <p class="calendar-custom-day">{{ day.day }}</p>
        </div>
      </template>
    </VCalendar>
  </client-only>
</template>

<script>
export default {
  name: 'UCalendar',
  props: {
    dates: {
      type: Object,
      required: false,
      default: () => ({})
    },
    selectedDate: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      attributes: [
        {
          highlight: {
            start: { fillMode: 'outline' },
            base: { fillMode: 'light' },
            end: { fillMode: 'outline' }
          }
        }
      ],
      masks: {
        title: 'YYYY-MM'
      },
      fromPage: {
        month: '',
        year: ''
      }
    };
  },
  created() {
    const [year, month] = this.selectedDate
      ? this.$dayjs(this.selectedDate).format('YYYY-MM').split('-')
      : this.$dayjs().format('YYYY-MM').split('-');

    this.fromPage.year = Number(year);
    this.fromPage.month = Number(month);
  },
  methods: {
    getIsDisabledDay(today) {
      return !this.dates[today] || this.dates[today].type === 'DISABLED';
    },
    getIsSoldOutDay(today) {
      return this.dates[today]?.type === 'SOLD_OUT';
    },
    onSelectDate(id) {
      if (!this.getIsDisabledDay(id)) {
        this.$emit('onSelectedDate', id);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.umic-arrow_backward,
.umic-arrow_forward {
  color: var(--color-white);
  font-size: 2rem;
}

.calendar {
  display: inline-flex;
  position: relative;
  color: var(--color-black);
  border-color: var(--color-u-grey-1);

  .ic-arrow-left,
  .ic-arrow-right {
    color: var(--color-white);
    font-size: 2.2rem;
  }

  &::v-deep {
    .vc-popover-content {
      border-radius: 0.3rem;
      border-color: var(--color-grey-2);
    }

    .vc-arrow:hover {
      background: transparent;
    }

    .vc-header {
      height: 4rem;
      padding: 0;
      background-color: var(--color-u-primary);
      border-radius: 0.4rem 0.4rem 0 0;

      .vc-title {
        color: var(--color-white);
        font-size: 1.6rem;
      }
    }

    .vc-weeks {
      padding: 2rem 1.8rem 2.2rem 1.8rem;

      .vc-weekday {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-black);
        height: 1.6rem;
        width: 3.6rem;
        font-size: 1.2rem;
        padding: 0;
        margin-bottom: 2.4rem;
      }

      .vc-day {
        height: 3.6rem;
        width: 3.6rem;
        margin-bottom: 0.4rem;
      }

      .vc-day.is-not-in-month *[data-v-4420d078] {
        color: var(--color-grey-3) !important;
        opacity: 1;
      }

      .vc-day-content {
        color: var(--color-black);
        border-radius: 0 !important;
        font-size: 1.4rem;
        height: 100%;
        width: 100%;

        &:hover {
          border-radius: 0;
        }
      }

      .vc-highlight-base-start,
      .vc-highlight-base-middle,
      .vc-highlight-base-end {
        width: 100% !important;
      }

      .vc-highlights + span.vc-day-content.vc-focusable {
        color: var(--color-blue) !important;
      }

      .vc-highlight {
        height: 7.2rem;
        width: 9.6rem;
        border-radius: 0 !important;
        border-color: var(--color-blue) !important;
        border-width: 1px !important;
        background-color: #ebf7ff !important;
      }
    }

    .calendar-custom {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      overflow: hidden;
      user-select: none;
      cursor: pointer;
      transition: 0.1s all ease-in-out;

      &:hover {
        transform: scale(0.9);
      }

      .calendar-custom-day {
        font-size: 1.4rem;
        font-weight: 500;
        text-align: center;
      }

      &.is-selected {
        color: var(--color-white);
        background-color: rgba(165, 177, 149, 0.6);
        border: 1px solid var(--color-u-primary);
      }
      &.is-disabled {
        background-color: rgba(235, 235, 235, 0.4);

        &:hover {
          transform: none;
        }
      }
      &.is-sold-out {
        color: var(--color-u-error);
        background-color: rgba(255, 77, 0, 0.1);

        &:hover {
          transform: none;
        }
      }
    }
  }
}

@media screen and (min-width: 769px) {
  .calendar {
    display: inline-flex;
    position: relative;
    color: var(--color-black);

    &::v-deep {
      .vc-arrows-container {
        top: 0.3rem;
      }

      .vc-header {
        height: 4.8rem;

        .vc-title {
          font-size: 1.8rem;
          font-weight: 500;
          line-height: 160%;
        }
      }

      .vc-weeks {
        padding: 2rem 3.2rem 3.2rem;

        .vc-weekday {
          height: 2.6rem;
          width: 6rem;
          font-size: 1.6rem;
          line-height: 160%;
          margin-bottom: 1.9rem;
        }

        .vc-day {
          height: 5.2rem;
          width: 6rem;
        }
      }

      .calendar-custom {
        .calendar-custom-day {
          font-size: 1.8rem;
        }
      }
    }
  }
}
</style>
