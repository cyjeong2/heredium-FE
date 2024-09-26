<template>
  <TermsDetail :id="id" :page-type="pageType" :detail-data="detailData" />
</template>

<script>
import TermsDetail from '~/components/admin/page/TermsDetail';

const PAGE_TYPE = 'REFUND';

export default {
  name: 'EditPage',
  components: { TermsDetail },
  layout: 'admin/default',
  asyncData({ params }) {
    const { id } = params;

    return { id };
  },
  data() {
    return {
      pageType: PAGE_TYPE,
      detailData: null,
      id: null
    };
  },
  async fetch() {
    this.detailData = await this.$axios.$get(`/admin/policies/${this.id}`);
  }
};
</script>
