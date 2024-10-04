<template>
  <header
    :class="{
      'is-scroll':
        (innerWidth > 1024 && scroll > 0) || $route.fullPath[$route.fullPath.length - 1] !== '/' || searchWrap
    }"
  >
    <div class="header mo">
      <button v-if="isDetailPage && !menuWrap" type="button" class="nav-back-btn" @click="goPrevPage">
        <i class="m umic-arrow_backward" />
      </button>
      <button v-if="isDetailPage && menuWrap" type="button" class="nav-back-btn" @click="goPrevPage">
        <img src="~assets/img/mobile/logo_m.png" alt="로고" width="77" height="38" />
      </button>
      <a v-else-if="!isDetailPage" class="logo" @click="goHome">
        <img src="~assets/img/mobile/logo_m.png" alt="로고" width="77" height="38" />
      </a>
      <div class="options">
        <button v-if="!searchWrap" class="search-btn" @click="onSearch">
          <i class="m umic-header_search" />
        </button>
        <button class="menu-open" @click="onMenu">
          <i v-if="!searchWrap && !menuWrap" class="m umic-header_menu_open" />
          <i v-if="searchWrap || menuWrap" class="m umic-header_menu_close" />
        </button>
      </div>
    </div>
    <nav v-if="menuWrap" class="menu-wrap" :class="{ 'is-show': menuWrap }" body-scroll-lock-ignore>
      <div v-if="!userInfo" class="profile-area">
        <NuxtLink to="/auth/login">로그인</NuxtLink>
        이<br />
        필요한 서비스 입니다.
      </div>
      <div v-else class="profile-area login">
        <p>안녕하세요</p>
        <div class="login-info">
          <div>
            <p>
              <span>{{ userInfo.name }}</span
              >님
            </p>
          </div>
          <div class="user-buttons">
            <button type="button" @click="onLogout">
              <span>로그아웃</span>
            </button>
            <NuxtLink to="/mypage/purchase/all">
              <span>마이페이지</span>
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="menu-area">
        <div :class="{ 'is-active': openNav.artMuseum }" class="depth-nav">
          <button @click="isOpen('artMuseum')">
            <h2>Visit <i class="m umic-arrow_bottom" /></h2>
          </button>
          <div v-show="openNav.artMuseum" class="depth-menu">
            <NuxtLink to="/about/info" @click.native="menuOff">헤레디움</NuxtLink>
            <NuxtLink to="/about/intro" @click.native="menuOff">오시는 길</NuxtLink>
          </div>
        </div>
        <div :class="{ 'is-active': openNav.exhibition }" class="depth-nav">
          <button @click="isOpen('exhibition')">
            <h2>Exhibition <i class="m umic-arrow_bottom" /></h2>
          </button>
          <div v-show="openNav.exhibition" class="depth-menu">
            <NuxtLink to="/exhibition" @click.native="menuOff">진행 중인 전시</NuxtLink>
            <NuxtLink to="/exhibition/end" @click.native="menuOff">종료된 전시</NuxtLink>
          </div>
        </div>
        <div :class="{ 'is-active': openNav.program }" class="depth-nav">
          <button @click="isOpen('program')">
            <h2>Program <i class="m umic-arrow_bottom" /></h2>
          </button>
          <div v-show="openNav.program" class="depth-menu">
            <NuxtLink to="/program" @click.native="menuOff">진행 중인 프로그램</NuxtLink>
            <NuxtLink to="/program/end" @click.native="menuOff">종료된 프로그램</NuxtLink>
          </div>
        </div>
        <div class="depth-nav">
          <NuxtLink to="/event" @click.native="menuOff">Event</NuxtLink>
        </div>
        <div :class="{ 'is-active': openNav.community }" class="depth-nav">
          <button @click="isOpen('community')">
            <h2>Community <i class="m umic-arrow_bottom" /></h2>
          </button>
          <div v-show="openNav.community" class="depth-menu">
            <NuxtLink
              :to="{ path: '/community/notice' }"
              :class="{ 'nuxt-link-exact-active': $route.path.includes('notice') }"
              @click.native="menuOff"
              >공지사항</NuxtLink
            >
            <NuxtLink to="/community/faq" @click.native="menuOff">FAQ</NuxtLink>
          </div>
        </div>
        <div class="depth-nav">
          <NuxtLink to="/membership/posts" @click.native="menuOff">Membership</NuxtLink>
        </div>
        <div class="depth-nav">
          <NuxtLink v-slot="{ isActive, href, navigate }" to="/coffee" custom @click.native="menuOff">
            <a :class="{ 'nuxt-link-active': isActive }" @click="clearAndGo(navigate, href)">
              <img src="~assets/img/coffee_calligraphy_m.svg" alt="" />
            </a>
          </NuxtLink>
        </div>
      </div>
      <NuxtLink to="/ticketing?selectedType=exhibitions" class="ticketing-area">
        <span>Ticket</span>
        <i class="m umic-arrow_forward" />
      </NuxtLink>
    </nav>
    <div v-if="searchWrap" class="search-wrap">
      <div class="search-area">
        <USearch
          v-model="queryOptions.text"
          class="search-bar"
          w-size="full"
          @search="onSearchText"
          @reset="resetText"
        />
      </div>
    </div>
    <div class="header pc" :class="{ 'is-active': pcOpenNav.background }">
      <NuxtLink to="/" class="logo">
        <img src="~assets/img/pc/logo.svg" alt="로고" width="139" height="68" />
      </NuxtLink>
      <nav class="nav-wrap" :class="{ 'is-active': userInfo }">
        <ul class="menu-depth-1">
          <li
            :class="{ 'is-active': pcOpenNav.artMuseum }"
            @mouseover="isMenuOpen('artMuseum')"
            @mouseleave="isMenuClose('artMuseum')"
          >
            <NuxtLink to="/about/info" @click.native="pcMenuTop">Visit</NuxtLink>
            <div class="bottom-area">
              <ul class="menu-depth-2">
                <li>
                  <NuxtLink to="/about/info" @click.native="pcMenuTop">헤레디움</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/about/intro" @click.native="pcMenuTop">오시는 길</NuxtLink>
                </li>
              </ul>
            </div>
          </li>
          <li
            :class="{ 'is-active': pcOpenNav.exhibition }"
            @mouseover="isMenuOpen('exhibition')"
            @mouseleave="isMenuClose('exhibition')"
          >
            <NuxtLink to="/exhibition" @click.native="pcMenuTop">Exhibition</NuxtLink>
            <div class="bottom-area">
              <ul class="menu-depth-2">
                <li>
                  <NuxtLink to="/exhibition" @click.native="pcMenuTop">진행 중인 전시</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/exhibition/end" @click.native="pcMenuTop">종료된 전시</NuxtLink>
                </li>
              </ul>
            </div>
          </li>
          <li
            :class="{ 'is-active': pcOpenNav.program }"
            @mouseover="isMenuOpen('program')"
            @mouseleave="isMenuClose('program')"
          >
            <NuxtLink to="/program" @click.native="pcMenuTop">Program</NuxtLink>
            <div class="bottom-area">
              <ul class="menu-depth-2">
                <li>
                  <NuxtLink to="/program" @click.native="pcMenuTop">진행 중인 프로그램</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/program/end" @click.native="pcMenuTop">종료된 프로그램</NuxtLink>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <NuxtLink to="/event" @click.native="pcMenuTop">Event</NuxtLink>
          </li>
          <li
            :class="{ 'is-active': pcOpenNav.community }"
            @mouseover="isMenuOpen('community')"
            @mouseleave="isMenuClose('community')"
          >
            <NuxtLink to="/community/notice" @click.native="pcMenuTop">Community</NuxtLink>
            <div class="bottom-area">
              <ul class="menu-depth-2">
                <li>
                  <NuxtLink to="/community/notice" @click.native="pcMenuTop">공지사항</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/community/faq" @click.native="pcMenuTop">FAQ</NuxtLink>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <NuxtLink to="/membership/posts" @click.native="pcMenuTop">Membership</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/coffee" @click.native="pcMenuTop">
              <img src="~assets/img/coffee_calligraphy.svg" alt="" />
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <div class="side-area">
        <template v-if="!userInfo">
          <NuxtLink to="/auth/login">
            <i class="pc uic-login" />
          </NuxtLink>
        </template>
        <template v-else>
          <button class="logout-btn" @click="onLogout">
            <i class="pc uic-logout" />
          </button>
          <NuxtLink to="/mypage/purchase/all">
            <i class="pc uic-account" />
          </NuxtLink>
        </template>
        <button v-if="!searchWrap" class="search-btn" @click="onSearch">
          <i class="pc uic-search" />
        </button>
        <button v-else class="search-btn" @click="onMenu">
          <i class="pc uic-close" />
        </button>
        <NuxtLink to="/ticketing?selectedType=exhibitions">
          <img src="~assets/img/pc/floating.svg" alt="예매" width="88" height="48" />
        </NuxtLink>
      </div>
    </div>
    <div v-if="searchWrap" class="search-wrap">
      <div class="search-area">
        <USearch
          v-model="queryOptions.text"
          class="search-bar"
          w-size="full"
          @search="onSearchText"
          @reset="resetText"
        />
      </div>
    </div>
  </header>
</template>

<script>
import '~/assets/style/user/grid.scss';
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock';
import USearch from '~/components/user/common/USearchBar';

export default {
  name: 'HeaderBase',
  components: { USearch },
  data() {
    return {
      openNav: {
        artMuseum: false,
        exhibition: false,
        program: false,
        community: false
      },
      pcOpenNav: {
        background: false,
        artMuseum: false,
        exhibition: false,
        program: false,
        community: false
      },
      scroll: 0,
      innerWidth: 0,
      searchWrap: false,
      menuWrap: false,
      queryOptions: {
        text: this.$route.query.text || '',
        size: Number(this.$route.query.size) || 8,
        page: this.$route.query.page || '0',
        type: this.$route.query.type || 'EXHIBITION'
      },
      isDetailPage: false,
      beforeFullPath: ''
    };
  },
  async fetch() {
    if (this.$store.getters['service/auth/getAccessToken']) {
      const userInfo = await this.$axios.$get('/user/account/info').catch(() => {});
      this.$store.commit('service/auth/setUserInfo', userInfo);
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters['service/auth/getUserInfo'];
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(newValue, oldValue) {
        if (oldValue && oldValue?.fullPath !== newValue?.fullPath) {
          this.searchWrap = false;
          this.menuWrap = false;
        }

        this.beforeFullPath = oldValue?.fullPath;
        this.isDetailPage = this.$route.params?.id || this.$route.params.infosId;
      }
    },
    menuWrap(newValue) {
      if (!this.noScrollLock) {
        if (newValue) {
          disableBodyScroll(document, {
            allowTouchMove: (el) => {
              while (el && el !== document.body) {
                if (el.getAttribute('body-scroll-lock-ignore') !== null) {
                  return true;
                }

                el = el.parentElement;
              }
            }
          });
        } else {
          clearAllBodyScrollLocks();
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleResize);
      window.addEventListener('scroll', this.handleScroll);
      window.addEventListener('scroll', this.isInteractionPage);
    });

    this.handleResize();
    this.handleScroll();
    this.isInteractionPage();
  },
  beforeDestroy() {
    if (!this.noScrollLock) {
      clearAllBodyScrollLocks();
    }
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('scroll', this.isInteractionPage);
  },
  methods: {
    isInteractionPage() {
      const $header = document.querySelector('header');
      if (this.$route.name === 'about-info' && window.scrollY > 0) {
        $header.classList.add('hide');
      } else {
        $header.classList.remove('hide');
      }
    },
    pcMenuTop() {
      window.scrollTo({ top: 0, left: 0 });
    },
    menuOff() {
      this.menuWrap = false;
      window.scrollTo({ top: 0, left: 0 });
    },
    handleScroll() {
      this.scroll = window.scrollY;
    },
    handleResize() {
      this.innerWidth = window.innerWidth;
    },
    onSearch() {
      this.searchWrap = !this.searchWrap;
      if (this.menuWrap) {
        this.menuWrap = false;
      }
    },
    onMenu() {
      this.menuWrap = !this.menuWrap;
      if (this.searchWrap) {
        this.searchWrap = false;
        this.menuWrap = false;
      }
    },
    onLogout() {
      const currentRoute = this.$route.path;
      this.$store.dispatch('service/auth/userLogout');

      if (currentRoute === '/' || currentRoute === '/app') {
        window.location.reload(true);
      } else {
        this.$router.replace(this.$store.state.deviceInfo.isApp ? '/app' : '/');
        this.menuWrap = false;
      }
    },
    resetText() {
      this.queryOptions.text = '';
    },
    async onSearchText() {
      await this.$router
        .replace({
          path: '/search',
          query: this.queryOptions
        })
        .catch(() => {
          this.searchWrap = false;
        });
      this.queryOptions.text = '';
    },
    isOpen(target) {
      Object.keys(this.openNav).forEach((key) => {
        if (target !== key) {
          this.openNav[`${key}`] = false;
        }
      });
      this.openNav[`${target}`] = !this.openNav[`${target}`];
    },
    clearAndGo(navigate, href) {
      Object.keys(this.openNav).forEach((key) => {
        this.openNav[key] = false;
      });
      navigate(href);
    },
    goPrevPage() {
      const splitFullPath = this.$route.fullPath.split('/');
      const isEndPage = !!this.$route.query?.end;
      const beforeFullPath = this.beforeFullPath;

      if (beforeFullPath === '/' || beforeFullPath === '/app') {
        this.$router.push(this.$store.state.deviceInfo.isApp ? '/app' : '/');
      } else if (isEndPage) {
        splitFullPath.splice(-1, 1);
        this.$router.push(splitFullPath.join('/') + '/end');
      } else if (splitFullPath[1] === 'exhibition' || splitFullPath[1] === 'program' || splitFullPath[1] === 'coffee') {
        this.$router.push(`/${splitFullPath[1]}`);
      } else if (splitFullPath.includes('ticketing')) {
        if (beforeFullPath) {
          this.$router.push(beforeFullPath);
        } else {
          this.$router.push('/ticketing');
        }
      } else {
        this.$router.go(-1);
      }
    },
    isMenuOpen(target) {
      Object.keys(this.pcOpenNav).forEach((key) => {
        if (target !== key) {
          this.pcOpenNav[`${key}`] = false;
        }
      });
      this.pcOpenNav[`${target}`] = true;
      this.pcOpenNav.background = true;
    },
    isMenuClose(target) {
      Object.keys(this.pcOpenNav).forEach((key) => {
        if (target !== key) {
          this.pcOpenNav[`${key}`] = false;
        }
      });
      this.pcOpenNav[`${target}`] = false;
      this.pcOpenNav.background = false;
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
header {
  width: 100%;
  height: 6rem;
  transition: 0.4s ease-in-out;

  &.hide {
    transform: translate3d(0, -100%, 0);
    border-bottom: none;

    &::before {
      border-bottom: none !important;
    }

    .header {
      border-bottom: none !important;
    }
  }

  .header {
    z-index: 11;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.1rem 2rem;
    height: 6rem;
    background-color: var(--color-white);

    &.mo {
      display: flex !important;
    }

    &.pc {
      display: none !important;
    }

    .options {
      display: flex;
      align-items: center;

      i {
        font-size: 3.2rem;
      }

      .search-btn {
        margin-right: 2rem;
        height: 3.2rem;
      }

      .menu-open {
        height: 3.2rem;
      }
    }
  }

  .nav-back-btn {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    transform: translateX(-0.5rem);

    i {
      font-size: 3.2rem;
    }
  }

  .menu-wrap {
    position: fixed;
    display: block;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 10;
    width: 100%;
    background: var(--color-white);

    &.is-show {
      position: fixed;
      top: 6rem;
    }

    .profile-area {
      padding: 3.6rem 2rem 2.4rem;
      font-size: 2.4rem;
      font-weight: 500;
      letter-spacing: -0.1rem;
      line-height: 3.84rem;

      &.login {
        .login-info {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .user-buttons {
            margin-top: -0.9rem;
          }

          button {
            font-size: 14px;
            font-weight: 700;
            line-height: 160%;
            color: var(--color-u-grey-2);
            text-decoration: underline;
            margin-right: 2.3rem;
          }
          a {
            font-size: 14px;
            font-weight: 700;
            line-height: 160%;
            color: var(--color-u-grey-2);
            text-decoration: underline;
          }
        }
      }

      a {
        position: relative;
        font-weight: 600;
        color: var(--color-u-primary);
        letter-spacing: -0.1rem;
        text-decoration: underline;
      }

      p {
        span {
          font-weight: 700;
        }
      }
    }

    .menu-area {
      display: flex;
      flex-direction: column;
      padding: 2.4rem 2rem;

      .depth-nav {
        margin-bottom: 4.2rem;

        > a {
          cursor: pointer;
          &.nuxt-link-active {
            color: var(--color-u-primary);
          }
        }

        &.is-active {
          h2 {
            color: var(--color-u-primary);
            font-weight: 700;

            i {
              transform: rotate(180deg);
              margin-top: -0.1rem;
            }
          }
        }

        a {
          display: flex;
          align-items: center;
          font-size: 2rem;
          font-weight: 500;
          line-height: 2rem;

          &.nuxt-link-exact-active {
            color: var(--color-u-primary);
          }
        }

        button {
          display: flex;
          width: 100%;

          h2 {
            display: flex;
            align-items: center;
            font-size: 2rem;
            font-weight: 500;
            line-height: 2rem;

            i {
              font-size: 2rem;
              margin-left: 1.2rem;
            }
          }
        }

        .depth-menu {
          display: flex;
          flex-direction: column;
          margin-top: 3rem;

          a {
            margin-bottom: 2.4rem;
            font-size: 1.6rem;
            font-weight: 500;
            line-height: 1.6rem;

            &:last-of-type {
              margin-bottom: 0;
            }
          }
        }
      }
    }

    .ticketing-area {
      position: fixed;
      display: flex;
      justify-content: space-between;
      align-items: center;
      bottom: 0;
      width: 100%;
      padding: 1.4rem;
      background-color: var(--color-u-primary);

      span {
        margin-left: 0.6rem;
        font-size: 2rem;
        font-weight: 700;
        color: var(--color-white);
      }

      i {
        font-size: 2.4rem;
        color: var(--color-white);
      }
    }
  }

  .search-wrap {
    z-index: 10;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    background-color: rgba(17, 17, 17, 0.8);
    padding-top: 6rem;

    .search-area {
      padding: 3.6rem 2rem 5.6rem;
      background: var(--color-white);

      .search-bar {
        height: 4.4rem;
      }
    }
  }
}

@media screen and (min-width: 1025px) {
  header {
    height: 10.4rem;
    z-index: 11;
    position: sticky;
    top: 0;
    background-color: var(--color-white);
    box-sizing: content-box;

    &.is-scroll {
      &::before {
        content: '';
        position: absolute;
        z-index: 11;
        display: block;
        width: 100%;
        height: 100%;
        background-color: var(--color-white);
        border-bottom: 0.1rem solid var(--color-black);
        box-sizing: content-box;
      }
    }

    .header {
      height: 10.4rem;
      padding: 0 2.8rem;
      max-width: 1920px;
      margin: 0 auto;
      box-sizing: content-box;
      background-color: unset;

      &.mo {
        display: none !important;
      }

      &.pc {
        display: flex !important;
      }

      .logo {
        margin-right: 6.925rem;
      }

      &.is-active {
        .nav-wrap {
          .menu-depth-1 {
            > li {
              &.is-active {
                .bottom-area {
                  display: block;
                }
              }
            }
          }
        }
      }

      .nav-wrap {
        height: 100%;

        .menu-depth-1 {
          position: relative;
          display: flex;
          align-items: center;
          height: 100%;

          > li {
            position: relative;
            height: 100%;
            padding: 0 2rem;

            > a {
              position: relative;
              display: flex;
              align-items: center;
              height: 100%;
              font-size: 1.8rem;
              font-weight: 600;
              line-height: 160%;
              letter-spacing: 0.025rem;
              color: var(--color-black);

              &:hover {
                color: var(--color-u-primary);
              }
            }

            .bottom-area {
              position: absolute;
              display: none;
              top: 100%;
              left: 50%;
              transform: translateX(-50%);
              width: auto;
              min-width: 18rem;
              white-space: nowrap;
              padding: 2.8rem 2rem 2.6rem;
              background-color: var(--color-black);

              .menu-depth-2 {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                li + li {
                  margin-top: 1.4rem;
                }

                li {
                  a {
                    position: relative;
                    display: block;
                    align-items: center;
                    font-size: 1.6rem;
                    font-weight: 500;
                    line-height: 160%;
                    letter-spacing: 0.025rem;
                    color: var(--color-white);

                    &:hover {
                      color: var(--color-u-primary);
                    }
                  }
                }
              }
            }
          }
        }
      }

      .side-area {
        display: flex;
        align-items: center;
        height: 100%;

        .logout-btn {
          position: absolute;
          right: 23.6rem;
          margin-right: 2.4rem;
        }

        .search-btn {
          margin: 0 3.2rem 0 2.4rem;
        }

        i {
          font-size: 3.2rem;
        }
      }
    }
    .search-wrap {
      padding-top: 10.4rem;

      .search-area {
        padding: 6rem 2rem 12.7rem;

        .search-bar {
          width: 66.8rem !important;
          height: 5.9rem;
          margin: 0 auto;
        }
      }
    }
  }
}

@media screen and (min-width: 1281px) {
  header {
    .header {
      .nav-wrap {
        .menu-depth-1 {
          > li {
            height: 100%;
            padding: 0 3.6rem;
          }
        }
      }
    }
  }
}
</style>
