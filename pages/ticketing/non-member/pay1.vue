<template>
  <main class="container">
    <div class="m progress-bar">
      <div class="fill" />
    </div>
    <div class="register-wrap">
      <h1>비회원 예메</h1>
      <div class="pc progress-bar">
        <div class="fill" />
      </div>
      <p>비회원 예매를 진행하기 위해 아래의 약관을 동의를 진행해 주세요.</p>
      <div class="terms-area">
        <div class="all-terms">
          <UCheckbox v-model="isAllChecked" @input="setCheckedAll"><strong>약관 전체 동의</strong></UCheckbox>
        </div>
        <div class="each-terms">
          <UCheckbox v-model="isTerms.AGE"><strong>[필수]</strong> 만 14세 이상이에요.</UCheckbox>
          <UCheckbox v-model="isTerms.AGREE">
            <strong>[필수]</strong>
            <button @click="showTerm('AGREE')">개인정보 수집 및 이용동의서</button> 동의</UCheckbox
          >
          <div class="term-des">
            <p>
              개인정보 수집 및 이용동의서의 동의를 거부할 수 있으며,<br />비동의 시 비회원 예매를 진행할 수 없습니다.
            </p>
            <dl>
              <dt>수집목적</dt>
              <dd>비회원예매 서비스 제공 / 이용자식별 / 구매 및 결제</dd>
              <dt>수집항목</dt>
              <dd>이름, 휴대폰번호, 비밀번호, 이메일</dd>
              <dt>보유기간</dt>
              <dd>관람, 환불, 기간만료 후 2년 후 파기</dd>
            </dl>
          </div>
        </div>
      </div>
      <UButton w-size="100" @click="onNextRegister">다음</UButton>
    </div>
    <URegisterModal
      :is-show="modal.isTerms"
      :term-target="termTarget"
      :terms-data="termsData"
      @close="modal.isTerms = false"
      @agree="termAgree"
    />
    <UDialogModal :is-show="modal.isError">
      <template #content>필수 약관에 동의해주세요.</template>
      <template #modal-btn2>
        <UButton w-size="100" class="feedback-btn" @click="modal.isError = false">확인</UButton>
      </template>
    </UDialogModal>
  </main>
</template>

<script>
import UCheckbox from '~/components/user/common/UCheckbox';
import UButton from '~/components/user/common/UButton';
import URegisterModal from '~/components/user/modal/URegisterModal';
import UDialogModal from '~/components/user/modal/UDialogModal';
export default {
  name: 'Pay1Page',
  components: { URegisterModal, UCheckbox, UButton, UDialogModal },
  asyncData({ store, redirect }) {
    if (!store.getters['service/non-member-pay/getPayTargetData']) {
      redirect('/');
    }
  },
  data() {
    return {
      termTarget: '',
      termsData: null,
      isAllChecked: false,
      isTerms: {
        AGE: false,
        AGREE: false
      },
      modal: {
        isTerms: false,
        isError: false
      }
    };
  },
  mounted() {
    window.addEventListener('beforeunload', this.beforeUnloadEvent);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.beforeUnloadEvent);
  },
  methods: {
    beforeUnloadEvent(e) {
      e.returnValue = '';
      return '';
    },
    async showTerm(target) {
      this.termTarget = target;
      this.termsData = await this.$axios.$get('/user/policies/posting', {
        params: {
          type: this.termTarget
        }
      });
      this.modal.isTerms = true;
    },
    termAgree() {
      this.isTerms[this.termTarget] = true;
      this.modal.isTerms = false;
    },
    setCheckedAll(newValue) {
      for (const key in this.isTerms) {
        this.isTerms[key] = newValue;
      }
    },
    onNextRegister() {
      if (this.isTerms.AGE && this.isTerms.AGREE) {
        this.$store.commit('service/non-member-pay/setIsAgreeDone', true);
        this.$router.push('/ticketing/non-member/pay2');
      } else {
        this.modal.isError = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin-bottom: 12rem;
}

h1 {
  margin: 5.2rem 0 2rem;
  font-size: 2.8rem;
  font-weight: 700;
  text-align: center;
  line-height: 2.8rem;
}

.register-wrap > p {
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.8rem;
}

.pc {
  display: none;
}

.progress-bar {
  position: fixed;
  top: 6rem;
  left: 0;
  right: 0;
  width: 100%;
  height: 0.2rem;
  background: var(--color-grey-1);

  .fill {
    width: 33.3%;
    height: 100%;
    background: var(--color-black);
  }
}

.terms-area {
  .all-terms {
    margin: 4rem 0 2.2rem;
  }

  strong {
    margin-right: 0.5rem;
    font-size: 1.7rem;
    font-weight: 700;
    line-height: 100%;
    transform: translateY(0.2rem);
  }

  .each-terms {
    display: flex;
    flex-direction: column;
    padding: 2.4rem 0;
    margin-bottom: 4rem;
    border-top: 1px solid var(--color-grey-1);
    border-bottom: 1px solid var(--color-grey-1);

    label + label {
      margin-top: 2rem;
    }

    strong {
      font-size: 1.4rem;
    }
  }

  button {
    margin-right: 0.5rem;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-u-primary);
    line-height: 150%;
  }
}

@media screen and (min-width: 768px) {
  .m {
    display: none;
  }

  .pc {
    display: block;
  }

  .register-wrap {
    max-width: 43.6rem;
    margin: 0 auto;

    > p {
      margin-top: 2.4rem;
      font-size: 2rem;
      line-height: 3rem;
      text-align: left;
    }
  }

  h1 {
    margin: 12.6rem 0 4rem;
    font-size: 4.2rem;
    line-height: 6.3rem;
  }

  .progress-bar {
    position: static;
    top: unset;
    left: unset;
    right: unset;
    width: 100%;
    height: 0.4rem;
    background: var(--color-grey-1);

    .fill {
      width: 33.3%;
      height: 100%;
      background: var(--color-black);
    }
  }

  .term-des {
    margin-top: 1.6rem;
    padding-left: 3.2rem;

    > p {
      font-size: 1.4rem;
      font-weight: 400;
      line-height: 150%;
      letter-spacing: -0.05rem;
    }

    > dl {
      display: grid;
      margin-top: 2.4rem;
      font-size: 1.4rem;
      background: rgba(235, 235, 235, 0.4);
      padding: 1.8rem 1.6rem;
      grid-template-columns: 5.1rem 1fr;
      column-gap: 3.5rem;
      row-gap: 1.2rem;
      letter-spacing: -0.05rem;

      dt {
        font-weight: 500;
      }

      dl {
      }
    }
  }

  .terms-area {
    .all-terms {
      margin: 4.8rem 0 2.4rem;
    }
    .each-terms {
      display: flex;
      flex-direction: column;
      padding: 2rem 0 2.4rem;
      margin-bottom: 3.2rem;
      border-top: 0.1rem solid var(--color-grey-1);

      label + label {
        margin-top: 1.3rem;
      }
    }

    strong {
      line-height: 160%;
      transform: unset;
    }
  }
}
</style>
