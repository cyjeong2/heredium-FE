<template>
  <main class="container">
    <div class="m progress-bar">
      <div class="fill" />
    </div>
    <div class="title-area">
      <h1>회원가입</h1>
      <div class="pc progress-bar">
        <div class="fill" />
      </div>
      <p>헤레디움에서 사용할 정보를 입력해주세요.</p>
    </div>
    <section class="register-sec">
      <div class="input">
        <label>이메일 <b class="must">*</b></label>
        <UInput
          v-model="email"
          class="h-m"
          :class="{ 'is-error': !feedback.email.isValid }"
          :error-msg="feedback.email.text"
          w-size="full"
          placeholder="heredium@example.com"
        ></UInput>
      </div>
      <div class="input">
        <label>비밀번호 <b class="must">*</b></label>
        <UInput
          v-model="password"
          class="h-m"
          :class="{ 'is-error': !feedback.password.isValid }"
          :error-msg="feedback.password.text"
          type="password"
          w-size="full"
          placeholder="8 ~ 16자로 입력해주세요."
        ></UInput>
      </div>
      <div class="input">
        <label>비밀번호 확인 <b class="must">*</b></label>
        <UInput
          v-model="passwordConfirm"
          class="h-m"
          :class="{ 'is-error': !feedback.passwordConfirm.isValid }"
          :error-msg="feedback.passwordConfirm.text"
          type="password"
          w-size="full"
          placeholder="비밀번호를 재입력해주세요."
        />
      </div>
      <div class="grid-wrap">
        <div class="input">
          <label>이름</label>
          <UInput :value="userInfo.name" class="h-m" w-size="full" disabled />
        </div>
        <!--        <div class="input">-->
        <!--          <label>성별</label>-->
        <!--          <UInput :value="userInfo.gender === 'MAN' ? '남자' : '여자'" class="h-m" w-size="full" disabled />-->
        <!--        </div>-->
        <div class="input">
          <label>전화번호</label>
          <UInput :value="userInfo.mobileNo" class="h-m" w-size="full" disabled />
        </div>
        <!--        <div class="input">-->
        <!--          <label>생년월일</label>-->
        <!--          <UInput :value="userInfo.birthDate" class="h-m" w-size="full" disabled />-->
        <!--        </div>-->
      </div>
    </section>
    <section class="local-sec">
      <UCheckbox v-model="isLocalResident">저는 대전에 살아요.</UCheckbox>
      <p>대전 지역 주민의 전시·프로그램 참여 추이를 확인하기 위해 지역 주민 여부를 파악하고 있어요.</p>
    </section>
    <div class="btn-area">
      <UButton w-size="100" @click="onRegister">가입 완료</UButton>
    </div>
  </main>
</template>

<script>
import UInput from '~/components/user/common/UInput';
import UCheckbox from '~/components/user/common/UCheckbox';
import UButton from '~/components/user/common/UButton';

export default {
  name: 'Register3Page',
  components: { UInput, UCheckbox, UButton },
  async asyncData({ query, $axios, $dayjs, redirect }) {
    const userInfo = await $axios
      .$get('/nice/decrypt', {
        params: {
          encodeData: query.EncodeData
        }
      })
      .catch(() => {
        redirect('/auth/register/register1');
      });

    const now = $dayjs();
    now.format();
    const birthDate = $dayjs(userInfo.birthDate);
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
      redirect('/auth/register/register2', { failed: true });
    }
    return { userInfo };
  },
  data() {
    return {
      encodeData: this.$route.query.EncodeData,
      email: '',
      password: '',
      passwordConfirm: '',
      isLocalResident: false,
      userInfo: null,
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
      }
    };
  },
  methods: {
    async onRegister() {
      if (this.isValidate()) {
        await this.$axios
          .$post('/user/auth/sign-up', {
            email: this.email,
            password: this.password,
            isLocalResident: this.isLocalResident,
            isMarketingReceive: JSON.parse(localStorage.getItem('isMarketing')),
            encodeData: this.encodeData
          })
          .then(async ({ token }) => {
            this.$store.commit('service/auth/setAccessToken', token);
            const userInfo = await this.$axios.$get('/user/account/info').catch(() => {});
            this.$store.commit('service/auth/setUserInfo', userInfo);
            this.$router.replace('/auth/register/register4');
          })
          .catch((err) => {
            const errorMessage = err.response.data?.MESSAGE || '';
            if (errorMessage === 'DUPLICATE_EMAIL') {
              this.feedback.email.isValid = false;
              this.feedback.email.text = '가입된 이메일 입니다.';
            }
          });
      }
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
