<template>
  <TicketingDetail :id="id" type="EXHIBITION" :init-detail-data="detailData" :init-selected-date="selectedDate" />
</template>

<script>
import { isEmpty } from 'lodash/lang';
import TicketingDetail from '~/components/user/page/TicketingDetail';

export default {
  name: 'TicketingExhibition',
  components: { TicketingDetail },
  async asyncData({ $axios, params, $dayjs, redirect }) {
    const today = $dayjs().format('YYYY-MM-DD');
    const id = params.id;
    const detailData = await $axios
      .$get(`/user/exhibitions/${id}/rounds`)
      .then((res) => ({
        ...res,
        prices: res.prices.map((item) => ({ ...item, count: 0 }))
      }))
      .catch(() => {
        redirect('/ticketing');
      });
    let selectedDate = '';

    if (detailData.dates[today] && detailData.dates[today].type === 'ENABLED') {
      selectedDate = today;
    } else if (!isEmpty(detailData.dates)) {
      const getNextEventDate = (type) => {
        return Object.entries(detailData.dates)
          .sort((a, b) => new Date(a[1].date) - new Date(b[1].date))
          .find(([date, value]) => $dayjs(date).isSameOrAfter(today) && value.type === type);
      };
      const [nextEventDate] = getNextEventDate('ENABLED') || getNextEventDate('SOLD_OUT') || [''];

      selectedDate = nextEventDate;
    }
    return { id, detailData, selectedDate };
  },
  data() {
    return {
      id: null,
      detailData: null,
      selectedDate: ''
    };
  }
};
</script>
