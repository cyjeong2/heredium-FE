<template>
  <div>
    <main class="login">
      <template v-if="type === 'id'">
        <div v-if="authType" class="login-wrap">
          <h1>아이디 찾기</h1>
          <div class="center-area">
            <img src="~assets/img/img_mobile.png" alt="휴대폰" />
          </div>
          <h4>본인인증을 통해 아이디를 확인하세요.</h4>
          <p class="bt-1r mb-43">본인 명의의 휴대폰으로 인증번호를 발송해 본인인증을 진행합니다.</p>
          <SButton button-type="primary" @click="onIdAuth">휴대폰 본인인증</SButton>
        </div>
        <div v-else class="login-wrap">
          <h1>아이디 찾기</h1>
          <div class="center-area">
            <img src="~assets/img/img_account.png" alt="휴대폰" />
          </div>
          <h4 v-if="userId.length === 0">가입된 아이디가 없습니다.</h4>
          <h4 v-else>
            관리자님의 아이디는<br />
            <span class="nt-2">{{ userId }} <span>입니다.</span></span>
          </h4>
          <SLink button-type="primary" to="/admin/login">로그인 페이지로 이동</SLink>
        </div>
      </template>
      <template v-else>
        <div v-if="authType" class="login-wrap password-way">
          <h1>비밀번호 찾기</h1>
          <div class="center-area">
            <h4>아래의 본인인증 방법을 선택해 주세요.</h4>
          </div>
          <div class="certified-way-wrap">
            <div class="way-area">
              <div class="img-box">
                <img src="~assets/img/img_mobile.png" alt="휴대폰 인증" width="188" height="157" />
              </div>
              <p class="bt-1r">본인 명의의 휴대폰으로 인증번호를<br />발송해 본인인증을 진행합니다.</p>
              <SButton button-type="primary" @click="onPasswordAuth(false)">휴대폰 본인인증</SButton>
            </div>
            <div class="way-area">
              <div class="img-box">
                <img src="~assets/img/img_email.png" alt="이메일 인증" width="188" height="157" />
              </div>
              <p class="bt-1r">
                이메일로 인증번호를 발송해<br />
                본인인증을 진행합니다.
              </p>
              <SButton button-type="primary" @click="onPasswordAuth(true)">이메일 인증</SButton>
            </div>
          </div>
        </div>
        <template v-else>
          <div v-if="emailAuth" class="login-wrap password">
            <h1>비밀번호 찾기</h1>
            <div class="center-area">
              <h4>
                아이디(이메일)을 입력 후 변경 링크 발송 버튼을 클릭하면 비밀번호를 변경 페이지로 이동가능한 링크를
                이메일로 전달 드립니다.
              </h4>
            </div>
            <SInput v-model="email" placeholder="이메일" maxlength="50" type="email" />
            <SButton button-type="primary" w-size="full" @click="passwordChangeEmailSend">변경 링크 발송</SButton>
          </div>
          <div v-else class="login-wrap password">
            <h1>비밀번호 찾기</h1>
            <div class="center-area">
              <h4>휴대폰 본인인증 완료 시 비밀번호 변경 페이지로 이동합니다.</h4>
            </div>
            <SInput v-model="email" placeholder="이메일" maxlength="50" type="email" />
            <div class="certified-area">
              <div class="certified-info">
                <h4>본인인증</h4>
                <p class="bt-1r">휴대폰 본인인증을 진행해 주세요.</p>
              </div>
              <SButton button-type="primary" @click="check">휴대폰 본인인증</SButton>
            </div>
          </div>
        </template>
      </template>
      <form name="popForm">
        <input type="hidden" name="open" value="openPop" />
        <input type="hidden" name="email" :value="email" />
        <input type="hidden" name="EncodeData" value="" />
      </form>
    </main>
    <SDialogModal :is-show="modal.isSend" @close="modal.isSend = false">
      <template #content>입력하신 이메일로 변경 링크를 보냈습니다.</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="modal.isSend = false">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isError" @close="modal.isError = false">
      <template #content>{{ errorMessage }}</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="modal.isError = false">확인</SButton>
      </template>
    </SDialogModal>
  </div>
</template>

<script>
import SButton from '~/components/admin/commons/SButton';
import SInput from '~/components/admin/commons/SInput';
import SDialogModal from '~/components/admin/modal/SDialogModal';
import SLink from '~/components/admin/commons/SLink';

export default {
  name: 'UserFindPage',
  components: { SLink, SInput, SButton, SDialogModal },
  layout: 'admin/none',
  asyncData({ query }) {
    const { type } = query;

    return { type };
  },
  data() {
    return {
      type: null,
      authType: true,
      emailAuth: false,
      userIdData: null,
      errorMessage: '',
      email: '',
      modal: {
        isSend: false,
        isError: false
      }
    };
  },
  computed: {
    userId() {
      return this.userIdData.length > 1 ? this.userIdData.join(', ') : this.userIdData.join();
    }
  },
  methods: {
    async passwordChangeEmailSend() {
      const emailPattern =
        /^([\w._-])*[a-zA-Z0-9]+([\w._-])*([a-zA-Z0-9])+([\w._-])+@([\w_-])*([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/;

      if (!this.email) {
        this.modal.isError = true;
        this.errorMessage = '이메일을 입력해주세요.';
      } else if (!emailPattern.test(this.email)) {
        this.modal.isError = true;
        this.errorMessage = '이메일의 양식이 잘못되었습니다.';
      } else {
        await this.$axios
          .$get(`/admin/auth/find/pw/email`, {
            params: {
              email: this.email,
              redirectUrl: `${window.location.origin}/admin/change-password`
            }
          })
          .then(() => {
            this.modal.isSend = true;
          })
          .catch((err) => {
            const errorMessage = err.response.data?.MESSAGE || '';
            if (errorMessage === 'USER_NOT_FOUND') {
              this.errorMessage = '가입한 이메일을 확인해주시기 바랍니다.';
              this.modal.isError = true;
            }
          });
      }
    },
    async onIdAuth() {
      const windowLocation = window.location;
      const returnUrl = `${windowLocation.protocol}//${windowLocation.host}/nice/nice-success?`;
      const errorUrl = `${windowLocation.protocol}//${windowLocation.host}/nice/nice-failure`;

      await this.$axios
        .$get('/nice/encrypt', {
          params: {
            returnUrl,
            errorUrl
          }
        })
        .then((res) => {
          const receiveMessage = (e) => {
            if (e.data.code === 'FIND_ID' && e.data.state === 'SUCCESS') {
              this.authType = false;
              this.userIdData = e.data.id;
            }
          };

          window.addEventListener('message', receiveMessage, false);

          window.open(
            '',
            'popForm',
            'width=500, height=550, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no'
          );
          document.popForm.action = '/nice/nice-popup';
          document.popForm.method = 'post';
          document.popForm.target = 'popForm';
          document.popForm.EncodeData.value = res;
          document.popForm.submit();
        })
        .catch((err) => {
          console.log(err);
          alert('에러가 발생했습니다.\n다시 시도해 해주세요.');
          window.location.reload(true);
        });
    },
    onPasswordAuth(boolean) {
      this.authType = false;
      this.emailAuth = boolean;
    },
    async check() {
      const res = await this.$axios.$get('/admin/auth/exist/email', {
        params: {
          email: this.email
        }
      });

      if (!res) {
        this.modal.isError = true;
        this.errorMessage = '가입한 이메일을 확인해주시기 바랍니다.';
        return;
      }

      const windowLocation = window.location;
      const returnUrl = `${windowLocation.protocol}//${windowLocation.host}/nice/nice-success?email=${this.email}`;
      const errorUrl = `${windowLocation.protocol}//${windowLocation.host}/nice/nice-failure`;

      const emailPattern =
        /^([\w._-])*[a-zA-Z0-9]+([\w._-])*([a-zA-Z0-9])+([\w._-])+@([\w_-])*([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/;

      if (!this.email) {
        this.modal.isError = true;
        this.errorMessage = '이메일을 입력해주세요.';
      } else if (!emailPattern.test(this.email)) {
        this.modal.isError = true;
        this.errorMessage = '이메일의 양식이 잘못되었습니다.';
      } else {
        await this.$axios
          .$get('/nice/encrypt', {
            params: {
              returnUrl,
              errorUrl
            }
          })
          .then((res) => {
            const receiveMessage = (e) => {
              console.log(e);
              console.log(e.data.code);
              console.log(window.location);
              // code: 'FIND_PW', state: 'SUCCESS'
              if (e.data.code === 'FIND_PW' && e.data.state === 'SUCCESS') {
                this.$router.push({
                  name: 'admin-change-password',
                  params: e.data
                });
              }
            };

            window.addEventListener('message', receiveMessage, false);

            window.open(
              '',
              'popForm',
              'width=500, height=550, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no'
            );
            document.popForm.action = '/nice/nice-popup';
            document.popForm.method = 'post';
            document.popForm.target = 'popForm';
            document.popForm.EncodeData.value = res;
            document.popForm.submit();
          })
          .catch((err) => {
            console.log(err);
            alert('에러가 발생했습니다.\n다시 시도해 해주세요.');
            window.location.reload(true);
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
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 52.8rem;
    min-height: 54.8rem;
    padding: 5.2rem 5.6rem;
    background-color: var(--color-white);
    box-shadow: 0 1px 7px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    transform: translate(-50%, -50%);

    &.password-way {
      width: 64.8rem;
      height: 59.2rem;
    }

    &.password {
      height: auto;
    }

    h1,
    h4 {
      text-align: center;
      word-break: keep-all;
    }

    .center-area {
      margin: 2.6rem 0 4.5rem;

      img {
        width: 24rem;
        height: 18rem;
      }
    }

    p.bt-1r {
      margin-top: 1.2rem;
    }

    span.nt-2 {
      display: inline-block;
      margin-top: 1.2rem;
      color: var(--color-blue);

      span {
        color: var(--color-black);
      }
    }

    a {
      margin-top: 4.5rem;
    }

    input + button,
    input + p + button {
      margin-top: 1.2rem;
    }

    input {
      width: 100%;
      height: 4.4rem;
      margin-bottom: 1.2rem;
      padding: 1.2rem 1.6rem;
      border: 0.1rem solid var(--color-grey-2);
      border-radius: 0.3rem;
      background-color: transparent;
      color: var(--color-black);

      &::placeholder {
        color: var(--color-grey-3);
      }
    }

    .certified-way-wrap {
      display: flex;
      justify-content: space-between;

      .way-area {
        width: 25.2rem;
        height: 35rem;
        background: rgba(244, 244, 244, 0.5);
        text-align: center;

        .img-box {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        button {
          margin: 3rem auto 2.6rem;
        }
      }

      .way-area + .way-area {
        margin-left: 3rem;
      }
    }

    .certified-area {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-top: 3.2rem;
      padding-top: 2.3rem;
      border-top: 0.1rem solid var(--color-grey-2);

      h4 {
        text-align: left;
      }

      p.bt-1r {
        margin-top: 0.8rem;
      }

      button {
        margin-top: 0;
      }
    }

    p.validation {
      width: 100%;
      text-align: left;
    }
  }
}
</style>
