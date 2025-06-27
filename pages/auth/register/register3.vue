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
        <div class="input">
          <label>전화번호</label>
          <UInput :value="userInfo.mobileNo" class="h-m" w-size="full" disabled />
        </div>
      </div>
      <div class="input region-input">
        <label>지역 <b class="must">*</b></label>
        <div class="region-row">
          <div class="region-col">
            <USelect
              v-model="form.region.state"
              :option-list="cityOptions"
              w-size="full"
              default-text="시/도 선택"
            />
          </div>
          <div class="region-col">
            <USelect
              v-model="form.region.district"
              :option-list="districtOptions"
              w-size="full"
              default-text="시/군/구 선택"
            />
          </div>
        </div>
        <p v-if="!feedback.region.isValid" class="error-msg">
          {{ feedback.region.text }}
        </p>
      </div>
    </section>
    <div class="btn-area">
      <UButton w-size="100" @click="onRegister">가입 완료</UButton>
    </div>
  </main>
</template>

<script>
import UInput from '~/components/user/common/UInput';
import UButton from '~/components/user/common/UButton';
import USelect from '~/components/user/common/USelect.vue';

export default {
  name: 'Register3Page',
  components: { UInput, UButton, USelect },
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
        },
        region: { isValid: true, text: '' }
      },
      form: {
        region: { state: '대전광역시', district: '동구' },
      },
      regionData: [
        { state: '서울특별시', districts: ['종로구','중구','용산구','성동구','광진구','동대문구','중랑구','성북구','강북구','도봉구','노원구','은평구','서대문구','마포구','양천구','강서구','구로구','금천구','영등포구','동작구','관악구','서초구','강남구','송파구','강동구'] },
        { state: '부산광역시', districts: ['중구','서구','동구','영도구','부산진구','동래구','남구','북구','해운대구','사하구','금정구','강서구','연제구','수영구','사상구','기장군'] },
        { state: '대구광역시', districts: ['중구','동구','서구','남구','북구','수성구','달서구','달성군'] },
        { state: '인천광역시', districts: ['중구','동구','미추홀구','연수구','남동구','부평구','계양구','서구','강화군','옹진군'] },
        { state: '광주광역시', districts: ['동구','서구','남구','북구','광산구'] },
        { state: '대전광역시', districts: ['동구','중구','서구','유성구','대덕구'] },
        { state: '울산광역시', districts: ['중구','남구','동구','북구','울주군'] },
        { state: '세종특별자치시', districts: ['세종시'] },
        { state: '경기도', districts: ['수원시','성남시','의정부시','안양시','부천시','광명시','평택시','동두천시','안산시','고양시','과천시','구리시','남양주시','오산시','시흥시','군포시','의왕시','하남시','용인시','파주시','이천시','안성시','김포시','화성시','광주시','양주시','포천시','여주시','연천군','가평군','양평군'] },
        { state: '강원도', districts: ['춘천시','원주시','강릉시','동해시','태백시','속초시','삼척시','홍천군','횡성군','영월군','평창군','정선군','철원군','화천군','양구군','인제군','고성군','양양군'] },
        { state: '충청북도', districts: ['청주시','충주시','제천시','보은군','옥천군','영동군','진천군','괴산군','음성군','단양군','증평군'] },
        { state: '충청남도', districts: ['천안시','공주시','보령시','아산시','서산시','논산시','계룡시','당진시','금산군','부여군','서천군','청양군','홍성군','예산군','태안군'] },
        { state: '전라북도', districts: ['전주시','군산시','익산시','정읍시','남원시','김제시','완주군','진안군','무주군','장수군','임실군','순창군','고창군','부안군'] },
        { state: '전라남도', districts: ['목포시','여수시','순천시','나주시','광양시','담양군','곡성군','구례군','고흥군','보성군','화순군','장흥군','강진군','해남군','영암군','무안군','함평군','영광군','장성군','완도군','진도군','신안군'] },
        { state: '경상북도', districts: ['포항시','경주','김천시','안동시','구미시','영주시','영천시','상주시','문경시','경산시','군위군','의성군','청송군','영양군','영덕군','청도군','고령군','성주군','칠곡군','예천군','봉화군','울진군','울릉군'] },
        { state: '경상남도', districts: ['창원시','김해시','진주시','통영시','사천시','밀양시','거제시','양산시','의령군',' 함안군','창녕군','고성군','남해군','하동군','산청군','함양군','거창군','합천군'] },
        { state: '제주특별자치도', districts: ['제주시','서귀포시'] },
      ],
    };
  },
  computed: {
    cityOptions() {
      return this.regionData.map(r => ({ value: r.state, label: r.state }));
    },
    districtOptions() {
      const region = this.regionData.find(r => r.state === this.form.region.state);
      return region ? region.districts.map(d => ({ value: d, label: d })) : [];
    }
  },
  watch: {
    'form.region.state'(newState) {
      const region = this.regionData.find(r => r.state === newState);
      this.form.region.district = region && region.districts.length
        ? region.districts[0]
        : '';
      this.feedback.region.isValid = true;
      this.feedback.region.text = '';
    }
  },
  methods: {
    async onRegister() {
      if (this.isValidate()) {

        const isMarketing = JSON.parse(localStorage.getItem('isMarketing'));
        const isLocal = (this.form.region.state === '대전광역시');

        await this.$axios
          .$post('/user/auth/sign-up', {
            email: this.email,
            password: this.password,
            isLocalResident: isLocal,
            isMarketingReceive: isMarketing,
            gender: isMarketing
              ? (this.userInfo.gender === 'MAN' ? 'M' : 'W') : null,
            birthDate: isMarketing
              ? this.$dayjs(this.userInfo.birthDate).format('YYYY-MM-DD') : null,
            marketingPending: false,
            state: this.form.region.state,
            district: this.form.region.district,
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
          value.text = '';
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
        passwordFeedback2.text = '비밀번호가 일치하는지 확인해주세요.';
      } else {
        passwordFeedback2.isValid = true;
        passwordFeedback2.text = '';
      }

      // region 검증
      if (!this.form.region.state) {
        this.feedback.region.isValid = false;
        this.feedback.region.text = '시/도를 선택해주세요.';
      }
      else if (!this.form.region.district) {
        this.feedback.region.isValid = false;
        this.feedback.region.text = '시/군/구를 선택해주세요.';
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

.region-row {
  display: flex;
  gap: 1.6rem;
  margin-top: 1.2rem;
}
.region-row .region-col {
  flex: 1;
}
.region-input{
  margin-top: 3.2rem;
  .error-msg {
    margin-top: 0.8rem;
    font-size: 1.4rem;
    color: var(--color-u-error);
  }
}
</style>
