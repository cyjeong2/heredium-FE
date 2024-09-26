<template>
  <main class="container">
    <div class="breadcrumb">
      <i class="pc uic-home" />
      <span>로그인</span>
      <span>비밀번호 찾기</span>
      <span>휴대폰 인증</span>
    </div>
    <div class="find-area">
      <h1>비밀번호 찾기</h1>
      <p>일치하는 정보가 없습니다.</p>
      <ULink to="/auth/login" w-size="full">로그인 페이지로 이동</ULink>
    </div>
  </main>
</template>

<script>
import ULink from '~/components/user/common/ULink';
export default {
  name: 'PasswordNotFound',
  components: { ULink }
};
</script>

<style scoped lang="scss">
h1 {
  margin: 3.2rem 0 2rem;
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

.container {
  margin-bottom: 12rem;
}

.find-area {
  .input {
    margin-top: 2.4rem;

    .input-wrap {
      margin-top: 1.6rem;
    }
  }

  p {
    line-height: 2.88rem;
    padding-bottom: 2.4rem;
  }

  button {
    margin-top: 4rem;
  }
}

.breadcrumb {
  display: none;
}

@media screen and (min-width: 768px) {
  h1 {
    margin: 7.6rem 0 2.4rem;
    font-size: 4.2rem;
    line-height: 6.3rem;
  }

  p {
    font-size: 2rem;
    text-align: center;
    line-height: 3rem;
    letter-spacing: 0.025rem;
  }

  .breadcrumb {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    margin-top: 2.8rem;

    i {
      font-size: 2rem;
      color: var(--color-grey-3);
    }

    span {
      font-size: 1.4rem;
      line-height: 2.24rem;
      letter-spacing: 0.025rem;
      color: var(--color-grey-3);

      &:first-of-type {
        position: relative;

        &::before {
          content: '';
          display: inline-block;
          width: 0.8rem;
          height: 0.1rem;
          margin: 0 0.4rem;
          background-color: var(--color-grey-3);
        }
        &::after {
          content: '';
          display: inline-block;
          width: 0.8rem;
          height: 0.1rem;
          margin: 0 0.4rem;
          background-color: var(--color-grey-3);
        }
      }

      &:last-of-type {
        position: relative;

        &::before {
          content: '';
          display: inline-block;
          width: 0.8rem;
          height: 0.1rem;
          margin: 0 0.4rem;
          background-color: var(--color-grey-3);
        }
      }
    }
  }

  .find-area {
    max-width: 43.6rem;
    margin: 0 auto;
    .input {
      margin-top: 2.8rem;

      label {
        font-size: 1.6rem;
        line-height: 160%;
        letter-spacing: 0.025rem;
      }

      .input-wrap {
        margin-top: 1.2rem;
      }
    }

    p {
      padding-bottom: 3.6rem;
    }

    button {
      margin-top: 3.2rem;
    }
  }
}
</style>
