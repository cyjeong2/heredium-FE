<template>
  <main class="container">
    <SideBarMyPage />
    <section>
      <div class="withdrawal-head">
        <h2>회원 탈퇴</h2>
      </div>
      <div class="withdrawal-body">
        <h3>탈퇴 규정</h3>
        <ul>
          <li>
            탈퇴하면 고객님의 모든 전시·프로그램 예매 및 커피 주문이 삭제돼요. 삭제된 정보와 계정은 복구되지 않으니
            신중하게 결정해주세요.
          </li>
          <li>예매한 전시·프로그램이나 커피 주문이 있다면 먼저 환불 신청을 하고 탈퇴해주세요.</li>
          <li>탈퇴하면 고객님의 개인정보는 모두 파기되니 안심하세요.</li>
          <li>
            전자상거래 시행령에 따라 계약 또는 청약철회에 관한 기록, 대금결제 및 재화 등의 기록은 5년 동안 보존하고
            있어요.
          </li>
        </ul>
        <div class="withdrawal-accept"><UCheckbox v-model="consentWithdraw">탈퇴 규정에 동의해요.</UCheckbox></div>
        <div class="btn-area grid col-xs-2 gap-xs-col-8">
          <UButton w-size="100" button-type="secondary" @click="$router.go(-1)">취소하기</UButton>
          <UButton w-size="100" @click="onWithdrawModal">탈퇴하기</UButton>
        </div>
      </div>
      <UDialogModal no-scroll-lock :is-show="modal.isConsent">
        <template #content>탈퇴 규정에 동의해주세요.</template>
        <template #modal-btn2>
          <UButton w-size="100" button-type="primary" @click="modal.isConsent = false">확인</UButton>
        </template>
      </UDialogModal>
      <UModal
        :is-show="modal.isWithdraw"
        hide-edge-close-btn
        class="withdrawal-modal"
        @close="modal.isWithdraw = false"
      >
        <template #title>회원 탈퇴</template>
        <template #content>
          <p class="withdrawal-modal-text">회원에서 탈퇴하려면 본인 확인이 필요해요. 비밀번호를 입력해주세요.</p>
          <UInput
            v-model="password"
            type="password"
            class="h-m"
            w-size="full"
            :error-msg="errorMsg"
            placeholder="비밀번호를 입력해주세요."
          />
        </template>
        <template #modal-btn1>
          <UButton button-type="secondary" @click="cancel">취소</UButton>
        </template>
        <template #modal-btn2>
          <UButton button-type="primary" @click="onWithdraw">탈퇴</UButton>
        </template>
      </UModal>
      <UModal
        :is-show="modal.isSNSWithdraw"
        hide-edge-close-btn
        class="withdrawal-modal"
        @close="modal.isSNSWithdraw = false"
      >
        <template #content>
          <p class="withdrawal-modal-text">회원 탈퇴를 진행하시겠습니까?</p>
        </template>
        <template #modal-btn1>
          <UButton button-type="secondary" @click="modal.isSNSWithdraw = false">취소</UButton>
        </template>
        <template #modal-btn2>
          <UButton button-type="primary" @click="onWithdraw">탈퇴</UButton>
        </template>
      </UModal>
    </section>
  </main>
</template>

<script>
import SideBarMyPage from '~/components/user/page/SideBarMyPage.vue';
import UCheckbox from '~/components/user/common/UCheckbox';
import UButton from '~/components/user/common/UButton';
import UDialogModal from '~/components/user/modal/UDialogModal';
import UInput from '~/components/user/common/UInput';
import UModal from '~/components/user/modal/UModal.vue';

export default {
  name: 'WithdrawalPage',
  components: { UModal, UInput, UDialogModal, UButton, UCheckbox, SideBarMyPage },
  asyncData({ store, redirect }) {
    const isLogged = !!store.getters['service/auth/getAccessToken'];
    if (!isLogged) {
      redirect('/');
    }
  },
  data() {
    return {
      consentWithdraw: false,
      password: '',
      errorMsg: '',
      modal: {
        isWithdraw: false,
        isConsent: false,
        isSNSWithdraw: false
      }
    };
  },
  methods: {
    onWithdrawModal() {
      const isSNSLogin = this.$store.getters['service/auth/getUserInfo']?.provider;

      if (this.consentWithdraw) {
        if (isSNSLogin === 'EMAIL') {
          this.modal.isWithdraw = true;
        } else {
          this.modal.isSNSWithdraw = true;
        }
      } else {
        this.modal.isConsent = true;
      }
    },
    async onWithdraw() {
      await this.$axios
        .$delete('/user/account', {
          params: { password: this.password }
        })
        .then(() => {
          this.$store.dispatch('service/auth/userLogout');
          this.$router.replace({ name: 'mypage-info-withdrawal-done', params: { complete: 'true' } });
        })
        .catch(() => {
          if (!this.password) {
            this.errorMsg = '비밀번호를 입력해주세요.';
          } else {
            this.errorMsg = '비밀번호를 다시 확인해주세요.';
          }
        });
    },
    cancel() {
      this.password = '';
      this.modal.isWithdraw = false;
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

h3 {
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 2.6rem;
}

.container {
  margin-bottom: 12rem;
}

.tabs {
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

.withdrawal-body {
  h3 {
    margin-top: 2.4rem;
  }

  ul {
    margin-top: 1.2rem;
    li + li {
      margin-top: 0.8rem;
    }

    li {
      position: relative;
      padding-left: 0.9rem;

      &::before {
        content: '';
        position: absolute;
        top: 0.9rem;
        left: 0;
        width: 0.3rem;
        height: 0.3rem;
        background-color: var(--color-grey-2);
        border-radius: 50%;
      }
    }
  }
  .withdrawal-accept {
    margin-top: 2rem;
    padding: 1.8rem 1.6rem;
    background: rgba(235, 235, 235, 0.4);
  }

  .btn-area {
    margin-top: 4rem;
  }
}

.withdrawal-modal-text {
  font-weight: 500;
  font-size: 1.6rem;
  line-height: 160%;
  margin-bottom: 2.4rem;
  text-align: left;
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

  .withdrawal-head {
    h2 {
      font-size: 3.2rem;
      font-weight: 500;
      line-height: 150%;
      padding-bottom: 2.6rem;
    }
  }

  .withdrawal-body {
    h3 {
      font-size: 2rem;
      font-weight: 500;
      margin-top: 2rem;
    }

    ul {
      margin-top: 2rem;

      li + li {
        margin-top: 0.4rem;
      }

      li {
        font-size: 1.6rem;
        line-height: 160%;
        padding-left: 1.5rem;

        &::before {
          top: 1rem;
        }
      }
    }
    .withdrawal-accept {
      padding: 1.8rem 2rem;

      ::v-deep .text {
        font-weight: 500;
        font-size: 1.6rem;
      }
    }

    .btn-area {
      margin-top: 5.2rem;
      column-gap: 1.6rem;

      > button {
        width: 15.2rem !important;

        &:first-child {
          justify-self: flex-end;
        }
      }
    }
  }

  .modal {
    .input-wrap {
      text-align: left;
    }

    p {
      margin-bottom: 2.4rem;
      text-align: left;
    }

    button {
      min-width: auto !important;
      width: 50% !important;
    }
  }
}
</style>
