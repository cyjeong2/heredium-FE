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
          @enter="onPasswordConfirm"
        />
        <UButton w-size="100" @click="onPasswordConfirm">확인</UButton>
      </div>
      <div v-else class="my-info-body">
        <div class="add-info">
          <p class="p1">회원 정보</p>
        </div>
        <div class="grid-wrap"></div>
        <table>
          <tr>
            <td>아이디</td>
            <td v-if="!emailChange">
              {{ account.email }}
              <div v-if="!isSNSLogin">
                <UButton class="xs" button-type="chart" @click="onEmailChange">아이디 변경</UButton>
              </div>
              <div v-else>
                [{{
                  SNSLoginType === 'KAKAO'
                    ? '카카오'
                    : SNSLoginType === 'NAVER'
                    ? '네이버'
                    : SNSLoginType === 'GOOGLE'
                    ? '구글'
                    : SNSLoginType === 'APPLE'
                    ? '애플'
                    : '존재하지 않는 SNS'
                }}]
              </div>
            </td>
            <td v-else>
              <UInput
                v-model="account.email"
                class="h-xs"
                w-size="full"
                :class="{ 'is-error': !feedback.email.isValid }"
                :error-msg="feedback.email.text"
                placeholder="heredium@exemple.com"
              />
            </td>
          </tr>
          <tr>
            <td>이름</td>
            <td>{{ account.name }}</td>
          </tr>
          <tr v-if="!isSNSLogin">
            <td>새 비밀번호</td>
            <td v-if="!passwordChange">
              <UButton class="xs" button-type="chart" @click="onPasswordChange">비밀번호 변경</UButton>
            </td>
            <td v-else>
              <UInput
                v-model="newPassword1"
                type="password"
                class="h-xs"
                :class="{ 'is-error': !feedback.newPassword1.isValid }"
                :error-msg="feedback.newPassword1.text"
                placeholder="8 ~ 16자로 입력해주세요."
              />
            </td>
          </tr>
          <tr v-if="passwordChange">
            <td>새 비밀번호 확인</td>
            <td>
              <UInput
                v-model="newPassword2"
                type="password"
                class="h-xs"
                :class="{ 'is-error': !feedback.newPassword2.isValid }"
                :error-msg="feedback.newPassword2.text"
                placeholder="비밀번호를 재입력해주세요."
              />
            </td>
          </tr>
          <tr>
            <td>휴대폰 번호</td>
            <td>
              {{ getPhone(account.phone) }}
              <div v-if="currentUser.birthDate == null">
                <UButton class="xs" button-type="chart" @click="onPhoneChange">휴대폰 번호 변경</UButton>
              </div>
              <div v-else>
                <UButton class="xs" button-type="chart" @click="onPhoneChange">휴대폰 인증</UButton>
              </div>
            </td>
          </tr>
          <!--          <tr>-->
          <!--            <td>생년월일</td>-->
          <!--            <td>{{ $dayjs(account.birthday).format('YYYY.MM.DD') }}</td>-->
          <!--          </tr>-->
          <!--          <tr>-->
          <!--            <td>성별</td>-->
          <!--            <td>{{ getGender(account.gender) }}</td>-->
          <!--          </tr>-->
          <!-- <tr> -->
            <!-- <td>지역주민</td> -->
            <!-- <td><UCheckbox v-model="account.isLocalResident">대전에 살고 있어요!</UCheckbox></td> -->
          <!-- </tr> -->
        </table>
        <!-- <div class="marketing-area"> -->
          <!-- <UCheckbox v-model="account.isMarketingReceive">마케팅 활용 동의 및 광고 수신 동의</UCheckbox> -->
        <!-- </div> -->
        <div class="add-info">
          <p class="p1">추가 정보 입력</p>
          <p class="p2">추가 정보 입력 및 마케팅 정보 수신활용에 동의하시면 혜택을 드려요!</p>
        </div>
        <div class="grid-wrap"></div>
        <div>
          <UCheckbox v-model="form.additionalInfoAgreed">
            <strong>(선택)</strong>&nbsp;추가 개인정보 수집 및 활용에 동의합니다.
          </UCheckbox>
        </div>
        <div v-if="form.additionalInfoAgreed" class="add-input">
          <div class="input job-input">
            <label>직업</label>
            <div style="margin-top: 1.2rem;">
              <USelect
                v-model="form.job"
                :option-list="jobOptions"
                default-text="선택"
                w-size="full"
              />
            </div>
          </div>

          <div class="input city-input">
            <label >지역</label>
            <div style="margin-top: 1.2rem;">
              <USelect
                v-model="form.region.state"
                :option-list="cityOptions"
                w-size="full"
                default-text="시/도 선택"
              />
            </div>
          </div>
          <div class="input district-input">
            <USelect
              v-model="form.region.district"
              :option-list="districtOptions"
              w-size="full"
              default-text="시/군/구 선택"
            />
          </div>
        </div>
        <div class="terms-area">
          <div class="each-terms">
            <UCheckbox v-model="isTerms.MARKETING">
              <strong>(선택)</strong>&nbsp;마케팅 정보 활용에 동의합니다.
            </UCheckbox>
          </div>
          <div class="marketing-info">
            <p>
              고객(정보주체)의 개인정보보호 및 권리는
              <strong>「개인정보 보호법」</strong> 및 관계 법령에 따라 헤레디움(사이트)에서 안전하게 관리하고 있습니다.
            </p>
          </div>
        </div>
        <div class="submit-area">
          <UButton w-size="100" @click="onSaveData">저장</UButton>
          <NuxtLink to="/mypage/info/withdrawal" class="withdrawal-btn">회원탈퇴</NuxtLink>
        </div>
      </div>
      <UDialogModal no-scroll-lock :is-show="modal.isError">
        <template #content>{{ errorMsg }}</template>
        <template #modal-btn2>
          <UButton w-size="100" button-type="primary" @click="modal.isError = false">확인</UButton>
        </template>
      </UDialogModal>
      <UDialogModal no-scroll-lock :is-show="modal.isSave">
        <template #content>저장 완료</template>
        <template #modal-btn2>
          <UButton w-size="100" button-type="primary" @click="onConfirmModal">확인</UButton>
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
        isError: false
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

        const res = await this.$axios
          .$put('/user/account', {
            email: this.account.email,
            password: this.passwordChange ? this.newPassword1 : null,
            isLocalResident: isLocal,
            // isMarketingReceive: this.account.isMarketingReceive,
            encodeData: this.$route.params.EncodeData,
            job: this.form.job,
            state: this.form.region.state,
            district: this.form.region.district,
            additionalInfoAgreed: this.form.additionalInfoAgreed,
            isMarketingReceive: this.isTerms.MARKETING,
            marketingAgreedDate: this.form.marketingAgreedDate,
            marketingPending: false,
          })
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
      }
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
    .input-wrap {
      margin-bottom: 2.4rem;
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
        margin-bottom: 3.2rem;
        max-width: 43.6rem;
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
  padding-top: 2.2rem;
  row-gap: 3.2rem;
  column-gap: 1.6rem;
}
@media screen and (min-width: 768px) {
  .grid-wrap {
    row-gap: 2.4rem;
    column-gap: 2.8rem;
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
    padding: 2.4rem 0;
    margin-bottom: 2rem;
    margin-top: 2rem;
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
  }
  button {
    margin-right: 0.5rem;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-u-primary);
  }
  .marketing-info {
    padding: 1.2rem;
    margin-bottom: 3.5rem;
    background-color: var(--color-grey-1);
    border: 1px solid var(--color-grey-2);
    border-radius: 0.3rem;
    font-size: 1.4rem;
    color: var(--color-grey-8);
  }
  @media screen and (max-width: 767px) {
    .marketing-info {
      padding: 0.8rem 1rem;
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
  margin-top: 20px;
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


</style>
