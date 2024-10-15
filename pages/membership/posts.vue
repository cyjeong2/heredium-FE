<template>
  <KeepAlive>
    <div class="container">
      <section class="title">
        <h1>헤레디움 멤버십</h1>
      </section>
      <div v-for="(item, index) in dataPosts" :key="index">
        <post-card :detail-post="item" />
      </div>
    </div>
  </KeepAlive>
</template>

<script>
import PostCard from '~/components/user/page/membership/PostCard.vue';

export default {
  name: 'PostList',
  components: { PostCard },
  async asyncData({ $axios }) {
    const dataPosts = await $axios.$get('/user/posts/enabled-list');
    const reversePosts = Array.isArray(dataPosts) ? dataPosts.reverse() : dataPosts;
    return { dataPosts: reversePosts };
  },
  data() {
    return {
      dataPosts: null
    };
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 4rem 1.6rem 1.6rem;
  .title {
    h1 {
      font-size: 2.8rem;
      font-weight: 700;
      margin-bottom: 1.6rem;
    }
  }
}
@media screen and (min-width: 769px) {
  .container {
    .title {
      margin-bottom: 8.8rem;
      h1 {
        font-size: 4.2rem;
        line-height: initial;
      }
    }
  }
}
</style>
