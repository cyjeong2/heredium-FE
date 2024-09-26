<template>
  <main class="container">
    <div class="login-wrap password">
      <h1>비밀번호 변경</h1>
      <div class="center-area">
        <p class="sub-title">비밀번호는 영문, 숫자, 특수문자를 포함한 8자리에서 16자리로 조합해주세요.</p>
      </div>
      <div class="input-area">
        <UInput
          v-model="password"
          class="h-m"
          :class="{ 'is-error': !feedback.password.isValid }"
          :error-msg="feedback.password.text"
          type="password"
          placeholder="8 ~ 16자로 입력해주세요."
          maxlength="30"
          w-size="full"
          @enter="changeIn"
        />
        <UInput
          v-model="passwordConfirm"
          class="h-m"
          :class="{ 'is-error': !feedback.passwordConfirm.isValid }"
          :error-msg="feedback.passwordConfirm.text"
          type="password"
          placeholder="비밀번호를 재입력해주세요."
          maxlength="30"
          w-size="full"
          @enter="changeIn"
        />
      </div>
      <UButton button-type="primary" w-size="100" @click="changeIn">비밀번호 변경</UButton>
    </div>
    <UDialogModal :is-show="modal.isSave" hide-head @close="loginMove">
      <template #content>비밀번호가 변경되었습니다.</template>
      <template #modal-btn1>
        <UButton w-size="100" button-type="primary" @click="loginMove">확인</UButton>
      </template>
    </UDialogModal>
    <UDialogModal :is-show="modal.isError">
      <template #content>만료된 페이지입니다.</template>
      <template #modal-btn1>
        <UButton w-size="100" button-type="primary" @click="loginMove">확인</UButton>
      </template>
    </UDialogModal>
  </main>
</template>

<script>
import UDialogModal from '~/components/user/modal/UDialogModal';
import UButton from '~/components/user/common/UButton';
import UInput from '~/components/user/common/UInput';
export default {
  name: 'ChangePw',
  components: { UInput, UButton, UDialogModal },
  asyncData({ query }) {
    const { token } = query;

    return { token };
  },
  data() {
    return {
      token: null,
      password: '',
      passwordConfirm: '',
      feedback: {
        password: {
          isValid: true,
          text: ''
        },
        passwordConfirm: {
          isValid: true,
          text: ''
        }
      },
      modal: {
        isSave: false,
        isError: false
      },
      errorMessage: ''
    };
  },
  async fetch() {
    if (this.$route.params.EncodeData) {
      this.token = await this.$axios
        .$get('/user/auth/find/pw/phone', {
          params: {
            encodeData: this.$route.params.EncodeData,
            email: this.$route.params.email
          }
        })
        .catch(() => {
          this.$router.push('/auth/password-not-found');
        });
    }
  },
  methods: {
    async changeIn() {
      if (this.isValidate()) {
        await this.$axios
          .$post(`/user/auth/find/pw`, {
            token: this.token,
            password: this.password
          })
          .then(() => {
            this.modal.isSave = true;
          })
          .catch((err) => {
            const errorMessage = err.response.data?.MESSAGE || '';

            if (errorMessage === 'BAD_VALID') {
              this.modal.isError = true;
            }
          });
      }
    },
    loginMove() {
      this.$router.replace(`/auth/login`);
    },
    isValidate() {
      const clearValid = () => {
        Object.values(this.feedback).forEach((value) => {
          value.isValid = true;
        });
      };
      const isClearForm = () => !Object.values(this.feedback).find((value) => value.isValid === false);
      const passwordFeedback1 = this.feedback.password;
      const passwordFeedback2 = this.feedback.passwordConfirm;

      clearValid();

      if (!this.password) {
        passwordFeedback1.isValid = false;
        passwordFeedback1.text = '비밀번호를 입력해 주세요.';
      } else if (this.password.length < 8 || this.password.length > 16) {
        passwordFeedback1.isValid = false;
        passwordFeedback1.text = '8 ~ 16자리로 입력해주세요.';
      } else {
        passwordFeedback1.isValid = true;
        passwordFeedback1.text = '';
      }

      if (!this.passwordConfirm) {
        passwordFeedback2.isValid = false;
        passwordFeedback2.text = '비밀번호 확인을 입력해 주세요.';
      } else if (this.password !== this.passwordConfirm) {
        passwordFeedback2.isValid = false;
        passwordFeedback2.isValid = false;
        passwordFeedback2.text = '비밀번호가 일치하는지 확인해주세요.';
      } else {
        passwordFeedback2.isValid = true;
        passwordFeedback2.text = '';
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
  padding-bottom: 2.4rem;
  border-bottom: 0.1rem solid var(--color-black);
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  line-height: 2.88rem;
}

.sub-title {
  word-break: keep-all;
}

.pc {
  display: none;
}

.input-wrap + .input-wrap {
  margin-top: 1.6rem;
}

.login-wrap {
  margin: 0 auto 12rem;

  button {
    margin-top: 4rem;
  }
}

.input-area {
  margin-top: 2.4rem;
}

@media screen and (min-width: 768px) {
  .m {
    display: none;
  }

  .pc {
    display: block;
  }

  h1 {
    margin: 12.4rem 0 2.4rem;
    font-size: 4.2rem;
    line-height: 6.3rem;
  }

  p {
    font-size: 2rem;
    text-align: center;
    line-height: 3rem;
    letter-spacing: 0.025rem;
  }

  .login-wrap {
    max-width: 43.6rem;
    margin: 0 auto 16.6rem;

    button {
      margin-top: 3.2rem;
    }
  }

  .input-area {
    margin-top: 3.2rem;
  }
}
</style>
