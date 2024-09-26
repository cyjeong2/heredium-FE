<template>
  <main class="container">
    <section>
      <h1>{{ docentList.title }}</h1>
      <p class="count">
        전체 <span>{{ docentList.infos.length }}</span>
      </p>
    </section>
    <section class="list">
      <div class="list-wrap">
        <div v-if="!docentList.infos || !docentList.infos[0]">리스트가 없습니다.</div>
        <NuxtLink v-for="item in docentList.infos" :key="item.id" :to="`/docent/${id}/${item.id}`" class="list-item">
          <img :src="getImage(item.thumbnail?.savedFileName)" alt="" />
          <div class="list-item-info">
            <h2>{{ item.title }}</h2>
            <div>
              <p>{{ item.writer }}</p>
              <p>{{ item.position }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'DocentListPage',
  async asyncData({ params, $axios, redirect }) {
    if (!params.id) {
      redirect('/docents');
    }
    const id = Number(params.id);
    const docentList = await $axios.$get(`/user/docents/${id}/infos`).catch(() => {
      redirect('/docent');
    });

    return { id, docentList };
  },
  data() {
    return {
      id: null,
      docentList: null
    };
  },
  methods: {
    getImage(imageUrl) {
      return imageUrl ? this.$store.state.BASE_URL + imageUrl : require('~/assets/img/thumbnail_default.jpg');
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  padding-top: 3.2rem;
  padding-bottom: 14rem;
}

h1 {
  font-weight: 700;
  font-size: 2.4rem;
  line-height: 160%;
  letter-spacing: -1px;
  margin-bottom: 2.8rem;
}

.count {
  font-weight: 500;
  font-size: 1.4rem;
  line-height: 100%;
  margin-bottom: 1.6rem;
}

.list {
  border-top: 1px solid #241215;

  .list-wrap {
    padding: 4rem 1rem 4rem 0;
    overflow-y: auto;
    margin-right: -1rem;
  }

  .list-item {
    display: flex;
    padding-bottom: 2rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid var(--color-u-grey-2);

    &:last-child {
      border-bottom: 1px solid var(--color-u-grey-2);
      margin-bottom: 0;
    }

    img {
      height: 10.4rem;
      aspect-ratio: 19 / 13;
      object-fit: cover;
      border-radius: 8px;
      margin-right: 1.6rem;
    }

    .list-item-info {
      display: flex;
      flex: 1 0 0;
      flex-direction: column;
      justify-content: space-between;

      h2 {
        font-weight: 700;
        font-size: 16px;
        line-height: 160%;
        margin-bottom: 1rem;
      }

      p {
        color: var(--color-u-grey-3);
        font-weight: 700;
        font-size: 1.4rem;
        line-height: 100%;

        &:last-child {
          margin-top: 1.2rem;
        }
      }
    }
  }
}
</style>
