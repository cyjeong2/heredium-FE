<template>
  <!-- PC 전용 -->
  <UModal
    v-if="isPCUrl"
    :is-show="value"
    class="modal-custom only-pc"
    :hide-edge-close-btn="true"
    :background-white="true"
    @close="handleClose"
  >
    <template #content>
      <div @mouseleave="handleMouseLeave" @mouseenter="handleMouseEnter">
        <div class="title-modal">
          <img
            v-if="imageSrcByCode(dataMembership.code)"
            :src="imageSrcByCode(dataMembership.code)"
            style="width: 48px; height: 48px"
            alt="membership icon"
          />
          <span class="name-membership">
            {{ dataMembership.name }} 님의 현재 등급은 <B>{{ dataMembership.membership_name }}</B> 입니다.
          </span>
        </div>
        <div class="benefit">
          <div class="benefit-box">
            <div class="benefit-box">
              <div class="benefit-row">
                <div class="left">
                  <img :src="imageSrcByCode(1)" class="membership-icon2" />
                  <div class="name_target">
                    <p class="membership-name">{{ (benefitRows.find((item) => item.code === 1) || {}).name }}</p>
                    <p class="membership-target">만 19세 이상 회원</p>
                  </div>
                </div>
                <div class="right">
                  <p class="benefit-info">
                    <span v-for="(c, i) in getCouponsByCode(1)" :key="c.id || i" class="benefit-cat">
                      {{ formatCouponText(c) }}
                    </span>
                    할인
                  </p>
                </div>
              </div>

              <div class="benefit-row">
                <div class="left">
                  <img :src="imageSrcByCode(2)" class="membership-icon2" />
                  <div class="name_target">
                    <p class="membership-name">{{ (benefitRows.find((item) => item.code === 2) || {}).name }}</p>
                    <p class="membership-target">
                      마일리지 {{ benefitRows.find((item) => item.code === 2)?.usage_threshold }}점 달성
                      {{ benefitRows.find((item) => item.code === 1)?.name }} 회원
                    </p>
                  </div>
                </div>
                <div class="right">
                  <p class="benefit-info">
                    <span v-for="(c, i) in getCouponsByCode(2)" :key="c.id || i" class="benefit-cat">
                      {{ formatCouponText(c) }}
                    </span>
                    할인
                  </p>
                </div>
              </div>

              <div class="benefit-row">
                <div class="left">
                  <img :src="imageSrcByCode(3)" class="membership-icon2" />
                  <div class="name_target">
                    <p class="membership-name">{{ (benefitRows.find((item) => item.code === 3) || {}).name }}</p>
                    <p class="membership-target">만 19세 미만 회원</p>
                  </div>
                </div>
                <div class="right">
                  <p class="benefit-info">
                    <span v-for="(c, i) in getCouponsByCode(3)" :key="c.id || i" class="benefit-cat">
                      {{ formatCouponText(c) }}
                    </span>
                    할인
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UModal>
  <!-- 모바일 전용 -->
  <UModal
    v-else
    :is-show="value"
    class="modal-custom only-mobile"
    :hide-head="false"
    :hide-edge-close-btn="false"
    :background-white="false"
    @close="handleClose"
  >
    <template #title>
      <div class="title-modal only-mobile">
        <img
          v-if="imageSrcByCode(dataMembership.code)"
          :src="imageSrcByCode(dataMembership.code)"
          style="width: 48px; height: 48px"
          alt="membership icon"
        />
        <span class="name-membership only-mobile">
          {{ dataMembership.name }} 님의 현재 등급은<br />
          <B>{{ dataMembership.short_name }}</B>
          입니다.
        </span>
      </div>
    </template>

    <template #content>
      <div class="benefit only-mobile">
        <div class="benefit-box only-mobile">
          <div class="benefit-row only-mobile">
            <img :src="imageSrcByCode(1)" class="membership-icon2 only-mobile" />
            <div class="name_target">
              <p class="membership-name only-mobile">
                <B>{{ (benefitRows.find((item) => item.code === 1) || {}).name }}</B>
              </p>
              <p class="membership-target only-mobile">만 19세 이상 회원</p>
              <p class="benefit-info only-mobile">
                <span v-for="(c, i) in getCouponsByCode(1)" :key="c.id || i" class="benefit-cat">
                  {{ formatCouponText(c) }}
                </span>
                할인
              </p>
            </div>
          </div>

          <div class="benefit-row only-mobile">
            <img :src="imageSrcByCode(2)" class="membership-icon2" />
            <div class="name_target only-mobile">
              <p class="membership-name only-mobile">
                <B>{{ (benefitRows.find((item) => item.code === 2) || {}).short_name }}</B>
              </p>
              <p class="membership-target only-mobile">
                마일리지 {{ benefitRows.find((item) => item.code === 2)?.usage_threshold }}점 달성
                {{ benefitRows.find((item) => item.code === 1)?.name }} 회원
              </p>
              <p class="benefit-info only-mobile">
                <span v-for="(c, i) in getCouponsByCode(2)" :key="c.id || i" class="benefit-cat">
                  {{ formatCouponText(c) }}
                </span>
                할인
              </p>
            </div>
          </div>

          <div class="benefit-row only-mobile">
            <img :src="imageSrcByCode(3)" class="membership-icon2" />
            <div class="name_target only-mobile">
              <p class="membership-name only-mobile">
                <B>{{ (benefitRows.find((item) => item.code === 3) || {}).name }}</B>
              </p>
              <p class="membership-target only-mobile">만 19세 미만 회원</p>
              <p class="benefit-info only-mobile">
                <span v-for="(c, i) in getCouponsByCode(3)" :key="c.id || i" class="benefit-cat">
                  {{ formatCouponText(c) }}
                </span>
                할인
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script>
import UModal from '~/components/user/modal/UModal.vue';
import { imageMixin } from '~/mixins/imageMixin';

export default {
  name: 'ModalMembershipInfor',
  components: { UModal },
  mixins: [imageMixin],
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    dataMembership: {
      type: Object,
      default: () => {}
    },
    value: {
      type: Boolean,
      required: true
    },
    benefitRows: { type: Array, default: () => [] }
  },
  data() {
    return {
      closeTimer: null
    };
  },
  computed: {
    isPCUrl() {
      return (
        this.$route.path.includes('/mypage/purchase/membership_pc') ||
        this.$route.path.includes('/mypage/purchase/coupon_pc')
      );
    },
    couponImageSrc() {
      return this.getImage(this.dataMembership.image_url);
    }
  },
  beforeDestroy() {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }
  },
  methods: {
    handleClose() {
      this.$emit('input', false);
      this.$emit('close');
    },
    handleMouseLeave() {
      this.$emit('hover-out');
    },
    handleMouseEnter() {
      this.$emit('hover-in');
    },
    getCouponsByCode(code) {
      const rows = Array.isArray(this.benefitRows) ? this.benefitRows : [];
      const row = rows.find((r) => Number(r.code) === Number(code));
      return row && Array.isArray(row.coupons) ? row.coupons : [];
    },
    imageSrcByCode(code) {
      const rows = Array.isArray(this.benefitRows) ? this.benefitRows : [];
      const row = rows.find((r) => Number(r.code) === Number(code));
      return row && row.image_url ? this.getImage(row.image_url) : null;
    },
    formatCouponText(c) {
      if (!c) return '';
      // 1) discount_percent 필드가 있으면 우선 사용
      const pctFromField = c.discount_percent ?? c.discountPercent;
      // 2) 없으면 name 문자열에서 끝자리 숫자 추출
      const m = String(c.name || '').match(/^(.*?)(\d+)\s*%?$/);
      const label = m ? m[1].trim() : (c.name || '').trim();
      const pct = pctFromField != null ? pctFromField : m ? m[2] : '';

      return pct ? `${label} ${pct}%` : label; // 예: "커피 10%"
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-custom {
  ::v-deep .modal-inner {
    width: 530px !important;
    height: 410px !important;
    max-width: 80vw;
    max-height: 80vh;
    border-radius: 24px;
    position: absolute;
    flex-direction: row;

    top: 60% !important;
    left: 60% !important;
    transform: translateX(-50%, 50%) !important;
  }
  .title-modal {
    display: flex;
    align-items: center;
    font-size: 1.8rem;
    column-gap: 1rem;
    padding: 0 !important;

    .membership-icon {
      width: 36px;
      height: 36px;
      object-fit: contain;
    }
  }
  .qr-box {
    color: var(--color-u-placeholder);
    border-bottom: 1px solid #d1d5d8;
    padding-bottom: 2rem;

    .name-membership {
      color: var(--color-u-primary);
      font-size: 1.2rem;
    }

    & > p:nth-child(2) {
      margin-bottom: 2rem;
    }
  }

  .benefit {
    margin-top: 2rem;

    &-box {
      display: flex;
      justify-content: space-between;
      column-gap: 1.2rem;
      background-color: #e6e6e6;
      border-radius: 24px;
      padding: 1.2rem;
    }

    &-card {
      padding: 7px 8px;
      background-color: solid #f7f8f5;
      flex: 1;

      &-name {
        color: var(--color-u-placeholder);
      }

      &-quantity {
        font-weight: 700;
        font-size: 1.8rem;
      }
    }
  }
}
.benefit-box {
  display: flex;
  flex-direction: column;
  background-color: #e6e6e6;
  border-radius: 24px;
  padding: 1.6rem;
  row-gap: 1.6rem;

  .benefit-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .membership-icon2 {
    width: 24px;
    height: 24px;
    margin-top: 15px;
    object-fit: contain;
  }
  .left {
    display: flex;
    column-gap: 0.8rem;

    .membership-name {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: -0.7rem;
    }

    .membership-target {
      font-size: 11px;
      color: #7a7a7a;
    }
  }

  .right {
    flex: 1;
    .benefit-info {
      font-size: 1.3rem;
      margin-bottom: -0.7rem;
      text-align: left;
    }

    .benefit-discount {
      font-size: 1.3rem;
      b {
        font-weight: bold;
      }
    }
  }
}

.title {
  font-size: 1.3rem;
}
.benefit-box {
  display: flex;
  flex-direction: column;
}
.benefit-content {
  display: block;
  font-size: 1.3rem;
}
.benefit-info {
  display: inline-block;
  line-height: 1.6;
}

.benefit-info .benefit-cat {
  display: inline;
  margin-right: 8px;
}

.benefit-info .benefit-cat:nth-of-type(2)::after {
  content: '';
  display: block;
}

.benefit-info .benefit-cat:last-of-type {
  margin-right: 0;
}
// 모바일 CSS
.modal-custom.only-mobile {
  ::v-deep .modal-inner {
    width: 90% !important;
    max-width: 90vw;
    height: 61% !important;
    border-radius: 24px;
    position: absolute;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
  }

  .title-modal.only-mobile {
    display: flex;
    align-items: left;
    justify-content: left;
    column-gap: 1rem;
    padding: 20px 0;

    .membership-icon {
      width: 36px;
      height: 36px;
      object-fit: contain;
    }

    .name-membership {
      font-size: 1.8rem;
      font-weight: normal;
      text-align: left;
      line-height: 1.4;

      b {
        font-weight: bold;
      }
    }
  }

  .benefit.only-mobile {
    margin-top: -1.2rem;

    .benefit-box.only-mobile {
      display: flex;
      flex-direction: column;
      background-color: #e6e6e6;
      border-radius: 24px;
      padding: 1.6rem;
      row-gap: 2.5rem;
    }

    .benefit-row.only-mobile {
      display: flex;
      align-items: flex-start;
      column-gap: 0.8rem;

      .membership-icon2 {
        width: 36px;
        height: 36px;
        margin-top: 5px;
        object-fit: contain;
      }

      .name_target.only-mobile {
        display: flex;
        flex-direction: column;
        column-gap: -3rem !important;
      }

      .membership-name.only-mobile {
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 0.5rem;
      }

      .membership-target.only-mobile {
        font-size: 11px;
        color: #7a7a7a;
        margin-bottom: 0.5rem;
      }

      .benefit-info.only-mobile {
        font-size: 12px;
        margin-bottom: 0;
      }
    }
  }
}
.modal-custom.only-mobile ::v-deep .modal-wrap {
  pointer-events: auto !important;
}
.modal-custom.only-mobile ::v-deep .close-btn {
  pointer-events: auto !important;
}
</style>
