<template>
  <main class="container">
    <SideBarMyPage />
    <section>
      <div class="ticketing-head">
        <h2 class="only-pc">쿠폰함</h2>
      </div>
      <div class="ticketing-body">
        <div class="membership_info">
          <div class="membership_icon">
            <img v-if="dataMembership.code === 1" src="~assets/img/Brown.png" />
            <img v-if="dataMembership.code === 2" src="~assets/img/Terracotta.png" />
            <img v-if="dataMembership.code === 3" src="~assets/img/Green.png" />
          </div>
          <div class="name_membership">
            <div>
              <p class="name_class">
                {{ dataMembership.name }} 님의 현재 등급은 <B>{{ dataMembership.membership_name }}</B> 입니다.
              </p>
              <div class="mileage_condition">
                <p v-if="dataMembership.code === 1">
                  마일리지 <B>{{ Math.max(0, 70 - totalMileage) }}</B> 적립시 업그레이드 됩니다.
                </p>
                <p v-if="dataMembership.code === 2">
                  업그레이드 등급 유지기간
                  <b
                    >{{ formatDate(dataMembership.registration_date) }}~{{
                      formatDate(dataMembership.expiration_date)
                    }}</b
                  >
                </p>
                <p v-if="dataMembership.code === 3"><B>미성년자</B>에게 부여되는 등급입니다.</p>
                <!-- 등급 혜택 모달 -->
                <div class="benefit-hover-wrapper">
                  <button class="membership_benefit" @mouseenter="showModal = true" @mouseleave="showModal = false">
                    등급 혜택보기
                  </button>

                  <ModalMembershipInfor
                    v-if="showModal"
                    v-model="showModal"
                    :is-modal-visible="showModal"
                    :data-membership="dataMembership"
                    class="transparent-modal"
                  />
                </div>
              </div>

              <div class="mileage_description">
                <p v-if="dataMembership.code !== 3">
                  마일리지는 <B>멤버십 등급 산정용</B>으로만 사용되며, <br />
                  적립된 마일리지에 따라 <B>등급별 혜택</B>이 제공됩니다
                </p>
                <p v-if="dataMembership.code === 3">
                  <B>만 19세</B>가 도래하는 경우 Brown 등급으로 전환되며, <br />
                  Green 회원의 경우 마일리지 적립이 불가합니다.
                </p>
              </div>
            </div>
          </div>
          <div class="mileage_summary">
            <div>현재 나의 쿠폰</div>
            <div>소멸 예정 쿠폰</div>
          </div>
          <div class="show_mileage">
            <!-- 쿠폰 조회로 수정 필요 -->
            <div class="mileage_total">
              <span style="font-size: 28px"> {{ totalCoupons }}</span>
            </div>
            <div class="mileage_expire">
              <span style="font-size: 28px"> {{ expiringCoupons }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Tab UI -->
      <div class="mileage-section">
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

export default {
  name: 'MembershipAndCouponPage',
  components: { SideBarMyPage, ModalMembershipInfor, UDatepicker, CouponList, UPageable },
  async asyncData({ $axios }) {
    const initialPageSize = 5;

    const dataMembership = await $axios.$get('/user/membership/info');
    const mileageRes = await $axios.$get(`/user/membershipMileage/${dataMembership.account_id}`, {
      params: { page: 0, size: initialPageSize }
    });
    const totalMileage = mileageRes.totalMileage;

    const couponList = await $axios.$get('/user/coupons/usage');
    console.log(couponList);

    const usedCouponsList = couponList.filter((item) => (item.used_coupons?.length || 0) > 0);

    const availableCouponsList = couponList
      .map((item) => ({
        ...item,
        unused_coupons: (item.unused_coupons || []).filter((c) => !c.is_expired)
      }))
      .filter((item) => item.unused_coupons.length > 0);
    console.log('available', availableCouponsList?.length, 'used', usedCouponsList?.length);

    return {
      dataMembership,
      totalMileage,
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
      showModal: false
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
      const start = this.startDate ? dayjs(this.startDate).startOf('day') : null;
      const end = this.endDate ? dayjs(this.endDate).endOf('day') : null;

      const inRange = (d) => {
        if (!start || !end) return true;
        const t = dayjs(d);
        return t.isValid() && (t.isAfter(start) || t.isSame(start)) && (t.isBefore(end) || t.isSame(end));
      };

      if (this.activeTab === 'used') {
        const src = this.usedCouponsList || [];
        return src
          .map((item) => {
            const pool = (item.used_coupons || []).filter((c) => inRange(c.used_at || c.created_at));
            return { ...item, used_coupons: pool };
          })
          .filter((item) => (item.used_coupons || []).length > 0);
      }

      const src = this.availableCouponsList || [];
      return src
        .map((item) => {
          const pool = (item.unused_coupons || []).filter((c) => {
            const d = c.delivered_date || c.created_at;
            return d ? inRange(d) : true;
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
    this.applyPeriodFilter();
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
      this.couponPageIndex = 0;
    },
    applyPeriodFilter() {
      this.selectedFilter = 'custom';
      this.couponPageIndex = 0;
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin-bottom: 12rem;
}

.ticketing-head {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 1.8rem;
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
  width: 2300px;
  height: 200px !important;

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

@media screen and (min-width: 769px) {
  .container {
    display: flex;
    margin-bottom: 12.6rem;
    margin-top: 4.8rem;

    > div {
      width: 34.8rem;
      padding-right: 14.8rem;
    }

    > section {
      flex: 1 0 0;
    }
  }

  .ticketing-head {
    h2 {
      font-size: 3.2rem;
      font-weight: 500;
      line-height: 150%;
    }
  }

  .ticketing-body {
    margin-top: 2.6rem;
    margin-bottom: 2.6rem;
    .ticketing-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 2rem;
      padding: 1.6rem 2rem;

      i {
        font-size: 2.4rem;
      }

      p {
        font-size: 1.4rem;
        font-weight: 500;
        line-height: 160%;
      }

      a {
        font-size: 1.4rem;
        line-height: 160%;

        i {
          margin-left: 0.4rem;
          margin-right: 0;
          font-size: 2.4rem;
        }
      }
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
}
.membership_info {
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  width: 80%;
  max-width: 1000px;
  height: 100%;
  max-height: 300px;
  padding: 2rem;
  margin-top: 2rem;
  border: 1px solid #e6e6e6;
  background-color: #fff;
}
.membership_icon {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 20px;
  margin-left: 1.2rem;
}
.name_membership {
  display: flex;
  flex-direction: column;
  width: 500px;
  margin-top: 20px;
  margin-left: 10px;
  margin-right: 40px;
}
// .name_membership > div > p,
// .name_membership > div > div {
//   margin-bottom: 1rem;
// }
.name_class {
  font-size: 1.5em;
  margin-bottom: 3rem !important;
}
.mileage_condition {
  display: flex;
  flex-direction: row;
  gap: 50px;
  color: #111111;
}
.mileage_description {
  color: #666666;
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
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  margin-top: 10px;
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
.mileage_summary {
  display: flex;
  flex-direction: column;
  gap: 5rem;
  padding-left: 30px;
  border-left: 1px solid #ccc;
  margin-top: 20px;
}
.show_mileage {
  display: flex;
  flex-direction: column;
  gap: 5rem;
  padding-left: 30px;
  margin-top: 20px;
  margin-left: 60px;
  font-weight: bold;
  font-size: 16px;
}
.mileage-section {
  width: 80%;
  max-width: 1000px;
  padding-left: 24px;
  padding-right: 24px;
  box-sizing: border-box;
}
.tabs {
  display: flex;
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
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 1.5rem;
  margin-bottom: 3.5rem;
  padding: 8px 0;
  gap: 4px;
}
.filter-area button {
  flex: 1;
  min-width: 90px;
  padding: 6px 12px;
  text-align: center;
  border: 1px solid #cccccc;
  background-color: #ffffff;
  cursor: pointer;
}

.filter-area button.selected {
  background: #ffffff;
  border-color: #111111;
}
.date-range {
  display: flex;
  align-items: center;
  gap: 6px;
  ::v-deep(.date-picker) {
    .data-input {
      padding: 0 3rem 0 1.6rem;
      border: 1px solid #ccc;
      background-color: #fff;
      font-size: 1.4rem;
      max-height: 32.8px;
    }

    &.is-active .data-input {
      border-color: #111111;
    }
  }
}
.filter-submit {
  background-color: #111111 !important;
  color: #ffffff;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  max-width: 50px;
  cursor: pointer;
}
.coupon-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  border-top: 2px solid #111111;

  th,
  td {
    padding: 12px;
    text-align: center;
    word-wrap: break-word;
  }

  th {
    border-top: 1px solid #111111;
    border-bottom: 1px solid #d9d9d9;
  }

  td {
    border-top: 1px solid #d9d9d9;
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 200px;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 400px;
  }
  td:nth-child(2) {
    text-align: left;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 200px;
  }

  th:nth-child(4),
  td:nth-child(4),
  th:nth-child(5),
  td:nth-child(5) {
    width: 80px;
  }
  .coupon-list {
    display: flex;
    flex-direction: row;
    margin-top: 2rem;
    padding: auto;
  }
}
::v-deep(.pagination) {
  margin-top: 2.6rem !important;
}
</style>
