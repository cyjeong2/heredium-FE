<template>
  <IntegratedDetail type="COFFEE" :detail-data="data" />
</template>

<script>
import IntegratedDetail from '~/components/user/page/IntegratedDetail';

export default {
  name: 'CoffeeDetail',
  components: { IntegratedDetail },
  async asyncData({ params, $axios, redirect, req }) {
    let id;
    let data;

    if (!params.id) {
      redirect('/coffee');
    }

    if (req?.body?.previewData && params.id === 'preview') {
      id = 0;
      data = JSON.parse(req.body.previewData);
    } else if (params.id !== 'preview') {
      id = Number(params.id);
      data = await $axios.$get(`/user/coffees/${id}`).catch(() => {
        redirect('/coffee');
      });
    } else {
      redirect('/coffee');
    }

    return { id, data };
  },
  data() {
    return {
      data: null
    };
  }
};
</script>
