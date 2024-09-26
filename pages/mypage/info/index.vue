<template>
  <main class="container">
    <div>
      <h1>Mypage</h1>
      <section class="tab-sec">
        <div class="only-mobile">
          <div class="tabs page">
            <NuxtLink class="tab" to="/mypage/purchase/all">구매내역</NuxtLink>
            <NuxtLink class="tab" to="/mypage/info">내 정보 수정</NuxtLink>
          </div>
        </div>
        <div class="only-pc pc-tabs">
          <h2>구매내역</h2>
          <NuxtLink to="/mypage/purchase/all" class="tab">전시·프로그램</NuxtLink>
          <NuxtLink to="/mypage/purchase/coffee" class="tab">커피</NuxtLink>
          <NuxtLink to="/mypage/info" class="big-tab">내 정보 수정</NuxtLink>
        </div>
      </section>
    </div>
    <section class="info-sec">
      <div class="my-info-head">
        <h2>내 정보 수정</h2>
      </div>
      <div v-if="modify === false" class="my-info-body">
        <p>계정 정보는 안전하게 보호되고 있어요. <br class="only-mobile" />수정을 원하면 비밀번호를 입력해주세요.</p>
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
              <div>
                <UButton class="xs" button-type="chart" @click="onPhoneChange">휴대폰 번호 변경</UButton>
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
          <tr>
            <td>지역주민</td>
            <td><UCheckbox v-model="account.isLocalResident">대전에 살고 있어요!</UCheckbox></td>
          </tr>
        </table>
        <div class="marketing-area">
          <UCheckbox v-model="account.isMarketingReceive">마케팅 활용 동의 및 광고 수신 동의</UCheckbox>
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
        <template #content>저장되었어요.</template>
        <template #modal-btn2>
          <UButton w-size="100" button-type="primary" @click="onConfirmModal">확인</UButton>
        </template>
      </UDialogModal>
    </section>
  </main>
</template>

<script>
import UInput from '~/components/user/common/UInput';
import UButton from '~/components/user/common/UButton';
import UDialogModal from '~/components/user/modal/UDialogModal';
import UCheckbox from '~/components/user/common/UCheckbox';
import { GENDER_TYPE } from '~/assets/js/types';
import { createFormElement } from '~/assets/js/commons';

export default {
  name: 'MyPage',
  components: { UInput, UButton, UCheckbox, UDialogModal },
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
      }
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
  created() {
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
        const res = await this.$axios
          .$put('/user/account', {
            email: this.account.email,
            password: this.passwordChange ? this.newPassword1 : null,
            isLocalResident: this.account.isLocalResident,
            isMarketingReceive: this.account.isMarketingReceive,
            encodeData: this.$route.params.EncodeData
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
  border-bottom: 0.1rem solid var(--color-black);
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
    p {
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
      p {
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
</style>
