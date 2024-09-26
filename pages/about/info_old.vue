<template>
  <div class="interaction-container">
    <section ref="scrollSection0" class="scroll-section-0">
      <div ref="doorWrap" class="door-wrap">
        <div class="door-area">
          <div ref="doorLeft" class="door left"></div>
          <div ref="doorRight" class="door right"></div>
          <div ref="doorBg" class="bg-img"></div>
        </div>
      </div>
      <div class="img-area">
        <img src="~assets/img/pc/interaction_logo.svg" alt="" width="271" height="169" />
      </div>
      <div v-if="currentScrollPosition === 0" class="arrow-area">
        <img class="scroll-bottom" src="~assets/img/scroll_bottom.svg" alt="" />
        <img class="scroll-bottom2" src="~assets/img/scroll_bottom.svg" alt="" />
      </div>
    </section>
    <section ref="scrollSection1" class="scroll-section-1">
      <div class="section-container">
        <div class="txt-area">
          <div ref="titleMessage1" class="sticky title-message">
            <h2>헤레디움</h2>
          </div>
          <div ref="subMessage1" class="sticky sub-txt">
            <h2>Historic Cultural Space, HEREDIUM</h2>
          </div>
        </div>
      </div>
    </section>
    <section ref="scrollSection2" class="scroll-section-2">
      <div class="section-container">
        <div class="txt-area">
          <div ref="titleMessage2" class="sticky title-message">
            <h2>
              물려받은 유산,<br />
              그 위에 문화예술의<br class="only-mobile" />
              새로운 역사가 쓰입니다.
            </h2>
          </div>
          <div ref="subMessage2" class="sticky sub-txt">
            <p>
              지나간 역사의 기록과 문화재 복원을 넘어<br class="only-pc" />
              수준높은 전시와 클래식 공연 등을 통해<br class="only-pc" />
              동시대의 예술적 영감과 희망을 전달하는 복합문화예술 공간으로<br class="only-pc" />
              대전의 미래유산을 위한 새로운 100년을 시작합니다.
            </p>
          </div>
        </div>
      </div>
      <div class="bg-wrap">
        <div class="bg"></div>
      </div>
    </section>
    <section ref="scrollSection3" class="scroll-section-3">
      <div class="section-container">
        <div class="txt-area">
          <h3>1922년 동양척식주식회사</h3>
          <p>
            1922년 일제 강점기, 조선의 토지와 자원 수탈을 위해 인동에 지어진 동양척식회사 대전지점은 일본 건축가
            오쿠라쿠미가 설계한 건물로 철근콘크리트와 붉은 벽돌 그리고 경사지붕으로 구성된 2층 규모의 절충주의 서양식
            건축양식이 특징입니다. 이 건물은 해방이후 대전 체신청과 대전 전신 전화국으로 사용되었다가 1984년 민간에
            매각되어 상업시설로 사용되었고 2004년 9월 근대 건축물로 그 가치가 인정되어 국가 등록문화재 제 98호로
            지정되었습니다. 지나간 역사의 기록과 문화재 복원을 넘어 수준높은 전시와 클래식 공연 등을 통해 동시대의
            예술적 영감과 희망을 전달하는 복합문화예술공간으로 대전의 미래유산을 위한 새로운 100년을 시작합니다.
          </p>
        </div>
        <div class="img-wrap">
          <div class="img-area">
            <picture>
              <source srcset="~/assets/img/mobile/img_interaction_3.png" media="(max-width: 640px)" type="image/png" />
              <source srcset="~/assets/img/pc/img_interaction_3.png" media="(min-width: 769px)" type="image/png" />
              <source srcset="~/assets/img/pc/img_interaction_3.png" type="image/png" />
              <img srcset="~/assets/img/pc/img_interaction_3.png" alt="헤레디움 일러스트" width="668" height="473" />
            </picture>
            <p>1922년 건립 당시 동양척식회사 대전지점의 모습</p>
          </div>
          <div class="img-area">
            <picture>
              <source srcset="~/assets/img/mobile/img_interaction_4.png" media="(max-width: 640px)" type="image/png" />
              <source srcset="~/assets/img/pc/img_interaction_4.png" media="(min-width: 769px)" type="image/png" />
              <source srcset="~/assets/img/pc/img_interaction_4.png" type="image/png" />
              <img srcset="~/assets/img/pc/img_interaction_4.png" alt="헤레디움 일러스트" width="668" height="473" />
            </picture>
            <p>1980년대 동양척식회사 대전지점의 모습</p>
          </div>
          <div class="img-area">
            <picture>
              <source srcset="~/assets/img/mobile/img_interaction_5.png" media="(max-width: 640px)" type="image/png" />
              <source srcset="~/assets/img/pc/img_interaction_5.png" media="(min-width: 769px)" type="image/png" />
              <source srcset="~/assets/img/pc/img_interaction_5.png" type="image/png" />
              <img srcset="~/assets/img/pc/img_interaction_5.png" alt="헤레디움 일러스트" width="668" height="473" />
            </picture>
            <p>2020년 동양척식회사 대전지점의 모습</p>
          </div>
        </div>
      </div>
    </section>
    <section ref="scrollSection4" class="scroll-section-4">
      <div class="section-container">
        <div class="txt-area">
          <div ref="titleMessage4" class="sticky title-message">
            <h2>HEREDIUM</h2>
          </div>
          <div ref="subMessage4" class="sticky sub-txt">
            <p>
              2019년부터 여러 고증자료를 토대로 전문가들과 함께 협업하여 2022년 12월, 지역사회와 미래세대를 위한
              문화예술공간, ‘헤레디움’으로 새로운 100년을 열었습니다.
            </p>
          </div>
        </div>
      </div>
      <div class="bg-wrap">
        <div class="bg"></div>
      </div>
    </section>
  </div>
</template>

<script>
/**
 * 하나은행을 진행하면서 인포페이지를 변경해달라는 요청이 와서 이 페이지는 old로 변경해두었습니다
 * 다만 롤백 가능성이 있어서 이렇게 해두었습니다. 따로 리다이렉트 처리는 해두지 않았습니다.
 * 인터렉션 페이지이며 이전 진재윤 주임님이 진행하였습니다.
 */

export default {
  name: 'InfoPage',
  data() {
    return {
      prevScrollHeight: 0,
      currentSection: 0,
      currentScrollPosition: 0,
      currentYOffset: 0,
      prevWidth: 0,
      headerHeight: 0,
      enterSec: false,
      scrollInfo: [
        {
          container: null,
          doorTransY: 15.9
        },
        {
          container: null
        },
        {
          container: null
        },
        {
          container: null
        },
        {
          container: null
        }
      ]
    };
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.viewportSetting);
      window.addEventListener('scroll', this.dataProgressSetting);
      window.addEventListener('scroll', this.dataSectionProgressSetting);
    });
    this.viewportSetting();
    this.dataProgressSetting();
    this.dataSectionProgressSetting();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.viewportSetting);
    window.removeEventListener('scroll', this.dataProgressSetting);
    window.removeEventListener('scroll', this.dataSectionProgressSetting);
  },
  methods: {
    playAnimation() {
      if (this.enterSec) return;
      const tablet = 1024;
      const dataSet = this.scrollInfo[this.currentSection]?.container.dataset.sectionProgress;
      switch (this.currentSection) {
        case 0:
          break;
        case 1:
          if (window.innerWidth > tablet) {
            this.$refs.doorWrap.style.opacity = 1;
            this.$refs.titleMessage4.style.opacity = 1;
            this.$refs.subMessage4.style.opacity = 1;
            if (dataSet < 0.4) {
              this.$refs.titleMessage1.style.opacity = this.ratioStyleCalc(this.currentYOffset, 0, 1, 0.35, 0.4);
              this.$refs.titleMessage1.style.fontSize = `${this.ratioStyleCalc(
                this.currentYOffset,
                8,
                8,
                0.35,
                0.4
              )}rem`;
            } else {
              this.$refs.titleMessage1.style.opacity = this.ratioStyleCalc(this.currentYOffset, 1, 0, 0.45, 0.55);
              this.$refs.titleMessage1.style.fontSize = `${this.ratioStyleCalc(
                this.currentYOffset,
                8,
                48,
                0.45,
                0.55
              )}rem`;
              this.$refs.titleMessage1.style.top = `calc(50vh - ${this.ratioStyleCalc(
                this.currentYOffset,
                8,
                48,
                0.45,
                0.55
              )}rem)`;
            }
          } else if (window.innerWidth < tablet) {
            if (dataSet < 0.4) {
              this.$refs.titleMessage1.style.opacity = this.ratioStyleCalc(this.currentYOffset, 0, 1, 0.35, 0.4);
              this.$refs.titleMessage1.style.fontSize = `${this.ratioStyleCalc(
                this.currentYOffset,
                3,
                3,
                0.35,
                0.4
              )}rem`;
            } else {
              this.$refs.titleMessage1.style.opacity = this.ratioStyleCalc(this.currentYOffset, 1, 0, 0.45, 0.55);
              this.$refs.titleMessage1.style.fontSize = `${this.ratioStyleCalc(
                this.currentYOffset,
                3,
                5.2,
                0.45,
                0.55
              )}rem`;
              this.$refs.titleMessage1.style.top = `calc(50vh - ${this.ratioStyleCalc(
                this.currentYOffset,
                5.2,
                8,
                0.45,
                0.55
              )}rem)`;
            }
          }
          this.$refs.doorWrap.style.opacity = 1;
          this.$refs.doorBg.style.opacity = 1;
          this.$refs.doorWrap.style.top = `calc(${this.ratioStyleCalc(
            this.currentYOffset,
            50,
            50,
            0,
            0.3
          )}vh + ${this.ratioStyleCalc(this.currentYOffset, 15.9, 0, 0, 0.3)}rem)`;
          this.$refs.doorLeft.style.height = `${this.ratioStyleCalc(this.currentYOffset, 5.8, 100, 0, 0.3)}vh`;
          this.$refs.doorRight.style.height = `${this.ratioStyleCalc(this.currentYOffset, 5.8, 100, 0, 0.3)}vh`;
          this.$refs.doorLeft.style.width = `${this.ratioStyleCalc(this.currentYOffset, 1.55, 0, 0, 0)}rem`;
          this.$refs.doorRight.style.width = `${this.ratioStyleCalc(this.currentYOffset, 1.55, 0, 0, 0)}rem`;
          this.$refs.doorBg.style.width = `${this.ratioStyleCalc(this.currentYOffset, 0.8, 100, 0.1, 0.3)}vw`;
          this.$refs.doorBg.style.height = `${this.ratioStyleCalc(this.currentYOffset, 5.8, 100, 0, 0.3)}vh`;
          this.$refs.doorLeft.style.transform = `translate3d(${this.ratioStyleCalc(
            this.currentYOffset,
            0,
            2.5,
            0,
            0.3
          )}vw, 0, 0)`;
          this.$refs.doorRight.style.transform = `translate3d(-${this.ratioStyleCalc(
            this.currentYOffset,
            0,
            2.5,
            0,
            0.3
          )}vw, 0, 0)`;

          this.$refs.subMessage1.style.opacity = this.ratioStyleCalc(this.currentYOffset, 0, 1, 0.55, 0.65);
          this.$refs.subMessage1.style.transform = `translate3d(0, ${this.ratioStyleCalc(
            this.currentYOffset,
            20,
            0,
            0.55,
            0.65
          )}%, 0)`;

          this.$refs.titleMessage4.style.opacity = 0;
          this.$refs.subMessage4.style.opacity = 0;
          this.$refs.titleMessage4.style.transform = 'translate3d(0, 0, 0)';
          this.$refs.subMessage4.style.transform = 'translate3d(0, 0, 0)';
          this.$refs.titleMessage2.style.opacity = 0;
          this.$refs.subMessage2.style.opacity = 0;
          this.$refs.titleMessage2.style.transform = 'translate3d(0,0,0)';
          this.$refs.subMessage2.style.transform = 'translate3d(0,0,0)';
          break;
        case 2:
          if (window.innerWidth > tablet) {
            this.$refs.doorWrap.style.opacity = 1;
            this.$refs.titleMessage4.style.opacity = 1;
            this.$refs.subMessage4.style.opacity = 1;
          }
          this.$refs.doorWrap.style.opacity = 1;
          if (dataSet < 0.25) {
            this.$refs.titleMessage2.style.opacity = this.ratioStyleCalc(this.currentYOffset, 0, 1, 0.1, 0.2);
            this.$refs.titleMessage2.style.transform = `translate3d(0, ${this.ratioStyleCalc(
              this.currentYOffset,
              20,
              0,
              0.1,
              0.2
            )}%, 0)`;
          } else {
            this.$refs.titleMessage2.style.opacity = this.ratioStyleCalc(this.currentYOffset, 1, 0, 0.3, 0.4);
            this.$refs.titleMessage2.style.transform = `translate3d(0, ${this.ratioStyleCalc(
              this.currentYOffset,
              0,
              -20,
              0.3,
              0.4
            )}%, 0)`;
          }

          this.$refs.subMessage2.style.opacity = this.ratioStyleCalc(this.currentYOffset, 0, 1, 0.45, 0.55);
          this.$refs.subMessage2.style.transform = `translate3d(0, ${this.ratioStyleCalc(
            this.currentYOffset,
            20,
            0,
            0.45,
            0.55
          )}%, 0)`;
          this.$refs.titleMessage4.style.opacity = 0;
          this.$refs.subMessage4.style.opacity = 0;
          this.$refs.titleMessage4.style.transform = 'translate3d(0, 0, 0)';
          this.$refs.subMessage4.style.transform = 'translate3d(0, 0, 0)';
          break;
        case 3:
          if (window.innerWidth > tablet) {
            this.$refs.doorWrap.style.opacity = 1;
            this.$refs.titleMessage4.style.opacity = 1;
            this.$refs.subMessage4.style.opacity = 1;
          } else {
            this.$refs.doorWrap.style.opacity = 1;
            this.$refs.titleMessage4.style.opacity = 0;
            this.$refs.subMessage4.style.opacity = 0;
            this.$refs.titleMessage4.style.transform = 'translate3d(0, 0, 0)';
            this.$refs.subMessage4.style.transform = 'translate3d(0, 0, 0)';
          }
          break;
        case 4:
          if (window.innerWidth > tablet) {
            this.$refs.doorWrap.style.opacity = 0;
            this.$refs.titleMessage4.style.opacity = 1;
            this.$refs.subMessage4.style.opacity = 1;
          } else {
            this.$refs.doorWrap.style.opacity = 0;
            this.$refs.titleMessage4.style.opacity = this.ratioStyleCalc(this.currentYOffset, 0, 1, 0.1, 0.3);
            this.$refs.titleMessage4.style.transform = `translate3d(0, ${this.ratioStyleCalc(
              this.currentYOffset,
              20,
              0,
              0.1,
              0.3
            )}%, 0)`;
            this.$refs.subMessage4.style.opacity = this.ratioStyleCalc(this.currentYOffset, 0, 1, 0.35, 0.55);
            this.$refs.subMessage4.style.transform = `translate3d(0, ${this.ratioStyleCalc(
              this.currentYOffset,
              20,
              0,
              0.35,
              0.55
            )}%, 0)`;
          }
          break;
      }
    },
    ratioStyleCalc(currentYOffset, minValue, maxValue, startValue, endValue) {
      let result;

      const scrollHeight = this.scrollInfo[this.currentSection]?.container.scrollHeight;
      const scrollStart = startValue * scrollHeight;
      const scrollEnd = endValue * scrollHeight;
      const scrollProgress = scrollEnd - scrollStart;
      currentYOffset = this.currentScrollPosition - this.prevScrollHeight - this.headerHeight;
      this.currentYOffset = currentYOffset;

      if (currentYOffset >= scrollStart && currentYOffset <= scrollEnd) {
        result = ((currentYOffset - scrollStart) / scrollProgress) * (maxValue - minValue) + minValue;
      }
      if (currentYOffset < scrollStart) {
        result = minValue;
      }
      if (currentYOffset > scrollEnd) {
        result = maxValue;
      }

      return result;
    },
    dataSectionProgressSetting() {
      this.prevScrollHeight = 0;
      this.headerHeight = document.querySelector('header').offsetHeight;
      this.currentScrollPosition = window.scrollY;
      if (this.enterSec) this.enterSec = false;

      for (let i = 0; i < this.currentSection; i++) {
        this.prevScrollHeight += this.scrollInfo[i].container.scrollHeight;
      }

      const scrollInfoScrollHeight = this.scrollInfo[this.currentSection]?.container.scrollHeight;
      const currentYOffset = this.currentScrollPosition - this.prevScrollHeight;
      const scrollRatio = currentYOffset / (scrollInfoScrollHeight + this.headerHeight);
      this.scrollInfo[this.currentSection]?.container.setAttribute('data-section-progress', scrollRatio);

      if (
        this.currentScrollPosition >
        this.scrollInfo[this.currentSection]?.container.scrollHeight + this.prevScrollHeight + this.headerHeight
      ) {
        this.scrollInfo[this.currentSection]?.container.setAttribute('data-section-progress', 1);
        this.currentSection++;
        this.enterSec = true;
        document.body.setAttribute('id', `show-current-${this.currentSection}`);
      }

      if (this.currentScrollPosition < this.prevScrollHeight + this.headerHeight) {
        if (this.currentSection === 0) return;
        this.scrollInfo[this.currentSection]?.container.setAttribute('data-section-progress', 0);
        this.currentSection--;
        this.enterSec = true;
        document.body.setAttribute('id', `show-current-${this.currentSection}`);
      }
      if (this.currentScrollPosition < window.innerHeight) this.resetAnimate();
      else this.playAnimation();
    },
    dataProgressSetting() {
      const viewportRatio = window.scrollY / (document.body.clientHeight - window.innerHeight);
      document.documentElement.setAttribute('data-progress', viewportRatio);
      document.body.setAttribute('id', `show-current-${this.currentSection}`);
    },
    viewportSetting() {
      const vh = window.innerHeight * 0.01;
      const vw = window.innerWidth * 0.01;
      const fh = document.querySelector('footer').offsetHeight;
      document.documentElement.style.setProperty('--footer-height', `${fh}px`);
      if (this.prevWidth !== window.innerWidth) {
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        document.documentElement.style.setProperty('--vw', `${vw}px`);
      }
      this.prevWidth = window.innerWidth;
      this.scrollInfo.forEach((section, index) => {
        this.scrollInfo[index].container = this.$refs[`scrollSection${index}`];
      });
    },
    resetAnimate() {
      const tablet = 1025;
      if (window.innerWidth > tablet) {
        this.$refs.titleMessage4.style.opacity = 1;
        this.$refs.subMessage4.style.opacity = 1;
        this.$refs.titleMessage2.style.opacity = 0;
        this.$refs.subMessage2.style.opacity = 0;
        this.$refs.titleMessage2.style.transform = 'translate3d(0,0,0)';
        this.$refs.subMessage2.style.transform = 'translate3d(0,0,0)';
        this.$refs.doorWrap.style.opacity = 1;
        this.$refs.doorWrap.style.opacity = 1;
        this.$refs.doorWrap.style.top = `calc(50vh + ${this.scrollInfo[0].doorTransY}rem)`;
        this.$refs.doorLeft.style.height = '5.8rem';
        this.$refs.doorRight.style.height = '5.8rem';
        this.$refs.doorLeft.style.width = '1.55rem';
        this.$refs.doorRight.style.width = '1.55rem';
        this.$refs.doorLeft.style.transform = 'translate3d(0, 0, 0)';
        this.$refs.doorRight.style.transform = 'translate3d(0, 0, 0)';
        this.$refs.doorBg.style.opacity = 0;
        this.$refs.doorBg.style.width = '3.1rem';
        this.$refs.doorBg.style.height = '5.8rem';
      } else {
        this.$refs.titleMessage4.style.opacity = 0;
        this.$refs.subMessage4.style.opacity = 0;
        this.$refs.titleMessage4.style.transform = 'translate3d(0, 0, 0)';
        this.$refs.subMessage4.style.transform = 'translate3d(0, 0, 0)';
        this.$refs.titleMessage2.style.opacity = 0;
        this.$refs.subMessage2.style.opacity = 0;
        this.$refs.titleMessage2.style.transform = 'translate3d(0,0,0)';
        this.$refs.subMessage2.style.transform = 'translate3d(0,0,0)';
        this.$refs.doorWrap.style.opacity = 1;
        this.$refs.doorWrap.style.opacity = 1;
        this.$refs.doorWrap.style.top = `calc(var(--vh, 1vh) * 50 + 11.6rem)`;
        this.$refs.doorLeft.style.height = '5.8rem';
        this.$refs.doorRight.style.height = '5.8rem';
        this.$refs.doorLeft.style.width = '1.55rem';
        this.$refs.doorRight.style.width = '1.55rem';
        this.$refs.doorLeft.style.transform = 'translate3d(0, 0, 0)';
        this.$refs.doorRight.style.transform = 'translate3d(0, 0, 0)';
        this.$refs.doorBg.style.opacity = 0;
        this.$refs.doorBg.style.width = '3.1rem';
        this.$refs.doorBg.style.height = '5.8rem';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#show-current-0 .scroll-section-0 .sticky,
#show-current-1 .scroll-section-1 .sticky,
#show-current-2 .scroll-section-2 .sticky,
#show-current-3 .scroll-section-3 .sticky,
#show-current-4 .scroll-section-4 .sticky,
#show-current-5 .scroll-section-5 .sticky {
  display: block;
  will-change: transform, opacity, contents, scroll-position;
}

.interaction-container {
  -webkit-overflow-scrolling: auto;

  .section-container {
    padding: 0 2rem;
  }

  .sticky {
    display: none;
    position: fixed;
  }

  .door-wrap {
    z-index: -1;
    position: fixed;
    top: calc(var(--vh, 1vh) * 50 + 11.6rem);
    transform: translateY(-50%);
    will-change: transform, opacity, contents, scroll-position;

    .door-area {
      display: flex;

      .door {
        z-index: 1;
        width: 1.55rem;
        height: 5.8rem;
        background-color: #1d1d1b;
      }

      .bg-img {
        opacity: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 3.1rem;
        height: 5.8rem;
        background-image: url('~assets/img/pc/img_interaction_1.png');
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: cover;
      }
    }
  }

  .arrow-area {
    overflow: hidden;
    position: absolute;
    bottom: 13.4rem;
    width: 4rem;
    height: 4rem;
    .scroll-bottom {
      position: absolute;
      animation: barAnimation cubic-bezier(0.65, 0, 0.35, 1) 3s infinite;
    }

    .scroll-bottom2 {
      position: absolute;
      animation: barAnimation2 cubic-bezier(0.65, 0, 0.35, 1) 3s infinite;
    }
  }

  @keyframes barAnimation {
    0% {
      transform: translate3d(0, -100%, 0);
    }
    50% {
      transform: translate3d(0, 0%, 0);
    }
    100% {
      transform: translate3d(0, 0%, 0);
    }
  }

  @keyframes barAnimation2 {
    0% {
      transform: translate3d(0, 0%, 0);
    }
    50% {
      transform: translate3d(0, 100%, 0);
    }
    100% {
      transform: translate3d(0, 100%, 0);
    }
  }

  .scroll-section-0 {
    position: relative;
    height: calc(var(--vh, 1vh) * 100);
  }
  .scroll-section-1 {
    position: relative;
    height: calc(var(--vh, 1vh) * 300);
  }
  .scroll-section-2 {
    z-index: 1;
    position: relative;
    height: calc(var(--vh, 1vh) * 400);
  }
  .scroll-section-3 {
    z-index: 1;
    position: relative;
    height: calc(var(--vh, 1vh) * 110);
  }
  .scroll-section-4 {
    position: relative;
    height: calc(var(--vh, 1vh) * 300);
  }

  .scroll-section-0 {
    display: flex;
    align-items: center;
    justify-content: center;

    .img-area {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }
  }

  .scroll-section-1 {
    .txt-area {
      .title-message {
        opacity: 0;
        width: 100%;
        //top: calc(var(--vh, 1vh) * 30 - 5.2rem);
        left: 0;
        right: 0;
        text-align: center;
        padding: 0;
        font-size: 3rem;
        h2 {
          font-weight: 700;
          line-height: 150%;
          letter-spacing: -1px;
          color: var(--color-white);
          word-break: keep-all;
        }
      }
      .sub-txt {
        opacity: 0;
        width: 100%;
        top: calc(var(--vh, 1vh) * 30 - 4rem);
        left: 0;
        right: 0;
        text-align: center;
        padding: 0 3.5rem;
        h2 {
          font-size: 4rem;
          font-weight: 700;
          line-height: 160%;
          color: var(--color-white);
          word-break: keep-all;
        }
      }
    }
  }

  .scroll-section-2 {
    .txt-area {
      .title-message {
        opacity: 0;
        width: 100%;
        top: calc(var(--vh, 1vh) * 40 - 3rem);
        left: 0;
        right: 0;
        text-align: center;
        padding: 0;
        h2 {
          font-size: 3rem;
          font-weight: 700;
          line-height: 150%;
          letter-spacing: -1px;
          color: var(--color-white);
          word-break: keep-all;
        }
      }
      .sub-txt {
        opacity: 0;
        width: 100%;
        top: calc(var(--vh, 1vh) * 50 - 1.6rem);
        left: 0;
        right: 0;
        text-align: center;
        padding: 0 3.5rem;
        p {
          font-size: 1.6rem;
          font-weight: 700;
          line-height: 160%;
          color: var(--color-white);
          word-break: keep-all;
        }
      }
    }
    .bg {
      background-image: url('~assets/img/pc/img_interaction_2.png');
    }
  }

  .scroll-section-3 {
    background-color: var(--color-white);

    .txt-area {
      padding: 8rem 0 4rem;
      h3 {
        padding-bottom: 2rem;
        font-size: 2.4rem;
        font-weight: 700;
        line-height: 160%;
        letter-spacing: -0.5px;
        color: var(--color-black);
        word-break: keep-all;
      }

      p {
        font-size: 1.4rem;
        font-weight: 500;
        line-height: 160%;
        text-align: left;
        color: var(--color-u-grey-4);
        word-break: keep-all;
      }
    }

    .img-wrap {
      overflow-y: hidden;
      overflow-x: scroll;
      display: flex;
      margin: 0 -2rem;
      padding: 0 2rem;

      .img-area + .img-area {
        margin-left: 1.6rem;
      }
      .img-area {
        position: relative;
        img {
          width: 23.6rem;
          height: auto;
        }
        p {
          color: var(--color-white);
          word-break: keep-all;
          position: absolute;
          bottom: 0;
          width: 100%;
          padding: 0.8rem 1.2rem;
          background: rgba(17, 17, 17, 0.25);
          -webkit-backdrop-filter: blur(2px);
          backdrop-filter: blur(2px);
          font-size: 1.2rem;
          font-weight: 500;
          line-height: 100%;
        }
      }
    }
  }

  .scroll-section-4 {
    .txt-area {
      .title-message {
        opacity: 0;
        width: 100%;
        top: calc(var(--vh, 1vh) * 8);
        left: 2rem;
        h2 {
          font-size: 5.2rem;
          font-weight: 700;
          line-height: 150%;
          letter-spacing: -1px;
          color: var(--color-white);
          word-break: keep-all;
        }
      }
      .sub-txt {
        opacity: 0;
        width: 100%;
        top: calc(var(--vh, 1vh) * 65);
        left: 0;
        right: 0;
        padding: 0 2rem;
        p {
          font-size: 1.6rem;
          font-weight: 700;
          line-height: 160%;
          color: var(--color-white);
          word-break: keep-all;
        }
      }
    }
    .bg {
      background-image: url('~assets/img/pc/img_interaction_6.png');
    }
  }

  .scroll-section-5 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--color-white);

    .img-area {
      padding-bottom: 3.2rem;
      img {
        width: 29.5rem;
        height: auto;
        margin: 0 auto;
      }
    }

    .txt-area {
      h3 {
        font-size: 2.4rem;
        font-weight: 700;
        line-height: 160%;
        text-align: center;
        letter-spacing: -0.5px;
        color: var(--color-black);
        word-break: keep-all;
      }

      p {
        padding-top: 1.6rem;
        font-size: 1.6rem;
        font-weight: 500;
        line-height: 160%;
        text-align: center;
        color: var(--color-black);
        word-break: keep-all;
      }
    }
  }

  .bg-wrap {
    z-index: -1;
    clip-path: inset(0 0 0 0);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .bg {
      position: fixed;
      display: block;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      transform: translateZ(0);
      will-change: transform;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }
}

@media screen and (min-width: 769px) {
  .interaction-container {
    .scroll-section-2 {
      .txt-area {
        .title-message {
          opacity: 0;
          width: 100%;
          top: calc(var(--vh, 1vh) * 50 - 8rem);
          left: 0;
          right: 0;
          text-align: center;
          padding: 0 2rem;
          h2 {
            font-size: 8rem;
            text-align: center;
          }
        }
        .sub-txt {
          opacity: 0;
          width: 100%;
          top: calc(var(--vh, 1vh) * 50 - 2.4rem);
          left: 0;
          right: 0;
          text-align: center;
          padding: 0 2rem;
          p {
            font-size: 2.4rem;
          }
        }
      }
    }

    .scroll-section-4 {
      z-index: 1;
      .txt-area {
        .title-message {
          width: 100%;
          top: calc(var(--vh, 1vh) * 33);
          left: 0;
          right: 0;
          h2 {
            font-size: 8rem;
            line-height: 100%;
            text-align: center;
          }
        }
        .sub-txt {
          max-width: 66.8rem;
          top: calc(var(--vh, 1vh) * 65);
          right: calc(var(--vw, 1vw) * 14);
          left: unset;
          padding: 0;
          p {
            font-size: 2.4rem;
          }
        }
      }
    }

    .scroll-section-5 {
      .img-area {
        padding-bottom: 8.4rem;
        img {
          width: auto;
        }
      }

      .txt-area {
        h3 {
          font-size: 4.2rem;
          line-height: 150%;
          letter-spacing: -1px;
        }

        p {
          padding-top: 2.6rem;
          font-size: 2.4rem;
          font-weight: 500;
          line-height: 150%;
          letter-spacing: -0.5px;
        }
      }
    }
  }
}

@media screen and (min-width: 1025px) {
  .interaction-container {
    .door-wrap {
      top: calc(50vh + 15.9rem);
    }
    .scroll-section-1 {
      .txt-area {
        .title-message {
          opacity: 0;
          width: 100%;
          top: calc(var(--vh, 1vh) * 50 - 8rem);
          left: 0;
          right: 0;
          text-align: center;
          font-size: 8rem;
          padding: 0 2rem;
          h2 {
            text-align: center;
          }
        }
        .sub-txt {
          opacity: 0;
          width: 100%;
          top: calc(var(--vh, 1vh) * 50 - 2.4rem);
          left: 0;
          right: 0;
          text-align: center;
          padding: 0 2rem;
          h2 {
            font-size: 8rem;
          }
        }
      }
    }

    .scroll-section-3 {
      height: auto;
      .section-container {
        display: flex;
      }
      .txt-area {
        position: sticky;
        top: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1 0 50%;
        width: 50%;
        height: 100vh;
        margin: 0;

        h3 {
          padding-bottom: 6.5rem;
          font-size: 4.2rem;
          line-height: 150%;
        }

        p {
          max-width: 45rem;
          font-size: 1.6rem;
          font-weight: 400;
          letter-spacing: -0.5px;
        }
      }

      .img-wrap {
        overflow-y: unset;
        overflow-x: unset;
        flex: 1 0 50%;
        width: 50%;
        flex-direction: column;
        align-items: flex-start;
        padding: 6rem 0;

        .img-area + .img-area {
          padding-top: 6rem;
          margin-left: 0;
        }
        .img-area {
          position: relative;
          img {
            width: auto;
          }
          p {
            padding: 1.1rem 2rem;
            font-size: 1.4rem;
            line-height: 160%;
          }
        }
      }
    }

    .scroll-section-4 {
      position: relative;
      height: calc(var(--vh, 1vh) * 100);

      .txt-area {
        .title-message {
          position: absolute;
          opacity: 1;
          display: block !important;
        }

        .sub-txt {
          position: absolute;
          opacity: 1;
          display: block !important;
        }
      }
    }
  }
}
</style>
