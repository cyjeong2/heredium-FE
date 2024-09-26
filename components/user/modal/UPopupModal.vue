<template>
  <transition name="fade">
    <div v-if="isShow" class="modal-wrap">
      <div class="modal-inner">
        <Swiper ref="popupSwiper" :options="popupSwiperOption" class="popup-slider">
          <SwiperSlide v-for="(item, index) in popupList" :key="index" :role="item.isUseButton ? 'link' : ''">
            <a
              :href="item.link ? item.link : 'javascript:void(0);'"
              :target="item.isNewTab && item.link ? '_blank' : ''"
              :class="{ clickable: item.link }"
            >
              <img
                :src="`${$store.state.BASE_URL}${item.pcImage?.savedFileName}`"
                :alt="item.pcImageAlt"
                class="only-pc"
              />
              <img
                :src="`${$store.state.BASE_URL}${item.mobileImage?.savedFileName}`"
                :alt="item.mobileImageAlt"
                class="only-mobile"
              />
              <div class="dim" />
            </a>
          </SwiperSlide>
          <div v-if="popupList.length > 1" slot="pagination" class="swiper-pagination" />
        </Swiper>
        <div class="bottom">
          <UCheckbox v-model="isHideToday" @change="onCheckBoxChange">오늘 하루 보지 않기</UCheckbox>
          <button type="button" @keydown.enter="hidePopup" @click="hidePopup">
            <i class="m umic-header_menu_close only-mobile" />
            <i class="pc uic-close only-pc" />
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import UCheckbox from '~/components/user/common/UCheckbox.vue';

export default {
  name: 'UPopupModal',
  components: { UCheckbox },
  props: {
    popupList: {
      type: Array,
      required: false,
      default: () => []
    },
    isShow: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      popupSwiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
        loop: true,
        autoplay: {
          delay: 5000
        },
        effect: 'fade',
        speed: 1000,
        fadeEffect: {
          crossFade: true
        }
      },
      isHideToday: false
    };
  },
  methods: {
    getImage(image) {
      return image
        ? `${this.$store.state.BASE_URL}${image.savedFileName}`
        : require('~/assets/img/thumbnail_default.jpg');
    },
    hidePopup() {
      if (this.isHideToday) {
        this.$cookies.set('mainPopupHide', 'true', {
          maxAge: 24 * 60 * 60
        });
      }

      this.$emit('close');
    },
    onCheckBoxChange() {
      if (this.isHideToday) {
        this.hidePopup();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9;
}

.modal-inner {
  position: absolute;
  width: 32rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-black);
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
  border: 1px solid var(--color-black);

  img {
    height: 31.9rem;
    width: 31.9rem;
    object-fit: cover;
  }

  .popup-slider {
    position: relative;

    .dim {
      position: absolute;
      height: 12rem;
      width: 31.9rem;
      left: 0;
      bottom: 0;
      background: linear-gradient(180deg, rgba(17, 17, 17, 0) 0%, rgba(17, 17, 17, 0.4) 100%);
      z-index: 1;
    }
  }

  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4.8rem;
    padding: 0 1.2rem 0 1.6rem;

    ::v-deep .text {
      color: var(--color-white);
      font-weight: 500;
      padding-left: 1.2rem;
    }

    button {
      transform: translateY(0.2rem);

      i {
        font-size: 2.4rem;
        color: var(--color-white);
      }
    }
  }
}

::v-deep .popup-slider {
  a {
    cursor: default;

    &.clickable {
      cursor: pointer;
    }
  }

  .swiper-pagination-bullets {
    height: 6px;
    bottom: 30px;
  }

  .swiper-pagination-bullet {
    height: 6px;
    width: 6px;
    margin: 0 3px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 3px;
    transition: 0.2s all ease-in-out;
    opacity: 1;
  }

  .swiper-pagination-bullet-active {
    width: 40px;
    background-color: var(--color-white);
  }
}

@media screen and (min-width: 769px) {
  .modal-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: auto;
    height: auto;
  }

  .modal-inner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 42rem;

    img {
      height: 41.9rem;
      width: 41.9rem;
      object-fit: cover;
    }

    .popup-slider {
      .dim {
        width: 41.9rem;
      }
    }

    .bottom {
      height: 5.2rem;

      ::v-deep .text {
        font-size: 1.6rem;
      }

      button {
        transform: translateY(0);
      }
    }
  }
}
</style>
