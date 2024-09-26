<template>
  <div class="fail">
    <img src="~assets/img/page_fail_m.jpg" alt="" class="only-mobile" />
    <img src="~assets/img/page_fail.jpg" alt="" class="only-pc" />
    <div class="fail-wrap">
      <template v-if="error.statusCode === 401">
        <h1>인증 에러가 발생하였어요</h1>
        <h2>
          인증 데이터가 필요한 요청을 하였지만 <br class="only-mobile" />인증 데이터가 없어 서버에서 거부하였어요.
        </h2>
      </template>
      <template v-if="error.statusCode === 404">
        <h1>원하시는 페이지를 <br class="only-mobile" />찾을 수 없었어요.</h1>
        <h2>찾으시는 페이지가 변경, 삭제되었거나 <br class="only-mobile" />잘못된 경로를 이용하셨어요.</h2>
      </template>
      <template v-else-if="error.statusCode === 500">
        <h1>웹 사이트에서 오류가 발생했어요.</h1>
        <h2>현재 관련 서비스를 사용하실 수 없어요. <br class="only-mobile" />잠시 후 다시 시도해주세요.</h2>
      </template>
      <template v-else>
        <h1>알 수 없는 에러 발생</h1>
        <h2>잠시 후 다시 확인해주세요.</h2>
      </template>
      <ULink
        v-if="error.statusCode === 404"
        :to="isAdminPath ? '/admin' : $store.state.deviceInfo.isApp ? '/app' : '/'"
        class="link"
        >메인으로 이동</ULink
      >
    </div>
  </div>
</template>

<script>
import ULink from '~/components/user/common/ULink.vue';

export default {
  name: 'ErrorPage',
  components: { ULink },
  layout: 'none',
  props: {
    error: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isAdminPath: false
    };
  },
  created() {
    this.isAdminPath = this.$route.path.split('/')[1] === 'admin';
  }
};
</script>

<style lang="scss" scoped>
.fail {
  position: relative;
  display: flex;
  height: 100vh;
  width: 100vw;
  align-items: center;
  justify-content: center;

  img {
    position: absolute;
    height: 100%;
    width: 100%;
    object-fit: cover;
    z-index: -1;
  }

  .fail-wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 2rem;
    align-items: center;
  }

  h1 {
    color: var(--color-white);
    font-weight: 700;
    font-size: 2.8rem;
    line-height: 160%;
    margin-bottom: 1.6rem;
    text-align: center;
  }

  h2 {
    color: var(--color-white);
    font-weight: 700;
    font-size: 1.6rem;
    line-height: 160%;
    text-align: center;
  }

  .link {
    margin-top: 3.6rem;
  }
}

@media screen and (min-width: 769px) {
  .fail {
    h1 {
      font-size: 4.2rem;
      line-height: 150%;
      margin-bottom: 2.4rem;
    }

    h2 {
      font-size: 2rem;
      line-height: 150%;
    }

    .link {
      margin-top: 3.2rem;
      width: 21rem !important;
    }
  }
}
</style>
