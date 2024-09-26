<template>
  <main class="container">
    <h1>가입되었어요!</h1>
    <div>
      <img class="m" src="~assets/img/mobile/register_img.png" alt="" width="120" height="120" />
      <img class="pc" src="~assets/img/pc/register_img.png" alt="" width="144" height="144" />
    </div>
    <div class="check-warp">
      <UCheckbox @change="updateMoreInfo"><strong>저는 대전에 살아요.</strong></UCheckbox>
      <p>대전 지역 주민의 전시·프로그램 참여 추이를 확인하기 위해 지역 주민 여부를 파악하고 있어요.</p>
    </div>
    <ULink :to="$store.state.deviceInfo.isApp ? '/app' : '/'">메인으로 이동</ULink>
  </main>
</template>

<script>
import ULink from '~/components/user/common/ULink.vue';
import UCheckbox from '~/components/user/common/UCheckbox.vue';

export default {
  name: 'SNSRegisterDone',
  components: { UCheckbox, ULink },
  async asyncData({ params, query, $axios, redirect }) {
    const provider = query.provider;
    const snsToken = query.snsToken;
    const encodeData = query.EncodeData;
    const isMarketingReceive =
      provider === 'kakao' ? null : query.marketing === 'true' || params.isMarketingReceive === 'true';
    const loginInfo = await $axios
      .$post(`/oauth2/${provider}/sign-up`, {
        token: snsToken,
        encodeData,
        isMarketingReceive
      })
      .catch((err) => {
        const errMsg = err.response.data.MESSAGE;

        redirect({
          path: '/auth/sns/terms-agree',
          query: {
            error: errMsg,
            snsToken
          }
        });

        return null;
      });

    if (!loginInfo) {
      redirect('/auth/login');
    }

    return { token: loginInfo.token };
  },
  data() {
    return {
      token: null
    };
  },
  async mounted() {
    if (this.token) {
      this.$store.commit('service/auth/setAccessToken', this.token);
      const userInfo = await this.$axios.$get('/user/account/info').catch(() => {});
      this.$store.commit('service/auth/setUserInfo', userInfo);
    }
  },
  methods: {
    updateMoreInfo(checked) {
      this.$axios.$put(`/user/account/local-resident?enabled=${checked}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin-bottom: 12rem;
}

.pc {
  display: none;
}

h1 {
  margin: 3.2rem 0 2rem;
  font-size: 2.8rem;
  font-weight: 700;
  text-align: center;
  line-height: 2.8rem;
}

div {
  display: flex;
  justify-content: center;
  margin-bottom: 1.2rem;
}

.check-warp {
  display: flex;
  flex-direction: column;
  padding: 2rem 0;
  border-top: 1px solid var(--color-black);
  border-bottom: 1px solid var(--color-black);
  max-width: 43.6rem;
  margin: 0 auto;

  label {
    margin-bottom: 1.2rem;
  }

  strong {
    font-size: 1.6rem;
    font-weight: 500;
    line-height: 160%;
    letter-spacing: -0.5px;
  }

  p {
    font-size: 1.4rem;
    font-weight: 400;
    line-height: 160%;
    padding-left: 3.2rem;
    word-break: keep-all;
  }
}

a {
  margin-top: 4rem;
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

  div {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }

  a {
    width: 21rem !important;
    min-width: 21rem !important;
    margin: 3.2rem auto 0;
  }
}
</style>
