<template>
  <TermsEdit
    :id="id"
    :page-type="pageType"
    :detail-data="detailData"
    :table-data="tableData"
    :is-new="isNew"
    @changePage="onChangePage"
  />
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import TermsEdit from '~/components/admin/page/TermsEdit';
import { TERMS_DETAIL } from '~/assets/js/types';

const PAGE_TYPE = 'SERVICE';

export default {
  name: 'EditPage',
  components: { TermsEdit },
  layout: 'admin/default',
  async asyncData({ params, $axios, redirect, $dayjs }) {
    const { id } = params;
    const isNew = id == null;
    const detailData = !isNew
      ? await $axios
          .$get(`/admin/policies/${id}`)
          .then((detailData) => ({ ...detailData, postDate: $dayjs(detailData.postDate).format('YYYY-MM-DD') }))
      : { ...cloneDeep(TERMS_DETAIL), type: PAGE_TYPE, postDate: $dayjs().add(30, 'd').format('YYYY-MM-DD') };

    if (!detailData) {
      redirect(`/admin/terms/${PAGE_TYPE.toLowerCase()}`);
    }

    return { detailData, isNew, id };
  },
  data() {
    return {
      detailData: null,
      pageType: PAGE_TYPE,
      isNew: false,
      id: '',
      tableData: null,
      queryOptions: {
        type: PAGE_TYPE,
        size: '10',
        page: '0'
      }
    };
  },
  async fetch() {
    this.tableData = await this.$axios
      .$get('/admin/policies', {
        params: this.queryOptions
      })
      .then((tableData) => ({
        ...tableData,
        startCount: tableData.totalElements - (tableData.number * tableData.size)
      }));
  },
  methods: {
    onChangePage(page) {
      if (!this.$fetchState.pending) {
        this.queryOptions.page = page;
        this.$fetch();
      }
    }
  }
};
</script>
