<template>
  <div>
    <HeaderBase class="only-mobile" />
    <main class="login">
      <div class="left">
        <div class="login-container">
          <div class="top">
            <NuxtLink to="/" class="only-pc">
              <img src="~assets/img/pc/logo.svg" alt="" class="logo" :class="{ 'mb-email': isEmail }" width="139" />
            </NuxtLink>
            <h1 v-if="isRegister" class="register">회원가입</h1>
            <h1 v-else-if="!isEmail" class="default">간편하게 로그인하고<br />새로운 미술씬을 경험해보세요</h1>
            <h1 v-else class="email">이메일로 로그인</h1>
            <div class="tab">
              <button type="button" :class="{ active: tabState === 'LOGIN' }" @click="tabState = 'LOGIN'">
                로그인
              </button>
              <button type="button" :class="{ active: tabState === 'NON_MEMBER' }" @click="tabState = 'NON_MEMBER'">
                비회원 예매 확인
              </button>
            </div>
            <template v-if="tabState === 'LOGIN'">
              <div class="login-wrap">
                <div v-if="isEmail" class="email-login">
                  <UInput
                    v-model="signInData.email"
                    class="h-m"
                    type="email"
                    w-size="full"
                    maxlength="50"
                    placeholder="heredium@example.com"
                    :class="{ 'is-error': !feedback.email.isValid }"
                    :error-msg="feedback.email.text"
                    @enter="signIn"
                  />
                  <UInput
                    v-model="signInData.password"
                    class="h-m"
                    type="password"
                    w-size="full"
                    maxlength="30"
                    placeholder="비밀번호"
                    :class="{ 'is-error': !feedback.password.isValid }"
                    :error-msg="feedback.password.text"
                    @enter="signIn"
                  />
                  <UButton w-size="100" @click="signIn">로그인</UButton>
                </div>
                <div v-else class="sns-login">
                  <a :href="`${$axios.defaults.baseURL}/oauth2/kakao/authorization`" class="kakao">
                    {{ isRegister ? '카카오로 1초 시작' : '카카오로 로그인' }}
                  </a>
                  <a class="naver" :href="`${$axios.defaults.baseURL}/oauth2/naver/authorization`">
                    {{ isRegister ? '네이버로 가입하기' : '네이버로 로그인' }}
                  </a>
                  <a class="google" :href="`${$axios.defaults.baseURL}/oauth2/google/authorization`">
                    {{ isRegister ? '구글로 가입하기' : '구글로 로그인' }}
                  </a>
                  <a class="apple" :href="`${$axios.defaults.baseURL}/oauth2/apple/authorization`">
                    {{ isRegister ? 'Apple로 등록' : 'Apple로 로그인' }}
                  </a>
                  <button
                    v-if="!isEmail"
                    type="button"
                    class="email"
                    @click="isRegister ? $router.push('/auth/register/register1') : (isEmail = true)"
                  >
                    {{ isRegister ? '이메일로 가입하기' : '이메일로 로그인' }}
                  </button>
                </div>
              </div>
              <div v-if="isEmail" class="other-login">
                <p>다른 방법으로 {{ isRegister ? '회원가입' : '로그인' }}</p>
                <div>
                  <a class="kakao" :href="`${$axios.defaults.baseURL}/oauth2/kakao/authorization`">
                    <img src="~assets/img/login_icon/login_sns_kakao.svg" alt="" />
                  </a>
                  <a class="naver" :href="`${$axios.defaults.baseURL}/oauth2/naver/authorization`">
                    <img src="~assets/img/login_icon/login_sns_naver.svg" alt="" />
                  </a>
                  <a class="google" :href="`${$axios.defaults.baseURL}/oauth2/google/authorization`">
                    <img src="~assets/img/login_icon/login_sns_google.svg" alt="" />
                  </a>
                  <a class="apple" :href="`${$axios.defaults.baseURL}/oauth2/apple/authorization`">
                    <img src="~assets/img/login_icon/login_sns_apple.svg" alt="" />
                  </a>
                  <button
                    v-if="!isEmail"
                    type="button"
                    class="email"
                    @click="isRegister ? $router.push('/auth/register/register1') : (isEmail = true)"
                  >
                    <img src="~assets/img/login_icon/login_sns_email.svg" alt="" />
                  </button>
                </div>
              </div>
              <div class="link-area">
                <div class="find">
                  <NuxtLink to="/auth/find-id">아이디 찾기</NuxtLink>
                  <div class="divider" />
                  <NuxtLink to="/auth/find-pw">비밀번호 찾기</NuxtLink>
                </div>
                <button
                  v-if="isRegister === false"
                  type="button"
                  class="register-btn"
                  @click="
                    isRegister = true;
                    isEmail = false;
                  "
                >
                  회원가입
                </button>
              </div>
            </template>
            <template v-else-if="tabState === 'NON_MEMBER'">
              <div
                class="login-wrap"
                :style="{
                  border: 0
                }"
              >
                <div class="email-login">
                  <UInput
                    v-model="nonMemberData.name"
                    class="h-m"
                    w-size="full"
                    maxlength="20"
                    placeholder="이름"
                    :class="{ 'is-error': !nonMemberFeedback.name.isValid }"
                    :error-msg="nonMemberFeedback.name.text"
                    @enter="goNonMemberTicketing"
                  />
                  <UInput
                    v-model="nonMemberData.phone"
                    class="h-m"
                    w-size="full"
                    maxlength="15"
                    placeholder="휴대폰 번호 (‘-’를 제외하고 입력해주세요.)"
                    :class="{ 'is-error': !nonMemberFeedback.phone.isValid }"
                    :error-msg="nonMemberFeedback.phone.text"
                    is-number-only
                    @enter="goNonMemberTicketing"
                  />
                  <UInput
                    v-model="nonMemberData.password"
                    class="h-m"
                    type="password"
                    w-size="full"
                    maxlength="4"
                    placeholder="비밀번호 (숫자 4자리)"
                    :class="{ 'is-error': !nonMemberFeedback.password.isValid }"
                    :error-msg="nonMemberFeedback.password.text"
                    @enter="goNonMemberTicketing"
                  />
                  <UButton w-size="100" @click="goNonMemberTicketing">비회원 예매확인</UButton>
                </div>
              </div>
            </template>
          </div>
          <div class="bottom">
            <div class="terms-area">
              <NuxtLink to="/terms/privacy"><b>개인정보처리방침</b></NuxtLink>
              <div class="divider" />
              <NuxtLink to="/terms/service">서비스이용약관</NuxtLink>
              <div class="divider" />
              <NuxtLink to="/terms/video">영상정보처리기기 운영방침</NuxtLink>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <img src="~assets/img/login_bg.jpg" alt="" />
      </div>
      <UModal :is-show="modal.isSleep" hide-edge-close-btn @close="modal.isSleep = false">
        <template #title>휴면계정 해제</template>
        <template #content
          >{{ userName }} 님의 방문을 1년 넘게 기다렸어요.<br />그동안 {{ userName }}님이 관심 가질만한 다양한 전시,
          프로그램, 이벤트를 준비했어요.
        </template>
        <template #modal-btn1>
          <UButton button-type="secondary" class="feedback-btn" @click="modal.isSleep = false">나중에 할게요</UButton>
        </template>
        <template #modal-btn2>
          <UButton class="feedback-btn" @click="isSleepOff">휴면계정 해제하기</UButton>
        </template>
      </UModal>
      <UDialogModal :is-show="modal.isError">
        <template #content>{{ errorMessage }}</template>
        <template #modal-btn1>
          <UButton class="feedback-btn" @click="modal.isError = false">확인</UButton>
        </template>
      </UDialogModal>
    </main>
  </div>
</template>

<script>
import UInput from '~/components/user/common/UInput';
import UButton from '~/components/user/common/UButton';
import UDialogModal from '~/components/user/modal/UDialogModal';
import UModal from '~/components/user/modal/UModal';
import HeaderBase from '~/components/user/sections/HeaderBase.vue';

export default {
  name: 'LoginPage',
  components: { HeaderBase, UInput, UButton, UDialogModal, UModal },
  layout: 'none',
  asyncData({ query, store, redirect, params }) {
    const redirectPage = query?.redirectPage || null;
    const isLogged = !!store.getters['service/auth/getAccessToken'];
    const isSleep = !!params.token;
    let userName = '';
    let token = '';

    if (isLogged) {
      redirect('/');
    }

    if (isSleep) {
      token = params.token;
      userName = query.name;
    }

    return { redirectPage, isSleep, userName, token };
  },
  data() {
    return {
      redirectPage: null,
      errorMessage: '',
      token: null,
      userName: null,
      tabState: 'LOGIN', // LOGIN | NON_MEMBER
      isEmail: false,
      isRegister: false,
      signInData: {
        email: '',
        password: ''
      },
      modal: {
        isSleep: false,
        isError: false
      },
      feedback: {
        email: {
          isValid: true,
          text: ''
        },
        password: {
          isValid: true,
          text: ''
        }
      },
      nonMemberData: {
        name: '',
        phone: '',
        password: ''
      },
      nonMemberFeedback: {
        name: {
          isValid: true,
          text: ''
        },
        phone: {
          isValid: true,
          text: ''
        },
        password: {
          isValid: true,
          text: ''
        }
      }
    };
  },
  created() {
    if (this.isSleep) {
      this.modal.isSleep = true;
    }
  },
  methods: {
    async signIn() {
      if (this.isValidate()) {
        const loginToken = await this.$axios
          .$post('/user/auth', {
            email: this.signInData.email,
            password: this.signInData.password
          })
          .catch((err) => {
            const errorMessage = err.response?.data?.MESSAGE || '';
            if (errorMessage === 'USER_NOT_FOUND') {
              this.modal.isError = true;
              this.errorMessage = `가입한 이메일을 확인해주시기 바랍니다.`;
            } else if (errorMessage === 'PASSWORD_NOT_MATCHED') {
              this.modal.isError = true;
              this.errorMessage = `비밀번호를 다시 확인해주세요.`;
            }
          });
        if (loginToken) {
          const { token, isSleeper, name } = loginToken;

          if (isSleeper) {
            this.modal.isSleep = true;
            this.token = token;
            this.userName = name;
          } else {
            this.$store.commit('service/auth/setAccessToken', token);
            const userInfo = await this.$axios.$get('/user/account/info').catch(() => {});
            this.$store.commit('service/auth/setUserInfo', userInfo);
            await this.$router.push(this.redirectPage ?? this.$store.state.deviceInfo.isApp ? '/app' : '/');
          }
        }
      }
    },
    async isSleepOff() {
      await this.$axios.post('/user/auth/release', null, {
        params: {
          accessToken: this.token
        }
      });
      this.$store.commit('service/auth/setAccessToken', this.token);
      const userInfo = await this.$axios.$get('/user/account/info').catch(() => {});
      this.$store.commit('service/auth/setUserInfo', userInfo);
      this.modal.isSleep = false;
      await this.$router.replace(this.$store.state.deviceInfo.isApp ? '/app' : '/');
    },
    clearValid(targetObject) {
      Object.values(targetObject).forEach((value) => {
        value.isValid = true;
      });
    },
    isClearForm(targetObject) {
      return !Object.values(targetObject).find((value) => value.isValid === false);
    },
    isValidate() {
      const emailFeedback = this.feedback.email;
      const passwordFeedback = this.feedback.password;

      this.clearValid(this.feedback);
      if (!this.signInData.email) {
        emailFeedback.isValid = false;
        emailFeedback.text = '이메일을 입력해주세요.';
      } else {
        emailFeedback.isValid = true;
        emailFeedback.text = '';
      }
      if (!this.signInData.password) {
        passwordFeedback.isValid = false;
        passwordFeedback.text = '비밀번호를 입력해 주세요.';
      } else {
        passwordFeedback.isValid = true;
        passwordFeedback.text = '';
      }

      return this.isClearForm(this.feedback);
    },
    async goNonMemberTicketing() {
      if (this.isNonMemberValidate()) {
        const isHasNonMemberItem = await this.$axios
          .$post('/user/non-user/tickets', this.nonMemberData)
          .catch(() => {});

        if (!isHasNonMemberItem || isHasNonMemberItem.content.length === 0) {
          this.errorMessage = '조회된 티켓 정보가 없습니다.\n입력값을 재확인해주세요.';
          this.modal.isError = true;
        } else {
          this.$store.commit('service/non-member-list/setUserData', this.nonMemberData);
          this.$store.commit('service/non-member-list/setKind', 'NON_MEMBER');
          await this.$router.push('/order-list');
        }
      }
    },
    isNonMemberValidate() {
      const { name, phone, password } = this.nonMemberData;
      const nameFeedback = this.nonMemberFeedback.name;
      const phoneFeedback = this.nonMemberFeedback.phone;
      const passwordFeedback = this.nonMemberFeedback.password;

      this.clearValid(this.nonMemberFeedback);
      if (!name) {
        nameFeedback.isValid = false;
        nameFeedback.text = '이름을 입력해주세요.';
      } else {
        nameFeedback.isValid = true;
        nameFeedback.text = '';
      }
      if (!phone) {
        phoneFeedback.isValid = false;
        phoneFeedback.text = '휴대폰 번호를 입력해주세요.';
      } else {
        phoneFeedback.isValid = true;
        phoneFeedback.text = '';
      }
      if (!password) {
        passwordFeedback.isValid = false;
        passwordFeedback.text = '비밀번호를 입력해 주세요.';
      } else if (password.length !== 4) {
        passwordFeedback.isValid = false;
        passwordFeedback.text = '비밀번호 4자리를 입력해 주세요.';
      } else {
        passwordFeedback.isValid = true;
        passwordFeedback.text = '';
      }

      return this.isClearForm(this.nonMemberFeedback);
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  font-weight: 700;
  font-size: 2.4rem;
  line-height: 160%;
  letter-spacing: -0.5px;
  margin-bottom: 4rem;
  text-align: center;
}

.divider {
  height: 1.4rem;
  width: 1px;
  margin: 0 1rem;
  background-color: var(--color-u-grey-2);
}

.login {
  display: flex;
  height: 100vh;
  width: 100vw;

  .left {
    flex: 1 0 50%;
    width: 50%;
  }

  .right {
    flex: 1 0 50%;
    width: 50%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.login-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  width: 100%;
  padding: 3.2rem 2rem 0;
  margin: 0 auto;

  .top {
    margin-bottom: 4rem;

    .tab {
      display: flex;
      margin-bottom: 4rem;

      button {
        color: var(--color-u-grey-4);
        font-size: 1.8rem;
        font-weight: 700;
        line-height: 160%;
        letter-spacing: -0.05rem;

        &:first-child {
          margin-right: 2.4rem;
        }

        &.active {
          color: var(--color-u-primary);
        }
      }
    }
  }

  .login-wrap {
    border-bottom: 1px solid var(--color-black);
    padding-bottom: 4rem;
    margin-bottom: 2.4rem;

    .email-login {
      .input-wrap {
        margin-bottom: 1.6rem;
      }
    }

    .sns-login {
      a,
      button {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 4.4rem;
        width: 100%;
        font-size: 1.4rem;
        font-weight: 700;
        line-height: 160%;
        letter-spacing: -0.5px;
        margin-bottom: 1.2rem;

        &:last-child {
          margin-bottom: 0;
        }

        &::before {
          content: '';
          position: absolute;
          width: 24px;
          height: 24px;
          left: 1.6rem;
          top: 50%;
          transform: translateY(-50%);
          background-repeat: no-repeat;
        }
      }

      a.kakao {
        background-color: #fee500;

        &::before {
          background-image: url('~assets/img/login_icon_2/icon_kakao.svg');
        }
      }

      a.naver {
        color: var(--color-white);
        background-color: #03c75a;

        &::before {
          background-image: url('~assets/img/login_icon_2/icon_naver.svg');
        }
      }

      a.google {
        border: 1px solid var(--color-u-grey-2);

        &::before {
          background-image: url('~assets/img/login_icon_2/icon_google.svg');
        }
      }

      a.apple {
        color: var(--color-white);
        background-color: #050709;

        &::before {
          background-image: url('~assets/img/login_icon_2/icon_apple.svg');
        }
      }

      button.email {
        color: var(--color-white);
        background-color: var(--color-u-primary);

        &::before {
          background-image: url('~assets/img/login_icon_2/icon_email.svg');
        }
      }
    }
  }

  .other-login {
    padding-bottom: 2.4rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid var(--color-u-grey-2);

    > p {
      font-size: 1.6rem;
      font-weight: 500;
      line-height: 160%;
      letter-spacing: -0.5px;
      margin-bottom: 2rem;
      text-align: center;
    }

    > div {
      display: flex;
      align-items: center;
      justify-content: center;

      button,
      a {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 4.4rem;
        width: 4.4rem;
        border-radius: 50%;
        margin-right: 1.6rem;
        cursor: pointer;

        &.kakao {
          background-color: #fee500;
        }

        &.naver {
          background-color: #03c75a;
        }

        &.google {
          border: 1px solid var(--color-u-grey-2);
        }

        &.apple {
          background-color: #050709;

          > img {
            transform: translateY(-0.1rem);
          }
        }

        &.email {
          background-color: var(--color-u-primary);
        }
      }
    }
  }

  .link-area {
    display: flex;
    justify-content: space-between;

    .find {
      display: flex;
      align-items: center;
      font-size: 1.4rem;
      font-weight: 400;
      line-height: 160%;
      letter-spacing: -0.5px;
    }

    .register-btn {
      color: var(--color-u-primary);
      font-weight: 500;
      font-size: 14px;
      line-height: 160%;
      letter-spacing: -0.5px;
      border-bottom: 1px solid var(--color-u-primary);
    }
  }

  .terms-area {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 4rem;

    b {
      font-weight: 500;
    }

    a,
    .divider {
      margin-top: 1.2rem;
    }
  }
}

@media screen and (min-width: 769px) {
  h1 {
    font-weight: 700;
    font-size: 3.2rem;
    line-height: 150%;
    letter-spacing: -0.5px;
    margin-bottom: 5.8rem;
    text-align: left;

    &.default {
      margin-top: 16rem;
    }

    &.email {
      margin-top: 11.1rem;
    }

    &.register {
      margin-top: 18.7rem;
    }
  }

  .divider {
    height: 1.4rem;
    width: 1px;
    margin: 0 1rem;
    background-color: var(--color-u-grey-2);
  }

  .login {
    display: flex;
    height: 100vh;
    width: 100vw;

    .left {
      flex: 1 0 50%;
      width: 50%;
    }

    .right {
      flex: 1 0 50%;
      width: 50%;

      img {
        position: fixed;
        width: 50vw;
        top: 0;
        right: 0;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .login-container {
    position: relative;
    min-height: 100vh;
    width: 43.6rem;
    padding: 6rem 0 0;
    margin: 0 auto;

    .login-wrap {
      border-bottom: 1px solid var(--color-black);
      padding-bottom: 5.8rem;
      margin-bottom: 2.8rem;

      .email-login {
        .input-wrap {
          margin-bottom: 1.6rem;
        }
      }

      .sns-login {
        a,
        button {
          height: 5.2rem;
          font-size: 1.8rem;

          &::before {
            width: 24px;
            height: 24px;
            left: 1.9rem;
            background-image: url('~assets/img/login_icon/login_sns_kakao.svg');
          }
        }
      }
    }

    .other-login {
      padding-bottom: 2.8rem;
      margin-bottom: 3.5rem;

      > p {
        text-align: left;
      }

      > div {
        justify-content: flex-start;
      }
    }

    .terms-area {
      a,
      .divider {
        margin-top: 0;
      }
    }
  }
}

@media screen and (max-width: 1100px) {
  .login .right {
    display: none;
  }
}
</style>
