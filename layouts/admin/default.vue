<template>
  <div class="wrapper">
    <div class="admin-layout">
      <div class="left">
        <HeaderBase />
      </div>
      <div class="right">
        <div class="content">
          <Nuxt />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '~/assets/style/admin/style.scss';
import HeaderBase from '~/components/admin/sections/HeaderBase';

export default {
  name: 'AdminLayout',
  components: { HeaderBase },
  head() {
    return {
      title: '헤레디움(관리자)'
    };
  }
};
</script>

<style lang="scss">
$side-bar-width: 28rem;

.wrapper {
  min-width: 1440px;
}

.admin-layout {
  display: flex;
  > .left {
    z-index: 10;
  }

  > .left,
  > .left header {
    width: $side-bar-width;
  }

  > .right {
    flex: 1 0 0;
    max-width: calc(100% - #{$side-bar-width});
    padding: 2.7rem 4rem 4rem;
  }
}

@media screen and (max-width: 1680px) {
  $side-bar-width: 25rem;

  .admin-layout {
    > .left {
      z-index: 10;
    }
    > .left,
    > .left header {
      width: $side-bar-width;
    }
    > .right {
      flex: 1 0 0;
      max-width: calc(100% - #{$side-bar-width});
      padding: 2.7rem 2rem 4rem;
    }
  }
}
</style>
