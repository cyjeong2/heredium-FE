<template>
  <footer>
    <div class="footer mo" :class="{ mb: $store.state.isHasBottomMenu }">
      <div class="footer-top">
        <a class="logo" @click="goHome">
          <img src="~assets/img/mobile/logo_footer_m.png" alt="로고" width="81.5" height="40" />
        </a>
        <div class="sns-area">
          <a href="https://www.instagram.com/heredium.official/" target="_blank">
            <img src="~assets/img/mobile/instagram.svg" alt="인스타 바로가기" />
          </a>
          <a href="https://www.facebook.com/hashtag/heredium" target="_blank">
            <img src="~assets/img/mobile/facebook.svg" alt="페이스북 바로가기" />
          </a>
          <a href="https://www.youtube.com/@LetsClay1021" target="_blank">
            <img src="~assets/img/mobile/youtube.svg" alt="유튜브 바로가기" />
          </a>
        </div>
      </div>
      <div class="footer-bottom">
        <div v-if="!($store.state.deviceInfo.isApp && $store.state.deviceInfo.isIOS)" class="app-download">
          <p class="install">Install the app</p>
          <div>
            <a
              href="https://apps.apple.com/us/app/%ED%97%A4%EB%A0%88%EB%94%94%EC%9B%80/id1659816022"
              class="app-store"
              target="_blank"
            >
              <img src="~assets/img/mobile/apple.svg" alt="앱스토어 바로가기" width="18" height="18" />
              <span class="apple">App Store</span></a
            >
            <a href="https://play.google.com/store/apps/details?id=heredium.art.app" target="_blank">
              <img src="~assets/img/mobile/google.svg" alt="구글플레이앱 바로가기" width="18" height="18" />
              <span class="google">Google Play</span>
            </a>
          </div>
        </div>
        <div class="contact-area">
          <p>Contact</p>
          <address>주소 : 대전광역시 동구 대전로 735(인동)</address>
          <address>735, Daejeon-ro, Dong-gu, Daejeon, 34631,<br>Rep. of KOREA</address>
          <address>운영시간 : 수요일-일요일 / 11:00~19:00<br />(월·화요일 휴관)</address>
          <address class="tel">
            <a href="tel:0507-1422-2075">T. 0507-1422-2075</a>
          </address>
          <address><a href="mailto:info@cncitymaum.org">info@cncitymaum.org</a></address>
        </div>
        <div class="terms">
          <p>Resources</p>
          <div>
            <NuxtLink to="/terms/privacy" class="bold-500">개인정보처리방침</NuxtLink>
            <NuxtLink to="/terms/service">서비스이용약관</NuxtLink>
            <NuxtLink to="/terms/video">영상정보처리기기 운영방침</NuxtLink>
          </div>
        </div>
        <div class="info-area">
          <p>Information</p>
          <span>재단법인 씨엔씨티마음에너지재단</span>
          <span>사업자등록번호 : 119-82-12067</span>
          <span>통신판매업신고번호 : 제 2023-대전동구-0203호</span>
          <span>대표자 : 황인규</span>
        </div>
        <p class="copyright">Copyright © 2022. Heredium. All rights reserved.</p>
      </div>
    </div>
    <div class="footer pc">
      <div class="footer-left">
        <a class="logo" @click="goHome">
          <img src="~assets/img/pc/logo.svg" alt="로고" width="139" height="68" />
        </a>
        <p class="copyright">Copyright © 2022. Heredium. All rights reserved.</p>
      </div>
      <div class="footer-center">
        <div v-if="!($store.state.deviceInfo.isApp && $store.state.deviceInfo.isIOS)" class="app-area">
          <p>Install the app</p>
          <a
            href="https://apps.apple.com/us/app/%ED%97%A4%EB%A0%88%EB%94%94%EC%9B%80/id1659816022"
            class="link-area"
            target="_blank"
          >
            <img src="~assets/img/pc/apple.svg" alt="앱스토어 바로가기" width="22" height="22" />
            <span>App Store</span>
          </a>
          <a href="https://play.google.com/store/apps/details?id=heredium.art.app" class="link-area" target="_blank">
            <img src="~assets/img/pc/google.svg" alt="구글플레이앱 바로가기" width="26" height="26" />
            <span>Google Play</span>
          </a>
        </div>
        <div class="contact-area">
          <p>Contact</p>
          <address class="address">주소 : 대전광역시 동구 대전로 735(인동)</address>
          <address class="address">735, Daejeon-ro, Dong-gu, Daejeon, 34631,<br>Rep. of KOREA</address>
          <address>운영시간 : 수요일-일요일 / 11:00~19:00<br />(월·화요일 휴관)</address>
          <address class="tel">
            <a href="tel:0507-1422-2075">T. 0507-1422-2075</a>
          </address>
          <address><a href="mailto:info@cncitymaum.org">info@cncitymaum.org</a></address>
          <div class="sns-area">
            <a href="https://www.instagram.com/heredium.official/" target="_blank">
              <img src="~assets/img/pc/instagram.svg" alt="인스타 바로가기" />
            </a>
            <a href="https://www.facebook.com/hashtag/heredium" target="_blank">
              <img src="~assets/img/pc/facebook.svg" alt="페이스북 바로가기" />
            </a>
            <a href="https://www.youtube.com/@LetsClay1021" target="_blank">
              <img src="~assets/img/pc/youtube.svg" alt="유튜브 바로가기" />
            </a>
          </div>
        </div>
        <div class="resources-area">
          <p>Resources</p>
          <NuxtLink to="/terms/privacy" class="bold-500">개인정보처리방침</NuxtLink>
          <NuxtLink to="/terms/service">서비스이용약관</NuxtLink>
          <NuxtLink to="/terms/video">영상정보처리기기 운영방침</NuxtLink>
        </div>
        <div class="info-wrap">
          <p>Information</p>
          <span>재단법인 씨엔씨티마음에너지재단</span>
          <span>사업자등록번호 : 119-82-12067</span>
          <span>통신판매업신고번호 : 제 2023-대전동구-0203호</span>
          <span>대표자 : 황인규</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterBase',
  data() {
    return {
      innerWidth: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleResize);
    });

    this.handleResize();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.innerWidth = window.innerWidth;
    },
    goHome() {
      const isApp = this.$store.state.deviceInfo?.isApp;
      const currentRoute = this.$route.path;

      if (currentRoute === '/' || currentRoute === '/app') {
        window.location.reload(true);
      } else {
        this.$router.push(isApp ? '/app' : '/');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
footer {
  position: relative;
  width: 100%;
  height: auto;
  background-color: var(--color-white);
  border-top: 1px solid #111111;

  .footer-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.8rem 2rem;
    border-bottom: 1px solid var(--color-grey-2);

    .sns-area {
      display: flex;
      align-items: center;

      a {
        margin-right: 2rem;

        &:last-of-type {
          margin-right: 0;
        }
      }
    }
  }

  .footer-bottom {
    padding: 2.4rem 2rem;

    .install {
      margin-bottom: -1.9rem;
    }

    .apple {
      margin-top: 0.3rem;
    }

    .google {
      margin-top: 0.2rem;
    }

    p {
      margin-bottom: 1.6rem;
      font-size: 1.2rem;
      font-weight: 500;
      color: var(--color-grey-3);

      &.copyright {
        margin-top: 3.2rem;
        margin-bottom: 0;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1rem;
        color: var(--color-u-grey-4);
      }
    }

    span,
    address,
    a {
      font-style: normal;
      margin-bottom: 1.2rem;
      font-size: 1.2rem;
      font-weight: 400;
      line-height: 1.2rem;

      &:last-of-type {
        margin-bottom: 0;
      }

      &.tel {
        a {
          &:first-of-type {
            position: relative;
            padding-right: 1rem;
          }
        }
      }
    }

    .info-area,
    .contact-area {
      display: flex;
      flex-direction: column;
      margin-bottom: 3.2rem;
    }

    .app {
      a {
        display: flex;
        align-items: center;

        &.app-store {
          margin-bottom: 0;
        }
        img {
          margin-right: 0.8rem;
        }
      }
    }
  }

  .logo {
    cursor: pointer;
  }
}

.bold-400 {
  font-weight: 400 !important;
}

.bold-500 {
  font-weight: 500 !important;
}

.mo {
  display: block !important;

  .footer-bottom {
    .app-download {
      margin-bottom: 3rem;

      p {
        margin-bottom: 1.2rem;
      }

      > div {
        display: flex;
      }

      a {
        display: flex;

        &:first-child {
          margin-right: 2.4rem;
        }
      }
    }

    .terms {
      margin-bottom: 2.8rem;

      > div {
        display: flex;
        flex-direction: column;
      }
    }

    .info-area {
      margin-bottom: 4.7rem;
    }
  }

  &.mb {
    margin-bottom: 7.2rem;
  }
}
.pc {
  display: none !important;
}

@media screen and(min-width: 1025px) {
  .mo {
    display: none !important;
  }

  .pc {
    display: flex !important;
  }
  footer {
    .footer {
      display: flex;
      padding: 2rem 2.8rem;
      max-width: 1920px;
      margin: 0 auto;
    }

    .footer-left {
      display: flex;
      flex-direction: column;
      width: 20%;

      p {
        margin-top: 3.8rem;
        font-size: 1.4rem;
        font-weight: 400;
        line-height: 150%;
        color: var(--color-u-grey-4);
      }
    }

    .footer-center {
      display: flex;
      justify-content: space-evenly;
      width: 80%;

      .info-wrap {
        display: flex;
        flex-direction: column;
        p {
          margin-top: 0.7rem;
          margin-bottom: 1.4rem;
          font-size: 1.4rem;
          font-weight: 400;
          line-height: 160%;
          color: var(--color-u-grey-3);
        }

        span {
          margin-bottom: 1rem;
          font-size: 1.4rem;
          font-weight: 400;
          line-height: 150%;
          letter-spacing: 0.025rem;
          color: var(--color-u-grey-4);

          &:last-of-type {
            margin-bottom: 0;
          }
        }
      }

      .contact-area,
      .resources-area,
      .app-area {
        display: flex;
        flex-direction: column;

        .sns-area {
          display: flex;
          margin-top: 1.2rem;
          a {
            margin-right: 1.6rem;

            &:last-of-type {
              margin-right: 0;
            }
          }
        }
        .link-area {
          display: flex;
          align-items: center;

          &:first-of-type {
            span {
              line-height: 1;
              margin-left: 0.9rem;
            }
          }

          &:last-of-type {
            span {
              line-height: 1;
              margin-left: 0.7rem;
            }
          }
        }

        p {
          margin-top: 0.7rem;
          margin-bottom: 1.4rem;
          font-size: 1.4rem;
          font-weight: 400;
          line-height: 160%;
          color: var(--color-u-grey-3);
        }

        span,
        address,
        a {
          font-style: normal;
          margin-bottom: 1rem;
          font-size: 1.4rem;
          font-weight: 400;
          line-height: 150%;
          color: var(--color-u-grey-4);

          &:last-of-type {
            margin-bottom: 0;
          }

          &.address {
            margin-top: -0.3rem;
            font-size: 1.4rem;
            line-height: 150%;
          }

          &.tel {
            a {
              &:first-of-type {
                position: relative;
                padding-right: 1rem;
              }
            }
          }
        }
      }
    }
  }
}
</style>
