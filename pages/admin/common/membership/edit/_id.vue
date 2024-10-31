<template>
  <PostForm v-if="initFormData && mode" :post-detail="initFormData" :mode="mode"> </PostForm>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { POST_DETAIL } from '~/assets/js/types';
import PostForm from '~/components/admin/page/membership/PostForm.vue';

export default {
  name: 'EditPost',
  components: {
    PostForm
  },
  layout: 'admin/default',

  data() {
    return {
      mode: null,
      initFormData: null
    };
  },
  computed: {},
  mounted() {
    const id = this.$route?.params?.id;
    if (!id) {
      this.mode = 'create';
      this.initFormData = cloneDeep(POST_DETAIL);
      return null;
    }
    this.mode = 'edit';
    this.getPostDetail(id);
  },
  methods: {
    async getPostDetail(id) {
      try {
        const { data } = await this.$axios.get(`/admin/posts/${id}`);
        this.initFormData = {
          id: data.id,
          name: data.name,
          memberships: {
            memberships: data.memberships
          },
          detail_image: {
            image_url: data.image_url,
            original_file_name: 'gfhvjb.png'
          },
          is_enabled: data.is_enabled,
          navigation_link: data.navigation_link,
          content_detail: data.content_detail,
          thumbnail_url: data.thumbnail_urls
        };
      } catch (error) {}
    }
  }
};
</script>
