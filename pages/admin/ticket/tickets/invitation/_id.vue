<template>
  <TicketsDetail page-type="invitation" :page-id="id" :fetch-detail-data="detailData" />
</template>

<script>
import TicketsDetail from '~/components/admin/page/TicketsDetail';

export default {
  name: 'DetailPage',
  components: { TicketsDetail },
  layout: 'admin/default',
  async asyncData({ params, $axios, redirect, $dayjs }) {
    const { id } = params;
    const detailData = await $axios.$get(`/admin/tickets/${id}`).catch(() => {
      redirect('/admin/site/popup');
    });

    return { id, detailData };
  },
  data() {
    return {
      id: null,
      detailData: null
    };
  }
};
</script>
