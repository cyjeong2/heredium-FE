<template>
  <transition name="fade">
    <div v-if="isShow" class="modal-wrap">
      <div class="modal-inner">
        <div class="modal">
          <div class="head">
            <button type="button" class="close-btn" @click="$emit('close')">
              <i class="ic-close" />
            </button>
          </div>
          <div class="body">
            <div class="type-title">
              <h2>QR 코드</h2>
              <span class="type">{{ TICKET_KIND_TYPE[detailData.kind] }}</span>
            </div>
            <div class="qr">
              <h3>{{ detailData.title }}</h3>
              <p>
                {{ $dayjs(detailData.startDate).format('HH:mm') }} - {{ $dayjs(detailData.endDate).format('HH:mm') }}
              </p>
              <div class="img">
                <QrcodeVue :value="createQrValue" :size="172" level="H" />
              </div>
            </div>
          </div>
          <div class="foot">QR코드는 해당 프로그램에서만 사용 가능합니다.<br />사용 후에는 자동 소멸됩니다.</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import QrcodeVue from 'qrcode.vue';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { TICKET_KIND_TYPE } from '~/assets/js/types';

export default {
  name: 'UQRModal',
  components: {
    QrcodeVue
  },
  props: {
    isShow: {
      type: Boolean,
      required: false,
      default: false
    },
    detailData: {
      type: Object,
      required: false,
      default: () => ({
        id: null,
        title: '',
        kind: '',
        startDate: '',
        endDate: '',
        uuid: '',
        info: ''
      })
    }
  },
  data() {
    return {
      TICKET_KIND_TYPE
    };
  },
  computed: {
    isHasSlotButtons() {
      return !!this.$slots['modal-btn1'] || !!this.$slots['modal-btn2'];
    },
    createQrValue() {
      const { id, uuid } = this.detailData;

      return id != null && uuid ? JSON.stringify({ id, uuid }) : '';
    }
  },
  watch: {
    isShow(newValue) {
      if (newValue) {
        disableBodyScroll(document);
      } else {
        clearAllBodyScrollLocks();
      }
    }
  },
  beforeDestroy() {
    clearAllBodyScrollLocks();
  },
  methods: {
    getDDayText(startDate) {
      const today = this.$dayjs().format('YYYY-MM-DD');
      const isToday = this.$dayjs(today).isSame(this.$dayjs(startDate));

      startDate = this.$dayjs(startDate).format('YYYY-MM-DD');

      return isToday ? 'Today' : `D-${this.$dayjs(startDate).diff(this.$dayjs(today), 'day')}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 500;
  background-color: rgba(17, 17, 17, 0.8);
}

.modal-inner {
  position: absolute;
  width: 100%;
  max-width: 53.2rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0 2rem;
}

.modal {
  .head {
    position: relative;
    height: 3.2rem;
    margin-bottom: 2rem;

    .close-btn {
      color: var(--color-white);
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      font-size: 3.2rem;
    }
  }

  .body {
    text-align: center;
    padding: 2.4rem 2rem 3.6rem;
    word-break: keep-all;
    background-color: var(--color-white);
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
  }

  .foot {
    padding: 1.2rem 2.1rem;
    background-color: #f7f7f7;
    font-weight: 500;
    font-size: 1.2rem;
    line-height: 1.6rem;
    text-align: center;
  }
}

.type-title {
  position: relative;
  margin-bottom: 3.2rem;

  h2 {
    font-weight: 500;
    font-size: 2rem;
    line-height: 100%;
    text-align: left;
  }

  .type {
    color: var(--color-white);
    position: absolute;
    top: 50%;
    right: -2rem;
    transform: translateY(-50%);
    font-weight: 700;
    font-size: 1.2rem;
    line-height: 100%;
    background-color: var(--color-black);
    padding: 0.8rem 1.1rem;
  }
}

.qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h3 {
    font-weight: 700;
    font-size: 1.6rem;
    line-height: 100%;
    margin-bottom: 1.2rem;
  }

  p {
    font-weight: 600;
    font-size: 1.4rem;
    line-height: 100%;
    margin-bottom: 3.2rem;
  }

  .img {
    position: relative;

    img {
      width: 17.2rem;
      aspect-ratio: 1/1;
      object-fit: contain;
    }
  }
}
</style>
