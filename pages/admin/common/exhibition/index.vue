<template>
  <div>
    <STitle emoji="frame">전시</STitle>
    <div class="search mb-28">
      <div class="mb-24">
        <SDropdown v-model="queryOptions.searchDateType" :option-list="dateOptionList" class="mr-16" />
        <SDatepicker v-model="queryOptions.startDate" :max="queryOptions.endDate" />
        <span class="ml-8 mr-8">~</span>
        <SDatepicker v-model="queryOptions.endDate" :min="queryOptions.startDate" />
        <SDivLine is-big />
        <SDropdown v-model="queryOptions.hall" :option-list="hallOptionList" class="mr-16">전시홀:</SDropdown>
        <SDivLine is-big />
        <SDropdown v-model="queryOptions.isEnabled" :option-list="enabledOptionList">노출:</SDropdown>
      </div>
      <div class="mb-24">
        <label>상태</label>
        <SCheckboxGroup v-model="queryOptions.state" :group-list="stateList">예정</SCheckboxGroup>
      </div>
      <div>
        <SSearchBar v-model="queryOptions.text" @search="onSearch()" />
        <SButton button-type="primary" @click="onSearch()">검색</SButton>
        <SButton @click="onSearch(true)">초기화</SButton>
      </div>
    </div>
    <div class="top-menus mb-16">
      <SLink to="/admin/common/exhibition/edit" class="mr-28">등록</SLink>
      <SDropdown v-model="queryOptions.size" :option-list="sizeOptionList" @change="onSelectSizeChange"
        >리스트 수:</SDropdown
      >
    </div>
    <SPageable :table-data="tableData" @getTableData="setCurrentPage">
      <template #data="{ data }">
        <table class="admin-table">
          <thead :class="{ 'data-none': !data || !data[0] }">
            <tr>
              <th>NO</th>
              <th>썸네일</th>
              <th>제목</th>
              <th>전시홀</th>
              <th>노출</th>
              <th>상태</th>
              <th>일정</th>
              <th>예매오픈</th>
              <th>총 입장 예정</th>
              <th>최초등록일시</th>
              <th>등록자</th>
              <th>수정일시</th>
              <th>수정자</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!data || !data[0]">
              <td colspan="13"><div>리스트가 없습니다.</div></td>
            </tr>
            <tr
              v-for="(item, index) in data"
              :key="item.id"
              @click="$router.push(`/admin/common/exhibition/${item.id}`)"
            >
              <td>
                <div>{{ tableData.startCount - index }}</div>
              </td>
              <td>
                <div class="img">
                  <img :src="getImage(item.thumbnail?.resizeImage?.small)" alt="" />
                </div>
              </td>
              <td>
                <div class="text-left">{{ item.title }}</div>
              </td>
              <td>
                <div>{{ item.halls.map((hall) => `${hall}홀`).join(', ') }}</div>
              </td>
              <td>
                <div>{{ item.isEnabled ? '노출' : '미노출' }}</div>
              </td>
              <td>
                <div><STag :type="item.state" /></div>
              </td>
              <td>
                <div>
                  <p>{{ $dayjs(item.startDate).format('YYYY-MM-DD') }}</p>
                  <p>~ {{ $dayjs(item.endDate).format('YYYY-MM-DD') }}</p>
                </div>
              </td>
              <td>
                <div>{{ $dayjs(item.bookingDate).format('YYYY-MM-DD') }}</div>
              </td>
              <td>
                <div>{{ item.total }}</div>
              </td>
              <td>
                <div>{{ $dayjs(item.createdDate).format('YYYY-MM-DD HH:mm') }}</div>
              </td>
              <td>
                <div>{{ item.createdName }}</div>
              </td>
              <td>
                <div>{{ $dayjs(item.lastModifiedDate).format('YYYY-MM-DD HH:mm') }}</div>
              </td>
              <td>
                <div>{{ item.lastModifiedName }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </SPageable>
  </div>
</template>

<script>
import STitle from '~/components/admin/commons/STitle';
import SPageable from '~/components/admin/commons/SPageable';
import SDropdown from '~/components/admin/commons/SDropdown';
import SButton from '~/components/admin/commons/SButton';
import SSearchBar from '~/components/admin/commons/SSearchBar';
import SDatepicker from '~/components/admin/commons/SDatepicker';
import SDivLine from '~/components/admin/commons/SDivLine';
import SCheckboxGroup from '~/components/admin/commons/SCheckboxGroup';
import SLink from '~/components/admin/commons/SLink';
import { EXHIBITION_STATE_TYPE } from '~/assets/js/types';
import STag from '~/components/admin/commons/STag';

export default {
  name: 'ExhibitionPage',
  components: { STag, SLink, SCheckboxGroup, SDivLine, SDatepicker, STitle, SPageable, SDropdown, SButton, SSearchBar },
  layout: 'admin/default',
  data() {
    return {
      dateOptionList: [
        { value: 'CREATED_DATE', label: '등록일시' },
        { value: 'LAST_MODIFIED_DATE', label: '수정일시' },
        { value: 'SCHEDULE', label: '일정' }
      ],
      enabledOptionList: [
        { value: null, label: '전체' },
        { value: true, label: '노출' },
        { value: false, label: '미노출' }
      ],
      sizeOptionList: [
        { value: 20, label: '20개' },
        { value: 30, label: '30개' },
        { value: 50, label: '50개' }
      ],
      queryOptions: {
        searchDateType: this.$route.query.searchDateType || 'CREATED_DATE',
        startDate: this.$route.query.startDate || '',
        endDate: this.$route.query.endDate || '',
        hall: this.$route.query.hall || null,
        isEnabled:
          this.$route.query.isEnabled === 'true' ? true : this.$route.query.isEnabled === 'false' ? false : null,
        state: typeof this.$route.query.state === 'string' ? [this.$route.query.state] : this.$route.query.state || [],
        text: this.$route.query.text || '',
        size: Number(this.$route.query.size) || 20
      },
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

    this.tableData = await this.$axios.$get('/admin/exhibitions', {
      params: {
        ...this.queryOptions,
        startDate: this.queryOptions.startDate ? `${this.queryOptions.startDate} 00:00:00` : '',
        endDate: this.queryOptions.endDate ? `${this.queryOptions.endDate} 23:59:59` : ''
      }
    });
    this.tableData.startCount = this.tableData.totalElements - this.tableData.number * this.tableData.size;
  },
  computed: {
    stateList() {
      return Object.entries(EXHIBITION_STATE_TYPE).map(([key, value]) => ({
        label: value,
        value: key
      }));
    },
    hallOptionList() {
      const hallList = this.$store.state.HALL_LIST.map((hall) => ({ value: hall, label: `${hall} 전시홀` }));
      hallList.unshift({ value: null, label: '전체' });
      return hallList;
    }
  },
  methods: {
    getImage(imageUrl) {
      return imageUrl ? this.$store.state.BASE_URL + imageUrl : require('~/assets/img/thumbnail_default.jpg');
    },
    setCurrentPage(currentPage) {
      if (!this.$fetchState.pending) {
        this.queryOptions.page = currentPage;
        this.$fetch();
      }
    },
    onSelectSizeChange() {
      if (!this.$fetchState.pending) {
        this.queryOptions.page = 0;
        this.$fetch();
      }
    },
    onSearch(isReset) {
      if (!this.$fetchState.pending) {
        if (isReset) {
          this.queryOptions.searchDateType = 'CREATED_DATE';
          this.queryOptions.startDate = '';
          this.queryOptions.endDate = '';
          this.queryOptions.hall = null;
          this.queryOptions.isEnabled = null;
          this.queryOptions.state = [];
          this.queryOptions.text = '';
        }
        this.queryOptions.page = 0;
        this.$fetch();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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

  > div:not(:last-child) {
    padding-bottom: 2.4rem;
    border-bottom: 1px solid var(--color-grey-2);
  }

  label {
    font-weight: 500;
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
    &:first-of-type {
      width: 4%;
    }
    &:nth-of-type(2) {
      width: 11%;
    }
    &:nth-of-type(3) {
      width: 16%;
    }
    &:nth-of-type(4) {
      width: 6%;
    }
    &:nth-of-type(5) {
      width: 5%;
    }
    &:nth-of-type(6) {
      width: 5%;
    }
    &:nth-of-type(7) {
      width: 11%;
    }
    &:nth-of-type(8) {
      width: 7%;
    }
    &:nth-of-type(9) {
      width: 7%;
    }
    &:nth-of-type(10) {
      width: 9%;
    }
    &:nth-of-type(11) {
      width: 5%;
    }
    &:nth-of-type(12) {
      width: 9%;
    }
    &:last-of-type {
      width: 5%;
    }
  }
}
</style>
