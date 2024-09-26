<template>
  <PurchaseDetail :id="id" :detail-data="detailData" :page-type="pageType" :terms-data="termsData" />
</template>

<script>
import PurchaseDetail from '~/components/user/page/PurchaseDetail';
const PAGE_TYPE = 'ALL';
export default {
  name: 'AllDetail',
  components: { PurchaseDetail },
  async asyncData({ $axios, params, redirect }) {
    const { id } = params;
    const detailData = await $axios.$get(`/user/account/tickets/${id}`).catch(() => {
      redirect('/mypage/purchase/all');
    });
    const termsData = await $axios.$get('/user/policies/posting', {
      params: {
        type: 'REFUND'
      }
    });
    return { id, detailData, termsData };
  },
  data() {
    return {
      pageType: PAGE_TYPE,
      detailData: null,
      termsData: null,
      id: ''
    };
  }
};
</script>
