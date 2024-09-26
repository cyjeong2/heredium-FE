<template>
  <div>
    <section class="container title">
      <h1>공지사항</h1>
      <!--<h2>헤레디움의 소식을<br />알려드립니다.</h2>-->
    </section>
    <section class="list-wrap">
      <div class="container list">
        <p class="list-count">전체 {{ tableData?.totalElements || 0 }}</p>
        <UPageable
          :list-data="tableData"
          :is-hide-pagination="tableData?.content.length === 0"
          @getListData="updatedPage"
        >
          <template #data="{ data }">
            <div v-if="!data || !data[0]" class="no-data">리스트가 없습니다.</div>
            <div v-else>
              <a
                v-for="(item, index) in data"
                :key="item.id"
                class="list-item"
                :class="{ 'is-pin': item.isNotice }"
                @click="goDetail(`/community/notice/${item.id}`)"
              >
                <div class="no">{{ tableData.startCount - index }}</div>
                <div class="info">
                  <h3><i v-if="item.isNotice" class="pc uic-fixed" />{{ item.title }}</h3>
                  <p>{{ $dayjs(item.postDate).format('YYYY-MM-DD') }}</p>
                </div>
              </a>
            </div>
          </template>
        </UPageable>
      </div>
    </section>
  </div>
</template>

<script>
import UPageable from '~/components/user/common/UPageable';

export default {
  name: 'NoticePage',
  components: { UPageable },
  data() {
    return {
      queryOptions: {
        size: 10,
        page: this.$route.query.page || '0'
      },
      tableData: null
    };
  },
  async fetch() {
    await this.$router
      .replace({
        path: this.$route.path,
        query: this.queryOptions
      })
      .catch(() => {});

    this.tableData = await this.$axios.$get('/user/notices', { params: this.queryOptions });
    this.tableData.startCount = this.tableData.totalElements - this.tableData.number * this.tableData.size;

    if (process.client) {
      this.$nextTick(() => {
        this.setScrollY();
      });
    }
  },
  computed: {
    baseUrl() {
      return this.$store.state.BASE_URL;
    }
  },
  methods: {
    getImage(imageUrl) {
      return imageUrl ? this.$store.state.BASE_URL + imageUrl : require('~/assets/img/thumbnail_default.jpg');
    },
    updatedPage(page) {
      if (!this.$fetchState.pending) {
        console.log(page);
        this.setSessionData(true);
        this.queryOptions.page = page;
        this.$fetch();
      }
    },
    goDetail(url) {
      this.setSessionData();
      this.$router.push(url);
    },
    setSessionData(isReset) {
      const saveData = JSON.stringify({
        scrollY: isReset ? 0 : window.scrollY
      });

      sessionStorage.setItem(this.$route.path, saveData);
    },
    setScrollY() {
      const sessionData = sessionStorage.getItem(this.$route.path);

      if (sessionData && window) {
        const savedData = JSON.parse(sessionData);

        this.$nextTick(() => {
          window.scrollTo(0, savedData.scrollY);
        });
        sessionStorage.removeItem(this.$route.path);
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

.list-wrap {
  background-color: rgba(235, 235, 235, 0.4);
}

.list {
  padding-top: 2.8rem;
  padding-bottom: 12rem;

  .list-count {
    color: var(--color-u-grey-4);
    font-weight: 500;
    font-size: 1.4rem;
    line-height: 100%;
    margin-bottom: 1.6rem;
  }

  .no-data {
    color: var(--color-grey-3);
    font-size: 1.6rem;
    text-align: center;
    line-height: 160%;
    letter-spacing: -0.5px;
    margin: 9.9rem 0 11.5rem;
  }

  .list-item {
    display: flex;
    padding: 1.8rem 0.8rem 2.1rem 1.6rem;
    border-bottom: 1px solid var(--color-black);
    transition: 0.1s all ease-in-out;
    cursor: pointer;

    .no {
      display: flex;
      align-items: center;
      margin-right: 3.2rem;
    }

    .info {
      flex: 1 0 0;

      h3 {
        display: -webkit-box;
        align-items: center;
        font-size: 1.6rem;
        font-weight: 500;
        line-height: 140%;
        margin-bottom: 0.7rem;
        overflow: hidden;
        white-space: normal;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        max-width: 100%;

        i {
          font-size: 2.4rem;
          margin-right: 0.8rem;
        }
      }

      p {
        color: var(--color-u-grey-3);
        font-weight: 500;
        font-size: 1.2rem;
        line-height: 100%;
      }
    }

    &.is-pin {
      background-color: var(--color-white);
    }

    &:first-child {
      border-top: 1px solid var(--color-black);
    }
  }
}

@media screen and (min-width: 769px) {
  .title {
    display: flex;
    margin: 4.8rem auto 8.8rem;
    justify-content: space-between;

    h1 {
      font-size: 4.2rem;
      font-weight: 700;
      line-height: 150%;
      margin-bottom: 0;
    }

    h2 {
      font-weight: 500;
      font-size: 3.6rem;
      line-height: 150%;
      text-align: right;
    }
  }

  .list {
    padding-top: 4.4rem;
    padding-bottom: 12.8rem;

    .list-count {
      font-size: 1.8rem;
      line-height: 160%;
    }

    .no-data {
      color: var(--color-grey-3);
      font-size: 2rem;
      font-weight: 500;
      line-height: 150%;
      margin: 10.4rem 0 12rem;
    }

    .list-item {
      padding: 2.55rem 2.8rem;

      .no {
        font-size: 1.8rem;
        font-weight: 400;
        line-height: 160%;
        margin-right: 3.6rem;
      }

      .info {
        flex: 1 0 0;
        display: flex;
        align-items: center;
        justify-content: space-between;

        h3 {
          flex: 1 0 0;
          display: flex;
          align-items: center;
          font-size: 2rem;
          line-height: 150%;
          margin-bottom: 0;
          margin-right: 4rem;

          i {
            font-size: 2.8rem;
          }
        }

        p {
          color: var(--color-black);
          font-weight: 400;
          font-size: 1.8rem;
          line-height: 160%;
        }
      }

      &.is-pin {
        background-color: var(--color-white);
      }

      &:first-child {
        border-top: 1px solid var(--color-black);
      }
    }
  }
}
</style>
