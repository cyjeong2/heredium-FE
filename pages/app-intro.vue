<template>
  <div class="container">
    <img src="~assets/img/iOS_app_store_1.png" class="intro-bg" alt="" />
    <a
      class="download-btn primary"
      href="https://kr.object.ncloudstorage.com/heredium/heredium-app-release-230126.apk"
      download
      min-width="auth"
      >안드로이드 앱 다운로드</a
    >
  </div>
</template>

<script>
export default {
  name: 'AppIntroPage',
  layout: 'none'
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
}
.download-btn {
  position: absolute;
  top: 12%;
  left: 19%;
}

a {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 160%;
  height: 5.2rem;
  padding: 0 1.2rem;
  letter-spacing: 0.25px;

  &.primary {
    color: var(--color-white);
    font-weight: 700;
    background-color: var(--color-u-primary);
  }
}
</style>
