<template>
  <transition name="fade">
    <div v-if="isShow" class="modal-wrap">
      <div class="modal-inner" :style="{ width }">
        <div class="modal">
          <div class="head">
            <h1 class="tm-1b"><slot name="title"></slot></h1>
            <button type="button" class="close-btn" @click="$emit('close')">
              <i class="ic-close" />
            </button>
          </div>
          <div class="body">
            <slot name="content" />
          </div>
          <div class="foot-wrap">
            <div v-if="isHasSlotButtons" class="foot">
              <slot name="modal-btn1" />
              <slot name="modal-btn2" />
            </div>
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
  name: 'SModal',
  props: {
    isShow: {
      type: Boolean,
      required: false,
      default: false
    },
    width: {
      type: String,
      required: false,
      default: '53.2rem'
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
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-inner {
  position: absolute;
  width: 53.2rem;
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
    border-bottom: 1px solid var(--color-grey-2);

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

  .foot-wrap {
    padding: 0 3.2rem;
  }

  .foot {
    display: flex;
    justify-content: center;
    margin-bottom: 3.6rem;
    padding-top: 3.2rem;
    border-top: 1px solid var(--color-grey-2);
  }
}

::v-deep .modal {
  .foot button:first-child {
    margin-right: 0.8rem !important;
  }
}
</style>
