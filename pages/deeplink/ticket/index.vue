<template>
  <div>Redirecting…</div>
</template>

<script>
export default {
  name: 'DeeplinkTicket',
  mounted() {
    const ua = navigator.userAgent || navigator.vendor;
    const isAndroid = /Android/.test(ua);
    const isIos     = /iPhone|iPad|iPod/.test(ua);

    // Android: Intent URL 사용 → 설치된 앱이 있으면 실행, 없으면 스토어(또는 웹)
    if (isAndroid) {
      const intentUrl =
        'intent://mypage/purchase/all' +
        '#Intent;' +
        'scheme=herediumart;' +                                           // 커스텀 스킴
        'package=heredium.art.app;' +                                     // 앱 패키지명
        'S.browser_fallback_url=https%3A%2F%2Fheredium.art%2Fmypage%2Fpurchase%2Fall;' + // 설치 없으면 이 URL로
        'end';
      window.location.href = intentUrl;
    }
    // iOS: Universal Link 호출 → 앱 설치 시 자동 실행, 없으면 웹
    else if (isIos) {
      window.location.href = 'https://heredium.art/mypage/purchase/all';
    }
    // 그 외(데스크톱·SPA·웹뷰): 라우터 네비게이션
    else {
      this.$router.replace('/mypage/purchase/all');
    }
  }
}
</script>

<style scoped>
/* 로딩 메시지나 스피너 스타일 추가 가능 */
</style>
