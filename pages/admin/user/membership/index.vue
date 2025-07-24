<template>
  <div>
    <STitle emoji="people">멤버십 회원</STitle>
    <div class="search mb-28">
      <div class="mb-24">
        <SDropdown v-model="queryOptions.searchDateType" class="mr-16" :option-list="dateOptionList" />
        <SDatepicker v-model="queryOptions.signUpDateFrom" w-size="large" :max="queryOptions.signUpDateTo" />
        <span class="ml-8 mr-8">~</span>
        <SDatepicker v-model="queryOptions.signUpDateTo" w-size="large" :min="queryOptions.signUpDateFrom" />
        <SDivLine is-big />
        <SDropdown v-model="queryOptions.isAgreeToReceiveMarketing" :option-list="marketingOptionList"
          >마케팅 수신 동의:</SDropdown
        >
      </div>
      <div>
        <SSearchBar v-model="queryOptions.text" @search="onSearch" />
        <SButton button-type="primary" @click="onSearch()">검색</SButton>
        <SButton @click="onSearch(true)">초기화</SButton>
      </div>
    </div>
    <div class="top-menus mb-16">
      <SButton w-size="large" class="mr-16" @click="downloadExcel">다운로드</SButton>
      <!-- <SButton w-size="large" class="mr-16" @click="downloadMileage">마일리지 내역<br>다운로드</SButton> -->
      <SDropdown v-model="queryOptions.size" :option-list="pageSizeList" @change="onSelectSizeChange"
        >리스트 수:</SDropdown
      >
    </div>
    <SPageable :table-data="tableData" @getTableData="onChangePage">
      <template #data="{ data }">
        <table class="admin-table">
          <thead>
            <tr>
              <th>No</th>
              <th>멤버십 구분</th>
              <th>계정</th>
              <th>이름</th>
              <th>연락처</th>
              <th>멤버십<br>횟수</th>
              <th>전시<br>사용횟수</th>
              <th>프로그램<br>사용횟수</th>
              <th>커피<br>사용횟수</th>
              <th>마일리지<br>내역</th>
              <!-- <th>마케팅<br>수신동의</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-if="!data || !data[0]">
              <td colspan="11"><div>리스트가 없습니다.</div></td>
            </tr>
            <tr v-for="(item, index) in data" :key="item.account_id" @click="onGoDetail(item.account_id)">
              <!-- No -->
              <td>
                <div>{{ tableData.startCount + index + 1 }}</div>
              </td>
              <!-- 멤버십 구분 -->
              <td>
                <div>{{ item.membership_name }}</div>
              </td>
              <!-- 계정 -->
              <td>
                <div>{{ item.email }}</div>
              </td>
              <!-- 이름 -->
              <td>
                <div>{{ item.name }}</div>
              </td>
              <!-- 연락처 -->
              <td>
                <div>{{ formatPhone(item.phone) }}</div>
              </td>
              <!-- 멤버십횟수 -->
              <td>
                <div>{{ item.number_of_memberships }}</div>
              </td>
              <!-- 전시 사용횟수 -->
              <td>
                <div>{{ item.number_of_exhibitions_used }}</div>
              </td>
              <!-- 프로그램 사용횟수 -->
              <td>
                <div>{{ item.number_of_programs_used }}</div>
              </td>
              <!-- 커피 사용횟수 -->
              <td>
                <div>{{ item.number_of_coffee_used }}</div>
              </td>
              <!-- 마일리지 내역 -->
              <td>
                <div>{{ item.mileage_sum }}</div>
              </td>
              <!-- 마케팅 수신동의 -->
              <!-- <td>
                <div>{{ item.is_agree_to_receive_marketing ? '동의' : '미동의' }}</div>
              </td> -->
            </tr>
          </tbody>
        </table>
      </template>
    </SPageable>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import STitle from '~/components/admin/commons/STitle';
import SDropdown from '~/components/admin/commons/SDropdown';
import SButton from '~/components/admin/commons/SButton';
import SSearchBar from '~/components/admin/commons/SSearchBar';
import SDatepicker from '~/components/admin/commons/SDatepicker';
import SDivLine from '~/components/admin/commons/SDivLine';
import { PAGE_SIZE_OPTIONS } from '~/assets/js/types';
import SPageable from '~/components/admin/commons/SPageable';
import { API_ERROR } from '~/utils/message';

export default {
  name: 'MembershipUserPage',

  components: { SDatepicker, STitle, SDropdown, SButton, SSearchBar, SDivLine, SPageable },
  directives: {},

  filters: {},
  layout: 'admin/default',
  props: {},
  data() {
    const INIT_QUERY_OPTIONS = {
      page: this.$route.query.page || 0,
      size: Number(this.$route.query.size) || 20,
      text: this.$route.query.text || '',
      searchDateType: this.$route.query.searchDateType || 'CREATED_DATE',
      signUpDateFrom: this.$route.query.signUpDateFrom || '',
      signUpDateTo: this.$route.query.signUpDateTo || '',
      isAgreeToReceiveMarketing: this.$route.query.isAgreeToReceiveMarketing || null
    };

    return {
      initQueryOptions: INIT_QUERY_OPTIONS,
      queryOptions: { ...INIT_QUERY_OPTIONS },
      queryOptionsSaved: { ...INIT_QUERY_OPTIONS },
      marketingOptionList: [
        { value: null, label: '전체' },
        { value: true, label: '동의' },
        { value: false, label: '미동의' }
      ],
      dateOptionList: [{ value: 'CREATED_DATE', label: '가입일시' }],
      pageSizeList: [...PAGE_SIZE_OPTIONS],
      tableData: null
    };
  },
  async fetch() {
    await this.$router
      .replace({
        path: this.$route.path,
        query: this.queryOptions
      })
      .catch(() => {});
    try {
      const signUpDateFrom = this.queryOptions.signUpDateFrom
        ? this.$dayjs(this.queryOptions.signUpDateFrom).format('YYYY-MM-DD 00:00:00')
        : '';
      const signUpDateTo = this.queryOptions.signUpDateTo
        ? this.$dayjs(this.queryOptions.signUpDateTo).format('YYYY-MM-DD 23:59:59')
        : '';

      this.tableData = await this.$axios.$get('/admin/memberships/users/active', {
        params: {
          ...this.queryOptions,
          signUpDateFrom,
          signUpDateTo
        }
      });
      this.tableData.startCount = this.tableData.number * this.tableData.size;
      this.queryOptionsSaved = cloneDeep(this.queryOptions);
    } catch (error) {
      console.error(API_ERROR, error)
    }
  },
  methods: {
    onGoDetail(id) {
      this.$router.push(`/admin/user/membership/detail/${id}`);
    },
    onChangePage(page) {
      if (!this.$fetchState.pending) {
        this.queryOptions.page = page;
        this.$fetch();
      }
    },
    onSearch(isReset) {
      if (isReset) {
        this.queryOptions = { ...this.initQueryOptions };
      }
      this.queryOptions.page = 0;
      if (!this.$fetchState.pending) {
        this.$fetch();
      }
    },
    onSelectSizeChange() {
      if (!this.$fetchState.pending) {
        this.queryOptions.page = 0;
        this.$fetch();
      }
    },
    downloadExcel() {
      const fileName = '멤버십 회원';
      const signUpDateFrom = this.queryOptionsSaved.signUpDateFrom
        ? this.$dayjs(this.queryOptionsSaved.signUpDateFrom).format('YYYY-MM-DD 00:00:00')
        : '';
      const signUpDateTo = this.queryOptionsSaved.signUpDateTo
        ? this.$dayjs(this.queryOptionsSaved.signUpDateTo).format('YYYY-MM-DD 23:59:59')
        : '';

      this.$axios
        .$get('/admin/memberships/users/active/excel', {
          responseType: 'blob',
          params: {
            ...this.queryOptionsSaved,
            fileName,
            signUpDateFrom,
            signUpDateTo
          }
        })
        .then((res) => {
          const href = URL.createObjectURL(res);
          const link = document.createElement('a');

          link.href = href;
          link.setAttribute('download', `${fileName}.XLSX`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(href);
        });
    },
    // downloadMileage(){
    //   alert('마일리지 내역 다운로드')
    // },
    formatPhone(phone) {
      if (!phone) return '';
      // 1) 숫자만 추출
      const digits = phone.replace(/\D+/g, '');
      // 2) 2~3 / 3~4 / 4 자리 그룹으로 나눠 하이픈 삽입
      return digits.replace(
        /^(\d{2,3})(\d{3,4})(\d{4})$/,
        '$1-$2-$3'
      );
    },
  }
};
</script>

<style scoped lang="scss">
.search {
  width: 100%;
  padding: 2.8rem 3.2rem;
  background: #ffffff;
  box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.06);
  border-radius: 0.3rem;

  > div {
    display: flex;
    align-items: center;
  }

  > div:first-child {
    padding-bottom: 2.4rem;
    border-bottom: 1px solid var(--color-grey-2);
  }

  label {
    margin-right: 2.8rem;
  }

  button + button {
    margin-left: 0.8rem;
  }
}
.top-menus {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.admin-table {
  th {
    /* NO */
    &:first-of-type {
      width: 60px;
      min-width: 60px;
    }
    /* Membership */
    &:nth-of-type(2) {
      width: 207px;
      min-width: 207px;
    }
    /* email */
    &:nth-of-type(3) {
      width: 15vw;
      min-width: 200px;
    }
    /* Name */
    &:nth-of-type(4) {
      width: 120px;
      min-width: 120px;
    }
    /* Phone */
    &:nth-of-type(5) {
      width: 130px;
      min-width: 130px;
    }
    /* Number of membership */
    &:nth-of-type(6) {
      width: 80px;
      min-width: 80px;
    }
    /* Number of display uses */
    &:nth-of-type(7) {
      width: 80px;
      min-width: 80px;
    }
    /* Number of program uses */
    &:nth-of-type(8) {
      width: 80px;
      min-width: 80px;
    }
    /* Number of drink uses */
    &:nth-of-type(9) {
      width: 80px;
      min-width: 80px;
    }
     /* 마일리지 내역 */
    // &:nth-of-type(10) {
    //   width: 80px;
    //   min-width: 80px;
    // }
    /* Agree to receive marketing */
    &:last-of-type {
      width: 80px;
      min-width: 80px;
    }
  }
}
</style>
