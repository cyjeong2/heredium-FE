<template>
  <KeepAlive>
    <div class="container">
      <section class="title">
        <h1>헤레디움 멤버십</h1>
      </section>
      <div class="center">
        <div v-for="(item, index) in dataMock" :key="index">
          <post-card :detail-post="item" />
        </div>
      </div>
    </div>
  </KeepAlive>
</template>

<script>
import { dataPostMock } from '~/assets/js/common_data';
import PostCard from '~/components/user/page/membership/PostCard.vue';

export default {
  name: 'PostList',
  components: { PostCard },
  data() {
    return {
      dataMock: dataPostMock
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
      }
    }
  }
}
</style>
