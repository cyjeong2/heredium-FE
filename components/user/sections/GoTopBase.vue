<template>
  <button
    ref="goTop"
    type="button"
    class="go-top"
    :class="{ 'is-detail': isDetailPage && innerWidth < 769 }"
    @click="goScrollTop"
  >
    <i class="m umic-arrow_top" />
  </button>
</template>

<script>
export default {
  name: 'GoTopBase',
  data() {
    return {
      isDetailPage: false,
      innerWidth: 0
    };
  },
  watch: {
    $route() {
      const currentPath = ['exhibition', 'program', 'coffee', 'ticketing'];
      this.isDetailPage =
        currentPath.some((path) => this.$route.path.includes(path)) &&
        !!this.$route.params?.id &&
        !this.$route.path.includes('purchase');
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleResize);
      document.addEventListener('scroll', this.goTopButtonHandler);
    });
    this.goTopButtonHandler();
    this.handleResize();
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.goTopButtonHandler);
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.innerWidth = window.innerWidth;
    },
    goTopButtonHandler() {
      const $target = this.$refs.goTop;

      if (window.scrollY > 300) {
        $target.classList.add('show');
      } else {
        $target.classList.remove('show');
      }
    },
    goScrollTop() {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }
};
</script>

<style scoped lang="scss">
.go-top {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  height: 4.4rem;
  width: 4.4rem;
  right: 2rem;
  bottom: 2rem;
  border-radius: 50%;
  background-color: var(--color-black);
  z-index: 100;
  opacity: 0;
  transition: 0.2s all ease-in-out;
  pointer-events: none;

  &.is-detail {
    bottom: 9.3rem;
  }

  &.show {
    opacity: 1;
    pointer-events: auto;
  }

  i {
    color: var(--color-white);
    font-size: 2.8rem;
  }
}
</style>
