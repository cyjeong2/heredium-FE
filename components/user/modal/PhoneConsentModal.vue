<template>
  <transition name="fade">
    <div v-if="isShow" class="modal-wrap">
      <div class="modal-inner">
        <div class="head">
          핸드폰 인증
          <button type="button" @click="$emit('close')"><i class="ic-close" /></button>
        </div>

        <div class="body" body-scroll-lock-ignore>
          <h3 style="text-align:center; margin:3rem 0;">
            멤버십 전환을 위해<br/>본인 인증이 필요합니다.
          </h3>

          <div class="term-select" style="text-align:center;">
            <UCheckbox v-model="isTerms.AGREE">
              <strong>[필수]</strong>
              <button type="button" @click="showTerm('AGREE')">
                &nbsp;개인정보 수집 및 활용
              </button>에 동의합니다.
            </UCheckbox>
          </div>
        </div>

        <div class="foot" body-scroll-lock-ignore>
          <UButton
            :button-type="cancelType"
            :class="['btn-outline', cancelClass]"
            @click="$emit('close')"
          >{{ cancelText }}</UButton>

          <UButton
            :button-type="confirmType"
            :class="['btn-fill', confirmClass]"
            :disabled="!isTerms.AGREE"
            @click="emitConfirm"
          >{{ confirmText }}</UButton>
        </div>
      </div>

      <URegisterModal
        :is-show="modal.isTerms"
        :term-target="termTarget"
        :terms-data="termsData"
        @close="modal.isTerms = false"
        @agree="termAgree"
      />
    </div>
  </transition>
</template>

<script>
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import UButton from '~/components/user/common/UButton';
import UCheckbox from '~/components/user/common/UCheckbox';
import URegisterModal from '~/components/user/modal/URegisterModal';

export default {
  name: 'PhoneConsentModal',
  components: { UButton, UCheckbox, URegisterModal },
  props: {
    isShow: { type: Boolean, default: false },
    // 버튼 텍스트/스타일을 부모에서 커스텀 가능
    confirmText: { type: String, default: '인증하기' },
    cancelText:  { type: String, default: '취소' },
    confirmType: { type: String, default: 'primary' },   // UButton button-type
    cancelType:  { type: String, default: 'secondary' },
    confirmClass:{ type: String, default: '' },           // 추가 CSS 클래스
    cancelClass: { type: String, default: '' },
  },
  data() {
    return {
      beforeScroll: 0,
      isTerms: { AGREE: false },
      modal: { isTerms: false },
      termTarget: '',
      termsData: null,
    };
  },
  watch: {
    isShow(val) {
      if (val) {
        this.beforeScroll = window.scrollY;
        disableBodyScroll(document, {
          allowTouchMove: el => el.hasAttribute('body-scroll-lock-ignore')
        });
      } else {
        clearAllBodyScrollLocks();
        this.$nextTick(() => window.scrollTo(0, this.beforeScroll));
      }
    }
  },
  beforeDestroy() {
    clearAllBodyScrollLocks();
  },
  methods: {
    async showTerm(target) {
      this.termTarget = target;
      this.termsData = await this.$axios.$get('/user/policies/posting', {
        params: { type: this.termTarget }
      });
      this.modal.isTerms = true;
    },
    termAgree() {
      this.isTerms[this.termTarget] = true;
      this.modal.isTerms = false;
    },
    emitConfirm() {
      if (!this.isTerms.AGREE) return;
      // 부모에서 onPhoneChange() 연결
      this.$emit('confirm');
    },
  }
};
</script>

<style lang="scss" scoped>
.modal-wrap {
  position: fixed; inset: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,.5); z-index: 500;
}
.modal-inner {
  position: relative; display: flex; flex-direction: column;
  height: 100%; width: 100%; background: #fff;

  .head {
    display:flex; align-items:center; position:relative;
    height:6rem; padding:0 6rem 0 2rem;
    font-weight:700; font-size:2rem; border-bottom:1px solid var(--color-u-grey-1);
    button { position:absolute; top:50%; right:2rem; transform:translateY(-50%); }
    i { font-size:3.2rem; }
  }

  .body { flex:1; overflow-y:auto; padding:2rem; }
  .foot {
    position: sticky; bottom: 0; left:0; width:100%;
    display:grid; grid-template-columns:1fr 1fr; gap:1.6rem;
    padding:2rem; border-top:1px solid var(--color-u-grey-1); background:#fff; z-index:10;
  }
}
@media (min-width: 769px) {
  .modal-inner {
    width: 44.4rem; height: auto; position:absolute;
    top:50%; left:50%; transform:translate(-50%,-50%);
    box-shadow: 0 1rem 3rem rgba(0,0,0,.175);
    .head { padding:3.2rem 3.6rem; font-size:2.4rem; }
    .body { max-height: 40.8rem; padding:1.4rem 3.6rem; }
    .foot { position: static; padding: 2rem 3.2rem 2rem; margin-top:2.5rem; }
  }
}

/* 버튼 커스텀 훅 */
:deep(.btn-fill),
:deep(.btn-outline) {
  height: 4.8rem; min-width: 10.4rem;
  font-weight: 700; border-radius: 0.8rem; padding: 0 1.6rem;
}
:deep(.btn-fill) {
  background: var(--color-u-primary);
  border: 1px solid var(--color-u-primary);
  color: #fff;
}
:deep(.btn-fill[disabled]) { opacity: .5; cursor: not-allowed; }
:deep(.btn-outline) {
  background: #fff;
  border: 1px solid var(--color-grey-3);
  color: var(--color-grey-9);
}
:deep(.btn-outline:hover) { border-color: var(--color-grey-5); }

.term-select button {
  margin-right:.5rem; font-size:1.4rem; font-weight:700;
  color: var(--color-u-primary); line-height:150%;
}
</style>
