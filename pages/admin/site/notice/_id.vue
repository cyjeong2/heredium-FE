<template>
  <TermsDetail :id="id" :page-type="pageType" :detail-data="detailData" />
</template>

<script>
import TermsDetail from '~/components/admin/page/TermsDetail';

const PAGE_TYPE = 'NOTICE';

export default {
  name: 'EditPage',
  components: { TermsDetail },
  layout: 'admin/default',
  async asyncData({ params, $axios }) {
    const { id } = params;
    const detailData = await $axios.$get(`/admin/notices/${id}`);
    return { id, detailData };
  },
  data() {
    return {
      pageType: PAGE_TYPE,
      detailData: null,
      id: null
    };
  }
};
</script>
