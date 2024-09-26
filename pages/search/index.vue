<template>
  <main>
    <section class="search-sec">
      <div class="container">
        <USearch
          v-model="queryOptions.text"
          class="search-bar"
          w-size="full"
          @search="onSearchText"
          @reset="resetText"
        />
      </div>
    </section>
    <section class="result-sec">
      <div class="container">
        <div class="tabs-area">
          <div class="tabs">
            <button
              v-for="item in searchTabCounts"
              :key="item.id"
              class="tab"
              :class="{ 'is-active': item.type === queryOptions.type }"
              @click="activeTab(item.type)"
            >
              {{ getType(item.type) }} {{ item.count }}
            </button>
          </div>
        </div>
        <UPageable
          :list-data="searchList"
          :is-hide-pagination="searchList?.totalElements < 9"
          @getListData="updatedPage"
        >
          <template #data="{ data }">
            <div>
              <div v-if="!data || !data[0]" class="result-none">리스트가 없습니다.</div>
              <div v-else-if="queryOptions.type === 'NOTICE'">
                <NuxtLink
                  v-for="item in data"
                  :key="item.id"
                  :to="`/community/notice/${item.id}`"
                  class="notice-item"
                  :class="{ 'is-notice': item.isNotice }"
                >
                  <div class="info">
                    <h3><i v-if="item.isNotice" class="pc uic-fixed" />{{ item.title }}</h3>
                    <p :class="{ 'is-notice': item.isNotice }">{{ $dayjs(item.createdDate).format('YYYY-MM-DD') }}</p>
                  </div>
                </NuxtLink>
              </div>
              <div
                v-else-if="queryOptions.type === 'EVENT'"
                class="grid col-lg-2 col-md-2 gap-md-row-52 gap-md-col-28 col-xs-1"
              >
                <NuxtLink
                  v-for="item in data"
                  :key="item.id"
                  :to="`${getBaseUrl(queryOptions.type)}/${item.id}`"
                  class="list-item event"
                >
                  <div class="img-wrap">
                    <img :src="getImage(item.thumbnail?.savedFileName)" alt="" />
                    <UTag v-if="item.state !== null" class="tag" :type="item.state" />
                  </div>
                  <div>
                    <h2>{{ item.title }}</h2>
                    <p class="date">
                      {{ $dayjs(item.startDate).format('YYYY-MM-DD') }} ~
                      {{ $dayjs(item.endDate).format('YYYY-MM-DD') }}
                    </p>
                  </div>
                </NuxtLink>
              </div>
              <div v-else class="grid col-lg-4 col-md-2 gap-md-row-52 gap-md-col-28 col-xs-1">
                <NuxtLink
                  v-for="item in data"
                  :key="item.id"
                  :to="`${getBaseUrl(queryOptions.type)}/${item.id}`"
                  class="list-item"
                >
                  <div class="img-wrap">
                    <img :src="getImage(item.thumbnail?.savedFileName)" alt="" />
                    <UTag v-if="item.state !== null" class="tag" :type="item.state" />
                  </div>
                  <div>
                    <h2>{{ item.title }}</h2>
                    <h3>{{ item.subTitle }}</h3>
                    <p class="date">
                      {{ $dayjs(item.startDate).format('YYYY-MM-DD') }} ~
                      {{ $dayjs(item.endDate).format('YYYY-MM-DD') }}
                    </p>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </template>
        </UPageable>
      </div>
    </section>
  </main>
</template>

<script>
import USearch from '~/components/user/common/USearchBar';
import UPageable from '~/components/user/common/UPageable';
import UTag from '~/components/user/common/UTag';
import { LOG_TYPE } from '~/assets/js/types';

export default {
  name: 'SearchIndexPage',
  components: { USearch, UPageable, UTag },
  async asyncData({ $axios, query }) {
    const searchTabCounts = await $axios.$get('/user/common/search/index', {
      params: {
        text: query.text || ''
      }
    });
    return { searchTabCounts };
  },
  data() {
    return {
      searchTabCounts: null,
      searchList: null,
      queryOptions: {
        text: this.$route.query.text || '',
        size: Number(this.$route.query.size) || 8,
        page: this.$route.query.page || 0,
        type: this.$route.query.type || 'EXHIBITION'
      },
      isSearch: false
    };
  },
  async fetch() {
    this.querySync();

    if (this.isSearch) {
      this.searchTabCounts = await this.$axios.$get('/user/common/search/index', {
        params: {
          text: this.queryOptions.text
        }
      });

      const searchActive = this.searchTabCounts.find((item) => item.count > 0);
      if (searchActive) {
        this.queryOptions.type = searchActive.type;
        this.querySync();
      }
      this.isSearch = false;
    }

    const typeSiZE = this.queryOptions.type === 'NOTICE' ? 10 : 8;
    this.searchList = await this.$axios.$get('/user/common/search/content', {
      params: { ...this.queryOptions, size: typeSiZE }
    });
  },
  /* // 왜 넣었는지 기억안남
  watch: {
    '$route.query': '$fetch'
  }, */
  methods: {
    querySync() {
      this.$router
        .replace({
          path: this.$route.path,
          query: this.queryOptions
        })
        .catch(() => {});
    },
    resetText() {
      if (!this.$fetchState.pending) {
        this.queryOptions.type = 'EXHIBITION';
        this.queryOptions.page = 0;
        this.queryOptions.text = '';
        this.$fetch();
      }
    },
    onSearchText() {
      if (!this.$fetchState.pending) {
        this.isSearch = true;
        this.queryOptions.type = 'EXHIBITION';
        this.queryOptions.page = 0;
        this.$fetch();
      }
    },
    getBaseUrl(type) {
      if (type === 'NOTICE') {
        type = 'community/notice';
      }

      return type.toLowerCase();
    },
    getImage(imageUrl) {
      return imageUrl ? this.$store.state.BASE_URL + imageUrl : require('~/assets/img/thumbnail_default.jpg');
    },
    getType(item) {
      return LOG_TYPE[item];
    },
    updatedPage(page) {
      if (!this.$fetchState.pending) {
        this.queryOptions.page = page;
        this.$fetch();
      }
    },
    activeTab(type) {
      if (!this.$fetchState.pending) {
        this.queryOptions.type = type;
        this.queryOptions.page = 0;
        this.$fetch();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.tabs-area {
  width: 100%;
  margin-bottom: 4rem;
  .tabs {
    display: flex;
    overflow-x: scroll;
    overflow-y: hidden;
    margin: 0 -2rem;
    padding: 0.9rem 2rem;
    .tab + .tab {
      margin-left: 2.4rem;
    }
    .tab {
      font-size: 1.8rem;
      font-weight: 500;
      line-height: 1.8rem;
      &.is-active {
        font-weight: 700;
        color: var(--color-u-primary);
      }
    }
  }
}

.search-sec {
  padding: 3.6rem 0 5.6rem;

  .search-bar {
    height: 4.4rem;
  }
}

.result-sec {
  padding: 2rem 0;
  background: rgba(235, 235, 235, 0.4);
}

.list-item {
  display: block;
  border-top: 1px solid var(--color-black);
  padding-top: 1.6rem;
  margin-bottom: 4rem;

  .img-wrap {
    position: relative;
    margin-bottom: 1.6rem;
    border-radius: 0.8rem;

    > img {
      width: 100%;
      object-fit: cover;
    }

    .tag {
      position: absolute;
      top: 1.2rem;
      left: 1.2rem;
    }
  }

  h2 {
    display: -webkit-box;
    min-height: 6rem;
    font-size: 1.8rem;
    font-weight: 500;
    margin-bottom: 0.4rem;
    line-height: 160%;
    word-break: keep-all;
    white-space: normal;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  h3 {
    display: -webkit-box;
    min-height: 2.88rem;
    margin-bottom: 2.4rem;
    font-size: 1.6rem;
    font-weight: 400;
    line-height: 160%;
    word-break: keep-all;
    white-space: normal;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .date {
    font-size: 1.4rem;
    font-weight: 400;
    line-height: 100%;
  }
}

.notice-item {
  display: flex;
  padding: 1.6rem 0.8rem 2.1rem 1.6rem;
  border-bottom: 1px solid var(--color-black);
  transition: 0.1s all ease-in-out;

  &.is-notice {
    background-color: var(--color-white);
  }

  .info {
    flex: 1 0 0;
    width: 100%;

    h3 {
      font-size: 1.6rem;
      line-height: 140%;
      margin-bottom: 0.7rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      i {
        display: inline-block;
        vertical-align: middle;
        font-size: 2.4rem;
        margin-right: 0.8rem;
      }
    }

    p {
      color: var(--color-u-grey-3);
      font-weight: 500;
      font-size: 1.2rem;
      line-height: 100%;

      &.is-notice {
        padding-left: 3.2rem;
      }
    }
  }

  &:first-child {
    border-top: 1px solid var(--color-black);
  }

  &:hover {
    color: var(--color-u-primary);
  }
}

.result-none {
  margin: 12rem 0;
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.6rem;
  color: var(--color-grey-3);
}

@media screen and (min-width: 769px) {
  .tabs-area {
    width: 100%;
    margin-bottom: 8rem;
    .tabs {
      margin: 0;
      padding: 0;
      .tab + .tab {
        margin-left: 3.2rem;
      }
      .tab {
        font-size: 2.4rem;
        line-height: 150%;
      }
    }
  }

  .search-sec {
    padding: 6rem 0 9.2rem;

    .search-bar {
      max-width: 66.8rem;
      height: 5.9rem;
      margin: 0 auto;
    }
  }

  .result-sec {
    margin: 0;
    padding: 3.6rem 0 12rem;
    background: rgba(235, 235, 235, 0.4);
  }

  .list-item {
    padding-top: 2rem;
    margin-bottom: 0;

    .img-wrap {
      overflow: hidden;
      margin-bottom: 2rem;

      > img {
        transition: 0.5s;
        aspect-ratio: 320/218;

        &:hover {
          scale: 1.2;
        }
      }

      .tag {
        top: 0.8rem;
        left: 0.8rem;
      }
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 0.4rem;
      line-height: 150%;
    }

    h3 {
      margin-bottom: 2rem;
      font-size: 1.8rem;
      line-height: 160%;
    }

    .date {
      line-height: 160%;
    }

    &.event {
      img {
        aspect-ratio: 668/220;
      }
    }
  }

  .notice-item {
    display: flex;
    padding: 2.6rem 2.8rem 2.6rem 2.4rem;

    &.is-notice {
      background-color: var(--color-white);
    }

    .info {
      display: flex;
      justify-content: space-between;
      h3 {
        font-size: 2rem;
        line-height: 150%;
        margin-bottom: 0;

        i {
          font-size: 2.8rem;
        }
      }

      p {
        font-weight: 400;
        font-size: 1.8rem;
        line-height: 160%;
        color: var(--color-black);

        &.is-notice {
          padding-left: 0;
        }
      }
    }

    &:first-child {
      border-top: 1px solid var(--color-black);
    }

    &:hover {
      color: var(--color-u-primary);
    }
  }

  .result-none {
    margin: 12rem 0;
    font-size: 1.6rem;
    font-weight: 500;
    text-align: center;
    line-height: 1.6rem;
    color: var(--color-grey-3);
  }
}
</style>
