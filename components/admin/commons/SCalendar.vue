<template>
  <client-only>
    <VCalendar class="calendar" :from-page="fromPage" :attributes="attributes" :masks="masks">
      <template #header-left-button>
        <button type="button"><i class="ic-arrow-left" /></button>
      </template>
      <template #header-right-button>
        <button type="button"><i class="ic-arrow-right" /></button>
      </template>
      <template #day-content="{ day }">
        <div
          class="calendar-custom"
          :class="{
            'is-active': day.isToday,
            'is-selected': day.id === selectedRoundDate,
            'is-click': !(day.inPrevMonth || day.inNextMonth),
            'is-disabled': day.inPrevMonth || day.inNextMonth,
            'is-overbooking': getData(day) && getData(day).isOverbooking,
            'is-open-period': getIsOpenDay(day.id),
            'is-holiday': holidayList.includes(day.id)
          }"
          @click="onSelectDate(day)"
        >
          <p class="calendar-custom-day">{{ day.day }}</p>
          <p v-if="getData(day)" class="calendar-custom-count-label">
            {{ getData(day).allTicketingCount }}/{{ getData(day).allMaxCount }}
          </p>
        </div>
      </template>
    </VCalendar>
  </client-only>
</template>

<script>
export default {
  name: 'SCalendar',
  props: {
    exStartDate: {
      type: String,
      required: false,
      default: ''
    },
    exEndDate: {
      type: String,
      required: false,
      default: ''
    },
    holidayList: {
      type: Array,
      required: false,
      default: () => []
    },
    computedRoundData: {
      type: Object,
      required: false,
      default: () => {}
    },
    selectedRoundDate: {
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
    const [year, month] = this.selectedRoundDate
      ? this.selectedRoundDate.split('-')
      : this.$dayjs().format('YYYY-MM').split('-');

    this.fromPage.year = Number(year);
    this.fromPage.month = Number(month);
  },
  methods: {
    getData({ id }) {
      return this.computedRoundData ? this.computedRoundData[id] || null : null;
    },
    getIsOpenDay(targetDay) {
      return this.exStartDate && this.exEndDate
        ? this.$dayjs(targetDay).isBetween(this.exStartDate, this.exEndDate, 'd', '[]')
        : false;
    },
    onSelectDate({ id }) {
      this.$emit('onSelectedDate', id);
    }
  }
};
</script>

<style lang="scss" scoped>
.calendar {
  display: inline-flex;
  position: relative;
  color: var(--color-black);

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
      height: 4.4rem;
      padding: 0;
      background-color: var(--color-blue);
      border-radius: 0.3rem 0.3rem 0 0;

      .vc-title {
        color: var(--color-white);
        font-size: 1.6rem;
      }
    }

    .vc-weeks {
      padding: 1.6rem 2.4rem 2.4rem 2.4rem;

      .vc-weekday {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-black);
        height: 1.6rem;
        width: 9.6rem;
        font-size: 1.4rem;
        padding: 0;
        margin-bottom: 1.5rem;
      }

      .vc-day {
        height: 7.2rem;
        width: 9.6rem;
        margin-bottom: 0.8rem;
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
      justify-content: flex-start;
      height: 100%;
      overflow: hidden;
      user-select: none;

      .calendar-custom-day {
        height: 2.4rem;
        font-size: 1.4rem;
        font-weight: 500;
        margin-top: 0.8rem;
        text-align: center;
        margin-bottom: 0.4rem;
      }

      .calendar-custom-count-label {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
        font-weight: 500;
        height: 2.8rem;
        border: 1px solid var(--color-black);
        padding: 0 0.8rem;
        border-radius: 3rem;
      }

      &.is-active .calendar-custom-day {
        color: var(--color-blue);
      }
      &.is-active .calendar-custom-count-label {
        color: var(--color-blue);
        border-color: var(--color-blue);
      }
      &.is-selected {
        border: 1px solid var(--color-blue);
      }
      &.is-click {
        cursor: pointer;
        transition: 0.1s all ease-in-out;

        &:hover {
          transform: scale(0.9);
        }
      }
      &.is-disabled .calendar-custom-count-label {
        border-color: var(--color-grey-2);
      }
      &.is-open-period {
        background-color: #ebf7ff !important;
      }
      &.is-holiday {
        background-color: var(--color-grey-1) !important;
      }
    }
  }
}
</style>
