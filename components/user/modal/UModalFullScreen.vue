<template>
  <transition name="fade">
    <div v-if="isShow" class="modal-wrap">
      <div class="modal-inner">
        <div class="modal">
          <div v-if="!hideHead" class="head">
            <h1 class="tm-1b"><slot name="title"></slot></h1>
            <button v-if="!hideEdgeCloseBtn" type="button" class="close-btn" @click="$emit('close')">
              <i class="ic-close" />
              <i class="pc uic-arrow_backward" />
            </button>
          </div>
          <div class="body">
            <slot name="content" />
          </div>
          <div v-if="isHasSlotButtons" class="foot">
            <slot name="modal-btn1" />
            <slot name="modal-btn2" />
          </div>
        </div>
      </div>
      <slot name="etc" />
    </div>
  </transition>
</template>

<script>
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

export default {
  name: 'UModalFullScreen',
  props: {
    isShow: {
      type: Boolean,
      required: false,
      default: false
    },
    hideEdgeCloseBtn: {
      type: Boolean,
      required: false,
      default: false
    },
    hideHead: {
      type: Boolean,
      required: false,
      default: false
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
        disableBodyScroll(document);
      } else {
        clearAllBodyScrollLocks();
      }
    }
  },
  beforeDestroy() {
    clearAllBodyScrollLocks();
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
  width: 100vw;
  height: 100vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-white);
  overflow-y: auto;
}

.modal {
  .head {
    position: relative;
    min-height: 5.2rem;
    padding: 2.4rem 2rem;
    margin-bottom: 0.8rem;

    h1 {
      font-size: 2rem;
      font-weight: 700;
      line-height: 100%;
    }

    .close-btn {
      position: absolute;
      top: 50%;
      left: 1.2rem;
      transform: translateY(-50%);
      font-size: 2.4rem;
      .ic-close {
        display: none;
      }
      .uic-arrow_backward {
        display: block;
      }
    }
  }

  .body {
    padding: 0 2rem;
    word-break: keep-all;
    font-size: 1.6rem;
    font-weight: 500;
    line-height: 160%;
    text-align: left;
  }

  .foot {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr;
    column-gap: 1.6rem;
    justify-content: center;
    margin-bottom: 3.6rem;
    padding: 2.4rem 2rem 0;

    ::v-deep button {
      min-width: auto !important;
      width: 100% !important;
    }
  }
}

@media screen and (min-width: 769px) {
  .modal-inner {
    width: 52.4rem;
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
    height: auto;
    max-height: 80vh;
  }

  .modal {
    .head {
      padding: 2.4rem 3.6rem;

      h1 {
        font-size: 2.4rem;
        line-height: 150%;
      }

      .close-btn {
        right: 1.2rem;
        left: unset;
        .ic-close {
          display: block;
        }
        .uic-arrow_backward {
          display: none;
        }
      }
    }

    .body {
      padding: 0 3.6rem;
      margin-bottom: 3.6rem;
      font-weight: 500;
      font-size: 1.8rem;
      line-height: 160%;
      text-align: left;

      &.only-body {
        margin-top: 4.4rem;
      }
    }

    .foot {
      padding: 0 3.6rem;
    }
  }
}
</style>
