<template>
  <transition name="fade">
    <div v-if="isShow" class="modal-wrap">
      <div class="modal-inner">
        <div class="head">
          <h3 class="title">{{ title }}</h3>
          <button type="button" class="close-btn" @click="skipMarketing">
            <i class="ic-close" />
          </button>
        </div>
        <div class="body">
          <div class="guide-content">
            <div class="guide-icon-div">
              <div
                class="guide-icon"
                :style="{ backgroundColor: code === 3 ? '#2c8e40' : '#6d4029' }"
              >
                <!-- ic-brown 아이콘 대신 동일하게 사용해도 되고, ic-green 아이콘을 따로 만들면 그걸로 교체 -->
                <i :class="code === 3 ? 'ic-green' : 'ic-brown'" />
              </div>
              <div class="guide-label">
                {{ code === 3 ? 'Green' : 'Brown' }}
              </div>
            </div>
            <div class="guide-text">
              <p>{{ code === 3 ? 'Green'  : 'Brown' }} 회원으로 전환됩니다.</p>
              <p>Mypage에서 혜택을 확인할 수 있습니다.</p>
            </div>
          </div>
        </div>

        <div class="foot">
          <UButton w-size='100' button-type="secondary" @click="$emit('next')">
            {{ canNext ? '추가 정보 입력하고 혜택 받기' : '완료' }}
          </UButton>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import UButton from '~/components/user/common/UButton';

export default {
  name: 'AdditionalInfoModal',
  components: { UButton },
  props: {
    isShow: { type: Boolean, required: true },
    title: { type: String, default: '등급 전환 안내' },
    code: { type: Number, required: true },
    canNext:  { type: Boolean, default: false }
  },
  emits: ['close', 'next'],
  methods: {
    async skipMarketing() {
      try {
        // 마케팅 동의 안 함(0)
        await this.$axios.$put('/user/account/marketing', {
          marketingPending: false,
          isMarketingReceive: false,
          isLocalResident: false,
          additionalInfoAgreed: false,
        });

      } catch (err) {
        console.warn('마케팅 스킵 처리 실패', err);
      } finally {
        this.$emit('close');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-wrap {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 500;
}
.modal-inner {
  display: flex;
  flex-direction: column;
  width: 100%; height: 100%;
  background: #fff;
  @media screen and (min-width: 769px) {
    width: 45.4rem;
    height: auto;
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 1rem 3rem rgba(0,0,0,0.175);
  }
}
.head {
  display: flex;
  align-items: center;
  position: relative;
  height: 6rem;
  padding: 0 6rem 0 2rem;
  font-weight: 700;
  font-size: 2rem;
  border-bottom: 1px solid var(--color-u-grey-1);
  @media screen and (min-width: 769px) {
    padding: 3.2rem 3.6rem;
    font-size: 2.4rem;
  }
  .title {
    margin: 0;
    flex: 1;
    // text-align: center;
  }
  .close-btn {
    position: absolute;
    top: 50%; right: 2rem;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    i { font-size: 3.2rem; }
  }
}
.body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  @media screen and (min-width: 769px) {
    max-height: 40.8rem;
    padding: 2.4rem 3.6rem;
  }
  .guide-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
  }
  .guide-icon-div {
    width: 100%;
    background-color: var(--color-u-grey-1);
    border-radius: 0.4rem;
    padding: 1.6rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
  }
  .guide-icon {
    width: 4rem; height: 4rem;
    border-radius: 50%;
    background-color: #6d4029;
    display: flex;
    align-items: center;
    justify-content: center;
    i { font-size: 2rem; color: #fff; }
  }
  .guide-label {
    font-size: 1.4rem;
    font-weight: 500;
    color: var(--color-black);
  }
  .guide-text {
    text-align: center;
    font-size: 1.3rem;
    line-height: 1.4;
    p { margin: 0.4rem 0; }
  }
}
.foot {
  display: flex;
  justify-content: center;
  gap: 1.6rem;
  padding: 1.4rem 2rem;
  border-top: 1px solid var(--color-u-grey-1);
  background: #fff;
  margin-top: auto;

  @media screen and (min-width: 769px) {
    padding: 0 3.2rem 3.6rem;
    margin-top: 0;
    button {
      margin-top: 3.6rem;
    }
  }
  button[button-type="secondary"] {
    background: transparent;
    border: 1px solid var(--color-u-grey-1);
    color: var(--color-black);
  }
  button:not([button-type="secondary"]) {
    background: var(--color-u-primary);
    color: #fff;
  }
}
</style>
