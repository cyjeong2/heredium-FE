<template>
  <div class="fail">
    <img src="~assets/img/page_fail_m.jpg" alt="" />
    <div class="fail-wrap">
      <h1>원하시는 페이지를<br />찾을 수 없었어요.</h1>
      <h2>찾으시는 페이지가 변경, 삭제되었거나<br />잘못된 경로를 이용하셨어요.</h2>
      <ULink>메인으로 이동</ULink>
    </div>
  </div>
</template>

<script>
import ULink from '~/components/user/common/ULink.vue';

export default {
  name: '404Error',
  components: { ULink },
  layout: 'none'
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
    width: 100%;
    padding: 0 2rem;
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
    margin-bottom: 3.6rem;
    text-align: center;
  }
}
</style>
