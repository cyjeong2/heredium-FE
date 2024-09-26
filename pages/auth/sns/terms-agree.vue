<template>
  <div class="container">
    <div class="register-wrap">
      <h1>간편 회원가입</h1>
      <template v-if="!isTermsAgreeDone">
        <h2>헤레디움 이용을 위해 약관 동의가 필요합니다.</h2>
        <div v-if="provider !== 'kakao'" class="terms-area">
          <div class="all-terms">
            <UCheckbox v-model="isAllChecked" @input="setCheckedAll"><strong>약관 전체 동의</strong></UCheckbox>
          </div>
          <div class="each-terms">
            <UCheckbox v-model="isTerms.AGE">
              <strong>[필수]</strong>
              만 14세 이상이에요.
            </UCheckbox>
            <UCheckbox v-model="isTerms.SERVICE">
              <strong>[필수]</strong>
              <button @click="showTerm('SERVICE')">서비스 이용약관</button>동의
            </UCheckbox>
            <UCheckbox v-model="isTerms.AGREE">
              <strong>[필수]</strong>
              <button @click="showTerm('AGREE')">개인정보 수집 및 이용동의서</button>동의
            </UCheckbox>
            <UCheckbox v-model="isTerms.MARKETING">
              <strong>[선택]</strong>
              마케팅 활용 동의 및 광고 수신 동의
            </UCheckbox>
          </div>
        </div>
        <div class="btn-area">
          <UButton w-size="100" @click="submitTerms">다음</UButton>
        </div>
      </template>
      <template v-else>
        <h2>헤레디움 이용을 위하여 추가 절차가 필요합니다.</h2>
        <div class="btn-area">
          <UButton w-size="100" @click="goPhoneNice">휴대폰 인증</UButton>
        </div>
      </template>
    </div>
    <URegisterModal
      :is-show="modal.isTerms"
      :term-target="termTarget"
      :terms-data="termsData"
      @close="modal.isTerms = false"
      @agree="termAgree"
    />
    <UDialogModal :is-show="modal.isError">
      <template #content>필수 약관에 동의해주세요.</template>
      <template #modal-btn2>
        <UButton w-size="100" class="feedback-btn" @click="modal.isError = false">확인</UButton>
      </template>
    </UDialogModal>
    <UDialogModal :is-show="modal.isAuthError">
      <template #content>{{ authErrorMsg }}</template>
      <template #modal-btn2>
        <UButton w-size="100" class="feedback-btn" @click="$router.push('/auth/login')">확인</UButton>
      </template>
    </UDialogModal>
  </div>
</template>

<script>
import { createFormElement } from '~/assets/js/commons';
import UButton from '~/components/user/common/UButton';
import URegisterModal from '~/components/user/modal/URegisterModal';
import UCheckbox from '~/components/user/common/UCheckbox';
import UDialogModal from '~/components/user/modal/UDialogModal';

export default {
  name: 'TermsAgree',
  components: { URegisterModal, UCheckbox, UButton, UDialogModal },
  asyncData({ params, redirect, query }) {
    const provider = params?.provider || '';
    let snsToken = params?.snsToken;
    let authErrorMsg = '';
    let isTermsAgreeDone = false;

    if (provider === 'kakao') {
      isTermsAgreeDone = true;
    }

    if (query.error) {
      const error = query.error;

      if (error === 'UNDER_FOURTEEN') {
        authErrorMsg = '만 14세 미만의 어린이는 가입할 수 없어요.';
      } else if (error === 'NOT_EQ_PHONE') {
        authErrorMsg = 'SNS 계정과 인증 정보가 일치하지 않아요.';
      } else if (error === 'BAD_VALID') {
        authErrorMsg = '서버가 응답하지 않습니다.';
      } else {
        redirect('/auth/login');
      }
      snsToken = query.snsToken;
      isTermsAgreeDone = true;
    }

    if (!authErrorMsg && !snsToken) {
      redirect('/auth/login');
    }

    return { snsToken, provider, authErrorMsg, isTermsAgreeDone };
  },
  data() {
    return {
      snsToken: '',
      provider: '',
      termTarget: '',
      termsData: null,
      isAllChecked: false,
      isTermsAgreeDone: false,
      isTerms: {
        AGE: false,
        SERVICE: false,
        AGREE: false,
        MARKETING: false
      },
      modal: {
        isTerms: false,
        isError: false,
        isAuthError: false
      },
      authErrorMsg: ''
    };
  },
  watch: {
    isTerms: {
      deep: true,
      handler(newValue) {
        this.isAllChecked = !Object.values(newValue).some((item) => !item);
      }
    }
  },
  created() {
    if (this.authErrorMsg) {
      this.modal.isAuthError = true;
    }
  },
  methods: {
    async showTerm(target) {
      this.termTarget = target;
      this.termsData = await this.$axios.$get('/user/policies/posting', {
        params: {
          type: this.termTarget
        }
      });
      this.modal.isTerms = true;
    },
    termAgree() {
      this.isTerms[this.termTarget] = true;
      this.modal.isTerms = false;
    },
    setCheckedAll(newValue) {
      for (const key in this.isTerms) {
        this.isTerms[key] = newValue;
      }
    },
    submitTerms() {
      if (this.isTerms.AGE && this.isTerms.SERVICE && this.isTerms.AGREE) {
        this.isTermsAgreeDone = true;
      } else {
        this.modal.isError = true;
      }
    },
    async goPhoneNice() {
      if (this.provider === 'kakao' || (this.isTerms.AGE && this.isTerms.SERVICE && this.isTerms.AGREE)) {
        const windowLocation = window.location;
        const returnUrl = `${windowLocation.protocol}//${windowLocation.host}/auth/sns/done?snsToken=${this.snsToken}&marketing=${this.isTerms.MARKETING}&provider=${this.provider}`;
        const errorUrl = `${windowLocation.protocol}//${windowLocation.host}/auth/login`;
        const res = await this.$axios
          .$get('/nice/encrypt', {
            params: {
              returnUrl,
              errorUrl
            }
          })
          .catch((err) => {
            console.log(err);
            alert('에러가 발생했습니다.\n다시 시도해 해주세요.');
            window.location.reload(true);
          });
        const form = createFormElement('https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb', {
          m: 'checkplusService',
          recvMethodType: 'get',
          EncodeData: res
        });

        document.querySelector('body').appendChild(form);
        form.submit();
        form.remove();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.register-wrap {
  padding-top: 12.5rem;
  max-width: 43.6rem;
  margin: 0 auto 12rem;

  h1 {
    font-weight: 700;
    font-size: 4.2rem;
    line-height: 150%;
    letter-spacing: -0.5px;
    text-align: center;
    margin-bottom: 2.8rem;
  }

  h2 {
    font-weight: 500;
    font-size: 2rem;
    line-height: 150%;
    margin-bottom: 3.2rem;
    text-align: center;
    word-break: keep-all;
  }

  .terms-area {
    padding: 2rem 0 2.2rem;
    border-top: 1px solid var(--color-black);
    border-bottom: 1px solid var(--color-black);
    margin-bottom: 3.2rem;

    .all-terms {
      padding-bottom: 2.2rem;
      margin-bottom: 2.4rem;
      border-bottom: 1px solid var(--color-u-grey-1);

      strong {
        font-size: 1.6rem;
        font-weight: 500;
      }
    }

    .each-terms {
      display: flex;
      flex-direction: column;

      strong {
        font-weight: 500;
        margin-right: 0.3rem;
      }

      label {
        margin-bottom: 1.3rem;

        &:last-child {
          margin-bottom: 0;
        }
      }

      button {
        color: var(--color-u-primary);
        margin-right: 0.3rem;
        font-weight: 500;
      }
    }
  }
}
</style>
