<template>
  <main v-if="isMounted" class="container">
    <section class="title">
      <h1>Docent</h1>
      <p>관람하는 전시를<br />선택해 주시기 바랍니다.</p>
    </section>
    <section class="contents">
      <div class="list-wrap">
        <div v-if="!listData || !listData[0]" class="no-data">리스트가 없습니다.</div>
        <NuxtLink v-for="item in listData" :key="item.id" :to="`/docent/${item.id}`" class="list-item">
          <h2>{{ item.title }}</h2>
          <div class="info">
            <p class="date">
              {{ $dayjs(item.startDate).format('YYYY-MM-DD') }} ~ {{ $dayjs(item.endDate).format('YYYY-MM-DD') }}
            </p>
          </div>
          <img :src="getImage(item.thumbnail?.savedFileName)" alt="" />
        </NuxtLink>
      </div>
    </section>
    <UDialogModal :is-show="isShowAlertModal">
      <template #content>{{ alertModalText }}</template>
      <template #modal-btn1>
        <UButton @click="$router.replace('/')">확인</UButton>
      </template>
    </UDialogModal>
  </main>
</template>

<script>
import UDialogModal from '~/components/user/modal/UDialogModal';
import UButton from '~/components/user/common/UButton.vue';

const HEREDIUM_WIFI_MAP = Object.freeze({
  ssid: ['spadecompany', 'heredium', 'HEREDIUM'],
  bssid: [
    '44:90:BB:24:CE:AB', // 스페이드 와이파이
    'bc:d0:74:75:e0:c7', // 스페이드 와이파이
    'e8:48:b8:d8:78:b5', // 스페이드 와이파이
    '94:b3:4f:27:07:00',
    '94:b3:4f:26:84:90',
    '94:b3:4f:26:5D:10',
    '94:b3:4f:26:4a:00'
  ]
});

export default {
  name: 'DocentPage',
  components: { UButton, UDialogModal },
  async asyncData({ $axios }) {
    const listData = await $axios.$get('/user/docents');

    return { listData };
  },
  data() {
    return {
      isShowAlertModal: false,
      alertModalText: '',
      isMounted: false,
      listData: {}
    };
  },
  mounted() {
    if (!this.$store.state.deviceInfo.isApp) {
      this.$router.push('/');
    } else {
      this.isMounted = true;
    }
    this.setAppBridge(); // 웹뷰에서 자바스크립트 set 부분
    this.getWifiInfo(); // 와이파이 정보 가져옴
  },
  methods: {
    isAbleWifiInfo(deviceWifiInfo) {
      return HEREDIUM_WIFI_MAP.ssid.includes(deviceWifiInfo.ssid);
    },
    getImage(imageUrl) {
      return imageUrl ? this.$store.state.BASE_URL + imageUrl : require('~/assets/img/thumbnail_default.jpg');
    },
    getWifiInfo() {
      if (window.heredium?.getWifiInfo) {
        // 안드로이드 전용
        // 안드로이드 호출 함수가 있는지 확인
        window.heredium.getWifiInfo();
      } else if (window.webkit?.messageHandlers.getWifiInfo?.postMessage) {
        // iOS 전용
        // iOS 호출 함수가 있는지 확인
        window.webkit.messageHandlers.getWifiInfo.postMessage('');
      } else {
        // 둘다 없으면 앱이 아님
        // 앱이 아닐경우 router.replace();
        this.alertModalText = '앱이 아닙니다.';
        // this.isShowAlertModal = true;
      }
    },
    validateWifiInfoCallback(wifiInfo) {
      if (typeof wifiInfo === 'string') {
        try {
          wifiInfo = JSON.parse(wifiInfo);
        } catch (e) {
          this.alertModalText = '와이파이 정보를 가져오는데 실패하였습니다.';
          this.isShowAlertModal = true;
        }
      }

      if (wifiInfo === '') {
        return;
      }

      if (!wifiInfo) {
        // 와이파이가 아닌 다른 것으로 연결되어 있거나 없을때
        // 피드백을 준 후 내보내기
        this.alertModalText = '헤레디움 입장 후 전용 와이파이 설정 시 전시 스토리를 감상하실 수 있습니다.';
        this.isShowAlertModal = true;
      } else if (!this.isAbleWifiInfo(wifiInfo)) {
        // 헤레디움에서 지정 한 와이파이 정보와 휴대폰에서 가져온 와이파이 정보가 일치하지 않을 경우
        // 일치하지 않는 피드백을 준 후 내보내기
        this.alertModalText = '헤레디움 입장 후 전용 와이파이 설정 시 전시 스토리를 감상하실 수 있습니다.';
        this.isShowAlertModal = true;
      }
    },
    // 앱에서 호출할 함수에 window에 직접 작성하여 넣는다.
    setAppBridge() {
      const vm = this;

      window.getWifiInfo = function () {
        vm.getWifiInfo();
      };
      window.permissionDenied = function () {
        // 모달 호출 후 내보내기
        vm.alertModalText = '권한허용이 필요합니다. 설정에서 허용해주세요.';
        vm.isShowAlertModal = true;
      };
      window.getWifiInfoResult = function (value) {
        // iOS 전용
        vm.validateWifiInfoCallback(value);
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  margin: 3.2rem 0 6.4rem;

  h1 {
    font-size: 2.8rem;
    font-weight: 700;
    margin-bottom: 1.6rem;
    line-height: 100%;
  }

  p {
    font-weight: 300;
    font-size: 1.6rem;
    line-height: 160%;
  }
}

.contents {
  margin-bottom: 12rem;

  .list-wrap {
    position: relative;

    .no-data {
      display: flex;
      height: 20rem;
      align-items: center;
      justify-content: center;
      color: var(--color-u-grey-3);
      font-weight: 500;
      font-size: 1.6rem;
    }
  }

  .list-item {
    display: block;
    border-top: 1px solid var(--color-black);
    padding-top: 1.6rem;
    margin-bottom: 4rem;

    h2 {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 2.4rem;
      line-height: 160%;
      word-break: keep-all;
    }

    .info {
      display: flex;
      align-items: center;
      margin-bottom: 2.4rem;

      .date {
        font-size: 1.4rem;
        font-weight: 500;
      }
    }

    > img {
      width: 100%;
      aspect-ratio: 16/11;
      border-radius: 0.8rem;
      object-fit: cover;
    }
  }
}
</style>
