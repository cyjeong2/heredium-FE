<template>
  <main class="container">
    <div class="breadcrumb">
      <i class="pc uic-home" />
      <span>로그인</span>
      <span>아이디 찾기</span>
    </div>
    <div v-if="findId === null" class="find-area">
      <h1>아이디 찾기</h1>
      <div class="img-area">
        <img class="m" src="~assets/img/mobile/find_id.png" alt="" width="120" height="120" />
        <img class="pc" src="~assets/img/pc/find_id.png" alt="" width="144" height="144" />
      </div>
      <UButton w-size="100" @click="check">휴대폰 인증</UButton>
    </div>
    <div v-else class="find-area">
      <h1>아이디 찾기</h1>
      <template v-if="findId.length === 0">
        <p>가입된 아이디가 없습니다!</p>
        <div class="not-found-img-area">
          <img src="~assets/img/find_id_error.png" alt="" />
        </div>
      </template>
      <p v-else>회원님의 아이디를 찾았어요!</p>
      <div v-if="findId.length > 0" class="id-list">
        <p v-for="(item, index) in findId" :key="item" v-html="idList(item, index)"></p>
      </div>
      <ULink v-if="findId.length === 0" to="/auth/register/register1" w-size="full">회원가입</ULink>
      <ULink v-else to="/auth/login" w-size="full">로그인</ULink>
    </div>
  </main>
</template>

<script>
import UButton from '~/components/user/common/UButton';
import { createFormElement } from '~/assets/js/commons';
import ULink from '~/components/user/common/ULink';
export default {
  name: 'FindId',
  components: { ULink, UButton },
  async asyncData({ $axios, params, redirect }) {
    let findId = null;
    if (params.EncodeData) {
      findId = await $axios
        .$get('/user/auth/find/id', {
          params: {
            encodeData: params.EncodeData
          }
        })
        .catch(() => {
          redirect('/auth/find-id');
        });
    }
    return { findId };
  },
  data() {
    return {
      findId: null
    };
  },
  async fetch() {
    if (this.$route.params.EncodeData) {
      this.findId = await this.$axios
        .$get('/user/auth/find/id', {
          params: {
            encodeData: this.$route.params.EncodeData
          }
        })
        .catch(() => {
          this.$router.push('/auth/find-id');
        });
    }
  },
  methods: {
    idList(item, index) {
      const { provider } = item;
      const providerName =
        provider === 'KAKAO'
          ? '카카오'
          : provider === 'NAVER'
          ? '네이버'
          : provider === 'GOOGLE'
          ? '구글'
          : provider === 'APPLE'
          ? '애플'
          : '';
      const computedItem = `${item.email}${providerName ? `(${providerName})` : ''}`;

      return this.findId.length - 1 === index ? computedItem : computedItem + `,&nbsp;`;
    },
    async check() {
      const windowLocation = window.location;
      const returnUrl = `${windowLocation.protocol}//${windowLocation.host}/nice/nice-user-success?returnUrl=auth-find-id`;
      const errorUrl = `${windowLocation.protocol}//${windowLocation.host}/auth/find-id`;

      await this.$axios
        .$get('/nice/encrypt', {
          params: {
            returnUrl,
            errorUrl
          }
        })
        .then((res) => {
          const form = createFormElement('https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb', {
            m: 'checkplusService',
            recvMethodType: 'get',
            EncodeData: res
          });
          document.querySelector('body').appendChild(form);
          form.submit();
          form.remove();
        })
        .catch((err) => {
          console.log(err);
          alert('에러가 발생했습니다.\n다시 시도해 해주세요.');
          window.location.reload(true);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  margin: 3.2rem 0 2rem;
  font-size: 2.8rem;
  font-weight: 700;
  text-align: center;
  line-height: 2.8rem;
}

.container {
  margin-bottom: 12rem;
}

.pc {
  display: none;
}

.img-area {
  display: flex;
  justify-content: center;
}

.id-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 2.4rem;
  padding: 2.4rem 0;
  border-top: 0.1rem solid var(--color-black);
  border-bottom: 0.1rem solid var(--color-black);

  p {
    font-size: 1.4rem;
    font-weight: 600;
    line-height: 2.24rem;
  }
}

p {
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.8rem;
}

button,
a {
  margin-top: 4rem;
}

.breadcrumb {
  display: none;
}

.not-found-img-area {
  display: flex;
  justify-content: center;
  margin-top: 2rem;

  img {
    height: 12rem;
    width: 12rem;
  }
}

@media screen and (min-width: 768px) {
  .m {
    display: none;
  }

  .pc {
    display: block;
  }

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
    }
  }

  .find-area {
    max-width: 43.6rem;
    margin: 0 auto;
  }

  .id-list {
    flex-wrap: wrap;
    flex-direction: row;
    margin-top: 3.6rem;
    padding: 2.8rem 0;

    p {
      font-size: 1.6rem;
      line-height: 2.6rem;
    }
  }

  button,
  a {
    margin: 3.2rem auto 0;
    width: 21rem !important;
    min-width: 21rem !important;
  }

  .not-found-img-area {
    display: flex;
    justify-content: center;
    margin-top: 2rem;

    img {
      height: 14.4rem;
      width: 14.4rem;
    }
  }
}
</style>
