<template>
  <transition name="fade">
    <div v-if="isShow" class="modal-wrap">
      <div class="modal-inner">
        <div class="modal">
          <div class="head">
            <button type="button" class="close-btn" @click="$emit('close')">
              <i class="ic-close" />
            </button>
          </div>
          <div class="body tm-1m">
            <slot name="content" />
          </div>
          <div v-if="isHasSlotButtons" class="foot">
            <slot name="modal-btn1" />
            <slot name="modal-btn2" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock';

export default {
  name: 'SDialogModal',
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
    isHasSlotButtons() {
      return !!this.$slots['modal-btn1'] || !!this.$slots['modal-btn2'];
    }
  },
  watch: {
    isShow(newValue) {
      if (!this.noScrollLock) {
        if (newValue) {
          disableBodyScroll(document);
        } else {
          clearAllBodyScrollLocks();
        }
      }
    }
  },
  beforeDestroy() {
    if (!this.noScrollLock) {
      clearAllBodyScrollLocks();
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
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-inner {
  position: absolute;
  width: 30.4rem;
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
    margin-bottom: 2.2rem;
    padding: 1.4rem 1.6rem;

    .close-btn {
      position: absolute;
      top: 50%;
      right: 1.2rem;
      transform: translateY(-50%);
      font-size: 2.4rem;
    }
  }

  .body {
    text-align: center;
    padding: 0 3.2rem;
    word-break: keep-all;
    margin-bottom: 3.2rem;
  }

  .foot {
    display: flex;
    justify-content: center;
    margin-bottom: 3.6rem;
  }
}

::v-deep .modal {
  .foot button:first-child {
    margin-right: 0.8rem !important;
  }
}
</style>
