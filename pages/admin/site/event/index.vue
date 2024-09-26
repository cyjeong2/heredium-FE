<template>
  <div>
    <STitle emoji="gift">이벤트</STitle>
    <SProgressTab v-model="queryOptions.isProgress" class="mb-24" @input="onProgress" />
    <div class="search mb-28">
      <SSearchBar v-model="searchText" class="mr-28" @search="onSearch()" />
      <SButton button-type="primary" class="mr-8" @click="onSearch()">검색</SButton>
      <SButton @click="onSearch(true)">초기화</SButton>
    </div>
    <div class="top-menus mb-16" :class="{ 'is-end': !queryOptions.isProgress }">
      <SToggle v-if="queryOptions.isProgress" v-model="queryOptions.isShowDisabled" @input="onToggle">
        미 노출 리스트 보기
      </SToggle>
      <div>
        <SLink to="/admin/site/event/edit" button-type="primary" class="mr-28">등록</SLink>
        <SDropdown v-model="selectedOption" :option-list="optionList" @change="onSelectSizeChange"
          >리스트 수:</SDropdown
        >
      </div>
    </div>
    <SPageable :table-data="tableData" @getTableData="setCurrentPage">
      <template #data="{ data }">
        <table class="admin-table">
          <thead>
            <tr>
              <th>No</th>
              <th>썸네일</th>
              <th class="text-left">제목</th>
              <th>상태</th>
              <th>진행기간</th>
              <th>등록자</th>
              <th>등록 일시</th>
              <th>수정자</th>
              <th>수정 일시</th>
              <th>노출 여부</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!data || !data[0]">
              <td colspan="100%"><div>리스트가 없습니다.</div></td>
            </tr>
            <tr v-for="(item, index) in data" :key="item.id" @click="onGoDetail(`/admin/site/event/${item.id}`)">
              <td>
                <div>{{ tableData.startCount - index }}</div>
              </td>
              <td>
                <div class="img">
                  <img :src="getImage(item?.thumbnail)" :alt="`${item.title}`" />
                </div>
              </td>
              <td>
                <div class="text-left">{{ item.title }}</div>
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
                <div>{{ item.createdName }}</div>
              </td>
              <td>
                <div>{{ $dayjs(item.createdDate).format('YYYY-MM-DD HH:mm') }}</div>
              </td>
              <td>
                <div>{{ item.lastModifiedName }}</div>
              </td>
              <td>
                <div>{{ $dayjs(item.lastModifiedDate).format('YYYY-MM-DD HH:mm') }}</div>
              </td>
              <td>
                <div>{{ item.isEnabled ? '노출' : '미노출' }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </SPageable>
  </div>
</template>

<script>
import SLink from '~/components/admin/commons/SLink';
import SButton from '~/components/admin/commons/SButton';
import SProgressTab from '~/components/admin/commons/SProgressTab';
import STitle from '~/components/admin/commons/STitle';
import SSearchBar from '~/components/admin/commons/SSearchBar';
import SPageable from '~/components/admin/commons/SPageable';
import SDropdown from '~/components/admin/commons/SDropdown';
import SToggle from '~/components/admin/commons/SToggle';
import STag from '~/components/admin/commons/STag';

export default {
  name: 'EventPage',
  components: { STag, SLink, SButton, SProgressTab, STitle, SToggle, SSearchBar, SPageable, SDropdown },
  layout: 'admin/default',
  data() {
    return {
      searchText: '',
      baseUrl: '/admin/site/event',
      optionList: [
        { value: 20, label: '20개' },
        { value: 30, label: '30개' },
        { value: 50, label: '50개' }
      ],
      selectedOption: 20,
      queryOptions: {
        page: this.$route.query.page || 0,
        size: Number(this.$route.query.size) || 20,
        text: this.$route.query.text || '',
        isProgress: this.$route.query.isProgress !== 'false',
        isShowDisabled: this.$route.query.isShowDisabled === 'true'
      },
      tableData: {}
    };
  },
  async fetch() {
    this.$router
      .replace({
        path: this.$route.path,
        query: this.queryOptions
      })
      .catch(() => {});

    this.tableData = await this.$axios.$get('/admin/events', {
      params: this.queryOptions
    });
    this.tableData.startCount = this.tableData.totalElements - this.tableData.number * this.tableData.size;
  },
  methods: {
    getImage(image) {
      return image?.resizeImage?.small
        ? `${this.$store.state.BASE_URL}${image.resizeImage?.small}`
        : require('~/assets/img/thumbnail_default.jpg');
    },
    onGoDetail(path) {
      this.$router.push(path);
    },
    setCurrentPage(currentPage) {
      if (!this.$fetchState.pending) {
        this.queryOptions.page = currentPage;
        this.$fetch();
      }
    },
    onSelectSizeChange() {
      if (!this.$fetchState.pending) {
        this.queryOptions.size = this.selectedOption;
        this.queryOptions.page = 0;
        this.$fetch();
      }
    },
    onSearch(isReset) {
      if (isReset) {
        this.searchText = '';
      }
      this.queryOptions.page = 0;
      if (!this.$fetchState.pending) {
        this.queryOptions.text = this.searchText;
        this.$fetch();
      }
    },
    onProgress() {
      if (!this.$fetchState.panding) {
        this.$fetch();
      }
    },
    onToggle() {
      if (!this.$fetchState.panding) {
        this.$fetch();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  width: 100%;
  padding: 2.8rem 3.2rem;
  background: #ffffff;
  box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.06);
  border-radius: 0.3rem;
}

.top-menus {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &.is-end {
    justify-content: flex-end;
  }

  div {
    display: flex;
    align-items: center;
  }
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
      width: 18%;
    }
    &:nth-of-type(4) {
      width: 8%;
    }
    &:nth-of-type(5) {
      width: 15%;
    }
    &:nth-of-type(6) {
      width: 8%;
    }
    &:nth-of-type(7) {
      width: 10%;
    }
    &:nth-of-type(8) {
      width: 8%;
    }
    &:nth-of-type(9) {
      width: 10%;
    }
    &:last-of-type {
      width: 8%;
    }
  }
}
</style>
