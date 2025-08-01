<template>
  <div class="container">
    <div class="register-wrap">
      <div class="logo-area">
        <img
          src="~assets/img/pc/logo.svg"
          alt="HEREDIUM 로고"
          class="logo"
          width="130"
          height="120"
        />
        <h2>회원가입하고<br />더 깊은 예술을 경험해보세요!</h2>
        <p style="font-size: 1.5rem; text-align: center;">헤레디움 멤버십 연동을 위해 지역 선택을 진행해주세요.</p>
      </div>
      <template v-if="!isTermsAgreeDone">
        <div v-if="provider !== 'kakao'" class="terms-area">
          <h2>헤레디움 이용을 위해 약관 동의가 필요합니다.</h2>
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
              <button @click="showTerm('MARKETING')">마케팅 활용 동의 및 광고 수집</button> 동의
            </UCheckbox>
            <div class="marketing-info">
              <p>
                고객(정보주체)의 개인정보보호 및 권리는
                <strong>「개인정보 보호법」</strong> 및 관계 법령에 따라 헤레디움(사이트)에서 안전하게 관리하고 있습니다.
              </p>
            </div>
          </div>
          <div class="grid-wrap">
            <div class="input region-input">
              <label>지역 <b class="must">*</b></label>
              <div class="region-row">
                <div class="region-col">
                  <USelect
                    v-model="form.region.state"
                    :option-list="cityOptions"
                    w-size="full"
                    default-text="시/도 선택"
                  />
                </div>
                <div class="region-col">
                  <USelect
                    v-model="form.region.district"
                    :option-list="districtOptions"
                    w-size="full"
                    default-text="시/군/구 선택"
                  />
                </div>
              </div>
              <p v-if="!feedback.region.isValid" class="error-msg">
                {{ feedback.region.text }}
              </p>
            </div>
          </div>
        </div>
        <div v-else class="terms-area">
          <div class="each-terms">
            <UCheckbox v-model="isTerms.MARKETING">
              <strong>[선택]</strong>
              <button @click="showTerm('MARKETING')">마케팅 활용 동의 및 광고 수집</button> 동의
            </UCheckbox>
            <div class="marketing-info">
              <p>
                고객(정보주체)의 개인정보보호 및 권리는
                <strong>「개인정보 보호법」</strong> 및 관계 법령에 따라 헤레디움(사이트)에서 안전하게 관리하고 있습니다.
              </p>
            </div>
          </div>
          <div class="grid-wrap">
            <div class="input region-input">
              <label>지역 <b class="must">*</b></label>
              <div class="region-row">
                <div class="region-col">
                  <USelect
                    v-model="form.region.state"
                    :option-list="cityOptions"
                    w-size="full"
                    default-text="시/도 선택"
                  />
                </div>
                <div class="region-col">
                  <USelect
                    v-model="form.region.district"
                    :option-list="districtOptions"
                    w-size="full"
                    default-text="시/군/구 선택"
                  />
                </div>
              </div>
              <p v-if="!feedback.region.isValid" class="error-msg">
                {{ feedback.region.text }}
              </p>
            </div>
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
import USelect from '~/components/user/common/USelect.vue';
import { REGION_DATA } from '~/assets/js/types';

export default {
  name: 'TermsAgree',
  components: { URegisterModal, UCheckbox, UButton, UDialogModal, USelect },
  asyncData({ params, redirect, query }) {
    const provider = params?.provider || '';
    let snsToken = params?.snsToken;
    let authErrorMsg = '';
    let isTermsAgreeDone = false;

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
      authErrorMsg: '',
      feedback: {
        region: { isValid: true, text: '' }
      },
      form: {
        region: { state: '대전광역시', district: '동구' },
      },
      regionData: REGION_DATA,
    };
  },
  computed: {
    cityOptions() {
      return this.regionData.map(r => ({ value: r.state, label: r.state }));
    },
    districtOptions() {
      const region = this.regionData.find(r => r.state === this.form.region.state);
      return region ? region.districts.map(d => ({ value: d, label: d })) : [];
    }
  },
  watch: {
    isTerms: {
      deep: true,
      handler(newValue) {
        this.isAllChecked = !Object.values(newValue).some((item) => !item);
        // localStorage.setItem('isMarketing', JSON.stringify(newValue.MARKETING));
      }
    },
    'form.region.state'(newState) {
      const region = this.regionData.find(r => r.state === newState);
      this.form.region.district = region && region.districts.length
        ? region.districts[0]
        : '';
      this.feedback.region.isValid = true;
      this.feedback.region.text = '';
    }
  },
  mounted() {
    // 마케팅 동의 초기화
    // localStorage.removeItem('isMarketing');
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
      if (this.isValidate()) {
        if (this.provider === 'kakao' || (this.isTerms.AGE && this.isTerms.SERVICE && this.isTerms.AGREE)) {
          this.isTermsAgreeDone = true;
        } else {
          this.modal.isError = true;
        }
      }
    },
    async goPhoneNice() {
      if (this.provider === 'kakao' || (this.isTerms.AGE && this.isTerms.SERVICE && this.isTerms.AGREE)) {
        const windowLocation = window.location;
        // const returnUrl = `${windowLocation.protocol}//${windowLocation.host}/auth/sns/done?snsToken=${this.snsToken}&provider=${this.provider}`;
        const returnUrl = [
            `${windowLocation.protocol}//${windowLocation.host}/auth/sns/done`,
            `snsToken=${encodeURIComponent(this.snsToken)}`,
            `provider=${encodeURIComponent(this.provider)}`,
            // 새로 추가
            `marketing=${this.isTerms.MARKETING}`,
            `state=${encodeURIComponent(this.form.region.state)}`,
            `district=${encodeURIComponent(this.form.region.district)}`
          ].join('&').replace('&', '?');
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
    },
    isValidate() {
      const clearValid = () => {
        Object.values(this.feedback).forEach((value) => {
          value.isValid = true;
          value.text = '';
        });
      };

      const isClearForm = () => !Object.values(this.feedback).find((value) => value.isValid === false);

      clearValid();

      // region 검증
      if (!this.form.region.state) {
        this.feedback.region.isValid = false;
        this.feedback.region.text = '시/도를 선택해주세요.';
      }
      else if (!this.form.region.district) {
        this.feedback.region.isValid = false;
        this.feedback.region.text = '시/군/구를 선택해주세요.';
      }

      return isClearForm();
    }
  },
};
</script>

<style lang="scss" scoped>
.register-wrap {
  padding-top: 4.5rem;
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

.region-row {
  display: flex;
  gap: 1.6rem;
  margin-top: 1.2rem;
}
.region-row .region-col {
  flex: 1;
}
.region-input{
  margin-top: 3.2rem;
  .error-msg {
    margin-top: 0.8rem;
    font-size: 1.4rem;
    color: var(--color-u-error);
  }
}
.input {
  .input-wrap {
    margin-top: 1.6rem;
  }

  .must {
    color: var(--color-u-error);
  }
}
.grid-wrap {
  display: grid;
  margin-top: 4rem;
  border-top: 1px solid var(--color-u-grey-2);
  padding-top: 3.2rem;
  row-gap: 3.2rem;
  column-gap: 1.6rem;

  .input {
    margin-top: 0 !important;
  }
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 2.8rem;
    font-weight: 700;
  }

  p {
    font-size: 1.6rem;
    font-weight: 500;
    color: var(--color-grey-6);
    margin: 0 0 2.4rem;

    @media (min-width: 768px) {
      font-size: 1.8rem;
      margin-bottom: 3rem;
      text-align: left;
      width: 100%;
    }
  }
}

.marketing-info {
    padding: 1.2rem 1.2rem;
    background-color: var(--color-grey-1);
    border: 1px solid var(--color-grey-2);
    border-radius: 0.3rem;
    font-size: 1.4rem;
    color: var(--color-grey-8);

    p {
      font-size: 1.4rem;
      font-weight: 500;
      margin: 0;
      line-height: 1.6;
      text-align: left; /* 기본 왼쪽 정렬 */
    }

    strong {
      font-weight: 700;
    }
  }

  /* 모바일 전용: padding만 줄이고, 여전히 왼쪽 정렬 */
  @media screen and (max-width: 767px) {
    .marketing-info {
      padding: 0.8rem 1rem;
    }
    .marketing-info p {
      /* 이미 기본이 left라면 이 라인은 선택 사항입니다 */
      text-align: left;
    }
  }
</style>
