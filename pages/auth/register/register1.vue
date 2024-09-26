<template>
  <main class="container">
    <div class="m progress-bar">
      <div class="fill" />
    </div>
    <div class="register-wrap">
      <h1>회원가입</h1>
      <div class="pc progress-bar">
        <div class="fill" />
      </div>
      <p>가입을 위해 약관에 동의를 해주세요.</p>
      <div class="terms-area">
        <div class="all-terms">
          <UCheckbox v-model="isAllChecked" @input="setCheckedAll"><strong>약관 전체 동의</strong></UCheckbox>
        </div>
        <div class="each-terms">
          <UCheckbox v-model="isTerms.AGE"><strong>[필수]</strong> 만 14세 이상이에요.</UCheckbox>
          <UCheckbox v-model="isTerms.SERVICE">
            <strong>[필수]</strong> <button @click="showTerm('SERVICE')">서비스 이용약관</button> 동의</UCheckbox
          >
          <UCheckbox v-model="isTerms.AGREE">
            <strong>[필수]</strong>
            <button @click="showTerm('AGREE')">개인정보 수집 및 이용동의서</button> 동의</UCheckbox
          >
          <UCheckbox v-model="isTerms.MARKETING"> <strong>[선택]</strong> 마케팅 활용 동의 및 광고 수신 동의</UCheckbox>
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
  name: 'Register1Page',
  components: { URegisterModal, UCheckbox, UButton, UDialogModal },
  data() {
    return {
      termTarget: '',
      termsData: null,
      isAllChecked: false,
      isTerms: {
        AGE: false,
        SERVICE: false,
        AGREE: false,
        MARKETING: false
      },
      modal: {
        isTerms: false,
        isError: false
      }
    };
  },
  watch: {
    isTerms: {
      deep: true,
      handler(newValue) {
        this.isAllChecked = !Object.values(newValue).some((item) => !item);
        localStorage.setItem('isMarketing', JSON.stringify(this.isTerms.MARKETING));
      }
    }
  },
  mounted() {
    localStorage.removeItem('isMarketing');
  },
  methods: {
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
      if (this.isTerms.AGE && this.isTerms.SERVICE && this.isTerms.AGREE) {
        this.$router.push('/auth/register/register2');
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

p {
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
  }

  h1 {
    margin: 12.6rem 0 4rem;
    font-size: 4.2rem;
    line-height: 6.3rem;
  }

  p {
    margin-top: 2.4rem;
    font-size: 2rem;
    line-height: 3rem;
    text-align: left;
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

  .terms-area {
    .all-terms {
      margin: 4.8rem 0 2.4rem;
    }
    .each-terms {
      display: flex;
      flex-direction: column;
      padding: 2rem 0 0;
      margin-bottom: 5.2rem;
      border-top: 0.1rem solid var(--color-grey-1);
      border-bottom: unset;

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
