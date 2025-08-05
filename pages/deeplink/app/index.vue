<template>
  <div>Redirecting…</div>
</template>

<script>
export default {
  name: 'DeeplinkApp',
  mounted() {
    const ua = navigator.userAgent || navigator.vendor;
    const isMobile = /Android|iPhone|iPad|iPod/.test(ua);

    // 1) 모바일 → 네이티브 앱 홈으로
    if (isMobile) {
      // 앱 내에서 처리할 스킴 URI (커스텀 스킴 또는 Universal Link)
      window.location.href = 'herediumart://home';
      // (필요 시 스토어로 포괄적 fallback 타이밍 추가)
    }
    // 2) 그 외 → 웹으로
    else {
      window.location.replace('https://heredium.art');
    }
  }
}
</script>

<style scoped>
/* 로딩 메시지나 스피너 스타일 추가 가능 */
</style>
