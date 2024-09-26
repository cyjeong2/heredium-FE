<template>
  <MonthPickerInput
    :default-year="defaultYear"
    :default-month="defaultMonth"
    date-format="%Y년 %n"
    lang="ko"
    class="date-picker"
    @change="onChangeMonth"
  />
</template>

<script>
import { numberPad } from '~/assets/js/commons';

export default {
  name: 'SMonthpicker',
  components: {
    MonthPickerInput: () =>
      process.client
        ? import('vue-month-picker').then((res) => res.MonthPickerInput)
        : Promise.resolve({ render: (h) => h('div') })
  },
  props: {
    value: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      defaultYear: '',
      defaultMonth: ''
    };
  },
  created() {
    this.defaultYear = Number(this.$dayjs(this.value).format('YYYY'));
    this.defaultMonth = Number(this.$dayjs(this.value).format('MM'));
  },
  methods: {
    onChangeMonth(date) {
      const month = numberPad(date.monthIndex, 2);
      const formatDate = `${date.year}-${month}-01`;

      this.$emit('input', formatDate);
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep input.month-picker-input {
  width: 14.4rem;
  height: 4.4rem;
  padding: 0 3rem 0 1.6rem;
  border: 1px solid var(--color-grey-2);
  border-radius: 0.3rem;
  background-color: var(--color-white);
  cursor: pointer;
  outline: 0;
  font-size: 1.4rem;
}

::v-deep .month-picker__year button {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}
</style>
