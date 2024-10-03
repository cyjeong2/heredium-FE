<template>
  <div class="container">
    <section class="title">
      <h1 v-if="type === 'RESERVATION_COFFEE'">
        <img src="~assets/img/coffee_calligraphy.svg" alt="" class="coffee-typo" />
      </h1>
      <h1 v-else>{{ TYPE_DATA[type].title }}</h1>
      <!--<h2 v-if="TYPE_DATA[type]?.subTitle" v-html="TYPE_DATA[type].subTitle" />-->
    </section>
    <section class="contents">
      <div v-if="type === 'RESERVATION'" class="filter">
        <button type="button" :class="{ active: selectedType === 'exhibitions' }" @click="changeType('exhibitions')">
          전시
        </button>
        <button type="button" :class="{ active: selectedType === 'programs' }" @click="changeType('programs')">
          프로그램
        </button>
        <button type="button" :class="{ active: selectedType === 'membership' }" @click="changeType('membership')">
          멤버십
        </button>
      </div>
      <div v-if="selectedType === 'membership'" class="list-wrap">
        <!-- <div v-if="!contents || !contents[0]" class="no-data">리스트가 없습니다.</div> -->
        <a class="list-item" @click="checkAndGoDetail(item.id)">
          <img src="~assets/img/intro/heredium_membership.png" alt="" />
          <article>
            <h3>HEREDIUM MEMBERSHIP</h3>
            <p>
              헤레디움을 사랑하는 예술 애호가 여러분을 위한 멤버십 제도를 소개합니다. 엄선된 혜택과 프로그램을 통해
              과거의 역사적 흔적과 현대 예술의 조화를 느껴보시길 바랍니다.
            </p>
          </article>
        </a>
      </div>
      <div v-else class="list-wrap">
        <div v-if="!contents || !contents[0]" class="no-data">리스트가 없습니다.</div>
        <a v-for="item in contents" :key="item.id" class="list-item" @click="checkAndGoDetail(item.id)">
          <h3>{{ item.title }}</h3>
          <h4>{{ item.subtitle }}</h4>
          <div class="info">
            <UTag
              v-if="type !== 'EXHIBITION_END' && type !== 'PROGRAM_END' && type !== 'RESERVATION'"
              :type="item.state"
            />
            <p class="date">
              {{ getFormattedDate(item.startDate, item.endDate) }}
            </p>
          </div>
          <div v-if="item.thumbnail?.savedFileName" class="img-wrap">
            <img :src="getImage(item.thumbnail?.savedFileName)" alt="" />
          </div>
        </a>
        <div v-show="!lastestData?.last && !$fetchState.pending" ref="infinityScrollObserver" class="observer" />
        <div v-if="!lastestData?.last && contents.length > 0" class="loader">
          <ULoader />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import UTag from '~/components/user/common/UTag';
import ULoader from '~/components/user/common/ULoader';
import { getDateCommonDateOutput } from '~/assets/js/commons';

export default {
  name: 'IntegratedView',
  components: { ULoader, UTag },
  props: {
    // RESERVATION | RESERVATION_COFFEE | EXHIBITION | EXHIBITION_END | PROGRAM | PROGRAM_END
    type: {
      type: String,
      required: false,
      default: ''
    }
  },
  fetchOnServer: false,
  data() {
    return {
      TYPE_DATA: {
        RESERVATION: {
          title: 'Ticket',
          subTitle: '헤레디움에서의 특별한 시간을<br>지금 예매하세요.'
        },
        RESERVATION_COFFEE: {
          title: 'Coffee',
          subTitle: '특별한 커피는<br>특별한 시간을 선물합니다.'
        },
        EXHIBITION: {
          title: '진행 중인 전시',
          subTitle: '헤레디움이 선사하는<br>새로운 미술씬을 경험해보세요.'
        },
        EXHIBITION_END: {
          title: '종료된 전시',
          subTitle: ''
        },
        PROGRAM: {
          title: '진행 중인 프로그램',
          subTitle: '다채로운 프로그램으로<br>예술 감상이 즐거워집니다.'
        },
        PROGRAM_END: {
          title: '종료된 프로그램',
          subTitle: ''
        }
      },
      selectedType: 'exhibitions', // exhibitions | programs | coffees
      page: 0,
      contents: [],
      lastestData: {}
    };
  },
  async fetch() {
    const isHasSessionStorageData = !(
      sessionStorage.getItem(`integratedView/${this.type}`) === 'null' ||
      sessionStorage.getItem(`integratedView/${this.type}`) === null
    );

    if (!isHasSessionStorageData) {
      const ingStates = ['RESERVATION_COFFEE', 'EXHIBITION', 'PROGRAM'];
      const states =
        this.type === 'RESERVATION'
          ? ['BOOKING', 'PROGRESS']
          : ingStates.includes(this.type)
          ? ['BOOKING', 'PROGRESS', 'SCHEDULE']
          : ['TERMINATION'];
      const newListData = await this.$axios.$get(`/user/${this.selectedType}`, {
        params: {
          size: 5,
          page: this.page,
          states
        }
      });

      this.contents = [...this.contents, ...newListData.content];
      this.lastestData = newListData;
      this.page = this.page + 1;
    }
  },
  created() {
    if (this.type === 'EXHIBITION' || this.type === 'EXHIBITION_END') {
      this.selectedType = 'exhibitions';
    } else if (this.type === 'PROGRAM' || this.type === 'PROGRAM_END') {
      this.selectedType = 'programs';
    } else if (this.type === 'RESERVATION_COFFEE') {
      this.selectedType = 'coffees';
    } else if (this.type === 'RESERVATION' && this.$route.query.selectedType) {
      this.selectedType = this.$route.query.selectedType;
    }
  },
  mounted() {
    this.getSessionData();
    this.setInfiniteScroll();
  },
  methods: {
    getFormattedDate(startDate, endDate) {
      return getDateCommonDateOutput(startDate, endDate);
    },
    getImage(imageUrl) {
      return imageUrl ? this.$store.state.BASE_URL + imageUrl : require('~/assets/img/thumbnail_default.jpg');
    },
    changeType(type) {
      if (!this.$fetchState.pending) {
        this.contents = [];
        this.lastestData = { last: false };
        this.page = 0;
        this.selectedType = type;
        this.setQueryByTabData(type);
        this.$fetch();
      }
    },
    checkAndGoDetail(id) {
      this.setSessionData();

      if (this.type === 'RESERVATION') {
        const linkType =
          this.selectedType === 'exhibitions' ? 'exhibition' : this.selectedType === 'programs' ? 'program' : 'coffee';

        this.$router.push(`/ticketing/${linkType}/${id}`);
      } else if (this.type === 'RESERVATION_COFFEE') {
        this.$router.push(`/coffee/${id}`);
      } else if (this.type === 'EXHIBITION' || this.type === 'EXHIBITION_END') {
        const endQuery = this.type === 'EXHIBITION_END' ? { end: 'true' } : null;

        this.$router.push({
          path: `/exhibition/${id}`,
          query: endQuery
        });
      } else if (this.type === 'PROGRAM' || this.type === 'PROGRAM_END') {
        const endQuery = this.type === 'PROGRAM_END' ? { end: 'true' } : null;

        this.$router.push({
          path: `/program/${id}`,
          query: endQuery
        });
      }
    },
    setQueryByTabData(tabType) {
      this.$router
        .replace({
          path: this.$route.path,
          query: { selectedType: tabType }
        })
        .catch(() => {});
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
        selectedType: this.selectedType,
        contents: this.contents,
        lastestData: this.lastestData,
        page: this.page,
        scrollTop: window.scrollY
      });

      if (sessionStorage) {
        sessionStorage.setItem(`integratedView/${this.type}`, saveData);
      }
    },
    getSessionData() {
      const isHasSessionStorageData = !(
        sessionStorage.getItem(`integratedView/${this.type}`) === 'null' ||
        sessionStorage.getItem(`integratedView/${this.type}`) === null
      );

      if (isHasSessionStorageData) {
        const savedData = JSON.parse(sessionStorage.getItem(`integratedView/${this.type}`));

        this.selectedType = savedData?.selectedType ?? 'exhibitions';
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
        sessionStorage.removeItem(`integratedView/${this.type}`);
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
    line-height: 100%;
    margin-bottom: 1.6rem;
  }

  h2 {
    font-weight: 300;
    font-size: 1.6rem;
  }

  .coffee-typo {
    height: 3rem;
  }
}

.contents {
  margin-bottom: 12rem;

  .filter {
    display: flex;
    margin-bottom: 4rem;

    > button {
      font-size: 1.8rem;

      &.active {
        color: var(--color-u-primary);
        font-weight: 700;
      }
    }

    > button {
      margin-right: 2.4rem;
    }
    > button:last-child {
      margin-right: 0;
    }
  }

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

    h3 {
      display: -webkit-box;
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 0.4rem;
      line-height: 160%;
      word-break: keep-all;
      white-space: normal;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    h4 {
      display: -webkit-box;
      font-size: 1.6rem;
      margin-bottom: 2.4rem;
      line-height: 140%;
      white-space: normal;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .info {
      display: flex;
      align-items: center;
      margin-bottom: 2.4rem;

      .status-tag {
        margin-right: 1.2rem;
      }

      .date {
        font-size: 1.4rem;
        font-weight: 500;
      }
    }

    .img-wrap {
      display: flex;
      align-items: center;
      justify-content: center;

      > img {
        width: 100%;
        object-fit: contain;
        border-radius: 8px !important;
      }
    }
    article {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 20px;
      text-align: center;

      h3 {
        font-size: 2rem;
        line-height: 2.8rem;
      }
      p {
        font-size: 1.6rem;
        line-height: 2.4rem;
      }
    }
  }
}

@media screen and (min-width: 769px) {
  .title {
    display: flex;
    justify-content: space-between;
    margin: 4.8rem 0 8.8rem;

    h1 {
      font-weight: 700;
      font-size: 4.2rem;
      line-height: 150%;
    }

    h2 {
      font-style: normal;
      font-weight: 500;
      font-size: 3.6rem;
      line-height: 150%;
      text-align: right;
      letter-spacing: -1px;
    }

    .coffee-typo {
      height: 5rem;
    }
  }

  .contents {
    .filter {
      margin-bottom: 5.2rem;

      > button {
        font-size: 2.4rem;
        font-weight: 500;
        line-height: 150%;
      }

      > button:first-child {
        margin-right: 3.2rem;
      }
    }

    .list-wrap {
      .no-data {
        height: auto;
        padding: 12rem 0;
        border-top: 1px solid var(--color-black);
        font-weight: 500;
        font-size: 2rem;
        line-height: 150%;
      }
    }

    .list-item {
      padding-top: 4rem;
      margin-bottom: 8rem;

      h3 {
        font-style: normal;
        font-weight: 600;
        font-size: 3.6rem;
        line-height: 150%;
        margin-bottom: 1rem;
      }

      h4 {
        font-weight: 500;
        font-size: 2.4rem;
        line-height: 150%;
      }

      .info {
        margin-bottom: 4.4rem;

        .status-tag {
          margin-right: 2rem;
        }

        .date {
          font-weight: 500;
          font-size: 1.6rem;
          line-height: 160%;
        }
      }

      .img-wrap {
        > img {
          width: auto;
          max-height: 88.9rem;
        }
      }
    }
  }
}
</style>
