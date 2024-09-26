<template>
  <div>
    <client-only>
      <section>
        <Swiper ref="mainSwiper" :options="mainSwiperOption" class="main-slider" @slideChange="onMainSlideChange">
          <SwiperSlide v-for="(item, index) in mainData.slides" :key="index" :role="item.isUseButton ? 'link' : ''">
            <a
              :href="item.isUseButton && item.link ? item.link : null"
              :target="item.isNewTab ? '_blank' : ''"
              :class="{ clickable: item.isUseButton && item.link }"
            >
              <img :src="getImage(item.pcImage)" :alt="item.mobileImageAlt" class="only-pc" />
              <img :src="getImage(item.mobileImage)" :alt="item.mobileImageAlt" class="only-mobile" />
              <div class="bg-wrap" />
              <div class="pc-container pc-flex-col">
                <h2>{{ item.title }}</h2>
                <h3 v-if="item.subtitle">{{ item.subtitle }}</h3>
                <p>{{ item.schedule }}</p>
              </div>
            </a>
          </SwiperSlide>
          <div v-if="mainData.slides.length > 1" slot="pagination" class="swiper-pagination only-mobile" />
          <div v-if="currentMainSlide !== 1" slot="button-prev" class="swiper-button-prev">
            <i class="pc uic-arrow_pre only-pc" />
            <i class="m umic-arrow_backward only-mobile" />
          </div>
          <div v-if="mainData.slides.length !== currentMainSlide" slot="button-next" class="swiper-button-next">
            <i class="pc uic-arrow_next only-pc" />
            <i class="m umic-arrow_forward only-mobile" />
          </div>
        </Swiper>
        <UPopupModal
          v-if="mainData.popups && mainData.popups[0]"
          :is-show="isShowPopup"
          :popup-list="mainData.popups"
          @close="isShowPopup = false"
        />
      </section>
    </client-only>
    <section v-if="mainData.projects && mainData.projects.length > 0">
      <div
        class="container"
        :class="{
          'has-sub': isSubTitle
        }"
      >
        <h2>
          <NuxtLink to="/exhibition">진행 중인 전시·프로그램<i class="m umic-arrow_forward" /></NuxtLink>
        </h2>
        <client-only>
          <Swiper ref="exSwiper" :options="exSwiperOption" class="ex-slider" @slideChange="onExSlideChange">
            <SwiperSlide v-for="item in mainData.projects" :key="`${item.kind}${item.id}`">
              <div class="ex-wrap">
                <NuxtLink :to="`${item.kind.toLowerCase()}/${item.id}`" class="ex-item">
                  <div class="left">
                    <img :src="getImage(item.thumbnail)" alt="" />
                  </div>
                  <div class="right" role="link" @click="goExDetail(item)">
                    <h3>{{ item.title }}</h3>
                    <h4 v-if="item.subtitle">{{ item.subtitle }}</h4>
                    <p>
                      <UTag class="tag" :type="item.state" />
                      <span>{{ getFormattedDate(item.startDate, item.endDate) }}</span>
                    </p>
                  </div>
                </NuxtLink>
              </div>
            </SwiperSlide>
            <div
              class="ex-swiper-menu-group"
              :class="{
                'has-sub': isSubTitle
              }"
            >
              <div class="page-num">{{ getPaddingNumber(currentExSlide) }}</div>
              <div slot="pagination" class="swiper-pagination" />
              <div class="page-num right-num">{{ getPaddingNumber(mainData.projects.length || 0) }}</div>
              <div slot="button-prev" class="swiper-button-prev mr-4">
                <i class="pc uic-arrow_pre only-pc" />
                <i class="m umic-arrow_backward only-mobile" />
              </div>
              <div slot="button-next" class="swiper-button-next">
                <i class="pc uic-arrow_next only-pc" />
                <i class="m umic-arrow_forward only-mobile" />
              </div>
            </div>
          </Swiper>
        </client-only>
      </div>
    </section>
    <section v-if="mainData.events && mainData.events.length > 0" class="bg-grey">
      <div class="container">
        <h2>
          <NuxtLink to="/event">이벤트<i class="m umic-arrow_forward" /></NuxtLink>
        </h2>
        <div class="event-wrap">
          <NuxtLink v-for="item in mainData.events" :key="item.id" :to="`/event/${item.id}`" class="event-item">
            <div class="img-wrap">
              <img :src="getImage(item.thumbnail)" alt="" />
              <UTag class="tag" :type="item.state" />
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ getFormattedDate(item.startDate, item.endDate) }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>
    <section v-if="mainData.notices && mainData.notices.length > 0">
      <div class="container notice">
        <h2>
          <NuxtLink to="/community/notice">공지사항<i class="m umic-arrow_forward" /></NuxtLink>
        </h2>
        <div class="notice-wrap">
          <NuxtLink
            v-for="item in mainData.notices"
            :key="item.id"
            :to="`/community/notice/${item.id}`"
            class="notice-item"
            :class="{ 'is-pin': item.isNotice }"
          >
            <h3>
              <i v-if="item.isNotice" class="pc uic-fixed" /><span>{{ item.title }}</span>
            </h3>
            <p>{{ $dayjs(item.postDate).format('YYYY-MM-DD') }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import UTag from '~/components/user/common/UTag';
import { getDateCommonDateOutput, numberPad } from '~/assets/js/commons';
import UPopupModal from '~/components/user/modal/UPopupModal.vue';

export default {
  name: 'IndexPage',
  components: { UPopupModal, UTag },
  async asyncData({ $axios, req }) {
    const mainData = await $axios.$get('/user/common/home');

    if (req?.body?.previewData) {
      const sliderData = JSON.parse(req.body.previewData);

      mainData.slides.unshift(sliderData);
      mainData.popups = [];
    }

    return { mainData };
  },
  data() {
    return {
      mainSwiperOption: {
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        loop: true,
        autoplay: {
          delay: 5000
        },
        effect: 'fade',
        speed: 1000,
        fadeEffect: {
          crossFade: true
        }
      },
      exSwiperOption: {
        pagination: {
          el: '.swiper-pagination',
          type: 'progressbar'
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        loop: true,
        autoplay: {
          delay: 5000
        },
        effect: 'fade',
        speed: 1000,
        fadeEffect: {
          crossFade: true
        }
      },
      currentMainSlide: 1,
      currentExSlide: 1,
      isSubTitle: false,
      mainData: null,
      isShowPopup: false
    };
  },
  computed: {
    mainSwiper() {
      return this.$refs.mainSwiper.$swiper;
    },
    exSwiper() {
      return this.$refs.exSwiper.$swiper;
    }
  },
  created() {
    this.mainSwiperOption.autoplay =
      this.mainData.slides.length <= 1
        ? false
        : {
            delay: 5000
          };
    this.exSwiperOption.autoplay =
      this.mainData.projects.length <= 1
        ? false
        : {
            delay: 5000
          };
  },
  mounted() {
    if (!this.$cookies.get('mainPopupHide')) {
      this.isShowPopup = true;
    }
    this.isSubTitle = !!this.mainData?.projects[0]?.subtitle;
  },
  methods: {
    getFormattedDate(startDate, endDate) {
      return getDateCommonDateOutput(startDate, endDate);
    },
    getImage(image) {
      return image
        ? `${this.$store.state.BASE_URL}${image.savedFileName}`
        : require('~/assets/img/thumbnail_default.jpg');
    },
    getPaddingNumber(num) {
      return numberPad(num, 2);
    },
    onMainSlideChange() {
      this.currentMainSlide = this.mainSwiper.realIndex + 1;
    },
    onExSlideChange() {
      this.currentExSlide = this.exSwiper.realIndex + 1;
      this.isSubTitle = !!this.mainData?.projects[this.exSwiper.realIndex]?.subtitle;
    },
    goExDetail(item) {
      this.$router.push(`/${item.kind.toLowerCase()}/${item.id}`);
    }
  }
};
</script>

<style lang="scss" scoped>
section {
  position: relative;
}

h2 {
  font-weight: 700;
  font-size: 2.4rem;
  line-height: 160%;
  margin-bottom: 2rem;

  i {
    font-size: 2rem;
    margin-left: 0.4rem;
  }

  a {
    display: flex;
    align-items: center;
  }
}

h3 {
  display: -webkit-box;
  font-weight: 700;
  font-size: 1.8rem;
  line-height: 160%;
  white-space: normal;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

h4 {
  display: -webkit-box;
  white-space: normal;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.main-slider {
  .swiper-slide {
    position: relative;
    height: calc(100vh - 6rem);
    width: 100vw;
    padding: 4.8rem 2rem;
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;

    a {
      cursor: default;

      &.clickable {
        cursor: pointer;
      }
    }

    img {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
      z-index: -1;
    }

    .bg-wrap {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background: linear-gradient(180deg, rgba(17, 17, 17, 0.1) 0%, rgba(17, 17, 17, 0.2) 100%);
      z-index: -1;
    }

    h2 {
      color: var(--color-white);
      font-weight: 700;
      font-size: 3rem;
      line-height: 140%;
      letter-spacing: -1px;
      margin-bottom: 0.8rem;
      word-break: keep-all;
    }

    h3 {
      color: var(--color-white);
      font-weight: 600;
      font-size: 2.4rem;
      line-height: 140%;
      word-break: keep-all;
      margin-bottom: 2rem;
    }

    p {
      color: var(--color-white);
      font-weight: 600;
      font-size: 1.6rem;
      line-height: 100%;
    }
  }

  .swiper-button-prev,
  .swiper-button-next {
    color: var(--color-white);
    height: 4.3rem;
    width: calc(var(--swiper-navigation-size) / 44 * 27);
    left: 2rem;
    top: 30.3rem;
    font-size: 2.4rem;

    &:after {
      content: '';
    }
  }
  .swiper-button-next {
    left: 6rem;
  }

  .swiper-pagination {
    color: var(--color-white);
    font-weight: 600;
    font-size: 1.4rem;
    line-height: 100%;
    height: 1.5rem;
    width: auto;
    top: 30.3rem;
    left: 9.8rem;
    transform: translateY(-50%);
  }
}

.ex-slider {
  padding-bottom: 4rem;

  .swiper-slide {
    position: relative;
  }

  .ex-swiper-menu-group {
    display: flex;
    align-items: center;
    position: absolute;
    top: unset;
    bottom: -4rem;
    left: 0;

    .page-num {
      font-weight: 600;
      font-size: 1.4rem;
      line-height: 160%;
    }

    .right-num {
      margin-right: 2.4rem;
      opacity: 0.4;
    }

    .mr-4 {
      margin-right: 0.4rem;
    }

    .swiper-button-prev,
    .swiper-button-next {
      color: var(--color-black);
      position: unset;
      font-size: 2rem;
      height: auto;
      margin-top: unset;

      &:after {
        content: '';
      }
    }

    ::v-deep .swiper-pagination-current,
    ::v-deep .swiper-pagination-total {
      display: none;
    }

    .swiper-pagination {
      overflow: hidden;
    }

    .swiper-pagination-progressbar {
      position: unset;
      height: 2px;
      width: 104px;
      margin: 0 1.6rem;
      background-color: var(--color-u-grey-2);
    }

    ::v-deep .swiper-pagination-progressbar-fill {
      background: var(--color-black);
    }

    .swiper-button-next {
      left: 6rem;
    }

    &.has-sub {
      bottom: -4.5rem;
    }
  }
}

.bg-grey {
  background-color: rgba(235, 235, 235, 0.4);
}

.container {
  padding-top: 4rem;
  padding-bottom: 4rem;

  .ex-wrap {
    .ex-item {
      img {
        width: 100%;
        aspect-ratio: 320 / 218;
        object-fit: contain;
        border-radius: 0.8rem;
        margin-bottom: 1.2rem;
      }

      h3 {
        margin-bottom: 0.8rem;
        -webkit-line-clamp: 1;
      }

      h4 {
        font-weight: 400;
        font-size: 1.6rem;
        line-height: 160%;
        -webkit-line-clamp: 1;
      }

      p {
        display: flex;
        align-items: center;
        margin-top: 2.4rem;

        .tag {
          margin-right: 1.2rem;
        }

        span {
          font-weight: 500;
          font-size: 1.4rem;
          line-height: 100%;
        }
      }
    }
  }

  .event-wrap {
    display: flex;
    flex-direction: column;

    .event-item {
      margin-bottom: 4rem;

      .img-wrap {
        position: relative;

        img {
          width: 100%;
          aspect-ratio: 320 / 218;
          object-fit: cover;
          border-radius: 0.8rem;
          margin-bottom: 1.6rem;
        }

        .tag {
          position: absolute;
          top: 1.2rem;
          left: 1.2rem;
        }
      }

      h3 {
        word-break: keep-all;
        margin-bottom: 0.8rem;
      }

      &.event-item:last-child {
        margin-bottom: 0;
      }
    }
  }

  &.notice {
    padding-bottom: 12rem;
  }

  .notice-wrap {
    border-top: 1px solid var(--color-black);

    .notice-item {
      display: block;
      padding: 1.6rem 1.2rem;
      border-bottom: 1px solid var(--color-black);
      min-height: 8rem;

      h3 {
        display: flex;
        align-items: center;
        font-weight: 400;
        font-size: 1.6rem;
        line-height: 140%;
        margin-bottom: 0.7rem;

        i {
          font-size: 2.4rem;
          margin-right: 0.5rem;
          transform: translateX(-0.3rem);
        }

        span {
          flex: 1 0 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      p {
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 100%;
        color: var(--color-u-grey-3);
      }

      &.is-pin {
        background-color: var(--color-white);
      }
    }
  }
}

.container.has-sub .ex-slider {
  padding-bottom: 4.3rem;
}

@media screen and (min-width: 769px) {
  .pc-flex-col {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: flex-end;
  }

  .main-slider {
    &.swiper-container {
      height: 80rem;
    }

    .swiper-slide {
      height: 100%;
    }

    .swiper-button-prev,
    .swiper-button-next {
      height: 100%;
      top: 50%;
      transform: translateY(-50%);
      left: 4rem;

      i {
        font-size: 8rem;
      }
    }

    .swiper-button-next {
      left: auto;
      right: 4rem;
    }

    .swiper-slide {
      padding-bottom: 8rem;

      h2 {
        order: 1;
        font-weight: 700;
        font-size: 5.2rem;
        line-height: 150%;
        margin-bottom: 0.4rem;
      }

      h3 {
        order: 2;
        font-weight: 600;
        font-size: 3.6rem;
        line-height: 150%;
        margin-bottom: 4rem;
      }

      p {
        font-size: 2rem;
        order: 3;
      }
    }
  }

  .container {
    padding-top: 8rem;
    padding-bottom: 8rem;

    .ex-wrap {
      .ex-item {
        display: flex;

        .left {
          position: relative;
          flex: 1 0 57.478%;
          width: 57.478%;
          margin-right: 2.8rem;
          aspect-ratio: 392/365;
        }

        .right {
          flex: 1 0 40.4692%;
          width: 40.4692%;
          cursor: pointer;

          h3 {
            font-weight: 600;
            font-size: 3.6rem;
            line-height: 150%;
            padding-top: 6rem;
            margin-bottom: 1.2rem;
            -webkit-line-clamp: 2;
          }

          h4 {
            font-weight: 500;
            font-size: 2.4rem;
            line-height: 150%;
            margin-bottom: 2.2rem;
            -webkit-line-clamp: 2;
          }

          p span:last-child {
            font-weight: 500;
            font-size: 1.6rem;
          }
        }

        img {
          position: absolute;
          height: 100%;
          max-height: 73rem;
          top: 0;
          right: 0;
          width: 55.3125vw;
          max-width: 106.2rem;
          margin-bottom: 0;
          border-radius: 0 0.8rem 0.8rem 0;
        }
      }
    }

    .event-wrap {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 2.8rem;

      .event-item {
        margin-bottom: 0;

        .img-wrap {
          position: relative;

          img {
            width: 100%;
            aspect-ratio: 9 / 3;
            object-fit: cover;
            border-radius: 0.8rem;
            margin-bottom: 2rem;
          }

          .tag {
            position: absolute;
            top: 0.8rem;
            left: 0.8rem;
          }

          p {
            line-height: 160%;
          }
        }

        h3 {
          font-size: 2rem;
          font-weight: 700;
          line-height: 150%;
          height: 6rem;
          margin-bottom: 2.8rem;
          display: -webkit-box;
          overflow: hidden;
          vertical-align: top;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      }
    }

    &.notice {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      column-gap: 2.8rem;

      h2 {
        grid-column: 1 / span 4;
        margin-bottom: 0;
      }

      .notice-wrap {
        grid-column: 5 / span 8;

        .notice-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2.5rem 2rem;

          h3 {
            flex: 1 0 0;
            display: flex;
            align-items: center;
            font-weight: 500;
            font-size: 1.8rem;
            line-height: 160%;
            margin-bottom: 0;
            padding-right: 2rem;
            overflow: hidden;
            vertical-align: top;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }

          p {
            color: var(--color-black);
            font-weight: 400;
            font-size: 1.6rem;
            line-height: 160%;
          }
        }
      }
    }
  }

  h2 {
    font-weight: 700;
    font-size: 4.2rem;
    line-height: 150%;
    margin-bottom: 4.4rem;

    i {
      font-size: 3.2rem;
      margin-left: 0.8rem;
    }
  }

  .ex-slider .ex-swiper-menu-group {
    top: 390px;
    left: 59.7%;
    bottom: 13.2rem;

    &.has-sub {
      bottom: 13.2rem;
    }
  }

  ::v-deep .ex-slider.swiper-container {
    overflow: visible;
    //padding-bottom: 0;
  }

  .container.has-sub .ex-slider {
    padding-bottom: 1rem;
  }
}
</style>
