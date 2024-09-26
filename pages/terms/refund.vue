<template>
  <main class="container">
    <TermsProgress
      :page-type="pageType"
      :terms-data="termsData"
      :previous-terms-data="previousTermsData"
      @changeData="termsLoad"
    />
  </main>
</template>

<script>
import TermsProgress from '~/components/user/page/TermsProgress.vue';

const PAGE_TYPE = 'REFUND';
export default {
  name: 'PrivacyPage',
  components: { TermsProgress },
  async asyncData({ $axios, req }) {
    const previousTermsData = await $axios.$get('/user/policies', {
      params: {
        type: PAGE_TYPE
      }
    });
    const termsData = req?.body?.previewData
      ? JSON.parse(req.body.previewData)
      : (await $axios.$get('/user/policies/posting', {
          params: {
            type: PAGE_TYPE
          }
        })) || {};

    return { termsData, previousTermsData };
  },
  data() {
    return {
      pageType: PAGE_TYPE,
      termsData: null,
      previousTermsData: null
    };
  },
  methods: {
    async termsLoad(id) {
      this.termsData = await this.$axios.$get(`/user/policies/${id}`);
    }
  }
};
</script>
