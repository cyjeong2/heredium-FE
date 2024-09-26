<template>
  <transition name="fade">
    <div v-if="isShow" class="modal-wrap">
      <div class="modal-inner">
        <div class="modal">
          <div class="head">
            <h1 class="tm-1b"><slot name="title"></slot></h1>
            <button type="button" class="close-btn" @click="$emit('close')">
              <i class="m umic-header_menu_close only-mobile" />
              <i class="pc uic-close only-pc" />
            </button>
          </div>
          <div class="body">
            <h3>공유하기</h3>
            <div class="btn-warp">
              <button type="button" @click="shareFacebook">
                <i class="pc uic-facebook" />
              </button>
              <button type="button">
                <i class="pc uic-twitter" @click="shareTwitter" />
              </button>
              <button type="button">
                <i class="pc uic-kakaotalk" @click="shareKakaotalk" />
              </button>
              <button type="button">
                <i class="pc uic-attach" @click="shareCommon" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <UDialogModal :is-show="isShowCopyModal">
        <template #content>주소가 복사되었습니다.</template>
        <template #modal-btn1><UButton @click="isShowCopyModal = false">확인</UButton></template>
      </UDialogModal>
    </div>
  </transition>
</template>

<script>
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import UDialogModal from '~/components/user/modal/UDialogModal';
import UButton from '~/components/user/common/UButton.vue';

export default {
  name: 'UShareModal',
  components: { UButton, UDialogModal },
  props: {
    isShow: {
      type: Boolean,
      required: false,
      default: false
    },
    info: {
      type: Object,
      required: false,
      default: () => ({
        imgUrl: '',
        title: '',
        subTitle: '',
        date: ''
      })
    }
  },
  data() {
    return {
      isShowCopyModal: false
    };
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
  },
  methods: {
    shareFacebook() {
      let urlCombine =
        'https://www.facebook.com/sharer/sharer.php?u=' +
        encodeURIComponent(location.href) +
        '&t=' +
        encodeURIComponent(document.title);

      urlCombine = this.xssFilter(urlCombine);
      window.open(urlCombine, '', 'scrollbars=no, width=600, height=600');
    },
    shareTwitter() {
      let urlCombine =
        'https://twitter.com/intent/tweet?text=' +
        encodeURIComponent(document.title) +
        '&url=' +
        encodeURIComponent(location.href);

      urlCombine = this.xssFilter(urlCombine);
      window.open(urlCombine, '', 'scrollbars=no, width=600, height=600');
    },
    shareKakaotalk() {
      const shareUrl = 'https://' + location.host + window.location.pathname;

      // eslint-disable-next-line no-undef
      Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: this.info.title,
          description: `${this.info.date || ''} ${this.info.subTitle || ''}`,
          imageUrl: this.info.imgUrl || '',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl
          }
        },
        buttons: [
          {
            title: '자세히 보기',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl
            }
          }
        ]
      });
    },
    shareCommon() {
      const shareUrl = 'https://' + location.host + window.location.pathname;
      const text = location.href;

      if (navigator.share) {
        // 모바일 내장 공유 기능
        navigator.share({
          url: shareUrl
        });
      } else if (window.clipboardData && window.clipboardData.setData) {
        window.clipboardData.setData('Text', text);
        this.isShowCopyModal = true;
      } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
        const textarea = document.createElement('textarea');

        textarea.textContent = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          this.isShowCopyModal = true;
        } catch (e) {
          console.warn('Copy to clipboard failed.', e);
          return false;
        } finally {
          document.body.removeChild(textarea);
        }
      }
    },
    xssFilter(value) {
      const lt = /</g;
      const gt = />/g;
      const ap = /'/g;
      const ic = /"/g;

      return value.toString().replace(lt, '&lt;').replace(gt, '&gt;').replace(ap, '&#39;').replace(ic, '&#34;');
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
  width: 100%;
  max-width: 34rem;
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

      i {
        font-size: 3.2rem;
      }
    }
  }

  .body {
    text-align: center;
    padding: 2.4rem 2rem 3.6rem;
    word-break: keep-all;
    margin-bottom: 3.2rem;
    background-color: var(--color-white);
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);

    h3 {
      font-weight: 700;
      font-size: 2rem;
      line-height: 100%;
      margin-bottom: 2.8rem;
      text-align: left;
    }

    .btn-warp {
      display: flex;
      align-items: center;
      justify-content: space-between;

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 5.8rem;
        width: 5.8rem;
        aspect-ratio: 1/1;
        border-radius: 50%;
        border: 1px solid var(--color-u-grey-2);

        i {
          font-size: 3.6rem;
        }
      }
    }
  }
}

@media screen and (min-width: 769px) {
  .modal-inner {
    position: absolute;
    width: 32.8rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0;
  }

  .modal {
    .head {
      .close-btn {
      }
    }

    .body {
      padding: 3.2rem 3.6rem;
      box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);

      h3 {
        font-size: 2.4rem;
        line-height: 150%;
      }

      .btn-warp {
        display: flex;
        align-items: center;
        justify-content: space-between;

        button {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 5.2rem;
          width: 5.2rem;
          aspect-ratio: 1/1;
          border-radius: 50%;
          border: 1px solid var(--color-u-grey-2);
          transition: 0.1s all ease-in-out;

          i {
            font-size: 3.2rem;
          }

          &:hover {
            background-color: var(--color-black);

            i {
              color: var(--color-white);
            }
          }
        }
      }
    }
  }
}
</style>
