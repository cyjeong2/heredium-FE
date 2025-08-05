<template>
  <div>Redirecting…</div>
</template>

<script>
export default {
  name: 'DeeplinkTicket',
  mounted() {
    const ua = navigator.userAgent || navigator.vendor;
    const isMobile = /Android|iPhone|iPad|iPod/.test(ua);

    if (isMobile) {
      // 모바일 앱에서 입장 내역 페이지로 바로 연결
      window.location.href = 'herediumart://mypage/purchase/all';
    } else {
      // 웹에서 주문 내역 페이지로 연결
      window.location.replace('https://heredium.art/mypage/purchase/all');
    }
  }
}
</script>

<style scoped>
/* 로딩 메시지나 스피너 스타일 추가 가능 */
</style>
