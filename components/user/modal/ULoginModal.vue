<template>
  <transition name="fade">
    <div v-if="isShow" class="modal-wrap">
      <div class="modal-inner">
        <div class="modal">
          <div class="body">
            로그인이 필요한 서비스입니다.<br />
            로그인 하시겠습니까?
          </div>
          <div class="foot">
            <UButton button-type="secondary" w-size="full" @click="$emit('close')">나중에 할게요</UButton>
            <UButton w-size="full" @click="goLoginPage">로그인 하기</UButton>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock';
import UButton from '~/components/user/common/UButton';

export default {
  name: 'ULoginModal',
  components: { UButton },
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
  },
  methods: {
    goLoginPage() {
      this.$router.push({ path: '/auth/login', query: { redirectPage: this.$route.path } });
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
  width: 30.4rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-white);
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
}

.modal {
  padding: 3.2rem 2rem 3.6rem;

  .body {
    font-weight: 500;
    font-size: 1.6rem;
    line-height: 160%;
    word-break: keep-all;
    margin-bottom: 2.4rem;
  }

  .foot {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1.6rem;

    button {
      display: block;
      width: 100%;
    }
  }
}

@media screen and (min-width: 769px) {
  .modal-inner {
    width: 52.4rem;
  }

  .modal {
    padding: 3.2rem 3.6rem 3.6rem;

    .body {
      font-size: 1.8rem;
      margin-bottom: 3.6rem;
    }
  }
}
</style>
