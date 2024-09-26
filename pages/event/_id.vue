<template>
  <PostDetail v-if="detailData" type="EVENT" :detail-data="detailData" />
</template>

<script>
import PostDetail from '~/components/user/page/PostDetail';

export default {
  name: 'EventDetail',
  components: { PostDetail },
  async asyncData({ $axios, params, redirect, req }) {
    const { id } = params;
    if (id == null) {
      redirect('/event');
    }

    const detailData = req?.body?.previewData
      ? JSON.parse(req.body.previewData)
      : await $axios.$get(`/user/events/${id}`).catch(() => {
          redirect('/event');
        });

    return { detailData };
  },
  data() {
    return {
      detailData: null
    };
  }
};
</script>
