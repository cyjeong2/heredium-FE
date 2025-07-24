<template>
  <main class="container">
    <SideBarMyPage />
    <section>
      <div class="ticketing-head">
        <i class="pc uic-arrow_pre" />
        <h3 @click="goBack">멤버십 · 쿠폰함 확인</h3>
      </div>
      <div v-if="dataListMileage !== null" class="mileage-summary">
        <div style="font-size: 30px">마일리지</div>
        <br />
        <div class="total_mileage" style="font-size: 50px">{{ totalMileage }} / 70 점</div>
      </div>
      <span class="table_title" style="font-size: 18px">마일리지 적립 내역</span>
      <hr class="divider" />
      <SPageable :table-data="dataListMileage" @getTableData="handlePageChange">
        <template #data="{ data }">
          <div class="mileage-table">
            <div v-if="!dataListMileage || dataListMileage.length === 0"><no-mileage /></div>
            <div v-for="item in data" :key="item.id" class="mileage-row">
              <div class="left-cell">
                <span>
                  <span v-if="item.mileageAmount > 0">😊&nbsp;</span>
                  <span v-else-if="item.mileageAmount < 0">🙂&nbsp;</span>
                  {{ formatMileageAmount(item.mileageAmount) }}
                </span>
              </div>
              <div class="right-cell">
                <div>{{ formatTypeCategory(item.type, item.category) }}</div>
                <div>일자 {{ formatDate(item.createdDate) }}</div>
                <div v-if="item.expirationDate">유효기간 {{ formatDate(item.expirationDate) }}</div>
              </div>
            </div>
          </div>
        </template>
      </SPageable>
    </section>
  </main>
</template>

<script>
import SideBarMyPage from '~/components/user/page/SideBarMyPage.vue';
import NoMileage from '~/components/user/page/membership/NoMileage.vue';
import SPageable from '~/components/admin/commons/SPageable';

export default {
  name: 'CouponHistory',
  components: { SideBarMyPage, SPageable, NoMileage },

  data() {
    return {
      dataListMileage: null,
      totalMileage: 0,
      currentPage: 0,
      pageSize: 5
    };
  },
  mounted() {
    const accountId = this.$route.query.accountId;
    if (!accountId) {
      console.error('accountId가 없습니다!');
      return;
    }
    this.getMileageList(accountId);
  },
  methods: {
    async getMileageList(accountId, page = 0) {
      try {
        const res = await this.$axios.$get(`/user/membershipMileage/${accountId}`, {
          params: { page, size: this.pageSize }
        });

        const totalPages = Math.ceil(res.totalElements / this.pageSize);

        this.dataListMileage = {
          ...res,
          pageSize: this.pageSize,
          totalPages,
          number: page,
          first: page === 0,
          last: page === totalPages - 1
        };
        this.totalMileage = res.totalMileage || 0;
        this.currentPage = res.number || page;
      } catch (error) {
        console.error('마일리지 불러오기 실패', error);
        this.dataListMileage = null;
        this.totalMileage = 0;
      }
    },
    handlePageChange(pageIndex) {
      const accountId = this.$route.query.accountId;
      this.getMileageList(accountId, pageIndex);
    },
    refreshMileageList() {
      this.getMileageList(this.$route.query.accountId, this.currentPage);
    },
    goBack() {
      this.$router.push('/mypage/purchase/membership');
    },
    formatTypeCategory(type, category) {
      const typeMap = {
        0: '적립',
        1: '승급',
        2: '만료소멸',
        3: '환불소멸',
        4: '환불완료'
      };
      const categoryMap = {
        0: '전시',
        1: '프로그램',
        2: '커피',
        3: '아트숍'
      };

      if (type === 1) {
        return '승급(CN2)';
      }
      return `${typeMap[type]}(${categoryMap[category]})`;
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString();
    },
    formatMileageAmount(amount) {
      if (typeof amount !== 'number') return amount;
      const sign = amount > 0 ? '+' : '';
      return `${sign}${amount.toLocaleString()}`;
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
  align-items: left;
  margin-top: -20px;
  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    line-height: 1.8rem;
  }
}

.ticketing-body {
  padding-top: 2rem;
  margin-top: 1.3rem;
  border-top: 0.1rem solid var(--color-black);
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
    padding-bottom: 2.2rem;
    h2 {
      display: flex;
      font-size: 3.2rem;
      font-weight: 500;
      line-height: 150%;
      align-items: center;
      cursor: pointer;
      margin-bottom: 2.2rem;

      i {
        font-size: 3.2rem;
        margin-right: 1.2rem;
      }
    }
  }

  .ticketing-body {
    border-top: 0.1rem solid var(--color-black);
  }
}

.mileage-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #ddd;
  min-height: 4rem;
}
.left-cell {
  width: 30%;
  font-weight: bold;
  font-size: 2.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.right-cell {
  width: 70%;
  display: flex;
  flex-direction: column;
  font-size: 1.4rem;
  justify-content: center;
}
.mileage-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 40px auto;
  text-align: center;
}
.table_title {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
}

.pagination {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  button {
    min-width: 2.5rem;
    height: 2.5rem;
    margin-right: 0.5rem;
    font-size: 2rem;
    cursor: pointer;

    &.active {
      font-weight: bold;
    }
  }
}
</style>
