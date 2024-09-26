<template>
  <div class="info">
    <div class="container">
      <section class="tab">
        <ULangTab v-model="selectedLang" />
      </section>
      <section class="banner">
        <img src="~assets/img/intro/info_img1.png" alt="" />
        <h1>Historic Cultural Space,<br />HEREDIUM</h1>
      </section>
      <section class="intro">
        <div class="left">
          <h2>
            {{ lang('intro-title1') }}<br />{{ lang('intro-title2') }}<br class="only-mobile" />
            {{ lang('intro-title3') }}
          </h2>
          <p>{{ lang('intro-text1') }}</p>
          <p>{{ lang('intro-text2') }}</p>
          <p>{{ lang('intro-text3') }}</p>
          <p>{{ lang('intro-text4') }}</p>
          <p>{{ lang('intro-text5') }}</p>
        </div>
        <div class="right">
          <img src="~assets/img/pc/logo.svg" alt="" />
        </div>
      </section>
      <section class="history">
        <h2 class="mo24">{{ lang('history-title1') }}<br />{{ lang('history-title2') }}</h2>
        <div class="grid">
          <div class="item">
            <img src="~assets/img/intro/history_1.png" alt="" />
            <h3><span>Year</span>1922</h3>
            <p>{{ lang('history-item1-text1') }}</p>
            <p>{{ lang('history-item1-text2') }}</p>
            <p v-if="selectedLang === 'en'">{{ lang('history-item1-text3') }}</p>
          </div>
          <div class="item">
            <img src="~assets/img/intro/history_2.png" alt="" />
            <h3><span>Year</span>1945</h3>
            <p>{{ lang('history-item2-text1') }}</p>
            <p>{{ lang('history-item2-text2') }}</p>
            <p v-if="selectedLang === 'en'">{{ lang('history-item2-text3') }}</p>
          </div>
          <div class="item">
            <img src="~assets/img/intro/history_3.png" alt="" />
            <h3><span>Year</span>1949</h3>
            <p>{{ lang('history-item3-text1') }}</p>
            <p>{{ lang('history-item3-text2') }}</p>
          </div>
          <div class="item">
            <img src="~assets/img/intro/history_4.png" alt="" />
            <h3><span>Year</span>1956</h3>
            <p>{{ lang('history-item4-text1') }}</p>
            <p>{{ lang('history-item4-text2') }}</p>
          </div>
          <div class="item">
            <img src="~assets/img/intro/history_5.png" alt="" />
            <h3><span>Year</span>1984</h3>
            <p>{{ lang('history-item5-text1') }}</p>
            <p>{{ lang('history-item5-text2') }}</p>
            <p v-if="selectedLang === 'en'">{{ lang('history-item5-text2') }}</p>
          </div>
          <div class="item">
            <img src="~assets/img/intro/history_6.png" alt="" />
            <h3><span>Year</span>2022</h3>
            <p>{{ lang('history-item6-text1') }}</p>
            <p>{{ lang('history-item6-text2') }}</p>
            <p v-if="selectedLang === 'en'">{{ lang('history-item6-text3') }}</p>
          </div>
        </div>
      </section>
      <section class="build">
        <div class="top">
          <div class="left">
            <h2 class="mo24">{{ lang('build-title1') }}<br />{{ lang('build-title2') }}</h2>
            <p>{{ lang('build-text1') }}</p>
            <p>{{ lang('build-text2') }}</p>
            <p>{{ lang('build-text3') }}</p>
            <p v-if="selectedLang === 'ko'">{{ lang('build-text4') }}</p>
          </div>
          <div class="right">
            <img src="~assets/img/intro/build_info_img.png" alt="" />
          </div>
        </div>
        <div class="grid">
          <div class="item">
            <img src="~assets/img/intro/build_1.png" alt="" />
            <h3>1. {{ lang('build-item1-title') }}</h3>
            <p>{{ lang('build-item1-text1') }}</p>
            <p>{{ lang('build-item1-text2') }}</p>
            <p>{{ lang('build-item1-text3') }}</p>
            <p>{{ lang('build-item1-text4') }}</p>
          </div>
          <div class="item">
            <img src="~assets/img/intro/build_2.png" alt="" />
            <h3>2. {{ lang('build-item2-title') }}</h3>
            <p>{{ lang('build-item2-text1') }}</p>
            <p>{{ lang('build-item2-text2') }}</p>
            <p>{{ lang('build-item2-text3') }}</p>
          </div>
          <div class="item">
            <img src="~assets/img/intro/build_3.png" alt="" />
            <h3>3. {{ lang('build-item3-title') }}</h3>
            <p>{{ lang('build-item3-text1') }}</p>
            <p>{{ lang('build-item3-text2') }}</p>
            <p>{{ lang('build-item3-text3') }}</p>
            <p>{{ lang('build-item3-text4') }}</p>
          </div>
          <div class="item">
            <img src="~assets/img/intro/build_4.png" alt="" />
            <h3>4. {{ lang('build-item4-title') }}</h3>
            <p>{{ lang('build-item4-text1') }}</p>
            <p>{{ lang('build-item4-text2') }}</p>
            <p>{{ lang('build-item4-text3') }}</p>
            <p>{{ lang('build-item4-text4') }}</p>
          </div>
          <div class="item">
            <img src="~assets/img/intro/build_5.png" alt="" />
            <h3>5. {{ lang('build-item5-title') }}</h3>
            <p>{{ lang('build-item5-text1') }}</p>
            <p>{{ lang('build-item5-text2') }}</p>
            <p>{{ lang('build-item5-text3') }}</p>
            <p>{{ lang('build-item5-text4') }}</p>
          </div>
          <div class="item">
            <img src="~assets/img/intro/build_6.png" alt="" />
            <h3>6. {{ lang('build-item6-title') }}</h3>
            <p>{{ lang('build-item6-text1') }}</p>
            <p>{{ lang('build-item6-text2') }}</p>
            <p>{{ lang('build-item6-text3') }}</p>
            <p>{{ lang('build-item6-text4') }}</p>
          </div>
        </div>
      </section>
      <section class="space">
        <div class="top">
          <h2 class="mo24">{{ lang('space-title1') }}<br class="only-mobile" />{{ lang('space-title2') }}</h2>
          <p>{{ lang('space-text1') }}</p>
          <p v-if="selectedLang === 'ko'">{{ lang('space-text2') }}</p>
        </div>
        <div class="grid">
          <img src="~assets/img/intro/space_1.png" alt="" />
          <img src="~assets/img/intro/space_2.png" alt="" />
        </div>
      </section>
      <section class="slogan mb-0">
        <div class="top">
          <h2 class="mo24">{{ lang('slogan-title1') }}<br class="only-mobile" />{{ lang('slogan-title2') }}</h2>
          <p>{{ lang('slogan-text') }}</p>
        </div>
        <div class="grid">
          <div>
            <img src="~assets/img/intro/slogan_1.png" alt="" />
            <h4>{{ lang('slogan-item1-title') }}</h4>
            <p>{{ lang('slogan-item1-text') }}</p>
          </div>
          <div>
            <img src="~assets/img/intro/slogan_2.png" alt="" />
            <h4>{{ lang('slogan-item2-title') }}</h4>
            <p>{{ lang('slogan-item2-text') }}</p>
          </div>
          <div>
            <img src="~assets/img/intro/slogan_3.png" alt="" />
            <h4>{{ lang('slogan-item3-title') }}</h4>
            <p>{{ lang('slogan-item3-text') }}</p>
          </div>
        </div>
      </section>
    </div>
    <div class="bottom">
      <img src="~assets/img/intro/bottom.png" alt="" />
      <div class="dim" />
      <h1>HEREDIUM</h1>
      <p>{{ lang('bottom-text') }}</p>
    </div>
  </div>
</template>
<script>
import ULangTab from '~/components/user/common/ULangTab.vue';
import infoKo from '~/assets/lang/ko/info.json';
import infoEn from '~/assets/lang/en/info.json';

export default {
  name: 'NewInfo',
  components: { ULangTab },
  data() {
    return {
      selectedLang: 'ko'
    };
  },
  methods: {
    lang(target) {
      const langData = this.selectedLang === 'ko' ? infoKo : infoEn;

      return langData[target] || '언어 데이터가 없음';
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  padding-top: 12rem;
  padding-bottom: 12rem;
}

h1 {
  font-size: 6rem;
  font-weight: 700;
  line-height: 150%;
}

h2 {
  font-size: 3.6rem;
  font-weight: 700;
  line-height: 130%;
  letter-spacing: -0.05rem;
}

h3 {
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 150%;
  letter-spacing: -0.05rem;
  padding-bottom: 1.8rem;
  border-bottom: 1px solid var(--color-default);
  margin-bottom: 2rem;

  span {
    font-size: 1.8rem;
    margin-right: 0.8rem;
  }
}

p {
  color: var(--color-u-grey-4);
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: -0.05rem;

  & + p {
    margin-top: 1.6rem;
  }
}

section {
  margin-bottom: 8rem;
}

.banner {
  position: relative;

  img {
    aspect-ratio: 1364/520;
    object-fit: cover;
  }

  h1 {
    color: var(--color-u-grey-4);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 100%;
  }
}

.intro {
  display: flex;
  gap: 14.4rem;

  .left {
    flex: 1 0 0;

    h2 {
      margin-bottom: 3.2rem;
    }
  }

  .right {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 55.2rem;
    border: 1px solid var(--color-default);

    img {
      width: 20rem;
    }
  }
}

.history {
  h2 {
    margin-bottom: 4.8rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 2.8rem;
    row-gap: 5.2rem;

    img {
      object-fit: cover;
      aspect-ratio: 436/320;
      margin-bottom: 3.2rem;
    }
  }
}

.build {
  border-top: 1px solid var(--color-default);
  padding-top: 4.8rem;

  .top {
    display: flex;
    gap: 11.8rem;
    margin-bottom: 8rem;

    .left {
      flex: 1 0 0;

      h2 {
        margin-bottom: 2.4rem;
      }
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 66.2rem;
      border: 1px solid var(--color-default);

      img {
        width: 100%;
      }
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 2.8rem;
    row-gap: 5.2rem;

    img {
      object-fit: cover;
      aspect-ratio: 668/320;
      margin-bottom: 3.2rem;
    }
  }
}

.space {
  border-top: 1px solid var(--color-default);
  padding-top: 4.8rem;

  .top {
    max-width: 78rem;
    margin-bottom: 4.8rem;

    h2 {
      margin-bottom: 2.4rem;
    }
  }

  .grid {
    display: grid;
    column-gap: 2.8rem;
    grid-template-columns: 1fr 1fr;

    img {
      object-fit: cover;
      aspect-ratio: 668/460;
    }
  }
}

.slogan {
  border-top: 1px solid var(--color-default);
  padding-top: 4.8rem;

  .top {
    max-width: 78rem;
    margin-bottom: 4.8rem;

    h2 {
      margin-bottom: 2.4rem;
    }
  }

  .grid {
    display: grid;
    column-gap: 2.8rem;
    grid-template-columns: repeat(3, 1fr);

    div {
      position: relative;
      aspect-ratio: 436/320;
      padding: 3.6rem;

      h4 {
        position: relative;
        font-size: 2rem;
        font-weight: 700;
        line-height: 140%;
        text-transform: capitalize;
        margin-bottom: 1.2rem;
        z-index: 1;
      }

      p {
        position: relative;
        color: var(--color-u-grey-4);
        font-size: 1.4rem;
        font-weight: 400;
        line-height: 140%;
        max-width: 20.4rem;
        z-index: 1;
      }

      img {
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 0;
      }

      &:nth-child(1) {
        background-color: #f8f4f0;

        img {
          width: 23.6%;
          right: 6rem;
        }
      }
      &:nth-child(2) {
        background-color: #eef0f3;

        img {
          width: 22.24%;
          right: 6.8rem;
        }
      }
      &:nth-child(3) {
        background-color: #f1f3ee;

        img {
          width: 43.8%;
          right: 2.7rem;
        }
      }
    }
  }
}

.bottom {
  position: relative;

  img {
    width: 100%;
    height: 98rem;
    object-fit: cover;
  }

  h1 {
    color: var(--color-white);
    position: absolute;
    font-size: 8rem;
    font-weight: 700;
    line-height: 100%;
    top: 33.7rem;
    left: 50%;
    transform: translateX(-50%);
  }

  p {
    color: var(--color-white);
    position: absolute;
    max-width: 70.4rem;
    font-size: 2.4rem;
    font-weight: 700;
    line-height: 150%;
    right: 24.2rem;
    bottom: 24.4rem;
    letter-spacing: -0.05rem;
  }
}

@media screen and (max-width: 768px) {
  .container {
    padding-top: 3.2rem;
    padding-bottom: 4rem;
  }

  h1 {
    font-size: 4.2rem;
    padding: 2rem;
  }

  h2 {
    font-size: 3.2rem;
    font-weight: 700;
    line-height: 150%;

    &.mo24 {
      font-size: 2.4rem;
    }
  }

  h3 {
    font-size: 2rem;
    line-height: 150%;
    padding-bottom: 1.3rem;
    border-bottom: 1px solid var(--color-default);
    margin-bottom: 1.2rem;

    span {
      font-size: 1.8rem;
      margin-right: 0.8rem;
    }
  }

  p {
    font-size: 1.4rem;
    letter-spacing: -0.05rem;

    & + p {
      margin-top: 1.4rem;
    }
  }

  section {
    margin-bottom: 4rem;
  }

  .banner {
    margin-left: -2rem;
    margin-right: -2rem;

    img {
      height: 76rem;
      object-fit: cover;
    }
  }

  .intro {
    flex-direction: column;
    gap: 2.8rem;

    .left {
      order: 1;
    }

    .right {
      width: auto;
      height: 22rem;

      img {
        width: 12rem;
      }
    }
  }

  .history {
    h2 {
      margin-bottom: 2rem;
    }

    .grid {
      grid-template-columns: 1fr;
      row-gap: 4rem;

      img {
        aspect-ratio: 32/22;
        margin-bottom: 2.4rem;
      }
    }
  }

  .build {
    border-top: 0;
    padding-top: 0;

    .top {
      flex-direction: column;
      gap: 2.8rem;
      margin-bottom: 4rem;

      .left {
        order: 1;

        h2 {
          margin-bottom: 2rem;
        }
      }

      .right {
        width: auto;
        padding: 3.5rem 0.6rem;

        img {
          width: 100%;
        }
      }
    }

    .grid {
      grid-template-columns: 1fr;
      row-gap: 4rem;

      img {
        aspect-ratio: 32/22;
        margin-bottom: 2.4rem;
      }
    }
  }

  .space {
    border-top: 1px solid var(--color-default);
    padding-top: 2rem;

    .top {
      max-width: 78rem;
      margin-bottom: 2rem;

      h2 {
        margin-bottom: 2rem;
      }
    }

    .grid {
      row-gap: 2rem;
      grid-template-columns: 1fr;

      img {
        aspect-ratio: 32/22;
      }
    }
  }

  .slogan {
    padding-top: 2rem;

    .top {
      margin-bottom: 2rem;

      h2 {
        margin-bottom: 2rem;
      }
    }

    .grid {
      row-gap: 2rem;
      grid-template-columns: 1fr;

      div {
        aspect-ratio: 32/22;
        padding: 2.4rem;

        h4 {
          font-weight: 500;
          line-height: 150%;
          margin-bottom: 0.8rem;
        }

        &:nth-child(1) {
          img {
            width: 18.75%;
            right: 2.7rem;
          }
        }
        &:nth-child(2) {
          img {
            width: 16.25%;
            right: 1.5rem;
          }
        }
        &:nth-child(3) {
          img {
            width: 36.25%;
            right: 2.7rem;
          }
        }
      }
    }
  }

  .bottom {
    img {
      height: 76rem;
    }

    h1 {
      font-size: 5.2rem;
      line-height: 150%;
      top: 12rem;
      left: 0;
      transform: translateX(0);
    }

    p {
      font-size: 1.6rem;
      font-weight: 500;
      line-height: 160%;
      right: 0;
      bottom: 12rem;
      padding: 0 2rem;
    }
  }
}
</style>
