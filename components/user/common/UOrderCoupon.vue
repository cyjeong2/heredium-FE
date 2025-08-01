<template>
  <div v-if="isLogged" class="custom-button">
    <UButton button-type="secondary" w-size="100" :disabled="disableSelectCoupon" @click="handleOpenCouponList">
      멤버십 쿠폰 적용(잔여수량: {{ totalCoupon }})
    </UButton>
    <KeepAlive>
      <UModalFullScreen :is-show="isShowCouponList" class="modal-custom" @close="handleClose">
        <template #title>
          <p class="center title-modal">쿠폰 선택</p>
        </template>
        <template #content>
          <p class="caption">쿠폰은 1개만 선택할 수 있습니다.</p>
          <CouponList
            v-if="dataListCoupon"
            class="coupon-list"
            :data="dataListCoupon"
            :is-selection="true"
            :selected-coupon-id="selectedCouponId"
            @toggle-coupon-select="toggleCouponSelect"
          />
          <UButton class="button mb-28 center" w-size="100" @click="handleUpdateCoupon">쿠폰 사용</UButton>
        </template>
      </UModalFullScreen>
    </KeepAlive>
  </div>
</template>

<script>
// import cloneDeep from 'lodash/cloneDeep';
import CouponList from '../page/coupon/CouponList.vue';
import UModalFullScreen from '../modal/UModalFullScreen.vue';
import UButton from './UButton.vue';
import { userMixin } from '~/mixins/userMixin';

export default {
  name: 'UOrderCoupon',

  components: { UButton, UModalFullScreen, CouponList },

  directives: {},

  filters: {},
  mixins: [userMixin],
  props: {
    couponType: {
      type: String,
      required: true,
      default: 'EXHIBITION' // EXHIBITION | PROGRAM | COFFEE
    },
    initCouponId: {
      required: true,
      default: null,
      validator(value) {
        return typeof value === 'number' || value === null;
      }
    },
    orderPrice: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data() {
    return {
      isLogged: null,
      isShowCouponList: false,
      dataListCoupon: null,
      totalCoupon: null,
      selectedCouponId: null
    };
  },
  computed: {
    disableSelectCoupon() {
      return !this.totalCoupon || !this.orderPrice;
    }
  },
  watch: {
    initCouponId(updateCouponId) {
      if (updateCouponId !== this.selectedCouponId) {
        this.selectedCouponId = updateCouponId;
      }
    }
  },
  created() {
    this.selectedCouponId = this.initCouponId;
  },

  mounted() {
    const isLogged = this.checkLogged();
    this.isLogged = isLogged;
    if (isLogged) {
      this.getCouponList();
      this.handleUpdateCoupon();
    }
  },

  beforeDestroy() {},

  methods: {
    handleClose() {
      this.isShowCouponList = false;
    },
    handleOpenCouponList() {
      this.isShowCouponList = true;
    },
    async getCouponList() {
      try {
        // 1) 전체 쿠폰 카테고리 불러오기
        const raw = await this.$axios.$get('/user/coupons/usage');
        let list = Array.isArray(raw) ? raw : [];

        // 2) 내가 보고 싶은 타입만 필터
        list = list.filter(c => c.coupon_type === this.couponType);

        // 3) membership 쿠폰 여부 플래그 추가
        list = list.map(c => ({
          ...c,
          // used/unused 둘 다 비어 있으면 “멤버십 쿠폰”이라 간주
          isMembershipCoupon:
            Array.isArray(c.used_coupons) &&
            c.used_coupons.length === 0 &&
            Array.isArray(c.unused_coupons) &&
            c.unused_coupons.length === 0
        }));

        // 4) 총 잔여 수량 계산
        let total = 0;
        for (const c of list) {
          // 기존 unused count
          let cnt = Array.isArray(c.unused_coupons)
            ? c.unused_coupons.filter(u => !u.is_expired).length
            : 0;

          // 만약 membership 쿠폰이면, 사용 이력 없더라도 한 번은 쓸 수 있게 1장 처리
          if (c.isMembershipCoupon) {
            cnt = 1;
          }

          total += cnt;
        }

        this.dataListCoupon = list;
        this.totalCoupon    = total;
      } catch (err) {
        console.error('cannot get coupon', err);
        this.dataListCoupon = [];
        this.totalCoupon    = 0;
      }

      //   let dataListCoupon = await this.$axios.$get('/user/coupons/usage');
      //   console.log('dataListCoupon', dataListCoupon)
      //   if (!dataListCoupon) {
      //     dataListCoupon = [];
      //   }
      //   dataListCoupon = dataListCoupon.filter((couponCategory) => couponCategory.coupon_type === this.couponType);
      //   let totalCoupon = 0;
      //   for (const couponCategory of dataListCoupon) {
      //     const availableCoupon = couponCategory?.unused_coupons?.filter((item) => !item.is_expired);
      //     totalCoupon += availableCoupon ? availableCoupon.length : 0;
      //   }
      //   this.totalCoupon = totalCoupon;
      //   this.dataListCoupon = dataListCoupon;
      // } catch (error) {
      //   // show empty coupon
      //   console.error('cannot get coupon', error.response);
      //   this.totalCoupon = 0;
      // }
    },
    toggleCouponSelect(id) {
      if (this.selectedCouponId === id) {
        this.selectedCouponId = null;
      } else {
        this.selectedCouponId = id;
      }
    },
    getFirstCouponAvailable(couponList) {
      if (!couponList) {
        return null;
      }
      return couponList.find((coupon) => coupon.is_expired === false);
    },
    getCoupon(id) {

      const cat = this.dataListCoupon.find(c => c.id === id);
      if (!cat) return null;

      // unused 쿠폰이 있는 경우(일반 쿠폰)
      if (cat.unused_coupons.length > 0) {
        const first = cat.unused_coupons.find(u => !u.is_expired);
        return {
          ...cat,
          uuid: first.uuid,
          isMembership: false
        };
      }

      // 멤버십 쿠폰
      return {
        id: cat.id,
        coupon_type: cat.coupon_type,
        discount_percent: cat.discount_percent,
        image_url: cat.image_url,
        isMembership: true
      };

      // const coupons = cloneDeep(this.dataListCoupon.find((coupon) => coupon.id === id));
      // if (!coupons) {
      //   return null;
      // }
      // const firstCouponAvailable = this.getFirstCouponAvailable(coupons.unused_coupons);
      // if (!firstCouponAvailable) {
      //   return null;
      // }
      // delete coupons.unused_coupons;
      // delete coupons.used_coupons;

      // coupons.uuid = firstCouponAvailable.uuid;
      // return coupons;
    },
    handleUpdateCoupon() {
      let coupon = null;
      if (this.selectedCouponId) {
        coupon = this.getCoupon(this.selectedCouponId);
      }
      this.$emit('update-coupon', coupon);
      this.isShowCouponList = false;
    }
  }
};
</script>

<style scoped lang="scss">
.custom-button > button {
  border-color: var(--color-u-grey-1);
}
.modal-custom {
  .title-modal {
    font-size: 2.4rem;
    line-height: 3.2rem;
    font-weight: 700;
  }
  .caption {
    width: 100%;
    font-size: 1.4rem;
    line-height: 2rem;
    font-weight: 400;
    color: var(--color-u-placeholder);
  }
  .coupon-list,
  .button {
    margin-top: 24px;
  }

  @media screen and (max-width: 768px) {
    .title-modal {
      font-size: 2rem;
      line-height: 2.8rem;
      font-weight: 700;
    }
    .modal-custom {
      .modal-inner {
        width: 100dvw;
        height: 100dvh;
      }
    }
  }
}
</style>
