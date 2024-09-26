<template>
  <div class="container">
    <section><ULangTab v-model="selectedLang" /></section>
    <section
      :style="{
        borderTop: '0',
        paddingTop: '0'
      }"
    >
      <h1>{{ lang('sec1-title') }}</h1>
      <div class="bg-img">
        <img src="~assets/img/img_intro-bg.jpg" alt="" class="only-pc" />
        <img src="~assets/img/img_intro-bg-m.jpg" alt="" class="only-mobile" />
      </div>
    </section>
    <section>
      <h2>{{ lang('sec2-title') }}</h2>
      <div>
        <div class="content mb">
          <span class="light">{{ lang('sec2-text1') }}</span>
          <br />{{ lang('sec2-text2') }}
        </div>
        <ul class="content bullet">
          <li>{{ lang('sec2-text3') }}<br />{{ lang('sec2-text4') }}</li>
        </ul>
      </div>
    </section>
    <section>
      <h2>{{ lang('sec3-title') }}</h2>
      <div class="content-wrap">
        <div>
          <h3>{{ lang('sec3-list1-title') }}</h3>
          <ul class="content bullet">
            <li>{{ lang('sec3-list1-text1') }}</li>
            <li>{{ lang('sec3-list1-text2') }}</li>
            <li>{{ lang('sec3-list1-text3') }}</li>
          </ul>
        </div>
        <div>
          <h3>{{ lang('sec3-list2-title') }}</h3>
          <ul class="content bullet">
            <li>{{ lang('sec3-list2-text1') }}</li>
            <li>{{ lang('sec3-list2-text2') }}</li>
          </ul>
        </div>
        <div>
          <h3>{{ lang('sec3-list3-title') }}</h3>
          <ul class="content bullet">
            <li>{{ lang('sec3-list3-text1') }}</li>
            <li>{{ lang('sec3-list3-text2') }}</li>
            <li>{{ lang('sec3-list3-text3') }}</li>
            <li>{{ lang('sec3-list3-text4') }}</li>
          </ul>
        </div>
      </div>
    </section>
    <section>
      <h2>
        {{ lang('sec4-title') }}
        <template v-if="selectedLang === 'en'"><br class="only-pc" />{{ lang('sec4-title2') }}</template>
      </h2>
      <div class="content-wrap">
        <div>
          <h3>{{ lang('sec4-list1-title') }}</h3>
          <ul class="content bullet">
            <li>{{ lang('sec4-list1-text1') }}</li>
            <li>{{ lang('sec4-list1-text2') }}</li>
            <li>{{ lang('sec4-list1-text3') }}</li>
          </ul>
        </div>
        <div v-if="!($store.state.deviceInfo.isApp && $store.state.deviceInfo.isIOS)" class="app-download">
          <a href="https://apps.apple.com/us/app/%ED%97%A4%EB%A0%88%EB%94%94%EC%9B%80/id1659816022" target="_blank">
            <img src="~assets/img/icon_apple.png" alt="" class="only-pc" />
            <img src="~assets/img/icon_apple_m.png" alt="" class="only-mobile" />
            <span>App Store</span>
          </a>
          <a href="https://play.google.com/store/apps/details?id=heredium.art.app" target="_blank">
            <img src="~assets/img/icon_google-play.png" alt="" /><span>Google Play</span>
          </a>
        </div>
        <div>
          <ul class="content bullet">
            <li>{{ lang('sec4-list1-text4') }}</li>
          </ul>
          <p class="sub">{{ lang('sec4-list1-text4-sub') }}</p>
          <ul class="content bullet">
            <li>{{ lang('sec4-list1-text5') }}</li>
          </ul>
        </div>
      </div>
    </section>
    <section>
      <h2>{{ lang('sec5-title') }}</h2>
      <ul class="content bullet">
        <li>{{ lang('sec5-text1') }}</li>
        <li>{{ lang('sec5-text2') }}</li>
        <li>{{ lang('sec5-text3') }}</li>
        <li>{{ lang('sec5-text4') }}</li>
        <li>{{ lang('sec5-text5') }}</li>
        <li>{{ lang('sec5-text6') }}</li>
        <li>{{ lang('sec5-text7') }}</li>
        <li>{{ lang('sec5-text8') }}</li>
        <li>{{ lang('sec5-text9') }}</li>
        <li>{{ lang('sec5-text10') }}</li>
        <li>{{ lang('sec5-text11') }}</li>
      </ul>
    </section>
    <section>
      <h2 id="way">{{ lang('sec6-title') }}</h2>
      <div class="content-wrap">
        <div>
          <h3>
            {{ lang('sec6-list1-title') }}
            <template v-if="selectedLang === 'en'"><br />{{ lang('sec6-list1-title2') }}</template>
          </h3>
          <ul v-if="selectedLang === 'ko'" class="content bullet">
            <li>대전 동구 대전로 735 (인동 74-1)</li>
          </ul>
          <div class="map-button">
            <a
              href="https://map.naver.com/v5/?c=15,0,0,0,dh&summaryCard=14186056.761229988%7C4345518.420308491%7Cplace%7C1020717718"
              target="_blank"
            >
              <img src="~assets/img/logo_naver.svg" alt="" />{{ lang('sec6-list1-naver-map') }}
            </a>
            <a href="https://map.kakao.com/link/to/헤레디움,36.32557832148047,127.43545973867754" target="_blank">
              <img src="~assets/img/logo_kakao.svg" alt="" />{{ lang('sec6-list1-kakao-map') }}
            </a>
          </div>
          <ul class="content bullet">
            <li>{{ lang('sec6-list1-text1') }}</li>
            <li>
              {{ lang('sec6-list1-text2') }}
              <div class="divider" />
              070-8843-2022
            </li>
          </ul>
        </div>
        <div class="map-wrap">
          <div id="map" class="map">MAP</div>
          <div class="custom_zoomcontrol radius_border">
            <span @click="zoomChange(-1)">
              <i class="pc uic-plus only-pc" />
              <i class="m umic-plus only-mobile" />
            </span>
            <span @click="zoomChange(1)">
              <i class="pc uic-minus only-pc" />
              <i class="m umic-minus only-mobile" />
            </span>
          </div>
          <transition name="fade">
            <div v-if="isShowDeem" class="map-deem" role="button" @click="isShowDeem = false">
              <img src="~assets/img/map_deem_icon.svg" alt="" />
              <p>{{ lang('sec6-list1-map-click') }}</p>
            </div>
          </transition>
        </div>
        <div class="subway-station">
          <h3>{{ lang('sec6-list2-title') }}</h3>
          <div class="subway-station-wrap">
            <div class="subway-station-item">
              <div class="subway-title">
                <span>1</span>
                {{ lang('sec6-list2-way1-text1') }}
              </div>
              <div class="divider" />
              <p>{{ lang('sec6-list2-way1-text2') }}</p>
              <div class="divider" />
              <div class="subway-walk-time">
                <img src="~assets/img/icon_walking.svg" alt="" />
                {{ lang('sec6-list2-way1-text3') }}
              </div>
            </div>
            <div class="subway-station-item">
              <div class="subway-title">
                <span>1</span>
                {{ lang('sec6-list2-way2-text1') }}
              </div>
              <div class="divider" />
              <p>{{ lang('sec6-list2-way2-text2') }}</p>
              <div class="divider" />
              <div class="subway-walk-time">
                <img src="~assets/img/icon_walking.svg" alt="" />
                {{ lang('sec6-list2-way2-text3') }}
              </div>
            </div>
            <div class="subway-station-item">
              <div class="subway-title">
                <span>1</span>
                {{ lang('sec6-list2-way3-text1') }}
              </div>
              <div class="divider" />
              <p>{{ lang('sec6-list2-way3-text2') }}</p>
              <div class="divider" />
              <div class="subway-walk-time">
                <img src="~assets/img/icon_walking.svg" alt="" />
                {{ lang('sec6-list2-way3-text3') }}
              </div>
            </div>
          </div>
        </div>
        <div class="bus-station">
          <h3>{{ lang('sec6-list3-title') }}</h3>
          <div class="bus-station-item">
            <div class="bus-station-head">
              <h4>
                <img src="~assets/img/icon_bus.svg" alt="" />
                {{ lang('sec6-list3-location') }}
              </h4>
              <div>
                <div>
                  <span>10080</span>
                </div>
                <div class="divider" />
                <p>41m</p>
              </div>
            </div>
            <div class="bus-station-numbers">
              <div>
                <span class="tag common">{{ lang('sec6-list3-label1') }}</span>
                <p>313, 501, 511, 514, 606, 607, 612, 802</p>
              </div>
              <div>
                <span class="tag outside">{{ lang('sec6-list3-label2') }}</span>
                <p>31, 60, 62, 63</p>
              </div>
              <div>
                <span class="tag farming">{{ lang('sec6-list3-label3') }}</span>
                <p>607</p>
              </div>
            </div>
          </div>
          <div class="bus-station-item">
            <div class="bus-station-head">
              <h4>
                <img src="~assets/img/icon_bus.svg" alt="" />
                {{ lang('sec6-list3-location') }}
              </h4>
              <div>
                <span>10020</span>
                <div class="divider" />
                <p>187m</p>
              </div>
            </div>
            <div class="bus-station-numbers">
              <div>
                <div>
                  <span class="tag common">{{ lang('sec6-list3-label1') }}</span>
                </div>
                <p>711, 802</p>
              </div>
              <div>
                <span class="tag outside">{{ lang('sec6-list3-label2') }}</span>
                <p>33-1, 33-2, 52</p>
              </div>
            </div>
          </div>
          <div class="bus-station-item">
            <div class="bus-station-head">
              <h4>
                <img src="~assets/img/icon_bus.svg" alt="" />
                {{ lang('sec6-list3-location') }}
              </h4>
              <div>
                <span>10070</span>
                <div class="divider" />
                <p>230m</p>
              </div>
            </div>
            <div class="bus-station-numbers">
              <div>
                <div>
                  <span class="tag common">{{ lang('sec6-list3-label1') }}</span>
                </div>
                <p>311, 501, 511, 514, 603, 605, 606, 607, 612, 616</p>
              </div>
              <div>
                <span class="tag outside">{{ lang('sec6-list3-label2') }}</span>
                <p>30, 33-1, 33-2, 52, 60, 62</p>
              </div>
              <div>
                <span class="tag farming">{{ lang('sec6-list3-label3') }}</span>
                <p>607</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3>{{ lang('sec6-list4-title') }}</h3>
          <ul class="content bullet">
            <li>{{ lang('sec6-list4-text') }}</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ULangTab from '~/components/user/common/ULangTab.vue';
import introKo from '~/assets/lang/ko/intro.json';
import introEn from '~/assets/lang/en/intro.json';

/**
 * 하나은행 진행 시 언어탭이 추가되었습니다. 일부 페이지만 언
 */

export default {
  name: 'IntroPage',
  components: { ULangTab },
  data() {
    return {
      map: null,
      isShowDeem: true,
      selectedLang: 'ko'
    };
  },
  mounted() {
    /* global kakao */
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(36.32557832148047, 127.43545973867754),
      level: 3
    };
    const map = new kakao.maps.Map(container, options);

    // eslint-disable-next-line no-new
    new kakao.maps.Marker({
      map,
      position: new kakao.maps.LatLng(36.32557832148047, 127.43545973867754)
    });
    this.map = map;
  },
  methods: {
    zoomChange(value) {
      this.map.setLevel(this.map.getLevel() + value);
    },
    lang(target) {
      const langData = this.selectedLang === 'ko' ? introKo : introEn;

      return langData[target] || '언어 데이터가 없음';
    }
  }
};
</script>

<style lang="scss" scoped>
.divider {
  display: inline-flex;
  height: 1.4rem;
  width: 1px;
  background-color: var(--color-u-grey-2);
  margin: 0 0.8rem;
  vertical-align: middle;
}

section {
  border-top: 1px solid var(--color-black);
  padding-top: 2rem;
  margin-bottom: 4rem;

  > div {
    margin-bottom: 2rem;
  }

  &:first-child {
    border-top: 0;
  }

  &:last-child {
    margin-bottom: 14.5rem;
  }
}

h1 {
  font-style: normal;
  font-weight: 700;
  font-size: 2.8rem;
  line-height: 100%;
  letter-spacing: -1px;
  margin: 3.2rem 0 2rem;
}

h2 {
  font-weight: 700;
  font-size: 2rem;
  line-height: 150%;
  margin-bottom: 2.8rem;
}

h3 {
  font-weight: 500;
  font-size: 1.6rem;
  line-height: 160%;
  margin-bottom: 1.6rem;
  letter-spacing: -0.5px;
}

.bg-img img {
  width: 100%;
  aspect-ratio: 16/11;
  margin-bottom: 2rem;
}

.content-wrap {
  > div {
    margin-bottom: 2rem;
  }

  > div:last-child {
    margin-bottom: 0;
  }
}

.content {
  color: var(--color-u-grey-4);
  font-weight: 500;
  line-height: 160%;

  &.bullet li {
    line-height: 160%;
    margin-bottom: 0.8rem;
    letter-spacing: -0.5px;
    font-weight: 400;
  }

  &.mb {
    margin-bottom: 2rem;
  }

  span.light {
    font-weight: 300;
  }
}

.map-wrap {
  position: relative;
  margin: 0 -2rem 2rem;
  overflow: hidden;

  .map {
    aspect-ratio: 360/230;
  }

  .radius_border {
    border: 1px solid var(--color-u-grey-2);
  }

  .custom_zoomcontrol {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 3.6rem;
    height: 8rem;
    overflow: hidden;
    z-index: 1;
    background-color: #fff;
  }
  .custom_zoomcontrol span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.6rem;
    height: 4rem;
    cursor: pointer;
  }
  .custom_zoomcontrol span:first-child {
    color: var(--color-white);
    border-bottom: 1px solid var(--color-u-grey-2);
    background-color: var(--color-u-primary);
  }

  .map-deem {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: rgba(17, 17, 17, 0.6);
    height: 100%;
    width: 100%;
    z-index: 1;
    cursor: pointer;

    img {
      height: 6.4rem;
      width: 6.4rem;
      margin-bottom: 2rem;
    }

    p {
      color: var(--color-white);
      font-weight: 500;
      line-height: 160%;
      letter-spacing: -0.5px;
    }
  }
}

.subway-station {
  .subway-station-wrap {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 1.2rem;
  }

  .subway-station-item {
    display: flex;
    flex-wrap: wrap;
    row-gap: 0.2rem;
    align-items: center;
    color: var(--color-u-grey-4);
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 150%;

    .subway-title {
      display: flex;
      align-items: flex-end;
      color: var(--color-u-grey-4);
      font-weight: 500;
      font-size: 1.4rem;
      line-height: 160%;
      letter-spacing: -0.5px;

      span {
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--color-white);
        font-weight: 500;
        font-size: 1.2rem;
        line-height: 150%;
        height: 2.2rem;
        width: 2.2rem;
        border-radius: 50%;
        background-color: #5fb256;
        margin-right: 0.8rem;
      }
    }

    p {
      color: var(--color-u-grey-4);
      font-weight: 400;
      font-size: 1.4rem;
      line-height: 160%;
    }

    .subway-walk-time {
      display: flex;
      align-items: center;
      font-weight: 400;
      font-size: 1.4rem;
      line-height: 160%;

      img {
        margin-right: 0.4rem;
      }
    }
  }
}

.bus-station {
  .bus-station-item {
    border-bottom: 1px solid var(--color-u-grey-1);
    padding-bottom: 1.6rem;
    margin-bottom: 1.6rem;

    .bus-station-head {
      display: flex;
      margin-bottom: 1.4rem;

      h4 {
        display: flex;
        font-weight: 500;
        font-size: 1.4rem;
        line-height: 160%;
        align-items: flex-end;
        letter-spacing: -0.5px;
        margin-right: 1rem;

        img {
          margin-right: 0.8rem;
        }
      }

      > div {
        display: flex;
        align-items: center;

        span {
          color: var(--color-u-grey-3);
          font-size: 1.2rem;
          font-weight: 400;
          line-height: 100%;
        }

        p {
          color: var(--color-u-grey-4);
          font-size: 1.4rem;
          line-height: 160%;
        }
      }
    }

    .bus-station-numbers {
      > div {
        display: flex;
        margin-bottom: 1.2rem;

        p {
          flex: 1 0 0;
          color: var(--color-u-grey-4);
          display: flex;
          font-weight: 400;
          font-size: 1.4rem;
          line-height: 150%;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }

      .tag {
        color: var(--color-white);
        display: flex;
        padding: 0.6rem;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 100%;
        letter-spacing: -0.5px;
        margin-right: 1rem;

        &.common {
          background-color: #4eacba;
        }

        &.outside {
          background-color: #5fb256;
        }

        &.farming {
          background-color: #d68345;
        }
      }
    }

    &:last-child {
      border-bottom: 0;
      padding-bottom: 0;
      margin-bottom: 0;
    }
  }
}

.sub {
  color: var(--color-u-grey-3);
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 100%;
  padding-left: 0.9rem;
  margin-bottom: 1.6rem;
  letter-spacing: -0.5px;
}

.app-download {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1.6rem;

  button,
  a {
    color: var(--color-u-grey-4);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 4.4rem;
    font-size: 1.2rem;
    line-height: 100%;
    border: 1px solid var(--color-u-grey-2);

    span {
      transform: translateY(0.1rem);
    }

    &:first-child img {
      margin-right: 0.8rem;
    }

    &:last-child img {
      margin-right: 0.6rem;
    }
  }
}

.map-button {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1.6rem;
  margin: 2rem 0;

  a {
    color: var(--color-u-grey-4);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 4.4rem;
    font-size: 1.2rem;
    line-height: 100%;
    border: 1px solid var(--color-u-grey-2);

    img {
      margin-right: 0.8rem;
    }
  }
}

@media screen and (min-width: 769px) {
  section {
    display: flex;
    border-top: 1px solid var(--color-black);
    padding-top: 4rem;
    margin-bottom: 8rem;

    > div,
    ul:not(.tab-wrap) {
      flex: 1 0 0;
      max-width: 90rem;
      margin-bottom: 0;
    }

    h1,
    h2 {
      flex: 1 0 0;
      max-width: 44.4rem;
      margin-right: 2rem;
    }

    &:last-child {
      margin-bottom: 14.5rem;
    }

    &:first-child {
      padding-top: 6rem;
      border-top: 0;
    }
  }

  h1 {
    font-size: 4.2rem;
    line-height: 150%;
    margin: 0;
  }

  h2 {
    font-weight: 600;
    font-size: 3.6rem;
    line-height: 150%;
    margin-bottom: 0;
  }

  h3 {
    font-weight: 700;
    font-size: 1.8rem;
    line-height: 160%;
    margin-bottom: 1.7rem;
  }

  .bg-img img {
    width: 100%;
    aspect-ratio: 980/614;
    margin-bottom: 0;
  }

  .content-wrap {
    > div {
      margin-bottom: 3.6rem;
    }

    > div:last-child {
      margin-bottom: 0;
    }
  }

  .content {
    font-size: 1.6rem;
    font-weight: 400;
    line-height: 160%;

    &.bullet li {
      font-size: 1.6rem;
      font-weight: 400;
      line-height: 160%;
      margin-bottom: 0.4rem;
      padding-left: 1.3rem;
    }

    &.bullet li:last-child {
      margin-bottom: 0;
    }

    &.mb {
      margin-bottom: 3.6rem;
    }

    span.light {
      font-weight: 400;
    }
  }

  .map-wrap {
    margin: 0 0 3.6rem;

    .map {
      aspect-ratio: 900/472;
    }
  }

  .subway-station {
    .subway-station-wrap {
      display: flex;
      flex-wrap: wrap;
      column-gap: 4rem;
      row-gap: 2rem;
    }

    .subway-station-item {
      font-weight: 400;
      font-size: 1.6rem;
      line-height: 150%;

      .subway-title {
        font-size: 1.6rem;
        line-height: 150%;

        span {
          font-weight: 500;
          font-size: 1.4rem;
          line-height: 150%;
        }
      }

      p {
        font-size: 1.6rem;
        line-height: 150%;
      }

      .subway-walk-time {
        font-size: 1.6rem;
      }
    }
  }

  .bus-station {
    .bus-station-item {
      border-bottom: 1px solid var(--color-u-grey-1);
      padding-bottom: 2.4rem;
      margin-bottom: 2rem;

      .bus-station-head {
        display: flex;
        margin-bottom: 1.6rem;

        h4 {
          font-size: 1.6rem;
          line-height: 150%;
        }

        > div {
          span {
            font-size: 1.4rem;
            line-height: 150%;
          }

          p {
            font-size: 1.6rem;
            line-height: 150%;
          }
        }
      }

      .bus-station-numbers {
        > div {
          display: flex;
          margin-bottom: 1.2rem;
        }

        .tag {
          padding: 0.2rem 0.6rem;
          font-size: 1.4rem;
          font-weight: 500;
          line-height: 150%;
        }
      }
    }
  }

  .sub {
    font-size: 1.4rem;
    line-height: 160%;
    padding-left: 1.3rem;
    margin-bottom: 1.2rem;
  }

  .app-download {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 16rem));
    column-gap: 1.2rem;
    margin-top: -0.8rem;
    margin-bottom: 2.4rem;

    button,
    a {
      height: 5.2rem;
      font-size: 1.4rem;
      line-height: 160%;

      &:first-child img {
        margin-right: 0.9rem;
        width: 2rem;
        height: 2rem;
      }

      &:last-child img {
        margin-right: 0.7rem;
      }
    }
  }

  .map-button {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 16rem));
    column-gap: 1.2rem;
    margin: 2.4rem 0;

    a {
      height: 5.2rem;
      font-size: 1.4rem;
      line-height: 100%;
      border: 1px solid var(--color-u-grey-2);

      img {
        width: 2.4rem;
        height: 2.4rem;
        margin-right: 0.8rem;
      }
    }
  }
}
</style>
