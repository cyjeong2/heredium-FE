<template>
  <div>
    <main class="login">
      <div class="login-wrap">
        <div class="img-area">
          <img src="~assets/img/login_img.png" alt="로그인 이미지" />
        </div>
        <div class="login-area">
          <h1>
            <img src="~assets/img/login_logo.png" alt="로그인 로고" />
          </h1>
          <SInput
            v-model="signInData.email"
            class="mb-12"
            :class="{ 'is-error': isError.email }"
            type="email"
            placeholder="이메일"
            w-size="large"
            maxlength="50"
            @enter="signIn"
          />
          <SInput
            v-model="signInData.password"
            :class="{ 'is-error': isError.password }"
            type="password"
            placeholder="비밀번호"
            w-size="large"
            maxlength="30"
            @enter="signIn"
          />
          <p class="validation">{{ errorMessage }}</p>
          <SButton button-type="primary" @click="signIn">로그인</SButton>
          <div class="find-area">
            <NuxtLink :to="{ path: '/admin/user-find', query: { type: 'id' } }">아이디 찾기</NuxtLink>
            <div class="divider" />
            <NuxtLink :to="{ path: '/admin/user-find', query: { type: 'password' } }">비밀번호 찾기</NuxtLink>
          </div>
        </div>
      </div>
    </main>
    <SDialogModal :is-show="modal.isShow" @close="modal.isShow = false">
      <template #content>{{ modal.msg }}</template>
      <template #modal-btn1>
        <SButton button-type="primary" @click="modal.isShow = false">확인</SButton>
      </template>
    </SDialogModal>
  </div>
</template>

<script>
import SButton from '~/components/admin/commons/SButton';
import SInput from '~/components/admin/commons/SInput';
import SDialogModal from '~/components/admin/modal/SDialogModal';

export default {
  name: 'LoginPage',
  components: { SDialogModal, SInput, SButton },
  layout: 'admin/none',
  data() {
    return {
      signInData: {
        email: '',
        password: ''
      },
      errorMessage: '',
      isError: {
        email: false,
        password: false
      },
      modal: {
        isShow: false,
        msg: ''
      }
    };
  },
  methods: {
    signIn() {
      Object.keys(this.isError).forEach((key) => {
        this.isError[key] = false;
      });

      if (!this.signInData.email) {
        this.errorMessage = '아이디를 입력해주세요.';
        this.isError.email = true;
      } else if (!this.signInData.password) {
        this.errorMessage = '비밀번호를 입력해주세요.';
        this.isError.password = true;
      } else {
        this.errorMessage = '';
        this.$axios
          .$post('/admin/auth', {
            email: this.signInData.email,
            password: this.signInData.password
          })
          .then(async ({ token, isSleeper }) => {
            if (!isSleeper) {
              this.$store.commit('service/auth/setAdminAccessToken', token);
              const adminUserInfo = await this.$axios.$get('/admin/member/info').catch(() => {});
              this.$store.commit('service/auth/setAdminUserInfo', adminUserInfo);
              await this.$router.push('/admin');
            } else {
              this.modal.isSleep = true;
            }
          })
          .catch((error) => {
            const errorCode = error.response.status;

            if (errorCode === 400) {
              const errorData = error.response?.data;
              const errorMessage = errorData.MESSAGE || '';
              const errorBody = errorData.BODY || '';

              if (errorMessage === 'USER_NOT_FOUND') {
                this.errorMessage = `이메일를 확인하세요.`;
              } else if (errorMessage === 'PASSWORD_NOT_MATCHED') {
                this.errorMessage = `비밀번호를 확인하세요. 5회 이상 로그인 실패 시 5분 동안 로그인 할 수 없습니다. ${errorBody}번째 시도`;
              } else if (errorMessage === 'USER_DISABLED') {
                this.modal.isShow = true;
                this.modal.msg = `정지상태의 계정입니다. 로그인을 할 수 없습니다.`;
              } else if (errorMessage === 'LOGIN_FAIL_OVER') {
                this.modal.isShow = true;
                this.modal.msg = `로그인을 5회 이상 실패하였습니다 ${Math.ceil(
                  errorBody / 60
                )}분 후 로그인을 시도해주세요. 비밀번호 찾기를 진행 후 즉시 로그인을 할 수 있습니다.`;
              }
            }
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  width: 100vw;

  .login-wrap {
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 96rem;
    height: 54.4rem;
    background-color: var(--color-white);
    border-radius: 1rem 0 0 1rem;
    box-shadow: 0 0.1rem 0.7rem rgba(0, 0, 0, 0.1);
    transform: translate(-50%, -50%);

    .img-area {
      img {
        height: 100%;
      }
    }

    .login-area {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 48rem;
      padding: 8.8rem 8rem 2rem;

      h1 {
        display: flex;
        justify-content: center;
        margin-bottom: 4rem;
      }

      button {
        margin-top: 1.2rem;
      }

      .find-area {
        position: absolute;
        left: 50%;
        bottom: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translateX(-50%);

        a {
          color: var(--color-grey-3);
        }

        .divider {
          width: 0.1rem;
          height: 1.6rem;
          margin: 0 1.2rem;
          background: var(--color-grey-2);
        }
      }
    }
  }
}
</style>
