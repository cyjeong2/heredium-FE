<template>
  <main class="container">
    <SideBarMyPage />
    <section class="info-sec">
      <div class="my-info-head">
        <h2>내 정보 수정</h2>
        <div v-if="modify === false" class="grid-wrap"></div>
      </div>
      <div v-if="modify === false" class="my-info-body">
        <p class="account-info">계정 정보는 안전하게 보호되고 있어요. <br class="only-mobile" />수정을 원하면 비밀번호를 입력해주세요.</p>
        <UInput
          v-model="password"
          type="password"
          placeholder="비밀번호를 입력해주세요."
          w-size="full"
          class="h-m"
          style="margin-bottom: 1.2rem; max-width: 43.6rem;"
          @enter="onPasswordConfirm"
        />
        <UButton w-size="100" @click="onPasswordConfirm">확인</UButton>
      </div>
      <div v-else class="my-info-body">
        <div class="add-info">
          <p class="p1">회원 정보</p>
        </div>
        <div class="grid-wrap"></div>
        <div class="form-rows">
          <!-- 이름 (읽기전용 입력으로 보여주기) -->
          <div class="form-row">
            <label class="form-label">이름</label>
            <div class="form-field">
              <UInput :value="account.name" readonly disabled class="h-xs" w-size="full" />
            </div>
          </div>
          <!-- 아이디 -->
          <div class="form-row">
            <label class="form-label">아이디</label>
            <div class="form-field">
              <div v-if="!emailChange" class="inline-field">
                <UInput :value="account.email" readonly disabled class="h-xs" w-size="full" />
                <div v-if="!isSNSLogin" class="inline-field">
                  <UButton class="xs" button-type="chart" @click="onEmailChange">아이디 변경</UButton>
                </div>
                <div v-else class="sns-label">
                  [{{
                    SNSLoginType === 'KAKAO' ? '카카오'
                    : SNSLoginType === 'NAVER' ? '네이버'
                    : SNSLoginType === 'GOOGLE' ? '구글'
                    : SNSLoginType === 'APPLE' ? '애플' : '존재하지 않는 SNS'
                  }}]
                </div>
              </div>
              <div v-else>
                <UInput
                  v-model="account.email"
                  class="h-xs"
                  w-size="full"
                  :class="{ 'is-error': !feedback.email.isValid }"
                  :error-msg="feedback.email.text"
                  placeholder="id@gmail.com"
                />
                <div style="margin-top: 8px;">
                  <UButton class="xs" button-type="chart" @click="cancelEmailChange">취소</UButton>
                </div>
              </div>
            </div>
          </div>
          <!-- 비밀번호(변경 버튼) -->
          <div v-if="!isSNSLogin" class="form-row">
            <label class="form-label">새 비밀번호</label>
            <div class="form-field">
              <div v-if="!passwordChange" class="inline-field">
                <UButton class="xs" button-type="chart" @click="onPasswordChange">비밀번호 변경</UButton>
              </div>
              <div v-else class="stack">
                <UInput
                  v-model="newPassword1"
                  type="password"
                  class="h-xs"
                  w-size="full"
                  :class="{ 'is-error': !feedback.newPassword1.isValid }"
                  :error-msg="feedback.newPassword1.text"
                  placeholder="8 ~ 16자로 입력해주세요."
                />
                <UInput
                  v-model="newPassword2"
                  type="password"
                  class="h-xs mt-8"
                  w-size="full"
                  :class="{ 'is-error': !feedback.newPassword2.isValid }"
                  :error-msg="feedback.newPassword2.text"
                  placeholder="비밀번호를 재입력해주세요."
                />
                <div style="margin-top: 8px;">
                  <UButton class="xs" button-type="chart" @click="cancelPasswordChange">취소</UButton>
                </div>
              </div>
            </div>
          </div>

          <!-- 휴대폰 번호 -->
          <div class="form-row">
            <label class="form-label">휴대폰 번호</label>
            <div class="form-field">
              <div class="inline-field">
                <UInput :value="getPhone(account.phone)" readonly disabled class="h-xs" w-size="full" />
                <UButton class="xs" button-type="chart" @click="onPhoneChange">
                  {{ currentUser?.birthDate == null ? '휴대폰 인증' : '휴대폰 번호 변경' }}
                </UButton>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="marketing-area"> -->
          <!-- <UCheckbox v-model="account.isMarketingReceive">마케팅 활용 동의 및 광고 수신 동의</UCheckbox> -->
        <!-- </div> -->
        <div class="add-info">
          <p class="p1">추가 정보 입력</p>
          <p class="p2">추가 정보 입력 및 마케팅 정보 수신활용에 동의하시면 혜택을 드려요!</p>
        </div>
        <div class="grid-wrap" style="padding-top: 2.2rem;"></div>
        <div class="terms-area">
          <div class="each-terms">
            <UCheckbox v-model="form.additionalInfoAgreed">
              <strong style="margin-right: 5px;">(선택)</strong>추가 개인정보 수집 및 활용에 동의합니다.
            </UCheckbox>
            <div v-if="form.additionalInfoAgreed" class="grid-gray-wrap"></div>
            <div v-if="form.additionalInfoAgreed" class="add-input">
              <div class="input job-input">
                <label>직업</label>
                <div style="margin-top: 1.2rem;">
                  <USelect
                    v-model="form.job"
                    :option-list="jobOptions"
                    default-text="선택"
                    w-size="full"
                    :searchable="true"
                  />
                </div>
              </div>

              <div class="input city-input">
                <label>지역</label>
                <div style="margin-top: 1.2rem;">
                  <USelect
                    v-model="form.region.state"
                    :option-list="cityOptions"
                    w-size="full"
                    default-text="시/도 선택"
                    :searchable="true"
                  />
                </div>
              </div>
              <div class="input district-input">
                <USelect
                  v-model="form.region.district"
                  :option-list="districtOptions"
                  w-size="full"
                  default-text="시/군/구 선택"
                  :searchable="true"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="terms-area">
          <div class="each-terms">
            <UCheckbox v-model="isTerms.MARKETING" class="checkBox">
              <strong style="margin-right: 5px;">(선택)</strong>마케팅 정보 수집에 동의합니다.
            </UCheckbox>
          </div>
          <div class="marketing-info">
            <p>
              고객(정보주체)의 개인정보보호 및 권리는
              「개인정보 보호법」및 관계 법령에 따라 헤레디움(사이트)에서 안전하게 관리하고 있습니다.
            </p>
          </div>
        </div>
        <div class="submit-area">
          <UButton w-size="100" @click="onSaveData">완료</UButton>
          <NuxtLink to="/mypage/info/withdrawal" class="withdrawal-btn">회원탈퇴</NuxtLink>
        </div>
      </div>
      <UDialogModal no-scroll-lock :is-show="modal.isError">
        <template #content>{{ errorMsg }}</template>
        <template #modal-btn2>
          <UButton w-size="100" button-type="primary" @click="modal.isError = false">확인</UButton>
        </template>
      </UDialogModal>
      <UDialogModal
        no-scroll-lock
        :is-show="modal.isSave"
        title="저장 완료"
        @close="modal.isSave = false"
      >
        <template #content>
          저장이 완료되었습니다.
        </template>
        <template #modal-btn2>
          <UButton
            w-size="100"
            button-type="primary"
            @click="onConfirmModal"
          >
            확인
          </UButton>
        </template>
      </UDialogModal>
      <UDialogModal
        no-scroll-lock
        title="선택 동의 해지 안내"
        title-align="center"
        content-align="center"
        :is-show="showCancelWarning"
        @close="showCancelWarning = false"
      >
        <template #content>
          선택 약관 동의를 해지하면<br/>
          추가 혜택이 제한될 수 있어요.<br/>
          그래도 해지하시겠어요?
        </template>
        <template #modal-btn1>
          <UButton button-type="standard" @click="showCancelWarning = false">
            아니요
          </UButton>
        </template>
        <template #modal-btn2>
          <UButton button-type="primary" @click="onConfirmCancelWarning">
            네
          </UButton>
        </template>
      </UDialogModal>
      <UDialogModal
        no-scroll-lock
        :is-show="modal.noChange"
        @close="modal.noChange = false"
      >
        <template #content>변경된 정보가 없습니다.</template>
        <template #modal-btn2>
          <UButton w-size="100" button-type="primary" @click="modal.noChange = false">확인</UButton>
        </template>
      </UDialogModal>
      <!-- 발급 쿠폰 모달 -->
      <!-- <MarketingCoupon
        :is-show="couponModalVisible"
        :coupons="issuedCoupons"
        @close="couponModalVisible = false"
      /> -->
    </section>
  </main>
</template>

<script>
import SideBarMyPage from '~/components/user/page/SideBarMyPage.vue';
import UInput from '~/components/user/common/UInput';
import UButton from '~/components/user/common/UButton';
import UDialogModal from '~/components/user/modal/UDialogModal';
import USelect   from '~/components/user/common/USelect';
import UCheckbox from '~/components/user/common/UCheckbox';
import { createFormElement } from '~/assets/js/commons';
import { REGION_DATA, JOB_OPTIONS, GENDER_TYPE } from '~/assets/js/types';
// import MarketingCoupon from '~/components/user/modal/coupon/MarketingCoupon.vue';

export default {
  name: 'MyPage',
  // MarketingCoupon
  components: { UInput, UButton, UDialogModal, SideBarMyPage, USelect, UCheckbox },
  asyncData({ store, redirect }) {
    const isLogged = !!store.getters['service/auth/getAccessToken'];

    if (!isLogged) {
      redirect('/');
    }
  },
  data() {
    return {
      isSNSLogin: false,
      SNSLoginType: '',
      password: '',
      errorMsg: '',
      account: {},
      emailChange: false,
      passwordChange: false,
      errQuery: '',
      newPassword1: '',
      newPassword2: '',
      modify: false,
      modal: {
        isSave: false,
        isError: false,
        noChange:  false,
      },
      feedback: {
        email: {
          isValid: true,
          text: ''
        },
        newPassword1: {
          isValid: true,
          text: ''
        },
        newPassword2: {
          isValid: true,
          text: ''
        }
      },
      form: {
        job: null,
        region: { state: null, district: null },
        additionalInfoAgreed: false,
        marketingAgreedDate: null,
      },
      originalInfo: {
        encodeData: null,
        email: null,
        phone:  null,
        job: null,
        state: null,
        district: null,
        additionalInfoAgreed: false,
        marketingAgreed: false,
      },
      // 경고 모달 표시용
      showCancelWarning: false,
      pendingPayload: null,
      jobOptions: JOB_OPTIONS,
      regionData: REGION_DATA,
      isTerms: { MARKETING: false },
      couponModalVisible: false,
      issuedCoupons: [],
    };
  },
  async fetch() {
    if (this.$route.params.EncodeData) {
      const userInfo = await this.$axios.$get('/nice/decrypt', {
        params: {
          encodeData: this.$route.params.EncodeData
        }
      });
      if (userInfo) {
        this.modify = true;
        this.account = {
          email: this.$route.params.email,
          name: userInfo.name,
          birthday: userInfo.birthDate,
          gender: userInfo.gender,
          phone: userInfo.mobileNo,
          isLocalResident: this.$route.params.isLocalResident === 'true',
          isMarketingReceive: this.$route.params.isMarketingReceive === 'true'
        };
      }
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters['service/auth/getUserInfo']
    },
    // table 렌더링용
    cityOptions() {
      return this.regionData.map(r => ({ value: r.state, label: r.state }));
    },
    districtOptions() {
      const region = this.regionData.find(r => r.state === this.form.region.state);
      return region
        ? region.districts.map(d => ({ value: d, label: d }))
        : [];
    }
  },
  watch: {
    'form.region.state'(newState) {
      // 시 선택 시 첫 번째 군구 기본 설정
      const opts = this.districtOptions;
      if(!this.currentUser.district){
        this.form.region.district = opts.length ? opts[0].value : null;
      }
      // this.feedback.region = { isValid: true, text: '' };
    }
  },
  created() {

    if (this.currentUser) {
      // and seed your 추가 정보 form
      this.form.job                  = this.currentUser.job
      this.form.region.state         = this.currentUser.state
      this.form.region.district      = this.currentUser.district
      this.form.additionalInfoAgreed = this.currentUser.additionalInfoAgreed
      this.isTerms.MARKETING         = this.currentUser.isMarketingReceive
      this.account.isLocalResident   = this.currentUser.isLocalResident
      this.form.marketingAgreedDate  = this.currentUser.marketingAgreedDate

      // ② originalInfo 에도 똑같이 복사
      Object.assign(this.originalInfo, {
        email: this.currentUser.email,
        job:    this.currentUser.job,
        state:  this.currentUser.state,
        district: this.currentUser.district,
        additionalInfoAgreed: this.currentUser.additionalInfoAgreed,
        marketingAgreed:       this.currentUser.isMarketingReceive,
      });

      // 인증 콜백으로 돌아왔으면 phoneChange 플래그 켜기
      if (this.$route.params.EncodeData) {
        this.phoneChange = true;
      }
    }

    this.$nextTick(() => {
      this.SNSLoginType = this.$store.getters['service/auth/getUserInfo']?.provider;
      this.isSNSLogin = this.SNSLoginType !== 'EMAIL';

      if (this.isSNSLogin) {
        this.onPasswordConfirm();
      }
    });
  },
  methods: {
    async onPasswordConfirm() {
      await this.$axios
        .$get('/user/account', {
          params: {
            password: this.password
          }
        })
        .then((res) => {
          this.modify = true;
          this.account = res;
        })
        .catch(() => {
          if (!this.password) {
            this.modal.isError = true;
            this.errorMsg = '비밀번호를 입력해주세요.';
          } else {
            this.modal.isError = true;
            this.errorMsg = '비밀번호를 다시 확인해주세요.';
          }
        });
    },
    async onPhoneChange() {
      const windowLocation = window.location;
      const returnUrl = `${windowLocation.protocol}//${windowLocation.host}/nice/nice-user-success?isLocalResident=${this.account.isLocalResident}&isMarketingReceive=${this.account.isMarketingReceive}&email=${this.account.email}&returnUrl=mypage-info`;
      const errorUrl = `${windowLocation.protocol}//${windowLocation.host}/mypage/info`;

      await this.$axios
        .$get('/nice/encrypt', {
          params: {
            returnUrl,
            errorUrl
          }
        })
        .then((res) => {
          const form = createFormElement('https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb', {
            m: 'checkplusService',
            recvMethodType: 'get',
            EncodeData: res
          });
          document.querySelector('body').appendChild(form);
          form.submit();
          form.remove();
        })
        .catch((err) => {
          console.log(err);
          alert('에러가 발생했습니다.\n다시 시도해 해주세요.');
          window.location.reload(true);
        });
    },
    isValidate() {
      const clearValid = () => {
        Object.values(this.feedback).forEach((value) => {
          value.isValid = true;
        });
      };
      const emailPattern =
        /^([\w._-])*[a-zA-Z0-9]+([\w._-])*([a-zA-Z0-9])+([\w._-])+@([\w_-])*([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/;
      const isClearForm = () => !Object.values(this.feedback).find((value) => value.isValid === false);
      const emailFeedback = this.feedback.email;
      const newPasswordFeedback1 = this.feedback.newPassword1;
      const newPasswordFeedback2 = this.feedback.newPassword2;

      clearValid();

      if (!this.account.email && this.emailChange) {
        emailFeedback.isValid = false;
        emailFeedback.text = '이메일을 입력해주세요.';
      } else if (!emailPattern.test(this.account.email) && this.emailChange) {
        emailFeedback.isValid = false;
        emailFeedback.text = '@을 포함한 뒷부분을 확인해주세요.';
      } else {
        emailFeedback.isValid = true;
        emailFeedback.text = '';
      }
      if (!this.newPassword1 && this.passwordChange) {
        newPasswordFeedback1.isValid = false;
        newPasswordFeedback1.text = '비밀번호를 입력해 주세요.';
      } else if ((this.newPassword1.length < 8 || this.newPassword1.length > 16) && this.passwordChange) {
        newPasswordFeedback1.isValid = false;
        newPasswordFeedback1.text = '8 ~ 16자리로 입력해주세요.';
      } else {
        newPasswordFeedback1.isValid = true;
        newPasswordFeedback1.text = '';
      }

      if (!this.newPassword2 && this.passwordChange) {
        newPasswordFeedback2.isValid = false;
        newPasswordFeedback2.text = '비밀번호 확인을 입력해 주세요.';
      } else if (this.passwordChange && this.newPassword1 !== this.newPassword2) {
        newPasswordFeedback1.isValid = false;
        newPasswordFeedback2.isValid = false;
        newPasswordFeedback2.text = '비밀번호가 일치하는지 확인해주세요.';
      } else {
        newPasswordFeedback2.isValid = true;
        newPasswordFeedback2.text = '';
      }

      return isClearForm();
    },
    async onSaveData() {
      if (this.isValidate()) {
        const isLocal = (this.form.region.state === '대전광역시');

        const payload = {
          email: this.account.email,
          password: this.passwordChange ? this.newPassword1 : null,
          isLocalResident: isLocal,
          encodeData: this.$route.params.EncodeData,
          job: this.form.job,
          state: this.form.region.state,
          district: this.form.region.district,
          additionalInfoAgreed: this.form.additionalInfoAgreed,
          isMarketingReceive: this.isTerms.MARKETING,
          marketingAgreedDate: this.form.marketingAgreedDate,
          marketingPending: false,
        }

        // ─── 1) “아무 것도 바뀐 게 없으면” 체크 ──────────────────
        const noChange =
          !this.emailChange        &&                   // 이메일 변경 안 함
          !this.passwordChange     &&                   // 비번 변경 안 함
          payload.email            === this.originalInfo.email &&
          payload.job              === this.originalInfo.job &&
          payload.state            === this.originalInfo.state &&
          payload.district         === this.originalInfo.district &&
          payload.additionalInfoAgreed === this.originalInfo.additionalInfoAgreed &&
          payload.isMarketingReceive   === this.originalInfo.marketingAgreed;

        if (noChange) {
          // show a simple “no changes” dialog
          this.modal.noChange = true;
          return;
        }
        // ────────────────────────────────────────────────────

        const wasComplete = Object.values(this.originalInfo).every(v => !!v);

        // 2) 지금도 모두 채워져 있는지
        const isCompleteNow = [
          this.form.job,
          this.form.region.state,
          this.form.region.district,
          this.form.additionalInfoAgreed,
          this.isTerms.MARKETING
        ].every(v => !!v);

        // 3) “원래 완전 → 지금 빠짐” 일 때만 경고 모달
        if (wasComplete && !isCompleteNow) {
          this.pendingPayload = payload;
          this.showCancelWarning = true;
          return;
        }

        // 아니라면 바로 저장
        await this.doSave(payload);
      }
    },
    // 실제 PUT 호출
    async doSave(payload) {
      const res = await this.$axios
        .$put('/user/account', payload)
        .catch((err) => {
          const errorMessage = err.response.data?.MESSAGE || '';
          if (errorMessage === 'DUPLICATE_EMAIL') {
            this.feedback.email.isValid = false;
            this.feedback.email.text = '중복된 이메일 입니다.';
          }
        });

      if (res) {
        this.account.email = res.email;

        // 추가 정보
        this.form.job                      = res.job;
        this.form.region.state             = res.state;
        this.form.region.district          = res.district;
        this.form.additionalInfoAgreed     = res.additionalInfoAgreed;
        this.isTerms.MARKETING             = res.isMarketingReceive;

        this.issuedCoupons = res.coupons || [];
        this.modal.isSave = true;
        this.$store.commit('service/auth/setUserInfo', res);
      }
    },
    // 모달에서 “네” 눌렀을 때
    async onConfirmCancelWarning() {
      this.showCancelWarning = false;
      await this.doSave(this.pendingPayload);
      this.pendingPayload = null;
    },
    onEmailChange() {
      this.emailChange = true;
    },
    onPasswordChange() {
      this.passwordChange = true;
    },
    getGender(gender) {
      return GENDER_TYPE[gender];
    },
    getPhone(phone) {
      return phone?.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3');
    },
    onConfirmModal() {
      this.newPassword1 = '';
      this.newPassword2 = '';
      this.passwordChange = false;
      this.emailChange = false;
      this.modal.isSave = false;

      if (this.issuedCoupons.length > 0) {
        this.couponModalVisible = true;
      }
    },
    closeCouponModal() {
      this.couponModalVisible = false;
      this.issuedCoupons = [];
    },
    cancelEmailChange() {
      this.emailChange = false;
      this.account.email = this.originalInfo.email; // 기존 값 복원
      this.feedback.email.isValid = true;
      this.feedback.email.text = '';
    },
    cancelPasswordChange() {
      this.passwordChange = false;
      this.newPassword1 = '';
      this.newPassword2 = '';
      this.feedback.newPassword1.isValid = true;
      this.feedback.newPassword1.text = '';
      this.feedback.newPassword2.isValid = true;
      this.feedback.newPassword2.text = '';
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  margin: 3.2rem 0 4rem;
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 2.8rem;
}

h2 {
  padding-bottom: 1.3rem;
  border-bottom: none;
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.8rem;
}

.container {
  margin-bottom: 12rem;
}

.tabs {
  display: flex;
  &.page {
    display: flex;
    margin-bottom: 4rem;
    .tab + .tab {
      margin-left: 2.4rem;
    }
    .tab {
      font-size: 1.8rem;
      font-weight: 500;
      line-height: 1.8rem;
      color: var(--color-grey-4);

      &.nuxt-link-active {
        color: var(--color-u-primary);
        font-weight: 700;
      }
    }
  }
}

.info-sec {
  .my-info-body {
    .account-info{
      margin: 2.4rem 0;
      font-size: 1.6rem;
      font-weight: 500;
      line-height: 2.6rem;
    }

    table {
      table-layout: fixed;
      border-collapse: collapse;
      border-spacing: 0;
      width: 100%;

      tr {
        border-bottom: 0.1rem solid rgba(190, 190, 190, 0.4);
      }

      td + td {
        border-left: 0.1rem solid var(--color-black);
      }

      td {
        padding: 2.1rem 1.6rem 1.7rem;
        &:first-of-type {
          width: 36%;
          font-size: 1.4rem;
          font-weight: 700;
          line-height: 1.4rem;
        }

        &:last-of-type {
          width: 64%;
          font-size: 1.4rem;
          font-weight: 400;
          line-height: 1.4rem;
        }

        div {
          margin-top: 1.7rem;
        }
      }
    }
    .marketing-area {
      margin-bottom: 4rem;
      padding: 1.8rem 1.6rem;
      background: rgba(235, 235, 235, 0.4);
    }

    .withdrawal-btn {
      position: relative;
      display: inline-block;
      margin-top: 2rem;
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--color-u-primary);
      line-height: 1.4rem;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -0.4rem;
        width: 100%;
        height: 0.1rem;
        background-color: var(--color-u-primary);
      }
    }
  }
}

@media screen and (min-width: 769px) {
  h1 {
    margin: 0 0 4.7rem;
    font-size: 4.2rem;
    line-height: 150%;
  }

  .container {
    display: flex;
    margin-bottom: 12rem;
    margin-top: 4.8rem;

    > div {
      width: 34.8rem;
      padding-right: 14.8rem;
    }

    > section {
      flex: 1 0 0;
    }
  }

  .pc-tabs {
    h2 {
      font-size: 1.8rem;
      font-weight: 700;
      line-height: 160%;
      letter-spacing: 0.25px;
      border-bottom: 1px solid var(--color-black);
      padding-bottom: 1rem;
      margin-bottom: 1.3rem;
    }

    a {
      display: block;
      font-size: 1.6rem;
      font-weight: 500;
      line-height: 160%;
      letter-spacing: 0.25px;
      margin-bottom: 2.6rem;

      &.nuxt-link-active {
        color: var(--color-u-primary);
        font-weight: 700;
      }

      &.big-tab {
        font-size: 1.8rem;
        font-weight: 700;
        line-height: 160%;
        letter-spacing: 0.25px;
      }
    }
  }

  .info-sec {
    .my-info-head h2 {
      font-size: 3.2rem;
      font-weight: 500;
      line-height: 150%;
      padding-bottom: 2.6rem;
    }

    .my-info-body {
      .account-info{
        margin: 2rem 0 3.7rem;
        font-size: 2rem;
        line-height: 150%;
      }

      .input-wrap {
        max-width: 31.6rem;
      }

      button.primary {
        max-width: 43.6rem;
      }

      table {
        td {
          height: 5.6rem;
          padding: 0.8rem 2.4rem;

          &:first-of-type {
            width: 17.6rem;
            font-size: 1.6rem;
            font-weight: 700;
            line-height: 160%;
          }

          &:last-of-type {
            width: auto;
            font-size: 1.6rem;
            line-height: 160%;
            padding: 0.8rem 2.4rem;
          }

          div {
            display: inline-block;
            margin-top: 0;
            margin-left: 1.7rem;
          }

          ::v-deep label .text {
            font-weight: 500;
            font-size: 1.6rem;
          }

          .input-wrap {
            margin-left: 0;
            margin-bottom: 0;
          }
        }
      }

      .marketing-area {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 5.2rem;
        padding: 1.8rem 2rem;

        ::v-deep .text {
          font-weight: 500;
          font-size: 1.6rem;
        }
      }

      .withdrawal-btn {
        margin-top: 0;
        line-height: 160%;

        &::after {
          left: 0;
          bottom: 0;
          height: 1px;
        }
      }
    }
  }

  .submit-area {
    position: relative;
    display: flex;
    justify-content: center;

    button {
      width: 15.2rem !important;
    }

    .withdrawal-btn {
      position: absolute !important;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
    }
  }
}

/* ─── 추가 정보 입력 섹션 ───────────────────────────────── */
.add-info {
  margin-top: 1.8rem;
  p {
    margin-top: 0;
  }
  .p1 {
    font-weight: 700;
    font-size: 1.8rem;
    text-align: left;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
  }
  .p2 {
    font-size: 1.1rem;
    text-align: left;
    margin-bottom: 1.3rem;
  }
}
@media screen and (min-width: 768px) {
  .add-info {
    margin-top: 2.8rem;
    .p1 {
      margin-bottom: 1.5rem;
    }
    .p2 {
      font-size: 1.3rem;
    }
  }
}

/* ─── 두 칼럼 그리드 ───────────────────────────────────── */
.grid-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid black;
  row-gap: 3.2rem;
  column-gap: 1.6rem;
}
@media screen and (min-width: 768px) {
  .grid-wrap {
    row-gap: 2.4rem;
    column-gap: 2.8rem;
  }
}

.grid-gray-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid var(--color-grey-1);
  margin-top: 1.8rem;
  row-gap: 3.2rem;
  column-gap: 1.6rem;
}
@media screen and (min-width: 768px) {
  .grid-gray-wrap {
    row-gap: 2.4rem;
    column-gap: 2.8rem;
    margin-top: 2.2rem;
  }
}

/* ─── 지역 입력 ───────────────────────────────────────── */
.region-row {
  display: flex;
  gap: 1.6rem;
  margin-top: 1.2rem;
}
.region-input {
  margin-bottom: 2.0rem;
  .error-msg {
    margin-top: 0.8rem;
    font-size: 1.4rem;
    color: var(--color-u-error);
  }
}

/* ─── 동의 체크박스 & 안내 ──────────────────────────────── */
.terms-area {
  .each-terms {
    display: flex;
    flex-direction: column;
    padding: 2.0rem 2.4rem;
    border-top: 1px solid var(--color-grey-1);
    border-bottom: 1px solid var(--color-grey-1);
    label + label {
      margin-top: 2rem;
    }
    strong {
      font-size: 1.4rem;
      font-weight: 700;
    }
    p {
      margin-top: 0.8rem;
      font-size: 1.3rem;
      margin-left: 3rem;
    }
    border: 1px solid var(--color-grey-1);
  }
  button {
    margin-right: 0.5rem;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-u-primary);
  }
  .marketing-info {
    padding: 2.0rem 2.4rem;
    margin-bottom: 3.5rem;
    background-color: var(--color-grey-1);
    border: 1px solid var(--color-grey-1);
    font-size: 1.4rem;
    color: var(--color-grey-8);
  }
  @media screen and (max-width: 767px) {
    .each-terms {
      padding: 1.6rem 0.7rem;       /* 예: 모바일용 값 */
    }
    .marketing-info {
      padding: 0.8rem 0.5rem;
      margin-bottom: 2.5rem;
    }
  }
}

/* ─── .add-input 에 Grid 레이아웃 적용 ───────────────── */
.add-input {
  display: grid;
  grid-template-columns: 1fr 1fr;   /* 모바일: 한 칸 */
  grid-template-rows: auto auto;/* 두 행 (직업 / 지역) */
  gap: 1.6rem;                  /* 행 간격 */
  width: 100%;
  margin-top: 1.2rem;
}

.add-input .job-input {
  grid-column: 1/3;  /* 1열부터 3열 직전까지(=두 칸) */
}

.add-input .city-input {
  grid-column: 1;      /* 왼쪽 */
}
.add-input .district-input {
  grid-column: 2;      /* 오른쪽 */
}

/* PC(≥768px) 전용: 2열, 2행 그리드 */
@media screen and (min-width: 768px) {
  .add-input {
    grid-template-columns: 1fr 1fr; /* 두 칸(각각 50%) */
    grid-template-rows: auto auto;  /* 첫째행=직업, 둘째행=지역 */
    width: 50%;
  }
  /* 첫째 행: job-input 이 두 칸을 모두 차지 */
  .add-input .job-input {
    grid-column: 1 / 3;  /* 1열부터 3열 직전까지(=두 칸) */
  }
  /* 둘째 행: city-input 은 왼쪽 칸, district-input 은 오른쪽 칸 */
  .add-input .city-input {
    grid-column: 1;      /* 왼쪽 */
  }
  .add-input .district-input {
    grid-column: 2;      /* 오른쪽 */
  }
}

/* ─── 시군구 레이블 숨기기 ───────────────────────────── */
.district-input > label {
  display: none;
}

/* ─── 시군구 셀렉트와 시/도 셀렉트 높이 정렬 ─────────── */
.district-input {
  /* USelect 컴포넌트가 .u-select 라는 클래스라 가정했을 때 예시 */
  margin-top: 3.4rem;   /* 레이블 아래에서 동일 간격 */
}

/* 기존 table 스타일은 제거(또는 그대로 두고 .form-rows만 새로 추가) */
.form-rows {
  display: grid;
}

/* 한 줄: 좌측 라벨, 우측 필드 */
.form-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  align-items: center;
  column-gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(190,190,190,0.4);
}

.form-label {
  font-size: 1.6rem;
  font-weight: 700;
}

.form-field {
  display: block;
}

/* 입력 + 버튼 가로 배치 */
.inline-field {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 12px;
}

/* 비번 두 칸 세로 쌓기 */
.stack > * + * {
  margin-top: 8px;
}

.sns-label {
  margin-left: 8px;
  font-size: 1.4rem;
  color: var(--color-grey-6);
}

/* 모바일: 세 번째 이미지처럼 세로 쌓기 */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr; /* 라벨/필드 세로 */
    row-gap: 8px;
    border-bottom: 1px solid rgba(190,190,190,0.4);
    padding: 12px 0;
  }
  .form-label {
    font-size: 1.4rem;
  }
  .inline-field {
    grid-template-columns: 1fr; /* 입력과 버튼도 세로 */
    gap: 8px;
  }
}

/* 공통: 인풋 옆에 버튼 */
.inline-field {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: nowrap;    /* 데스크탑에선 한 줄 */
}

/* 인풋은 남는 공간 가변, 버튼은 내용 크기 */
.inline-field :deep(.u-input),
.inline-field .inline-input {
  flex: 1 1 auto;
  width: auto !important;
  min-width: 0;         /* 길어도 줄어들 수 있게 */
}
.inline-field > * {
  flex: 0 0 auto;       /* 버튼/라벨은 고정 폭 */
  min-width: 0;
}

/* 모바일: 공간 부족하면 다음 줄로 내려감 */
@media (max-width: 768px) {
  .inline-field {
    flex-wrap: wrap;    /* 줄바꿈 허용 */
    gap: 8px;
  }
  /* 인풋은 한 줄 전체 사용 */
  .inline-field :deep(.u-input),
  .inline-field .inline-input {
    flex: 1 1 100%;
  }
  /* 버튼도 100% 폭으로 */
  .inline-field > button,
  .inline-field > .u-button,
  .inline-field > div:has(> .xs) {
    flex: 1 1 100%;
    width: 100%;
  }
}

.stack {
  display: flex;
  flex-direction: column;
}

.stack > * + * {
  margin-top: 8px;
}
</style>
