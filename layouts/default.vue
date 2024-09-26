<template>
  <div>
    <MountedProcessor />
    <header v-if="isHanaLayout" class="hana-header">
      <h1>{{ targetName }}</h1>
      <p>예매</p>
    </header>
    <HeaderBase v-else />
    <Nuxt />
    <GoTopBase />
    <FooterBase v-if="!isHanaLayout" />
  </div>
</template>

<script>
import '~/assets/style/user/style.scss';
import HeaderBase from '~/components/user/sections/HeaderBase';
import FooterBase from '~/components/user/sections/FooterBase';
import GoTopBase from '~/components/user/sections/GoTopBase';
import MountedProcessor from '~/components/user/sections/mountedProcessor.vue';

export default {
  name: 'DefaultLayout',
  components: { MountedProcessor, GoTopBase, FooterBase, HeaderBase },
  computed: {
    isHanaLayout() {
      return this.$store.getters['service/hana/getIsHanaPay'];
    },
    targetName() {
      return this.$store.getters['service/hana/getTargetData']?.title || '';
    }
  },
  mounted() {
    /**
     * 카카오 API init
     *  - 모달 내 동작에서 사용 되기 때문에 mounted 동작 이후 작동을 보장
     */

    /* global Kakao */
    if (!Kakao.isInitialized()) {
      Kakao.init(process.env.KAKAO_API_KEY);
    }
  }
};
</script>

<style lang="scss" scoped>
.hana-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.6rem 2rem;
  border-bottom: 1px solid var(--color-black);

  h1 {
    font-size: 2rem;
    font-weight: 700;
    line-height: 100%;
    letter-spacing: -0.05rem;
  }

  p {
    color: var(--color-u-primary);
    font-size: 1.8rem;
    font-style: normal;
    font-weight: 700;
    line-height: 160%;
    letter-spacing: -0.05rem;
  }
}
</style>
