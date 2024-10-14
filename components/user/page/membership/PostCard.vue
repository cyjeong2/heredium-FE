<template>
  <div class="post-card">
    <div>
      <p>{{ detailPost.name }}</p>
      <div v-html="detailPost.content_detail"></div>
    </div>
    <div>
      <NuxtLink :to="`${detailPost.navigation_link}?id=${detailPost.id}`" class="img-wrap">
        <img :src="smallImage" alt="heredium_membership" class="only-mobile" />
        <img :src="mediumImage" alt="heredium_membership" class="only-pc" />
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import { imageMixin } from '~/mixins/imageMixin';

export default {
  name: 'PostCard',
  mixins: [imageMixin],
  props: {
    detailPost: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  computed: {
    smallImage() {
      return this.getImage(this.detailPost?.thumbnail_urls?.small);
    },
    mediumImage() {
      return this.getImage(this.detailPost?.thumbnail_urls?.medium);
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  h1 {
    font-size: 2.8rem;
    font-weight: 700;
    margin-bottom: 1.6rem;
  }

  h2 {
    font-weight: 300;
    font-size: 1.6rem;
  }
}

.post-card {
  border-top: 1px solid var(--color-u-placeholder);
  margin-bottom: 2rem;
  padding-top: 2rem;

  .reservation-btn {
    font-size: 2rem;
    flex: 1 0 0;
    margin-right: 1.6rem;
    padding: 1.2rem;
    margin-top: 1.6rem;
    width: 100% !important;

    span {
      margin-left: 1.2rem;
    }
  }
  & > div:first-child {
    margin-bottom: 1rem;
    & > p:first-child {
      font-size: 1.6rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    & > div:first-child {
      font-size: 1.4rem;
    }
  }

  h4 {
    font-weight: 400;
    display: -webkit-box;
    font-size: 1.6rem;
    margin-top: 2rem;
    margin-bottom: 3.6rem;
    line-height: 140%;
    white-space: normal;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .img-wrap {
    display: flex;
    align-items: center;
    justify-content: center;

    > img {
      width: 100%;
      object-fit: contain;
    }
  }
}

@media screen and (min-width: 769px) {
  .title {
    display: flex;
    margin: 4.8rem 0 8.8rem;
    justify-content: space-between;

    h1 {
      font-size: 4.2rem;
      line-height: 150%;
      margin-bottom: 0;
    }

    h2 {
      font-weight: 500;
      line-height: 150%;
      font-size: 3.6rem;
      text-align: right;
    }
  }

  .post-card {
    margin-top: 4.4rem;
    display: flex;
    justify-content: space-between;
    column-gap: 5rem;

    .reservation-btn {
      margin-top: 0;
      width: initial !important;
    }

    > div:first-child {
      flex: 1;
      & > p:first-child {
        font-size: 1.8rem;
        font-weight: 700;
        margin-bottom: 2rem;
      }
    }
    > div:nth-child(2) {
      flex: 1;
    }

    .img-wrap {
      margin-bottom: 2rem;
    }
  }
}
</style>
