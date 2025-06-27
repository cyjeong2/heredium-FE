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
              <button @click="showTerm('MARKETING')">마케팅 활용 동의 및 광고 수집</button> 동의
            </UCheckbox>
            <p>마케팅 수신·활용 동의 시 추가 쿠폰을 제공해 드립니다.</p>
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
            <p>마케팅 수신·활용 동의 시 추가 쿠폰을 제공해 드립니다.</p>
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
      regionData: [
        { state: '서울특별시', districts: ['종로구','중구','용산구','성동구','광진구','동대문구','중랑구','성북구','강북구','도봉구','노원구','은평구','서대문구','마포구','양천구','강서구','구로구','금천구','영등포구','동작구','관악구','서초구','강남구','송파구','강동구'] },
        { state: '부산광역시', districts: ['중구','서구','동구','영도구','부산진구','동래구','남구','북구','해운대구','사하구','금정구','강서구','연제구','수영구','사상구','기장군'] },
        { state: '대구광역시', districts: ['중구','동구','서구','남구','북구','수성구','달서구','달성군'] },
        { state: '인천광역시', districts: ['중구','동구','미추홀구','연수구','남동구','부평구','계양구','서구','강화군','옹진군'] },
        { state: '광주광역시', districts: ['동구','서구','남구','북구','광산구'] },
        { state: '대전광역시', districts: ['동구','중구','서구','유성구','대덕구'] },
        { state: '울산광역시', districts: ['중구','남구','동구','북구','울주군'] },
        { state: '세종특별자치시', districts: ['세종시'] },
        { state: '경기도', districts: ['수원시','성남시','의정부시','안양시','부천시','광명시','평택시','동두천시','안산시','고양시','과천시','구리시','남양주시','오산시','시흥시','군포시','의왕시','하남시','용인시','파주시','이천시','안성시','김포시','화성시','광주시','양주시','포천시','여주시','연천군','가평군','양평군'] },
        { state: '강원도', districts: ['춘천시','원주시','강릉시','동해시','태백시','속초시','삼척시','홍천군','횡성군','영월군','평창군','정선군','철원군','화천군','양구군','인제군','고성군','양양군'] },
        { state: '충청북도', districts: ['청주시','충주시','제천시','보은군','옥천군','영동군','진천군','괴산군','음성군','단양군','증평군'] },
        { state: '충청남도', districts: ['천안시','공주시','보령시','아산시','서산시','논산시','계룡시','당진시','금산군','부여군','서천군','청양군','홍성군','예산군','태안군'] },
        { state: '전라북도', districts: ['전주시','군산시','익산시','정읍시','남원시','김제시','완주군','진안군','무주군','장수군','임실군','순창군','고창군','부안군'] },
        { state: '전라남도', districts: ['목포시','여수시','순천시','나주시','광양시','담양군','곡성군','구례군','고흥군','보성군','화순군','장흥군','강진군','해남군','영암군','무안군','함평군','영광군','장성군','완도군','진도군','신안군'] },
        { state: '경상북도', districts: ['포항시','경주','김천시','안동시','구미시','영주시','영천시','상주시','문경시','경산시','군위군','의성군','청송군','영양군','영덕군','청도군','고령군','성주군','칠곡군','예천군','봉화군','울진군','울릉군'] },
        { state: '경상남도', districts: ['창원시','김해시','진주시','통영시','사천시','밀양시','거제시','양산시','의령군',' 함안군','창녕군','고성군','남해군','하동군','산청군','함양군','거창군','합천군'] },
        { state: '제주특별자치도', districts: ['제주시','서귀포시'] },
      ],
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
        localStorage.setItem('isMarketing', JSON.stringify(newValue.MARKETING));
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
    localStorage.removeItem('isMarketing');
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

      p {
        font-size: 1.3rem;     /* 안내문은 좀 더 작게 1.4rem */
        margin-left: 3rem;
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
</style>
