<template>
  <main class="container">
    <h1>회원 가입에 성공하셨어요!</h1>
    <div>
      <img class="m" src="~assets/img/mobile/register_img.png" alt="" width="120" height="120" />
      <img class="pc" src="~assets/img/pc/register_img.png" alt="" width="144" height="144" />
    </div>
    <p>헤레디움과 함께 해주셔서 감사해요!<br />지금 헤레디움의 다양한 서비스를 경험해보세요!</p>
    <ULink :to="$store.state.deviceInfo.isApp ? '/app' : '/'">메인으로 이동</ULink>
    <!-- 쿠폰 모달 -->
    <MarketingCoupon
      :is-show="showCouponModal"
      @close="closeCouponModal"
    />
  </main>
</template>

<script>
import ULink from '~/components/user/common/ULink.vue';
// import UCheckbox from '~/components/user/common/UCheckbox.vue';
import MarketingCoupon from '~/components/user/modal/coupon/MarketingCoupon.vue';

export default {
  name: 'SNSRegisterDone',
  components: { ULink, MarketingCoupon },
  async asyncData({ params, query, $axios, redirect, $dayjs }) {
    const provider = query.provider;
    const snsToken = query.snsToken;
    const encodeData = query.EncodeData;

     const userInfo = await $axios
      .$get('/nice/decrypt', {
        params: {
          encodeData: query.EncodeData
        }
      })
      .catch(() => {
        redirect('/auth/register/register1');
      });

    const qMarketing = query.marketing === 'true'
    const qState = query.state;
    const qDistrict = query.district;
    const isLocal = (qState === '대전광역시');

    const loginInfo = await $axios
      .$post(`/oauth2/${provider}/sign-up`, {
        token: snsToken,
        encodeData,
        isMarketingReceive: qMarketing,
        state: qState,
        district: qDistrict,
        isLocalResident: isLocal,
        gender: qMarketing
          ? (userInfo.gender === 'MAN' ? 'M' : 'W') : null,
        birthDate: qMarketing
          ? $dayjs(userInfo.birthDate).format('YYYY-MM-DD') : null,
        marketingPending: false,
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

    return { token: loginInfo.token, marketing : qMarketing };
  },
  data() {
    return {
      token: null,
      showCouponModal: false,
    };
  },
  async mounted() {
    if (this.marketing === 'true') {
      this.showCouponModal = true;
    }

    if (this.token) {
      this.$store.commit('service/auth/setAccessToken', this.token);
      const userInfo = await this.$axios.$get('/user/account/info').catch(() => {});
      this.$store.commit('service/auth/setUserInfo', userInfo);
    }
  },
  methods: {
    closeCouponModal() {
      this.showCouponModal = false;
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

p {
  font-size: 1.4rem;
  font-weight: 500;
  text-align: center;
  line-height: 2.24rem;
}
</style>
