<template>
  <main class="container">
    <div class="breadcrumb">
      <i class="pc uic-home" />
      <span :class="{ 'is-active': authType }">로그인</span>
      <span>비밀번호 찾기</span>
      <span v-if="emailAuth">이메일 인증</span>
      <span v-if="!emailAuth && !authType">휴대폰 인증</span>
    </div>
    <template v-if="authType">
      <h1>비밀번호 찾기</h1>
      <p>본인인증 방법을 선택해주세요.</p>
      <div class="certified-area">
        <div>
          <img class="m" src="~assets/img/mobile/phone.png" alt="" width="120" height="120" />
          <img class="pc" src="~assets/img/pc/phone.png" alt="" width="144" height="144" />
          <UButton @click="onPasswordAuth(false)">휴대폰 인증</UButton>
        </div>
        <div>
          <img class="m" src="~assets/img/mobile/email.png" alt="" width="120" height="120" />
          <img class="pc" src="~assets/img/pc/email.png" alt="" width="144" height="144" />
          <UButton @click="onPasswordAuth(true)">이메일 인증</UButton>
        </div>
      </div>
    </template>
    <template v-else>
      <div v-if="emailAuth" class="find-area">
        <h1>비밀번호 찾기</h1>
        <p>
          입력하신 아이디(이메일)로 비밀번호 변경<br />
          링크를 보내드립니다.
        </p>
        <div class="input">
          <label>아이디</label>
          <UInput
            v-model="email"
            class="h-m"
            :class="{ 'is-error': !feedback.email.isValid }"
            :error-msg="feedback.email.text"
            w-size="full"
            placeholder="이메일 주소"
          />
        </div>
        <UButton w-size="100" @click="passwordChangeEmailSend">이메일 발송</UButton>
      </div>
      <div v-else class="find-area">
        <h1>비밀번호 찾기</h1>
        <p>
          휴대폰 인증이 끝나면<br class="m" />
          비밀번호를 변경하세요.
        </p>
        <div class="input">
          <label>아이디</label>
          <UInput
            v-model="email"
            class="h-m"
            :class="{ 'is-error': !feedback.email.isValid }"
            :error-msg="feedback.email.text"
            w-size="full"
            placeholder="이메일 주소"
          />
        </div>
        <UButton w-size="100" @click="check">휴대폰 인증</UButton>
      </div>
    </template>
    <UDialogModal :is-show="modal.isSend">
      <template #content>입력하신 이메일로 변경 링크를 보냈습니다.</template>
      <template #modal-btn2>
        <UButton w-size="100" button-type="primary" @click="modal.isSend = false">확인</UButton>
      </template>
    </UDialogModal>
    <UDialogModal :is-show="modal.isError">
      <template #content>가입한 이메일을 확인해주시기 바랍니다.</template>
      <template #modal-btn2>
        <UButton w-size="100" button-type="primary" @click="modal.isError = false">확인</UButton>
      </template>
    </UDialogModal>
  </main>
</template>

<script>
import UButton from '~/components/user/common/UButton';
import UInput from '~/components/user/common/UInput';
import UDialogModal from '~/components/user/modal/UDialogModal';
import { createFormElement } from '~/assets/js/commons';
export default {
  name: 'FindPw',
  components: { UDialogModal, UButton, UInput },
  data() {
    return {
      authType: true,
      emailAuth: false,
      token: '',
      email: '',
      feedback: {
        email: {
          isValid: true,
          text: ''
        }
      },
      modal: {
        isSend: false,
        isError: false
      }
    };
  },
  methods: {
    async check() {
      if (this.isValidate()) {
        const res = await this.$axios.$get('/user/auth/exist/email', {
          params: {
            email: this.email
          }
        });

        if (!res) {
          this.modal.isError = true;
          return;
        }

        const windowLocation = window.location;
        const returnUrl = `${windowLocation.protocol}//${windowLocation.host}/nice/nice-user-success?email=${this.email}&returnUrl=auth-change-pw`;
        const errorUrl = `${windowLocation.protocol}//${windowLocation.host}/auth/change-pw`;

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
      }
    },
    async passwordChangeEmailSend() {
      if (this.isValidate()) {
        await this.$axios
          .$get(`/user/auth/find/pw/email`, {
            params: {
              email: this.email,
              redirectUrl: `${window.location.origin}/auth/change-pw`
            }
          })
          .then(() => {
            this.modal.isSend = true;
          })
          .catch((err) => {
            const errorMessage = err.response.data?.MESSAGE || '';
            if (errorMessage === 'USER_NOT_FOUND') {
              this.modal.isError = true;
            }
          });
      }
    },
    onPasswordAuth(boolean) {
      this.authType = false;
      this.emailAuth = boolean;
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

      clearValid();

      if (!this.email) {
        emailFeedback.isValid = false;
        emailFeedback.text = '이메일을 입력해주세요.';
      } else if (!emailPattern.test(this.email)) {
        emailFeedback.isValid = false;
        emailFeedback.text = '@을 포함한 뒷부분을 확인해주세요.';
      } else {
        emailFeedback.isValid = true;
        emailFeedback.text = '';
      }

      return isClearForm();
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  margin: 3.2rem 0 2rem;
  font-size: 2.8rem;
  font-weight: 700;
  text-align: center;
  line-height: 2.8rem;
}

p {
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.8rem;
}

.container {
  margin-bottom: 12rem;
}

.pc {
  display: none;
}

.certified-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 2.4rem;
  border: 0.1rem solid var(--color-black);

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 0 3.6rem;

    &:first-of-type {
      border-bottom: 0.1rem solid var(--color-black);
    }

    button {
      width: 15.4rem !important;
      margin-top: 1.2rem;
    }
  }
}

.find-area {
  .input {
    margin-top: 2.4rem;

    .input-wrap {
      margin-top: 1.6rem;
    }
  }

  p {
    line-height: 2.88rem;
    padding-bottom: 2.4rem;
    border-bottom: 0.1rem solid var(--color-black);
  }

  button {
    margin-top: 4rem;
  }
}

.breadcrumb {
  display: none;
}

@media screen and (min-width: 768px) {
  .m {
    display: none;
  }

  .pc {
    display: block;
  }

  h1 {
    margin: 7.6rem 0 2.4rem;
    font-size: 4.2rem;
    line-height: 6.3rem;
  }

  p {
    font-size: 2rem;
    text-align: center;
    line-height: 3rem;
    letter-spacing: 0.025rem;
  }

  .breadcrumb {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    margin-top: 2.8rem;

    i {
      font-size: 2rem;
      color: var(--color-grey-3);
    }

    span {
      font-size: 1.4rem;
      line-height: 2.24rem;
      letter-spacing: 0.025rem;
      color: var(--color-grey-3);

      &.is-active {
        &:first-of-type {
          &::after {
            display: none;
          }
        }
      }

      &:first-of-type {
        position: relative;

        &::before {
          content: '';
          display: inline-block;
          width: 0.8rem;
          height: 0.1rem;
          margin: 0 0.4rem;
          background-color: var(--color-grey-3);
        }
        &::after {
          content: '';
          display: inline-block;
          width: 0.8rem;
          height: 0.1rem;
          margin: 0 0.4rem;
          background-color: var(--color-grey-3);
        }
      }

      &:last-of-type {
        position: relative;

        &::before {
          content: '';
          display: inline-block;
          width: 0.8rem;
          height: 0.1rem;
          margin: 0 0.4rem;
          background-color: var(--color-grey-3);
        }
      }
    }
  }

  .certified-area {
    flex-direction: row;
    justify-content: space-around;
    max-width: 66.8rem;
    margin: 3.6rem auto 0;

    div {
      width: 50%;
      padding: 5.6rem 0;

      &:first-of-type {
        border-bottom: unset;
        border-right: 0.1rem solid var(--color-black);
      }

      button {
        width: 15.2rem !important;
        margin-top: 3.2rem;
      }
    }
  }

  .find-area {
    max-width: 43.6rem;
    margin: 0 auto;
    .input {
      margin-top: 2.8rem;

      label {
        font-size: 1.6rem;
        line-height: 160%;
        letter-spacing: 0.025rem;
      }

      .input-wrap {
        margin-top: 1.2rem;
      }
    }

    p {
      padding-bottom: 3.6rem;
    }

    button {
      margin-top: 3.2rem;
    }
  }
}
</style>
