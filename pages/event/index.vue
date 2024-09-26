<template>
  <KeepAlive>
    <div class="container">
      <section class="title">
        <h1>Event</h1>
        <!--<h2>색다른 이벤트를<br />마련했습니다.</h2>-->
      </section>
      <section class="contents">
        <div class="list-wrap" :class="{ 'is-not-only-end-item': !isOnlyEndItem || contents.length === 0 }">
          <div v-if="!contents || !contents[0]" class="no-data">리스트가 없습니다.</div>
          <a v-for="item in contents" :key="item.id" class="list-item" @click="goDetail(item.id)">
            <div class="img-wrap">
              <img :src="getImage(item.thumbnail?.savedFileName)" alt="" />
              <UTag class="tag" :type="item.state" />
            </div>
            <h3>{{ item.title }}</h3>
            <p class="date">
              {{ $dayjs(item.startDate).format('YYYY-MM-DD') }} ~ {{ $dayjs(item.endDate).format('YYYY-MM-DD') }}
            </p>
          </a>
          <div v-show="!lastestData?.last && !$fetchState.pending" ref="infinityScrollObserver" class="observer" />
          <div v-if="!lastestData?.last" class="loader">
            <ULoader />
          </div>
        </div>
      </section>
    </div>
  </KeepAlive>
</template>

<script>
import UTag from '~/components/user/common/UTag';
import ULoader from '~/components/user/common/ULoader';

export default {
  name: 'EventPage',
  components: { ULoader, UTag },
  fetchOnServer: false,
  data() {
    return {
      page: 0,
      contents: [],
      lastestData: {},
      modal: {
        isLogin: false
      }
    };
  },
  async fetch() {
    const isHasSessionStorageData = !(
      sessionStorage.getItem('integratedView/event') === 'null' ||
      sessionStorage.getItem('integratedView/event') === null
    );

    if (!isHasSessionStorageData) {
      const newListData = await this.$axios.$get(`/user/events`, {
        params: {
          size: 5,
          page: this.page
        }
      });

      this.contents = [...this.contents, ...newListData.content];
      this.lastestData = newListData;
      this.page = this.page + 1;

      this.$nextTick(() => {
        if (this.page === 1 && window) {
          window.scroll(0, 0);
        }
      });
    }
  },
  computed: {
    isOnlyEndItem() {
      return !this.contents.find((item) => item.state === 'SCHEDULE' || item.state === 'PROGRESS');
    }
  },
  mounted() {
    this.getSessionData();
    this.setInfiniteScroll();
  },
  methods: {
    goDetail(id) {
      this.setSessionData();
      this.$router.push(`/event/${id}`);
    },
    getImage(imageUrl) {
      return imageUrl ? this.$store.state.BASE_URL + imageUrl : require('~/assets/img/thumbnail_default.jpg');
    },
    setInfiniteScroll() {
      if (this.$refs && this.$refs && this.$refs.infinityScrollObserver) {
        const $observerTarget = this.$refs.infinityScrollObserver;
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.$fetch();
            }
          });
        });

        observer.observe($observerTarget);
      }
    },
    setSessionData() {
      const saveData = JSON.stringify({
        contents: this.contents,
        lastestData: this.lastestData,
        page: this.page,
        scrollTop: window.scrollY
      });

      if (sessionStorage) {
        sessionStorage.setItem('integratedView/event', saveData);
      }
    },
    getSessionData() {
      const isHasSessionStorageData = !(
        sessionStorage.getItem('integratedView/event') === 'null' ||
        sessionStorage.getItem('integratedView/event') === null
      );

      if (isHasSessionStorageData) {
        const savedData = JSON.parse(sessionStorage.getItem('integratedView/event'));

        this.contents = savedData?.contents ?? [];
        this.lastestData = savedData?.lastestData ?? null;
        this.page = Number(savedData?.page) ?? null;
        if (window && savedData?.scrollTop) {
          this.$nextTick(() => {
            this.$nextTick(() => {
              window.scrollTo(0, savedData.scrollTop);
            });
          });
        }
        sessionStorage.removeItem('integratedView/event');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  margin: 3.2rem 0 6.4rem;

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

.contents {
  margin-bottom: 12rem;

  .list-wrap {
    position: relative;

    .observer {
      position: absolute;
      bottom: 40rem;
    }

    .loader {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .no-data {
      display: flex;
      height: 20rem;
      align-items: center;
      justify-content: center;
      color: var(--color-u-grey-3);
      font-weight: 500;
      font-size: 1.6rem;
    }
  }

  .list-item {
    display: block;
    border-top: 1px solid var(--color-black);
    padding-top: 1.6rem;
    margin-bottom: 4rem;
    cursor: pointer;

    .img-wrap {
      position: relative;
      margin-bottom: 1.6rem;

      > img {
        width: 100%;
        border-radius: 0.8rem;
        object-fit: cover;
        aspect-ratio: 320/106;
      }

      .tag {
        position: absolute;
        top: 1.2rem;
        left: 1.2rem;
      }
    }

    h3 {
      display: -webkit-box;
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 2.4rem;
      line-height: 160%;
      word-break: keep-all;
      white-space: normal;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .date {
      font-size: 1.4rem;
      font-weight: 500;
      line-height: 100%;
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

  .contents {
    margin-bottom: 22.4rem;

    .list-wrap {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 2.8rem;
      row-gap: 5.2rem;

      .observer {
        height: 1px;
        width: 1px;
        position: absolute;
        bottom: 0;
        z-index: 2;
      }

      .loader {
        grid-column: auto / span 2;
      }

      .no-data {
        display: flex;
        height: 20rem;
        align-items: center;
        justify-content: center;
        color: var(--color-u-grey-3);
        font-weight: 500;
        font-size: 1.6rem;
      }
    }

    .list-item {
      padding-top: 2rem;
      margin-bottom: 0;

      .img-wrap {
        margin-bottom: 2rem;

        > img {
          aspect-ratio: 668/220;
        }

        .tag {
          top: 0.8rem;
          left: 0.8rem;
        }
      }

      h3 {
        font-size: 2rem;
        margin-bottom: 2.8rem;
        line-height: 150%;
      }

      .date {
        font-weight: 400;
        line-height: 160%;
      }
    }

    .is-not-only-end-item .list-item:first-child {
      grid-column: auto / span 2;
      padding-top: 0;
      margin-bottom: 0;
      border-top: 0;

      .img-wrap {
        margin-bottom: 3.6rem;
        margin-right: calc(((100vw - 136.4rem) / 2) - (100vw - 136.4rem));
        min-width: 100%;
        aspect-ratio: 1642/540;

        > img {
          border-radius: 0.8rem 0 0 0.8rem;
          height: 100%;
          width: 100%;
          aspect-ratio: 1642/540;
        }
      }

      h3 {
        font-size: 3.6rem;
      }

      .date {
        font-size: 1.6rem;
        font-weight: 500;
        line-height: 160%;
      }
    }
  }
}
</style>
