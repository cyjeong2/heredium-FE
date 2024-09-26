<template>
  <div v-if="isShow" class="modal-wrap">
    <div class="modal-inner">
      <div class="head">{{ getPageType(termTarget) }}</div>
      <div class="body" body-scroll-lock-ignore>
        <div class="content-wrap">
          <CommonEditorContentOutput :contents="termsData?.contents" />
        </div>
      </div>
      <div class="foot">
        <UButton button-type="secondary" @click="$emit('close')">닫기</UButton>
        <UButton @click="$emit('agree')">동의</UButton>
      </div>
    </div>
  </div>
</template>

<script>
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock';
import UButton from '~/components/user/common/UButton';
import { POLICY_TYPE } from '~/assets/js/types';

export default {
  name: 'URegisterModal',
  components: { UButton },
  props: {
    isShow: {
      type: Boolean,
      required: false,
      default: false
    },
    termTarget: {
      type: String,
      required: false,
      default: ''
    },
    termsData: {
      type: Object,
      required: false,
      default: () => null
    }
  },
  computed: {
    isHasSlotButtons() {
      return !!this.$slots['modal-btn1'] || !!this.$slots['modal-btn2'];
    }
  },
  watch: {
    isShow(newValue) {
      if (newValue) {
        const ua = navigator.userAgent.toLowerCase();

        if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
          this.beforeScroll = window.scrollY;
        }

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
        this.$nextTick(() => {
          this.$nextTick(() => {
            this.setBeforeScroll();
          });
        });
      }
    }
  },
  beforeDestroy() {
    clearAllBodyScrollLocks();
    this.setBeforeScroll();
  },
  methods: {
    getPageType(type) {
      return POLICY_TYPE[type];
    },
    setBeforeScroll() {
      if (this.beforeScroll > 0 && window) {
        window.scrollTo(0, this.beforeScroll);
        this.beforeScroll = 0;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 500;
  background-color: rgba(17, 17, 17, 0.8);
}

.modal-inner {
  height: 100%;
  width: 100%;
  background-color: var(--color-white);

  .head {
    display: flex;
    align-items: center;
    height: 6rem;
    padding: 0 2rem;
    font-weight: 700;
    font-size: 2rem;
    line-height: 100%;
  }

  .body {
    height: calc(100vh - 13.2rem);
    overflow-y: auto;
    padding: 3.2rem 2rem 0;

    .content-wrap {
      padding-bottom: 10.2rem;
    }
  }

  .foot {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 7.2rem;
    width: 100%;
    display: grid;
    padding: 1.4rem 2rem;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 1.6rem;
    border-top: 1px solid var(--color-u-grey-1);
    background-color: #fff;

    button {
      width: 100%;
    }
  }
}

@supports (-webkit-touch-callout: none) {
  .body {
    -webkit-overflow-scrolling: touch !important;
    overflow-y: scroll;
  }
}

@media screen and (min-width: 769px) {
  .modal-inner {
    display: block;
    position: absolute;
    width: 60.4rem;
    height: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--color-white);
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);

    .head {
      height: auto;
      padding: 3.2rem 3.6rem 3.6rem;
      font-size: 2.4rem;
      line-height: 150%;
    }

    .body {
      max-height: 40.8rem;
      padding: 0 3.6rem 3.6rem;
      overflow-y: unset;

      li {
        font-size: 1.6rem;
        line-height: 160%;
      }

      .content-wrap {
        height: 40.8rem;
        background: rgba(235, 235, 235, 0.4);
        overflow-y: auto;
        padding: 2.4rem 2.4rem 0;
        border: 1px solid var(--color-u-grey-1);
      }
    }

    .foot {
      position: static;
      display: grid;
      padding: 0 3.2rem 3.6rem;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 1.6rem;
      height: auto;
      border-top: 0;
      margin-top: 3.6rem;

      button {
        width: 100%;
      }
    }
  }
}
</style>
