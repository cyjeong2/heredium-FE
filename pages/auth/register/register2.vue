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
      <p>본인 인증을 진행해주세요.</p>
    </div>
    <div class="btn-area">
      <UButton w-size="100" @click="check">휴대폰 인증</UButton>
    </div>
    <UDialogModal :is-show="$route.query.failed">
      <template #content> 만 14세 미만의 어린이는 가입할 수 없어요. </template>
      <template #modal-btn2>
        <UButton
          w-size="100"
          class="feedback-btn"
          @click="$router.replace($store.state.deviceInfo.isApp ? '/app' : '/')"
          >확인</UButton
        >
      </template>
    </UDialogModal>
  </main>
</template>

<script>
import UButton from '~/components/user/common/UButton';
import UDialogModal from '~/components/user/modal/UDialogModal';
import { createFormElement } from '~/assets/js/commons';
export default {
  name: 'Register2Page',
  components: { UButton, UDialogModal },
  methods: {
    async check() {
      const windowLocation = window.location;
      const returnUrl = `${windowLocation.protocol}//${windowLocation.host}/auth/register/register3`;
      const errorUrl = `${windowLocation.protocol}//${windowLocation.host}/auth/register1`;

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
    width: 66.6%;
    height: 100%;
    background: var(--color-black);
  }
}

button {
  margin-top: 4rem;
}

@media screen and (min-width: 768px) {
  .m {
    display: none;
  }

  .pc {
    display: block;
  }

  .title-area,
  .btn-area {
    max-width: 43.6rem;
    margin: 0 auto;
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
      width: 66.6%;
      height: 100%;
      background: var(--color-black);
    }
  }

  button {
    margin-top: 4.8rem;
  }
}
</style>
