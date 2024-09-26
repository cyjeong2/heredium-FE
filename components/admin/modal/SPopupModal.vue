<template>
  <transition name="fade">
    <div v-if="isShow" class="modal-wrap">
      <div class="modal-inner">
        <Swiper ref="popupSwiper" :options="popupSwiperOption" class="popup-slider">
          <SwiperSlide v-for="(item, index) in popupList" :key="index" :role="item.isUseButton ? 'link' : ''">
            <a
              :href="item.link || ''"
              :target="item.isNewTab ? '_blank' : ''"
              :class="{ clickable: item.isUseButton && item.link }"
            >
              <img :src="getImage(item)" :alt="item.pcImageAlt" />
            </a>
          </SwiperSlide>
          <div v-if="popupList.length > 1" slot="pagination" class="swiper-pagination only-mobile" />
        </Swiper>
        <div class="bottom">
          <UCheckbox v-model="isHideToday">오늘 하루 보지 않기</UCheckbox>
          <button type="button" @keydown.enter="hidePopup" @click="hidePopup">닫기</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import UCheckbox from '~/components/user/common/UCheckbox.vue';

export default {
  name: 'SPopupModal',
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
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        }
      },
      isHideToday: false
    };
  },
  methods: {
    getImage(image) {
      return image && image.pcImage
        ? `${this.$store.state.BASE_URL}${image.pcImage?.savedFileName}`
        : require('~/assets/img/thumbnail_default.jpg');
    },
    hidePopup() {
      this.$emit('close');
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

  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4.8rem;
    padding: 0 1.2rem 0 1.6rem;

    ::v-deep .text {
      color: var(--color-white);
      font-weight: 500;
    }

    button {
      color: var(--color-white);
      i {
        font-size: 2.4rem;
        color: var(--color-white);
      }
    }
  }
}

::v-deep .popup-slider {
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
  }

  .swiper-pagination-bullet-active {
    width: 40px;
    background-color: var(--color-white);
  }
}

@media screen and (min-width: 769px) {
  .modal-wrap {
    position: fixed;
    top: 10rem;
    left: auto;
    right: 51.9rem;
    width: auto;
    height: auto;
    z-index: 500;
  }

  .modal-inner {
    width: 42rem;
    top: 0;
    left: 0;
    transform: translate(0, 0);

    img {
      height: 41.9rem;
      width: 41.9rem;
      object-fit: cover;
    }

    .bottom {
      height: 5.2rem;

      ::v-deep .text {
        font-size: 1.6rem;
      }
    }
  }
}
</style>
