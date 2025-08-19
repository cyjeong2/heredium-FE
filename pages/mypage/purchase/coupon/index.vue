<template>
  <main class="container">
    <div>
      <SideBarMyPage />
    </div>
    <section>
      <div class="ticketing-head">
        <h2>쿠폰함</h2>
      </div>
      <div class="ticketing-body">
        <div class="membership_info">
          <div class="membership_icon">
            <img
              v-if="imageSrcByCode(dataMembership.code)"
              :src="imageSrcByCode(dataMembership.code)"
              style="width: 48px; height: 48px"
              alt="membership icon"
            />
          </div>
          <div class="name_membership">
            <div>
              <p class="name_class">
                {{ dataMembership.name }} 님의 현재 등급은<br />
                <B>{{ dataMembership.short_name }}</B>
                입니다.
              </p>
              <div class="mileage_description">
                <p v-if="dataMembership.code !== 3">
                  마일리지는 <B>멤버십 등급 산정용</B>으로만 사용되며, <br />
                  적립된 마일리지에 따라 <B>등급별 혜택</B>이 제공됩니다
                </p>
                <p v-if="dataMembership.code === 3">
                  <B>만 19세</B>가 도래하는 경우
                  {{ membershipBenefit.items.find((item) => item.code === 1)?.name }} 등급으로 전환되며, <br />
                  {{ dataMembership.short_name }} 회원의 경우 마일리지 적립이 불가합니다.
                </p>
              </div>
              <div class="mileage_condition">
                <p v-if="dataMembership.code === 1">
                  마일리지
                  <B
                    >{{
                      Math.max(
                        0,
                        (membershipBenefit.items.find((item) => item.code === 2)?.usage_threshold || 0) - totalMileage
                      )
                    }}점</B
                  >
                  적립시 <br />
                  업그레이드 됩니다.
                </p>
                <p v-if="dataMembership.code === 2">
                  업그레이드 등급 유지기간 <br />
                  <b
                    >{{ formatDate(dataMembership.registration_date) }}~{{
                      formatDate(dataMembership.expiration_date)
                    }}</b
                  >
                </p>
                <p v-if="dataMembership.code === 3"><B>미성년자</B>에게 부여되는 등급입니다.</p>
                <!-- 등급 혜택 모달 -->
                <div class="benefit-hover-wrapper">
                  <button class="membership_benefit" @click="showModal = true">등급 혜택보기</button>

                  <ModalMembershipInfor
                    v-if="showModal"
                    v-model="showModal"
                    :is-modal-visible="showModal"
                    :data-membership="dataMembership"
                    class="transparent-modal"
                    :benefit-rows="(membershipBenefit && membershipBenefit.items) || []"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="coupon_summary_table">
          <table>
            <tr>
              <th>현재 나의 쿠폰</th>
              <td>
                <span style="font-size: 19px">{{ totalCoupons }}</span>
              </td>
            </tr>
            <tr>
              <th>소멸 예정 쿠폰</th>
              <td>
                <span style="font-size: 19px">{{ expiringCoupons }}</span>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <!-- Tab UI -->
      <div class="coupon-section">
        <!-- 탭 버튼 영역 -->
        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
        <!-- 기간 필터 영역 -->
        <div class="filter-area">
          <div class="filter-buttons">
            <button
              v-for="option in filterOptions"
              :key="option"
              :class="{ selected: selectedFilter === option }"
              @click="selectFilter(option)"
            >
              {{ option }}
            </button>
          </div>
          <!-- 사용자 지정 기간 설정 -->
          <div class="date-range">
            <UDatepicker v-model="startDate" :max="endDate" style="width: 227.5px" />
            <span>~</span>
            <UDatepicker v-model="endDate" :min="startDate" style="width: 227.5px" />
          </div>

          <button class="filter-submit" @click="applyPeriodFilter">조회</button>
        </div>

        <!-- 테이블 -->
        <UPageable
          :list-data="couponPageModel"
          :show-prev-page="true"
          :show-next-page="true"
          @getListData="onCouponPageChange"
        >
          <template #data="{ data }">
            <table class="coupon-table">
              <tbody>
                <tr>
                  <td colspan="5" style="padding: 0; border: none; background: transparent">
                    <CouponList
                      :key="`page-${couponPageIndex}-${data && data.length}`"
                      class="coupon-list"
                      :data="data"
                      :right-button="true"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </UPageable>
      </div>
    </section>
  </main>
</template>

<script>
import dayjs from 'dayjs';

import ModalMembershipInfor from '~/components/user/modal/membership/ModalMembershipInfor.vue';
import SideBarMyPage from '~/components/user/page/SideBarMyPage.vue';
import UDatepicker from '~/components/user/common/UDatepicker';
import UPageable from '~/components/user/common/UPageable';
import CouponList from '~/components/user/page/coupon/CouponList.vue';
import { imageMixin } from '~/mixins/imageMixin';

export default {
  name: 'MembershipAndCouponPage',
  components: { SideBarMyPage, ModalMembershipInfor, UDatepicker, CouponList, UPageable },
  mixins: [imageMixin],
  async asyncData({ $axios }) {
    const initialPageSize = 5;

    const dataMembership = await $axios.$get('/user/membership/info');
    const mileageRes = await $axios.$get(`/user/membershipMileage/${dataMembership.account_id}`, {
      params: { page: 0, size: initialPageSize }
    });
    const totalMileage = mileageRes.totalMileage;

    const couponList = await $axios.$get('/user/coupons/usage');

    const membershipBenefit = await $axios.$get('/user/membership/benefit');

    const usedCouponsList = couponList.filter((item) => (item.used_coupons?.length || 0) > 0);

    const availableCouponsList = couponList
      .map((item) => ({
        ...item,
        unused_coupons: (item.unused_coupons || []).filter((c) => !c.is_expired)
      }))
      .filter((item) => item.unused_coupons.length > 0);

    return {
      dataMembership,
      totalMileage,
      membershipBenefit,
      availableCouponsList,
      usedCouponsList,
      startDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD')
    };
  },
  data() {
    return {
      activeTab: 'total',
      couponPageSize: 5,
      couponPageIndex: 0,
      tabs: [
        { key: 'total', label: '전체' },
        { key: 'added', label: '보유 쿠폰' },
        { key: 'used', label: '사용 쿠폰' }
      ],
      filterOptions: ['1개월', '3개월', '6개월', '1년'],
      selectedFilter: '1개월',
      pageSizeForLoad: 5,
      showModal: false,

      appliedStartDate: null,
      appliedEndDate: null
    };
  },
  computed: {
    totalCoupons() {
      if (!this.availableCouponsList) return 0;
      return this.availableCouponsList.reduce((sum, item) => {
        return sum + (item.unused_coupons?.length || 0);
      }, 0);
    },
    expiringCoupons() {
      if (!this.availableCouponsList) return 0;
      const today = dayjs();
      return this.availableCouponsList.reduce((sum, item) => {
        const expiring =
          item.unused_coupons?.filter((coupon) => {
            return coupon.expiration_date && dayjs(coupon.expiration_date).isBefore(today.add(30, 'day'));
          }) || [];
        return sum + expiring.length;
      }, 0);
    },
    filteredCouponsAll() {
      const start = this.appliedStartDate ? dayjs(this.appliedStartDate).startOf('day') : null;
      const end = this.appliedEndDate ? dayjs(this.appliedEndDate).endOf('day') : null;

      // 기간 교집합 체크: [aStart,aEnd] ↔ [bStart,bEnd]
      const isOverlap = (aStart, aEnd, bStart, bEnd) => {
        // aStart/aEnd가 null이면 무한대(-∞/∞)로 간주
        const beginsBeforeBEnd = !aStart || !bEnd || aStart.isSame(bEnd) || aStart.isBefore(bEnd);
        const endsAfterBStart = !aEnd || !bStart || aEnd.isSame(bStart) || aEnd.isAfter(bStart);
        return beginsBeforeBEnd && endsAfterBStart;
      };

      // 사용 쿠폰은 사용일 기준
      if (this.activeTab === 'used') {
        const src = this.usedCouponsList || [];
        return src
          .map((item) => {
            const pool = (item.used_coupons || []).filter((c) => {
              if (!start || !end) return true;
              const used = c.used_at || c.created_at; // 되도록 used_at
              const t = used ? dayjs(used) : null;
              return t && (t.isSame(start) || t.isAfter(start)) && (t.isSame(end) || t.isBefore(end));
            });
            return { ...item, used_coupons: pool };
          })
          .filter((item) => (item.used_coupons || []).length > 0);
      }

      // 보유(미사용) 쿠폰은 "유효기간 구간"과 조회기간이 겹치면 포함
      const src = this.availableCouponsList || [];
      return src
        .map((item) => {
          const pool = (item.unused_coupons || []).filter((c) => {
            if (!start || !end) return true;

            // 유효 시작/종료 (가능한 필드 우선순위로 선택)
            const fromRaw = c.valid_from || c.delivered_date || c.created_at || null;
            const toRaw = c.valid_to || c.expiration_date || null;

            const from = fromRaw ? dayjs(fromRaw).startOf('day') : null; // null이면 -∞
            const to = toRaw ? dayjs(toRaw).endOf('day') : null; // null이면  +∞

            return isOverlap(from, to, start, end);
          });
          return { ...item, unused_coupons: pool };
        })
        .filter((item) => (item.unused_coupons || []).length > 0);
    },
    currentCouponSource() {
      return Array.isArray(this.filteredCouponsAll) ? this.filteredCouponsAll : [];
    },

    couponPageModel() {
      const source = this.currentCouponSource;

      const size = this.couponPageSize || 5;
      const totalElements = source.length;
      const totalPages = Math.max(1, Math.ceil(totalElements / size));
      const safePage = Math.min(this.couponPageIndex || 0, totalPages - 1);

      const start = safePage * size;
      const end = start + size;
      const content = source.slice(start, end);

      return {
        content,
        totalElements,
        totalPages,
        number: safePage,
        size,
        first: safePage === 0,
        last: safePage === totalPages - 1
      };
    }
  },
  watch: {
    activeTab() {
      this.couponPageIndex = 0;
    }
  },

  mounted() {
    this.appliedStartDate = this.startDate;
    this.appliedEndDate = this.endDate;
  },
  methods: {
    onCouponPageChange(index) {
      this.couponPageIndex = index;
    },

    formatDate(dateStr) {
      if (!dateStr) return '';
      return dayjs(dateStr).format('YYYY-MM-DD');
    },
    selectFilter(option) {
      this.selectedFilter = option;
      const now = dayjs();
      let start;

      switch (option) {
        case '1개월':
          start = now.subtract(1, 'month');
          break;
        case '3개월':
          start = now.subtract(3, 'month');
          break;
        case '6개월':
          start = now.subtract(6, 'month');
          break;
        case '1년':
          start = now.subtract(1, 'year');
          break;
        default:
          return;
      }

      this.startDate = start.format('YYYY-MM-DD');
      this.endDate = now.format('YYYY-MM-DD');

      // 필터 바뀌면 첫 페이지로
      this.applyPeriodFilter();
      this.couponPageIndex = 0;
    },
    applyPeriodFilter() {
      this.appliedStartDate = this.startDate;
      this.appliedEndDate = this.endDate;
      this.couponPageIndex = 0;
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    imageSrcByCode(code) {
      const rows = (this.membershipBenefit && this.membershipBenefit.items) || [];
      const row = rows.find((r) => Number(r.code) === Number(code));
      if (row && row.image_url) return this.getImage(row.image_url);
      return null;
    },
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin-bottom: 12rem;
  min-height: 100vh !important;
}
.mypage {
  margin-top: 2rem;
}
.ticketing-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4.5rem;

  h2 {
    font-size: 20px;
    font-weight: 700;
    line-height: 1.8rem;
  }
}

.head {
  font-size: 2rem;
  font-weight: 700;
  padding-left: 8px;
  border-left: 5px solid var(--color-u-primary);
  margin-bottom: 2rem;
}

.ticketing-body {
  .ticketing-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 4rem;
    padding: 1.6rem 1.6rem 1.7rem;
    background: rgba(235, 235, 235, 0.4);

    .left {
      display: flex;
      align-items: center;
    }

    i {
      margin-right: 0.8rem;
      font-size: 2rem;
    }

    p {
      font-size: 1.2rem;
      font-weight: 500;
      line-height: 1.2rem;

      strong {
        display: inline-flex;
        transform: translateY(0.1rem);
        font-weight: 700;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  ::v-deep(.coupon-list) {
    width: 100%;
  }
  .mypage h1 {
    font-size: 2rem;
  }
  .ticketing-head h2 {
    font-size: 2rem;
  }
  .ticketing-body {
    width: 100%;
    height: auto !important;
  }
  .membership_info {
    max-width: 100%;
    padding: 1rem;
  }
  .name_membership {
    width: 100%;
  }
  ::v-deep(.coupon-table td[colspan]) {
    padding-top: 3rem !important;
  }

  ::v-deep(.coupon-list .coupon-card) {
    width: 100%;
    max-width: none;
    box-sizing: border-box;
  }
  ::v-deep(.coupon-card) {
    display: grid;
    grid-template-columns: 56px 1fr;
    column-gap: 12px;
    row-gap: 8px;
    align-items: start;
    width: 100%;
    box-sizing: border-box;
  }

  ::v-deep(.coupon-card .img-wrap) {
    grid-column: 1;
    grid-row: 1;
    width: 56px;
    height: 56px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ::v-deep(.coupon-card .coupon-detail) {
    display: contents;
  }

  ::v-deep(.coupon-card .coupon-detail > div:first-child) {
    grid-column: 2;
    grid-row: 1;
    padding: 0;
  }

  ::v-deep(.coupon-card .right-action) {
    grid-column: 1 / -1;
    grid-row: 2;
    margin: 8px 0 0;
    padding: 0;
    display: block;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
  ::v-deep(.coupon-card .right-action .use-btn) {
    width: 100% !important;
    height: 44px !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    line-height: 1 !important;
    text-align: center;
    box-sizing: border-box;
  }
}

.box-contents {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .box-membership {
    max-width: 35%;
  }
}

.head {
  font-size: 2rem;
  font-weight: 700;
  padding-left: 8px;
  border-left: 5px solid var(--color-u-primary);
  margin-bottom: 2rem;
}
.membership_info {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  max-height: 800px;
  height: 100%;
  padding: 2rem;
  margin-top: 2rem;
  border: 1px solid #e6e6e6;
  background-color: #fff;
}
.membership_icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 15px;
  max-width: 48px;
  max-height: 48px;
}
.name_membership {
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
}
.name_class {
  font-size: 1.5em;
  margin-bottom: 3rem !important;
}
.mileage_condition {
  display: flex;
  justify-content: space-between;
  text-align: left;
  flex-direction: row;
  color: #111111;
  border-top: solid #e6e6e6;
  margin-top: 1.2rem;
  padding-top: 1.2rem;
  font-size: 1.2rem;
}
.mileage_description {
  color: #666666;
  font-size: 1.2rem;
}
.benefit-hover-wrapper {
  position: relative;
}
.membership_benefit {
  background-color: #111111 !important;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  min-width: 90px;
  min-height: 30px;
  cursor: pointer;
}
.transparent-modal {
  z-index: 10;
  pointer-events: none;
}
.modal_title {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.modal_icon {
  display: flex;
  flex-direction: row;
}
.modal_name {
  font-size: 17px;
  display: flex;
  flex-direction: row;
}

.coupon_summary_table {
  width: 100%;
  margin-top: 2rem;
  padding: 0 1rem;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 10px 0;
    text-align: left;
  }

  th {
    width: 50%;
    font-weight: normal;
    color: #111111;
  }

  td {
    width: 50%;
    text-align: right;
    font-weight: bold;
    color: #111111;
  }
}

.coupon-section {
  width: 100%;
  max-width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
  box-sizing: border-box;
}
.tabs {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
}
.tabs button {
  flex: 1;
  padding: 12px;
  border: none;
  background: #fff;
  font-weight: bold;
  color: #000;
  border-bottom: 1px solid #d9d9d9;
  cursor: pointer;
}

.tabs button.active {
  border-bottom: 2px solid #000;
  background: #fff;
}
.filter-area {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 1.5rem;
  margin-bottom: 3.5rem;
  padding: 8px 0;
  gap: 5px;
}
.filter-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  border: 1px solid #cccccc;
  background-color: #ffffff;

  button {
    flex: 1;
    min-width: unset;
    padding: 10px 12px;
    text-align: center;
    border: 1px solid #cccccc;
    background-color: #ffffff;
    cursor: pointer;
  }
}
.filter-buttons button.selected {
  background: #ffffff;
  border-color: #111111;
}
.date-range {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 6px;
  ::v-deep(.date-picker) {
    flex: 1;
    width: auto !important;
    .data-input {
      padding: 0 1.6rem;
      border: 1px solid #ccc;
      background-color: #fff;
      font-size: 1.4rem;
      max-height: 100%;
      box-sizing: border-box;
    }

    &.is-active .data-input {
      border-color: #111111;
    }
  }
}
.filter-submit {
  background-color: #a5b195 !important;
  color: #ffffff;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  max-width: 100%;
  height: 45px;
  font-size: 14px;
  cursor: pointer;
}
.coupon-table {
  width: 100%;
  border-top: 1px solid #111111;
  table-layout: fixed;

  th,
  td {
    padding: 12px;
    text-align: center;
    word-wrap: break-word;
  }

  th {
    border-top: 1px solid #111111;
    border-bottom: 1px solid #d9d9d9;
    background-color: #f9f9f9;
  }

  td {
    border-top: 1px solid #d9d9d9;
    vertical-align: middle;
  }

  /* 컬럼 너비 조정 */
  th:nth-child(1),
  td:nth-child(1) {
    width: 65%;
    text-align: left;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 35%;
  }

  .created-date {
    font-size: 1.2rem;
    color: #666666;
  }
  .category {
    font-size: 1.4rem;
    font-weight: bold;
    color: #333333;
  }
  .expiration-date {
    font-size: 1.2rem;
    color: #999999;
  }
}
::v-deep(.pagination) {
  margin-top: 2.6rem !important;
}
</style>
