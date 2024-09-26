<template>
  <div>
    <main class="login">
      <div class="login-wrap password">
        <h1 class="mb-20">비밀번호 변경</h1>
        <div class="center-area mb-43">
          <h4>비밀번호는 영문, 숫자, 특수문자를 포함한 8~16자리로 조합해주세요.</h4>
        </div>
        <SInput
          v-model="password"
          class="mb-12"
          :class="{ 'is-error': !feedback.password.isValid }"
          type="password"
          placeholder="새 비밀번호"
          maxlength="30"
          w-size="full"
          @enter="changeIn"
        />
        <p v-if="!feedback.password.isValid" class="validation">{{ feedback.password.text }}</p>
        <SInput
          v-model="passwordConfirm"
          class="mb-12"
          :class="{ 'is-error': !feedback.passwordConfirm.isValid }"
          type="password"
          placeholder="비밀번호 확인"
          maxlength="30"
          w-size="full"
          @enter="changeIn"
        />
        <p v-if="!feedback.passwordConfirm.isValid" class="validation">{{ feedback.passwordConfirm.text }}</p>
        <SButton button-type="primary" w-size="full" @click="changeIn">변경</SButton>
      </div>
    </main>
    <SDialogModal :is-show="modal.isSave" @close="loginMove">
      <template #content>비밀번호가 변경되었습니다.</template>
      <template #modal-btn1>
        <SButton button-type="primary" @click="loginMove">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isError" @close="loginMove">
      <template #content>만료된 페이지입니다.</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="loginMove">확인</SButton>
      </template>
    </SDialogModal>
  </div>
</template>

<script>
import SButton from '~/components/admin/commons/SButton';
import SInput from '~/components/admin/commons/SInput';
import SDialogModal from '~/components/admin/modal/SDialogModal';

export default {
  name: 'ChangePassword',
  components: { SDialogModal, SInput, SButton },
  layout: 'admin/none',
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
      }
    };
  },
  mounted() {
    console.log('Change Password', this.$route);
  },
  methods: {
    async changeIn() {
      if (this.isValidate()) {
        await this.$axios
          .$put(`/admin/auth/find/pw`, {
            token: this.token || this.$route.params.token,
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
      this.$router.replace(`/admin/login`);
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
    height: 54.8rem;
    padding: 5.2rem 5.6rem;
    background-color: var(--color-white);
    box-shadow: 0 1px 7px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    transform: translate(-50%, -50%);

    &.password {
      height: auto;
    }

    h1,
    h4 {
      text-align: center;
    }

    input + button,
    input + p + button {
      margin-top: 1.2rem;
    }

    p.validation {
      width: 100%;
      text-align: left;
    }
  }
}
</style>
