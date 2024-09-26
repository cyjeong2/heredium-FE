<template>
  <transition name="fade">
    <div v-if="isShow" class="modal-wrap">
      <div class="modal-inner">
        <div class="head">
          <h3>{{ groupData.name }}</h3>
          <button type="button" @click="$emit('close')"><i class="ic-close" /></button>
        </div>
        <div class="body" body-scroll-lock-ignore>
          <div class="top">
            <div>
              <img :src="getImage(selectedArtist?.thumbnail)" alt="" />
              <h4 class="only-pc">{{ selectedArtist.name }}</h4>
            </div>
            <div v-if="groupData?.infos?.length > 1" class="btn-area">
              <button type="button" :disabled="artistIndex === 0" @click="artistIndex = artistIndex - 1">
                <i class="pc uic-arrow_backward" />
              </button>
              <button
                type="button"
                :disabled="!groupData.infos[artistIndex + 1]"
                @click="artistIndex = artistIndex + 1"
              >
                <i class="pc uic-arrow_forward" />
              </button>
            </div>
          </div>
          <div class="content">
            <h4 class="only-mobile">{{ selectedArtist.name }}</h4>
            <p>{{ selectedArtist.intro }}</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

export default {
  name: 'UArtistModal',
  props: {
    isShow: {
      type: Boolean,
      required: false,
      default: false
    },
    groupData: {
      type: Object,
      required: false,
      default: () => ({})
    },
    initArtistIndex: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      termDataDefault: {
        title: '',
        listText: []
      },
      artistIndex: 0,
      beforeScroll: 0
    };
  },
  computed: {
    isHasSlotButtons() {
      return !!this.$slots['modal-btn1'] || !!this.$slots['modal-btn2'];
    },
    selectedArtist() {
      return this.groupData.infos[this.artistIndex];
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
        this.artistIndex = this.initArtistIndex;
      } else {
        clearAllBodyScrollLocks();
        this.$nextTick(() => {
          this.setBeforeScroll();
        });
      }
    }
  },
  beforeDestroy() {
    clearAllBodyScrollLocks();
    this.setBeforeScroll();
  },
  methods: {
    getImage(image) {
      return image
        ? `${this.$store.state.BASE_URL}${image.savedFileName}`
        : require('~/assets/img/thumbnail_default.jpg');
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
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: var(--color-white);

  .head {
    display: flex;
    position: relative;
    align-items: center;
    height: 6rem;
    padding: 0 6rem 0 2rem;
    font-weight: 700;
    font-size: 2rem;
    line-height: 100%;

    h3 {
      font-weight: 700;
      font-size: 2rem;
      line-height: 100%;
    }

    button {
      position: absolute;
      top: 50%;
      right: 2rem;
      transform: translateY(-50%);

      i {
        font-size: 3.2rem;
      }
    }
  }

  .body {
    flex: 1 1 0;
    overflow-y: auto;
    padding: 1.6rem 2rem;

    .top {
      display: flex;
      align-items: flex-end;
      margin-bottom: 3.2rem;

      img {
        height: 20rem;
        width: 20rem;
        aspect-ratio: 1/1;
        object-fit: cover;
        margin-right: 2rem;
      }

      .btn-area {
        height: 2.8rem;

        button {
          width: 2.8rem;
          height: 100%;

          &:first-child {
            margin-right: 1.2rem;
          }

          &:disabled {
            opacity: 0.4;
          }
        }

        i {
          font-size: 2.8rem;
        }
      }
    }

    .content {
      h4 {
        font-weight: 500;
        font-size: 1.8rem;
        line-height: 100%;
        margin-bottom: 0.8rem;
      }

      p {
        font-weight: 300;
        font-size: 1.4rem;
        line-height: 200%;
      }
    }
  }
}

@media screen and (min-width: 769px) {
  .modal-inner {
    position: absolute;
    height: 48.8rem;
    width: 70rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--color-white);
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);

    .head {
      position: relative;
      height: auto;
      padding: 3.2rem 3.6rem 3.6rem 3.6rem;

      h3 {
        font-size: 2.4rem;
        line-height: 150%;
      }

      button {
        color: var(--color-white);
        position: absolute;
        top: auto;
        right: -0.5rem;
        bottom: calc(100% + 2rem);
        transform: unset;
      }
    }

    .body {
      display: flex;
      flex: unset;
      overflow-y: auto;
      padding: 0 3.6rem 3.6rem;

      .top {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0;
        margin-right: 2.4rem;
        max-width: 20.4rem;

        img {
          height: 20.4rem;
          width: 20.4rem;
          aspect-ratio: 1/1;
          object-fit: cover;
          margin-right: 0;
          margin-bottom: 1.6rem;
        }

        h4 {
          max-width: 100%;
          font-weight: 500;
          font-size: 2rem;
          line-height: 150%;
          letter-spacing: 0.25px;
          margin-bottom: 1.6rem;
        }

        .btn-area {
          height: 2.8rem;

          button {
            width: 2.8rem;
            height: 100%;

            &:first-child {
              margin-right: 1.2rem;
            }

            &:disabled {
              opacity: 0.4;
            }
          }

          i {
            font-size: 2.8rem;
          }
        }
      }

      .content {
        flex: 1 0 0;

        p {
          height: 34.8rem;
          font-size: 1.6rem;
          line-height: 200%;
          padding: 2rem 2.4rem;
          overflow-y: auto;
          background-color: rgba(235, 235, 235, 0.4);
          border: 1px solid var(--color-u-grey-1);
        }
      }
    }
  }
}
</style>
