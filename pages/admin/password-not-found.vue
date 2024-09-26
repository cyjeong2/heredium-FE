<template>
  <div>
    <main class="login">
      <div class="login-wrap">
        <h1>비밀번호 찾기</h1>
        <div class="center-area">
          <img src="~assets/img/img_account.png" alt="휴대폰" />
        </div>
        <h4>일치하는 정보가 없습니다.</h4>
        <SLink button-type="primary" to="/admin/login">로그인 페이지로 이동</SLink>
      </div>
    </main>
  </div>
</template>

<script>
import SLink from '~/components/admin/commons/SLink';
export default {
  name: 'PasswordNotFoundPage',
  components: { SLink },
  layout: 'admin/none'
};
</script>

<style scoped lang="scss">
.login {
  height: 100vh;
  width: 100vw;

  .login-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 52.8rem;
    min-height: 54.8rem;
    padding: 5.2rem 5.6rem;
    background-color: var(--color-white);
    box-shadow: 0 1px 7px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    transform: translate(-50%, -50%);

    h1,
    h4 {
      text-align: center;
      word-break: keep-all;
    }

    .center-area {
      margin: 2.6rem 0 4.5rem;

      img {
        width: 24rem;
        height: 18rem;
      }
    }

    a {
      margin-top: 4.5rem;
    }
  }
}
</style>
