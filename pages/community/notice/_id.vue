<template>
  <PostDetail v-if="detailData" type="NOTICE" :detail-data="detailData" />
</template>

<script>
import PostDetail from '~/components/user/page/PostDetail';

export default {
  name: 'NoticeDetail',
  components: { PostDetail },
  async asyncData({ $axios, params, redirect, req }) {
    const { id } = params;
    let detailData;

    if (id == null) {
      redirect('/notice');
    }

    if (req?.body?.previewData && params.id === 'preview') {
      detailData = JSON.parse(req.body.previewData);
    } else if (params.id !== 'preview') {
      detailData = await $axios.$get(`/user/notices/${id}`).catch(() => {
        redirect('/notices');
      });
    } else {
      redirect('/notice');
    }

    return { detailData };
  },
  data() {
    return {
      detailData: null
    };
  }
};
</script>
