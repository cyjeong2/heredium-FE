<template>
  <div>
    <STitle emoji="loudspeaker">공지사항</STitle>
    <div class="search mb-28">
      <SSearchBar v-model="queryOptions.text" class="mr-28" @search="onSearch" />
      <SButton button-type="primary" class="mr-8" @click="onSearch()">검색</SButton>
      <SButton @click="onSearch(true)">초기화</SButton>
    </div>
    <div class="top-menus mb-16">
      <SLink to="/admin/site/notice/edit" button-type="primary" class="mr-28">등록</SLink>
      <SDropdown v-model="queryOptions.size" :option-list="optionList" @change="onSelectSizeChange"
        >리스트 수:</SDropdown
      >
    </div>
    <SPageable :table-data="tableData" @getTableData="setCurrentPage">
      <template #data="{ data }">
        <table class="admin-table">
          <thead>
            <tr>
              <th>No</th>
              <th class="text-left">제목</th>
              <th>게시일</th>
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
            <tr v-for="(item, index) in data" :key="item.id" @click="onGoDetail(`/admin/site/notice/${item.id}`)">
              <td>
                <div>{{ tableData.startCount - index }}</div>
              </td>
              <td>
                <div class="text-left">
                  <span>{{ item.isNotice ? '[공지]' : '' }}</span
                  >{{ item.title }}
                </div>
              </td>
              <td>
                <div>{{ $dayjs(item.postDate).format('YYYY-MM-DD') }}</div>
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
                <div>
                  {{ item.isEnabled ? '노출' : '미노출' }}
                </div>
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
import STitle from '~/components/admin/commons/STitle';
import SSearchBar from '~/components/admin/commons/SSearchBar';
import SPageable from '~/components/admin/commons/SPageable';
import SDropdown from '~/components/admin/commons/SDropdown';
import { PAGE_SIZE_OPTIONS } from '~/assets/js/types';

export default {
  name: 'NoticePage',
  components: { SLink, SButton, STitle, SSearchBar, SPageable, SDropdown },
  layout: 'admin/default',
  data() {
    return {
      baseUrl: '/admin/site/notice',
      optionList: [...PAGE_SIZE_OPTIONS],
      queryOptions: {
        page: this.$route.query.page || 0,
        size: Number(this.$route.query.size) || 20,
        text: this.$route.query.text || ''
      },
      tableData: {}
    };
  },
  async fetch() {
    this.$router
      .replace({
        path: this.$route.path,
        query: {
          page: this.queryOptions.page,
          size: this.queryOptions.size,
          text: this.queryOptions.text
        }
      })
      .catch(() => {});
    this.tableData = await this.$axios.$get(`/admin/notices`, {
      params: this.queryOptions
    });
    this.tableData.startCount = this.tableData.totalElements - this.tableData.number * this.tableData.size;
  },
  methods: {
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
        this.queryOptions.page = 0;
        this.$fetch();
      }
    },
    onSearch(isReset) {
      if (isReset) {
        this.queryOptions.text = '';
      }
      this.queryOptions.page = 0;
      if (!this.$fetchState.pending) {
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
  justify-content: flex-end;
  align-items: center;
}

.admin-table {
  th {
    &:first-of-type {
      width: 4%;
    }
    &:nth-of-type(2) {
      width: 21%;
    }
    &:nth-of-type(3) {
      width: 15%;
    }
    &:nth-of-type(4) {
      width: 10%;
    }
    &:nth-of-type(5) {
      width: 15%;
    }
    &:nth-of-type(6) {
      width: 10%;
    }
    &:nth-of-type(7) {
      width: 15%;
    }
    &:last-of-type {
      width: 10%;
    }
  }
}
</style>
