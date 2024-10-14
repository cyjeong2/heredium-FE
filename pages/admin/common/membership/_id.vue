<template>
  <PostForm v-if="initFormData" :post-detail="initFormData" :mode="mode"> </PostForm>
</template>

<script>
import PostForm from '~/components/admin/page/membership/PostForm.vue';

export default {
  name: 'ViewPost',
  components: {
    PostForm
  },
  layout: 'admin/default',

  data() {
    return {
      mode: 'edit',
      initFormData: null
    };
  },
  computed: {},
  mounted() {
    const id = this.$route?.params?.id;
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
          memberships: data.memberships,
          detail_image: {
            image_url: data.image_url,
            original_file_name: 'gfhvjb.png'
          },
          is_enabled: data.is_enabled,
          navigation_link: data.navigation_link,
          content_detail: data.content_detail,
          thumbnail_urls: data.thumbnail_urls
        };
      } catch (error) {}
    }
  }
};
</script>
