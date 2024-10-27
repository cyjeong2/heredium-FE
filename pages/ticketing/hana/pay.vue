<template>
  <main class="container">
    <div class="register-wrap">
      <h1>비회원 예매정보 입력</h1>
      <p>전화번호, 비밀번호를 입력해주세요.<br />입력하신 정보는 헤레디움 사이트에서 예매내역을 조회 시 사용됩니다.</p>
      <div class="name-table">
        <div>이름</div>
        <div>{{ hanaInfo.name }}</div>
      </div>
      <section class="register-sec">
        <div class="input">
          <label>휴대폰 번호 <b class="must">*</b></label>
          <UInput
            v-model="userForm.phone"
            class="h-m"
            :class="{ 'is-error': !feedback.phone.isValid }"
            :error-msg="feedback.phone.text"
            w-size="full"
            placeholder="휴대폰 번호 (‘-’를 제외하고 입력해주세요.)"
            is-number-only
          />
        </div>
        <div class="input">
          <label>비밀번호 <b class="must">*</b></label>
          <UInput
            v-model="userForm.password"
            class="h-m"
            :class="{ 'is-error': !feedback.password.isValid }"
            :error-msg="feedback.password.text"
            type="password"
            w-size="full"
            placeholder="숫자 4자리를 입력해주세요."
            is-number-only
            maxlength="4"
          />
        </div>
        <div class="input">
          <label>비밀번호 확인 <b class="must">*</b></label>
          <UInput
            v-model="userForm.passwordConfirm"
            class="h-m"
            :class="{ 'is-error': !feedback.passwordConfirm.isValid }"
            :error-msg="feedback.passwordConfirm.text"
            type="password"
            w-size="full"
            placeholder="비밀번호를 재입력해주세요."
            is-number-only
            maxlength="4"
          />
        </div>
        <div class="input">
          <label>이메일 (선택)</label>
          <UInput
            v-model="userForm.email"
            class="h-m"
            :class="{ 'is-error': !feedback.email.isValid }"
            :error-msg="feedback.email.text"
            w-size="full"
            placeholder="heredium@example.com"
          />
        </div>
      </section>
      <div class="terms-area">
        <div class="each-terms">
          <h2>개인정보 수집 및 이용동의서 동의</h2>
          <UCheckbox v-model="isTerms">
            <div class="checkbox-label">
              <strong>[필수]</strong>
              <button @click="showTerm('AGREE')">개인정보 수집 및 이용동의서</button><span>동의</span>
            </div>
          </UCheckbox>
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
      <UButton w-size="100" @click="goPaymentProcess">다음</UButton>
    </div>
    <URegisterModal
      :is-show="modal.isTerms"
      :term-target="termTarget"
      :terms-data="termsData"
      @close="modal.isTerms = false"
      @agree="termAgree"
    />
    <UDialogModal :is-show="modal.isFeedback">
      <template #content>
        {{ feedbackMsg }}
      </template>
      <template #modal-btn2>
        <UButton class="feedback-btn" @click="confirmModal">확인</UButton>
      </template>
    </UDialogModal>
  </main>
</template>

<script>
import UCheckbox from '~/components/user/common/UCheckbox';
import UButton from '~/components/user/common/UButton';
import URegisterModal from '~/components/user/modal/URegisterModal';
import UDialogModal from '~/components/user/modal/UDialogModal';
import UInput from '~/components/user/common/UInput.vue';
import payMixin from '~/store/tosspaymentsMixin';
// import payMixin from '~/store/nicepayMixin';
export default {
  name: 'Pay1Page',
  components: { UInput, URegisterModal, UCheckbox, UButton, UDialogModal },
  mixins: [payMixin],
  async asyncData({ store, redirect, $axios }) {
    const hanaQuery = store.getters['service/hana/getHanaQuery'];
    const targetData = store.getters['service/hana/getTargetData'];
    const hanaInfo = store.getters['service/hana/getHanaInfo'];
    const termTarget = 'AGREE';
    const termsData = await $axios.$get('/user/policies/posting', {
      params: {
        type: termTarget
      }
    });

    if (!hanaQuery || !hanaInfo || !targetData || !termsData) {
      redirect('/');
    }

    return { hanaQuery, hanaInfo, targetData, termsData, termTarget };
  },
  data() {
    return {
      hanaQuery: null,
      hanaInfo: null,
      targetData: null,
      termsData: null,
      termTarget: null,
      userForm: {
        phone: '',
        email: '',
        password: '',
        passwordConfirm: ''
      },
      feedback: {
        phone: {
          isValid: true,
          text: ''
        },
        email: {
          isValid: true,
          text: ''
        },
        password: {
          isValid: true,
          text: ''
        },
        passwordConfirm: {
          isValid: true,
          text: ''
        }
      },
      isTickedLimit: false,
      isTerms: false,
      modal: {
        isTerms: false,
        isFeedback: false
      },
      feedbackMsg: ''
    };
  },
  created() {
    this.userForm.phone = this.hanaInfo.phone;
    this.userForm.email = this.hanaInfo.email;
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
      this.isTerms = true;
      this.modal.isTerms = false;
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
      const { phone, email, password, passwordConfirm } = this.userForm;
      const phoneFeedback = this.feedback.phone;
      const emailFeedback = this.feedback.email;
      const passwordFeedback1 = this.feedback.password;
      const passwordFeedback2 = this.feedback.passwordConfirm;

      clearValid();

      if (!phone) {
        phoneFeedback.isValid = false;
        phoneFeedback.text = '전화번호를 입력해주세요.';
      }

      if (!password) {
        passwordFeedback1.isValid = false;
        passwordFeedback1.text = '비밀번호를 입력해 주세요.';
      } else if (password.length < 4) {
        passwordFeedback1.isValid = false;
        passwordFeedback1.text = '4자리로 입력해주세요.';
      }

      if (!passwordConfirm) {
        passwordFeedback2.isValid = false;
        passwordFeedback2.text = '비밀번호 확인을 입력해 주세요.';
      } else if (password !== passwordConfirm) {
        passwordFeedback2.isValid = false;
        passwordFeedback2.text = '비밀번호가 일치하는지 확인해주세요.';
      }

      if (email.length > 0 && !emailPattern.test(email)) {
        emailFeedback.isValid = false;
        emailFeedback.text = '이메일 입력 시, @을 포함한 뒷부분을 확인하여 올바른 이메일을 입력해주세요.';
      }

      return isClearForm();
    },
    async goPaymentProcess() {
      if (!this.isTerms) {
        this.feedbackMsg = '필수 약관에 동의해주세요.';
        this.modal.isFeedback = true;
      } else if (this.isValidate()) {
        window.removeEventListener('beforeunload', this.beforeUnloadEvent);
        const ticketOrderInfo = {
          kind: this.targetData.kind,
          roundId: this.targetData.roundId,
          prices: this.targetData.prices,
          discountType: 'HANA_BANK'
        };
        const userRequest = {
          ...this.hanaQuery,
          phone: this.userForm.phone,
          email: this.userForm.email,
          password: this.userForm.password
        };
        const isFree = this.targetData.isFree;

        localStorage.setItem('hanaQueryData', JSON.stringify(this.hanaQuery));
        localStorage.setItem('hanaEncryptData', JSON.stringify(this.hanaInfo));

        if (isFree) {
          await this.$axios
            .$post('/user/tickets/hana-bank/free', {
              ticketOrderInfo,
              userRequest
            })
            .then((res) => {
              this.$router.push({
                name: 'ticketing-result',
                query: {
                  free: 'free',
                  type: 'hana'
                },
                params: {
                  data: {
                    kind: res.type,
                    title: res.title,
                    uuid: res.uuid,
                    price: 0,
                    prices: [...res.prices],
                    startDate: res.startDate,
                    endDate: res.endDate
                  }
                }
              });
            })
            .catch((err) => {
              const errorMessage = err.response.data?.MESSAGE || '';

              if (errorMessage === 'BAD_VALID') {
                const state = err.response.data?.STATE;

                if (state === 1) {
                  this.feedbackMsg =
                    `보유 중인 입장일이 동일한 입장권 : ${err.response.data.BODY} 개\n` +
                    '입장일이 동일한 입장권은 최대 4매까지 구매 가능합니다.\n' +
                    '결제를 계속하시려면 구매 수를 변경하거나 입장 일을 다른 날짜로 선택해 주세요.';
                  this.isTickedLimit = true;
                  this.modal.isFeedback = true;
                } else if (state === 2) {
                  this.feedbackMsg = '전시 시작일과 종료일 사이에 존재하지 않는 회차에요.';
                  this.modal.isFeedback = true;
                  alert('회차가 전시 시작일과 종료일 사이에 존재하지 않음');
                } else if (state === 3) {
                  this.feedbackMsg = '예매 오픈일이 지나지 않았거나 회차 시작일이 2주 미만인 티켓이 아니에요.';
                  this.modal.isFeedback = true;
                } else if (state === 4) {
                  this.feedbackMsg = '회차 종료 1시간 전까지만 예매가 가능해요.';
                  this.modal.isFeedback = true;
                } else if (state === 5) {
                  this.feedbackMsg = '아쉽지만 선택한 회차가 매진되었습니다. 덜 붐비는 회차는 어떠세요?';
                  this.modal.isFeedback = true;
                }
              } else {
                alert('알수없는 오류. 다시 시도해주세요.');
              }
            });
        } else {
          const failUrl = `${window.location.origin}/ticketing/${this.targetData.kind.toLowerCase()}/${
            this.targetData.id
          }`;

          await this.requestPayment(
            {
              ticketOrderInfo,
              userRequest
            },
            this.targetData.totalPrice,
            failUrl,
            {
              id: this.targetData.id,
              type: this.targetData.type
            },
            'hana'
          );
        }
      }
    },
    confirmModal() {
      if (this.isTickedLimit) {
        this.$router.push(`/ticketing/${this.targetData.kind.toLowerCase()}/${this.targetData.id}`);
      }

      this.modal.isFeedback = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin-bottom: 12rem;
}

h1 {
  margin: 3.2rem 0 1rem;
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 2.8rem;
}

.register-wrap > p {
  font-size: 1.6rem;
  line-height: 160%;
  margin-bottom: 3.2rem;
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
    padding: 2.5rem 0 0;
    margin-bottom: 3.2rem;
    border-top: 1px solid var(--color-black);

    h2 {
      font-size: 1.6rem;
      font-weight: 500;
      line-height: 160%;
      letter-spacing: -0.05rem;
      margin-bottom: 2.4rem;
    }

    label + label {
      margin-top: 2rem;
    }

    strong {
      font-size: 1.4rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;

      strong {
        transform: none;
      }
      > * {
        font-family: 'Inter', 'Noto Sans KR', serif;
        display: inline-flex;
        line-height: 100%;
      }
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

.register-sec {
  margin: 5.7rem 0 3.2rem;

  .input + .input {
    margin-top: 2.8rem;
  }

  label {
    font-weight: 500;
    letter-spacing: -0.05rem;
  }

  .input {
    .input-wrap {
      margin-top: 1.2rem;
    }

    .must {
      color: var(--color-u-error);
    }
  }

  .grid-wrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 4rem;
    border-top: 1px solid var(--color-u-grey-2);
    padding-top: 3.2rem;
    row-gap: 3.2rem;
    column-gap: 1.6rem;

    .input {
      margin-top: 0 !important;
    }
  }
}

.name-table {
  display: flex;
  border-top: 1px solid var(--color-black);
  border-bottom: 1px solid rgba(190, 190, 190, 0.4);

  > div {
    padding: 1.5rem 1.6rem;
    font-weight: 500;
  }

  > div:first-child {
    width: 12.8rem;
    border-right: 1px solid var(--color-black);
    font-weight: 700;
  }
}

.term-des {
  margin-top: 1.6rem;

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
    column-gap: 4rem;
    row-gap: 1.2rem;
    letter-spacing: -0.05rem;

    dt {
      font-weight: 500;
    }

    dl {
    }
  }
}

@media screen and (min-width: 768px) {
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

  .register-sec {
    margin: 4.7rem auto 3.2rem;

    label {
      font-size: 1.6rem;
      line-height: 160%;
    }

    .input + .input {
      margin-top: 2.4rem;
    }

    .input {
      .input-wrap {
        margin-top: 1.2rem;
      }
    }

    .grid-wrap {
      margin-top: 3.2rem;
      row-gap: 2.4rem;
      column-gap: 2.8rem;
    }
  }
}
</style>
