<template>
  <main class="container">
    <template v-if="isMounted">
      <div class="m progress-bar">
        <div class="fill" />
      </div>
      <div class="title-area">
        <h1>비회원 예메</h1>
        <div class="pc progress-bar">
          <div class="fill" />
        </div>
        <p>예매확인을 위한 정보를 입력해주세요.</p>
      </div>
      <section class="register-sec">
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
        <div class="grid-wrap">
          <div class="input">
            <label>이름</label>
            <UInput :value="userInfo.name" class="h-m" w-size="full" disabled />
          </div>
          <div class="input">
            <label>전화번호</label>
            <UInput :value="userInfo.mobileNo" class="h-m" w-size="full" disabled />
          </div>
        </div>
      </section>
      <div class="btn-area">
        <UButton w-size="100" @click="goPaymentProcess">완료</UButton>
      </div>
    </template>
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
import UInput from '~/components/user/common/UInput';
import UButton from '~/components/user/common/UButton';
import payMixin from '~/store/tosspaymentsMixin';
import UDialogModal from '~/components/user/modal/UDialogModal.vue';

export default {
  name: 'Pay3Page',
  components: { UDialogModal, UInput, UButton },
  mixins: [payMixin],
  async asyncData({ query, $axios, $dayjs, redirect }) {
    if (!query.EncodeData) {
      redirect('/');
    }

    const encodeData = query.EncodeData;
    const userInfo = await $axios
      .$get('/nice/decrypt', {
        params: {
          encodeData
        }
      })
      .catch(() => {
        redirect('/ticketing/non-member/pay1');
      });

    const now = $dayjs();
    now.format();
    const birthDate = $dayjs(userInfo?.birthDate || '1990-01-01');
    birthDate.format();
    const age = now.get('year') - birthDate.get('year');
    const mon = now.get('month') + 1 - birthDate.get('month');
    const ageTest = () => {
      if (mon < 0 || (mon === 0 && now.get('day') < birthDate.get('day'))) {
        return age - 1;
      } else {
        return age;
      }
    };
    if (ageTest() < 14) {
      redirect('/ticketing/non-member/pay2', { failed: true });
    }
    return { userInfo, encodeData };
  },
  data() {
    return {
      userInfo: {
        name: '',
        mobileNo: ''
      },
      encodeData: null,
      userForm: {
        email: '',
        password: '',
        passwordConfirm: ''
      },
      payTargetData: {
        id: '',
        isFree: null,
        kind: null,
        prices: [{ id: null, number: null }],
        roundId: null
      },
      isMounted: false,
      feedback: {
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
      modal: { isFeedback: false },
      feedbackMsg: '',
      isTickedLimit: false
    };
  },
  mounted() {
    try {
      const data = JSON.parse(localStorage.getItem('store'));

      localStorage.removeItem('store');
      if (!data || !data.payTargetData) {
        this.$router.push('/');
      }

      this.payTargetData = data.payTargetData;
      this.isMounted = true;
    } catch (e) {
      this.$router.push('/');
    }

    window.addEventListener('beforeunload', this.beforeUnloadEvent);
  },
  destroyed() {
    window.removeEventListener('beforeunload', this.beforeUnloadEvent);
  },
  methods: {
    beforeUnloadEvent(e) {
      e.returnValue = '';
      return '';
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
      const passwordFeedback1 = this.feedback.password;
      const passwordFeedback2 = this.feedback.passwordConfirm;
      const { email, password, passwordConfirm } = this.userForm;

      clearValid();

      if (email.length > 0 && !emailPattern.test(email)) {
        emailFeedback.isValid = false;
        emailFeedback.text = '이메일 입력 시, @을 포함한 뒷부분을 확인하여 올바른 이메일을 입력해주세요.';
      } else {
        emailFeedback.isValid = true;
        emailFeedback.text = '';
      }

      if (!password) {
        passwordFeedback1.isValid = false;
        passwordFeedback1.text = '비밀번호를 입력해 주세요.';
      } else if (password.length < 4) {
        passwordFeedback1.isValid = false;
        passwordFeedback1.text = '4자리로 입력해주세요.';
      } else {
        passwordFeedback1.isValid = true;
        passwordFeedback1.text = '';
      }

      if (!passwordConfirm) {
        passwordFeedback2.isValid = false;
        passwordFeedback2.text = '비밀번호 확인을 입력해 주세요.';
      } else if (password !== passwordConfirm) {
        passwordFeedback2.isValid = false;
        passwordFeedback2.isValid = false;
        passwordFeedback2.text = '비밀번호가 일치하는지 확인해주세요.';
      } else {
        passwordFeedback2.isValid = true;
        passwordFeedback2.text = '';
      }

      return isClearForm();
    },
    async goPaymentProcess() {
      if (this.isValidate()) {
        const ticketOrderInfo = {
          kind: this.payTargetData.kind,
          roundId: this.payTargetData.roundId,
          prices: this.payTargetData.prices
        };
        const userRequest = {
          encodeData: this.encodeData,
          email: this.userForm.email,
          password: this.userForm.password
        };
        const localStorageData = {
          name: this.userInfo.name,
          password: this.userForm.password,
          phone: this.userInfo.mobileNo
        };
        const isFree = this.payTargetData.isFree;

        localStorage.setItem('nonMemberData', JSON.stringify(localStorageData));
        window.removeEventListener('beforeunload', this.beforeUnloadEvent);
        if (isFree) {
          await this.$axios
            .$post('/user/tickets/non-user/free', {
              ticketOrderInfo,
              userRequest
            })
            .then((res) => {
              this.$router.push({
                name: 'ticketing-result',
                query: {
                  free: 'free',
                  type: 'nonMember'
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
          const failUrl = `${window.location.origin}/ticketing/${this.payTargetData.kind.toLowerCase()}/${
            this.payTargetData.id
          }`;

          await this.requestPayment(
            {
              ticketOrderInfo,
              userRequest
            },
            this.payTargetData.totalPrice,
            failUrl,
            {
              id: this.payTargetData.id,
              type: this.payTargetData.type
            },
            'non-member'
          );
        }
      }
    },
    confirmModal() {
      if (this.isTickedLimit) {
        this.$router.push(`/ticketing/${this.payTargetData.kind.toLowerCase()}/${this.payTargetData.id}`);
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

.progress-bar {
  position: fixed;
  top: 6rem;
  left: 0;
  right: 0;
  width: 100%;
  height: 0.2rem;
  background: var(--color-grey-1);

  .fill {
    width: 100%;
    height: 100%;
    background: var(--color-black);
  }
}

button {
  margin-top: 4rem;
}

.register-sec {
  margin: 4rem 0;

  .input + .input {
    margin-top: 3.2rem;
  }

  .input {
    .input-wrap {
      margin-top: 1.6rem;
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

.local-sec {
  padding: 2rem 0;
  border-top: 0.1rem solid var(--color-black);
  border-bottom: 0.1rem solid var(--color-black);

  p {
    margin-top: 1.2rem;
    padding-left: 2.5rem;
    font-size: 1.4rem;
    font-weight: 500;
    text-align: left;
    line-height: 2.2rem;
    word-break: keep-all;
  }
}

@media screen and (min-width: 768px) {
  .m {
    display: none;
  }

  .pc {
    display: block;
  }

  .register-sec,
  .local-sec,
  .btn-area,
  .title-area {
    max-width: 43.6rem;
    margin: 0 auto;
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

  .local-sec {
    p {
      padding-left: 3.2rem;
    }
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
      width: 100%;
      height: 100%;
      background: var(--color-black);
    }
  }
}
</style>
