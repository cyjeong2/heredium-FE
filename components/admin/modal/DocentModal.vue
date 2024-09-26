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
            <div class="contents-info mb-24">
              <div class="representative-img mr-16">
                <img
                  :src="getThumbnailImage(docentData?.thumbnail)"
                  :alt="`${docentData.thumbnail?.originalFileName}`"
                />
              </div>
              <div class="works-info">
                <p class="tm-1m">{{ docentData.title }}</p>
                <p class="tm-2r">{{ docentData.writer }}</p>
                <p class="tm-2r">{{ docentData.position }}</p>
                <div>
                  <audio :src="`${$store.state.BASE_URL}${docentData.audio?.savedFileName}`" class="player" controls />
                </div>
              </div>
            </div>
            <div class="content-intro">
              <p>
                {{ docentData.intro }}
              </p>
            </div>
          </div>
          <div class="foot">
            <div v-if="docentData?.map" class="map-img">
              <img
                :src="`${$store.state.BASE_URL}${docentData.map?.savedFileName}`"
                :alt="`${docentData.map?.originalFileName}`"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
export default {
  name: 'DocentModal',
  props: {
    isShow: {
      type: Boolean,
      required: false,
      default: false
    },
    docentData: {
      type: Object,
      required: false,
      default: () => null
    }
  },
  data() {
    return {};
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
  },
  methods: {
    getThumbnailImage(image) {
      return image
        ? `${this.$store.state.BASE_URL}${image.savedFileName}`
        : require('~/assets/img/thumbnail_default.jpg');
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

    .close-btn {
      position: absolute;
      top: 50%;
      right: 1.2rem;
      transform: translateY(-50%);
      font-size: 2.4rem;
    }
  }

  .body {
    padding: 0 3.2rem;
    word-break: keep-all;
    margin-bottom: 2.4rem;

    .contents-info {
      display: flex;
      align-items: flex-start;

      .representative-img {
        flex: 1 1 16rem;
        img {
          width: 100%;
          height: 16rem;
          border-radius: 0.3rem;
          object-fit: cover;
          object-position: center;
          background-color: #d9d9d9;
        }
      }

      .works-info {
        flex: 1 1 calc(100% - 17.6rem);
        overflow: hidden;

        p {
          &:first-of-type {
            padding-bottom: 1.1rem;
          }
          &:nth-of-type(2) {
            padding-bottom: 0.4rem;
          }
          &:last-of-type {
            padding-bottom: 2.9rem;
          }
        }

        .player {
          width: 100%;
          height: 5.2rem;
        }
      }
    }
    .content-intro {
      overflow-y: auto;
      max-height: 25rem;
    }
  }

  .foot {
    padding: 0 3.2rem 3.2rem;

    .map-img {
      img {
        width: 100%;
        height: 15.6rem;
        border-radius: 0.3rem;
        object-fit: cover;
        object-position: center;
        background-color: #d9d9d9;
      }
    }
  }
}
</style>
