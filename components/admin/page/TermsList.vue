<template>
  <div>
    <STitle emoji="bookmark">{{ titleText }}</STitle>
    <div class="search mb-28">
      <SSearchBar v-model="searchText" @search="onSearch()" />
      <SButton button-type="primary" @click="onSearch()">검색</SButton>
      <SButton @click="onSearch(true)">초기화</SButton>
    </div>
    <div class="top-menus mb-16">
      <SLink :to="`${baseUrl}/edit`" class="mr-28">등록</SLink>
      <SDropdown v-model="selectedOption" :option-list="optionList" @change="onListCount">리스트 수:</SDropdown>
    </div>
    <SPageable
      :table-data="tableData"
      @getTableData="
        (page) => {
          $emit('changePage', page);
        }
      "
    >
      <template #data="{ data }">
        <table class="admin-table">
          <thead>
            <tr>
              <th>NO</th>
              <th>제목</th>
              <th>게시일</th>
              <th>등록자</th>
              <th>등록일시</th>
              <th>수정자</th>
              <th>수정일시</th>
              <th>노출여부</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!data || !data[0]">
              <td colspan="8"><div>리스트가 없습니다.</div></td>
            </tr>
            <tr v-for="(item, index) in data" :key="item.id" @click="onGoDetail(item.id)">
              <td>
                <div>{{ tableData.startCount - index }}</div>
              </td>
              <td>
                <div class="text-left">{{ item.isProgress ? '[진행] ' : '' }}{{ item.title }}</div>
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
                <div>{{ item.isEnabled ? '노출' : '미 노출' }}</div>
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
import SLink from '~/components/admin/commons/SLink';

export default {
  name: 'TermsList',
  components: { SLink, STitle, SPageable, SDropdown, SButton, SSearchBar },
  props: {
    // pageType: PRIVACY | AGREE | SERVICE | REFUND | VIDEO
    pageType: {
      type: String,
      required: false,
      default: 'PRIVACY'
    },
    tableData: {
      type: Object,
      required: false,
      default: () => null
    }
  },
  data() {
    return {
      titleText: '',
      baseUrl: '',
      emojiType: '',
      searchText: '',
      optionList: [
        { value: 20, label: '20개' },
        { value: 30, label: '30개' },
        { value: 50, label: '50개' }
      ],
      selectedOption: Number(this.$route.query.size) || 20
    };
  },
  created() {
    let titleText = '';
    let baseUrl = '';

    switch (this.pageType) {
      case 'PRIVACY':
        titleText = '개인정보처리방침';
        baseUrl = '/admin/terms/privacy';
        break;
      case 'AGREE':
        titleText = '개인정보 수집 및 이용 동의서';
        baseUrl = '/admin/terms/agree';
        break;
      case 'SERVICE':
        titleText = '서비스 이용약관';
        baseUrl = '/admin/terms/service';
        break;
      case 'REFUND':
        titleText = '취소 및 환불약관';
        baseUrl = '/admin/terms/refund';
        break;
      case 'VIDEO':
        titleText = '영상정보처리기기 운영 관리방침';
        baseUrl = '/admin/terms/video';
        break;
      default:
        titleText = '올바르지 않은 페이지 타입';
        break;
    }

    this.titleText = titleText;
    this.baseUrl = baseUrl;
  },
  methods: {
    onGoDetail(id) {
      this.$router.push(`${this.baseUrl}/${id}`);
    },
    onListCount() {
      this.$emit('dropdownChange', this.selectedOption);
    },
    onSearch(isReset) {
      if (isReset) {
        this.searchText = '';
      }

      this.$emit('search', this.searchText);
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
    &:first-of-type {
      width: 4%;
    }
    &:nth-of-type(2) {
      width: 20%;
    }
    &:nth-of-type(3) {
      width: 10%;
    }
    &:nth-of-type(4) {
      width: 10%;
    }
    &:nth-of-type(5) {
      width: 10%;
    }
    &:nth-of-type(6) {
      width: 10%;
    }
    &:nth-of-type(7) {
      width: 10%;
    }
    &:last-of-type {
      width: 7%;
    }
  }
}
</style>
