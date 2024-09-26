<template>
  <main class="container">
    <h1>회원 탈퇴가 완료되었어요.</h1>
    <div class="img-area">
      <img src="~assets/img/mobile/withdrawal.png" alt="" width="120" height="120" />
    </div>
    <p>
      떠나신다니 너무 아쉽네요.<br />
      다양한 전시와 프로그램을 준비해서 기다리고 있을게요.
    </p>
    <UButton w-size="100" @click="$router.replace($store.state.deviceInfo.isApp ? '/app' : '/')">확인</UButton>
  </main>
</template>

<script>
import UButton from '~/components/user/common/UButton';
export default {
  name: 'WithdrawalDonePage',
  components: { UButton },
  asyncData({ params, redirect }) {
    if (!params.complete) {
      redirect('/');
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  margin: 3.2rem 0 2rem;
  font-size: 2.4rem;
  font-weight: 700;
  text-align: center;
  line-height: 2.8rem;
}

.container {
  margin-bottom: 12rem;
}

.img-area {
  display: flex;
  justify-content: center;
}

p {
  font-size: 1.4rem;
  font-weight: 500;
  text-align: center;
  line-height: 2.24rem;
}

button {
  margin-top: 4rem;
}

@media screen and (min-width: 769px) {
  h1 {
    margin: 12.4rem 0 2.4rem;
    font-size: 4.2rem;
    line-height: 150%;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 18.4rem;
  }

  .img-area img {
    height: 14.4rem;
    width: 14.4rem;
  }

  p {
    font-size: 1.6rem;
    line-height: 160%;
    margin-top: 2rem;
  }

  button {
    width: 15.2rem !important;
    margin-top: 3.2rem;
  }
}
</style>
