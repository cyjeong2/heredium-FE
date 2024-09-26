<template>
  <div class="hide" />
</template>

<script>
export default {
  name: 'MountedProcessor',
  mounted() {
    if (window && navigator) {
      const userAgent = navigator.userAgent;
      const deviceInfo = {
        isPC: false,
        isMobile: false,
        isApp: false,
        isIOS: false,
        isAndroid: false
      };

      if (/AppleWebKit|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        deviceInfo.isMobile = true;

        if (userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('iPod')) {
          deviceInfo.isIOS = true;
        } else {
          deviceInfo.isAndroid = true;
        }
        if (window.heredium?.getWifiInfo) {
          deviceInfo.isAndroid = true;
          deviceInfo.isApp = true;
        } else if (window.webkit?.messageHandlers.getWifiInfo?.postMessage) {
          deviceInfo.isIOS = true;
          deviceInfo.isApp = true;
        }
      } else {
        deviceInfo.isPC = true;
      }

      this.$store.commit('setDeviceInfo', deviceInfo);
    }
  }
};
</script>

<style lang="scss" scoped>
.hide {
  display: none;
}
</style>
