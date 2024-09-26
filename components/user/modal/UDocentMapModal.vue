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
          <div class="body">
            <img :src="imgSrc" :alt="imgAlt" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

export default {
  name: 'UDocentMapModal',
  props: {
    isShow: {
      type: Boolean,
      required: false,
      default: false
    },
    imgSrc: {
      type: String,
      required: false,
      default: ''
    },
    imgAlt: {
      type: String,
      required: false,
      default: ''
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
  width: 100%;
  max-width: 53.2rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0 2rem;
}

.modal {
  .head {
    position: relative;
    height: 3.2rem;
    margin-bottom: 2rem;

    .close-btn {
      color: var(--color-white);
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      font-size: 3.2rem;
    }
  }

  .body {
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: calc(100vh - 10rem);
    background-color: var(--color-white);

    img {
      object-fit: contain;
    }
  }
}
</style>
