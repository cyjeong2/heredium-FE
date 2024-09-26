<template>
  <transition name="fade">
    <div v-if="isShow" class="modal-wrap">
      <div class="modal-inner">
        <div class="modal">
          <div v-if="isHasSlotTitle" class="head">
            <h1 class="tm-1b"><slot name="title" /></h1>
          </div>
          <div class="body tm-1m">
            <slot name="content" />
          </div>
          <div v-if="isHasSlotButtons" class="foot">
            <slot name="modal-btn1" />
            <slot name="modal-btn2" />
            <slot name="modal-btn3" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock';

export default {
  name: 'UTripleDialogModal',
  props: {
    isShow: {
      type: Boolean,
      required: false,
      default: false
    },
    noScrollLock: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    isHasSlotTitle() {
      return !!this.$slots.title;
    },
    isHasSlotButtons() {
      return !!this.$slots['modal-btn1'] || !!this.$slots['modal-btn2'];
    }
  },
  watch: {
    isShow(newValue) {
      if (!this.noScrollLock) {
        if (newValue) {
          const ua = navigator.userAgent.toLowerCase();

          if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
            this.beforeScroll = window.scrollY;
          }

          disableBodyScroll(document);
        } else {
          clearAllBodyScrollLocks();
          this.$nextTick(() => {
            this.$nextTick(() => {
              this.setBeforeScroll();
            });
          });
        }
      }
    }
  },
  beforeDestroy() {
    if (!this.noScrollLock) {
      clearAllBodyScrollLocks();
    }
  },
  methods: {
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
  position: absolute;
  width: calc(100% - 4rem);
  min-width: 30.4rem;
  margin: 0 auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-white);
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
}

.modal {
  .head {
    position: relative;
    min-height: 5.2rem;
    padding: 2.4rem 2rem 0;

    h1 {
      font-size: 2rem;
      font-weight: 700;
      line-height: 100%;
    }
  }

  .body {
    text-align: center;
    font-weight: 500;
    font-size: 1.6rem;
    line-height: 160%;
    padding: 0 2rem;
    word-break: keep-all;
    margin: 2.4rem 0;

    &.only-body {
      margin-top: 3.2rem;
      margin-bottom: 2.4rem;
      text-align: left;
    }
  }

  .foot {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1.2rem;
    margin-bottom: 3.6rem;
    padding: 0 2rem;
  }
}

::v-deep .modal {
  .foot button {
    width: auto !important;
    min-width: auto !important;
    padding: 0 !important;
  }
}

@media screen and (min-width: 769px) {
  .modal-inner {
    width: 40rem;
  }

  .modal {
    .head {
      padding: 2.4rem 3.6rem 0;

      h1 {
        font-size: 2.4rem;
        line-height: 150%;
      }
    }
    .body {
      padding: 0 3.6rem;
      margin: 3.6rem 0;
      font-weight: 500;
      font-size: 1.8rem;
      line-height: 160%;
      text-align: left;

      &.only-body {
        margin-top: 4.4rem;
      }
    }

    .foot {
      margin-bottom: 3.6rem;
      padding: 0 3.6rem;
      gap: 1.6rem;

      ::v-deep > button {
        flex: 1 0 0;
      }
    }
  }
}
</style>
