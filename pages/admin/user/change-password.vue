<template>
  <div class="edit">
    <div class="login-wrap password">
      <h1>비밀번호 변경</h1>
      <div class="center-area">
        <h4>비밀번호는 영문, 숫자, 특수문자를 포함한 8자리에서<br />16자리로 조합해주세요.</h4>
      </div>
      <input
        v-if="user === undefined"
        v-model="password"
        :class="{ 'is-error': !feedback.password.isValid }"
        type="password"
        placeholder="현재 비밀번호"
        maxlength="30"
        @keyup.enter="onChangePassword"
      />
      <p v-if="user === undefined && !feedback.password.isValid" class="validation">{{ feedback.password.text }}</p>
      <input
        v-model="newPassword1"
        :class="{ 'is-error': !feedback.newPassword1.isValid }"
        type="password"
        placeholder="새 비밀번호"
        maxlength="30"
        @keyup.enter="onChangePassword"
      />
      <p v-if="!feedback.newPassword1.isValid" class="validation">{{ feedback.newPassword1.text }}</p>
      <input
        v-model="newPassword2"
        :class="{ 'is-error': !feedback.newPassword2.isValid }"
        type="password"
        placeholder="비밀번호 확인"
        maxlength="30"
        @keyup.enter="onChangePassword"
      />
      <p v-if="!feedback.newPassword2.isValid" class="validation">{{ feedback.newPassword2.text }}</p>
      <SButton w-size="full" button-type="primary" @click="onChangePassword">변경</SButton>
    </div>
    <SDialogModal :is-show="modal.isDone">
      <template #content>비밀번호가 변경되었습니다.</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="goBack">확인</SButton>
      </template>
    </SDialogModal>
  </div>
</template>

<script>
import SDialogModal from '~/components/admin/modal/SDialogModal';
import SButton from '~/components/admin/commons/SButton';

export default {
  name: 'ChangePassword',
  components: { SButton, SDialogModal },
  layout: 'admin/default',
  asyncData({ query }) {
    const { id, email } = query;
    const user = query.user === 'true' ? true : query.user === 'false' ? false : undefined;
    return { id, user, email };
  },
  data() {
    return {
      id: null,
      user: null,
      modal: {
        isDone: false
      },
      password: '',
      newPassword1: '',
      newPassword2: '',
      feedback: {
        password: {
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
  methods: {
    goBack() {
      this.$router.back();
    },
    isValidate() {
      const clearValid = () => {
        Object.values(this.feedback).forEach((value) => {
          value.isValid = true;
        });
      };
      const isClearForm = () => !Object.values(this.feedback).find((value) => value.isValid === false);
      const passwordFeedback = this.feedback.password;
      const newPasswordFeedback1 = this.feedback.newPassword1;
      const newPasswordFeedback2 = this.feedback.newPassword2;

      clearValid();

      if (!this.password && this.user === undefined) {
        passwordFeedback.isValid = false;
        passwordFeedback.text = '현재 비밀번호를 입력해 주세요.';
      }

      if (!this.newPassword1) {
        newPasswordFeedback1.isValid = false;
        newPasswordFeedback1.text = '새 비밀번호를 입력해 주세요.';
      } else if (this.newPassword1.length < 8 || this.newPassword1.length > 16) {
        newPasswordFeedback1.isValid = false;
        newPasswordFeedback1.text = '비밀번호를 8자리에서 16자리로 조합해주세요.';
      }

      if (!this.newPassword2) {
        newPasswordFeedback2.isValid = false;
        newPasswordFeedback2.text = '비밀번호 확인을 입력해 주세요.';
      } else if (this.newPassword1 !== this.newPassword2) {
        newPasswordFeedback1.isValid = false;
        newPasswordFeedback2.isValid = false;
        newPasswordFeedback2.text = '비밀번호가 일치하지 않습니다.';
      }

      return isClearForm();
    },
    async onChangePassword() {
      if (this.isValidate()) {
        if (this.user) {
          await this.$axios
            .$put(`/admin/accounts/${this.id}/password`, {
              password: this.newPassword1
            })
            .then(() => {
              this.modal.isDone = true;
            });
        } else if (this.user === false) {
          await this.$axios
            .$put(`/admin/admins/${this.id}/password`, {
              password: this.newPassword1
            })
            .then(() => {
              this.modal.isDone = true;
            });
        } else if (this.user === undefined) {
          await this.$axios
            .$put(`/admin/member/password`, {
              password: this.password,
              changePassword: this.newPassword1
            })
            .then(() => {
              this.modal.isDone = true;
            })
            .catch((err) => {
              const errorMessage = err.response.data?.MESSAGE || '';

              if (errorMessage === 'PASSWORD_NOT_MATCHED') {
                this.feedback.password.isValid = false;
                this.feedback.password.text = '올바른 현재 비밀번호를 입력해 주세요.';
              }
            });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.edit {
  display: flex;
  height: calc(100vh - 6.7rem);
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 43.2rem;
  min-height: 43.7rem;
  padding: 4.6rem 5.6rem 5.2rem;
  background-color: var(--color-white);
  box-shadow: 0 0.1rem 0.7rem rgba(0, 0, 0, 0.1);
  border-radius: 3px;

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
  }

  h4 {
    letter-spacing: -0.02em;
    white-space: nowrap;
  }

  .center-area {
    margin: 2rem 0 4.3rem;

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
  }

  button {
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

      .img-box {
        margin-bottom: 4.1rem;
      }
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
</style>
