<template>
  <div>
    <STitle emoji="people">{{ titleText }}</STitle>
    <div class="search mb-28">
      <div v-if="pageType !== 'HANA'" class="mb-24">
        <SDropdown v-model="cloneQueryOptions.searchDateType" class="mr-16" :option-list="dateOptionList" />
        <SDatepicker v-model="cloneQueryOptions.startDate" w-size="large" :max="cloneQueryOptions.endDate" />
        <span class="ml-8 mr-8">~</span>
        <SDatepicker v-model="cloneQueryOptions.endDate" w-size="large" :min="cloneQueryOptions.startDate" />
        <SDivLine is-big />
        <SDropdown v-model="cloneQueryOptions.isMarketingReceive" :option-list="marketingOptionList"
          >마케팅 수신 동의:</SDropdown
        >
      </div>
      <div :style="pageType === 'HANA' ? { border: 'none', padding: 0 } : ''">
        <SSearchBar v-model="cloneQueryOptions.text" @search="onSearch" />
        <SButton button-type="primary" @click="onSearch()">검색</SButton>
        <SButton @click="onSearch(true)">초기화</SButton>
      </div>
    </div>
    <div class="top-menus mb-16">
      <SButton v-if="pageType !== 'HANA'" button-type="primary" w-size="large" class="mr-16" @click="downloadExcel"
        >엑셀다운로드</SButton
      >
      <SDropdown v-model="cloneQueryOptions.size" :option-list="optionList" @change="onSelectSizeChange"
        >리스트 수:</SDropdown
      >
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
        <table class="admin-table" :class="{ nonactive: pageType === 'NONACTIVE' }">
          <thead>
            <tr v-if="pageType === 'HANA'">
              <th>NO</th>
              <th>고객번호</th>
              <th>이름</th>
              <th>전시 관람 횟수</th>
            </tr>
            <tr v-else>
              <th>NO</th>
              <th>아이디</th>
              <th>이름</th>
              <th>연락처</th>
              <th>가입일시</th>
              <th>{{ pageType === 'COMMON' ? '최근 로그인 일시' : '휴면 전환 일시' }}</th>
              <th>마케팅 수신 동의</th>
              <th>전시 관람 횟수</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!data || !data[0]">
              <td :colspan="pageType === 'HANA' ? '4' : '8'"><div>리스트가 없습니다.</div></td>
            </tr>
            <template v-if="pageType === 'HANA'">
              <tr v-for="(item, index) in data" :key="item.id" @click="onGoDetail(item.id)">
                <td>
                  <div>{{ tableData.startCount - index }}</div>
                </td>
                <td>
                  <div>{{ item.hanaBankUuid }}</div>
                </td>
                <td>
                  <div>{{ item.name }}</div>
                </td>
                <td>
                  <div>{{ item.visitCount }}</div>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="(item, index) in data" :key="item.id" @click="onGoDetail(item.id)">
                <td>
                  <div>{{ tableData.startCount - index }}</div>
                </td>
                <td>
                  <div class="text-left">{{ item.email }}</div>
                </td>
                <td>
                  <div>{{ item.name }}</div>
                </td>
                <td>
                  <div>{{ item.phone }}</div>
                </td>
                <td>
                  <div>{{ item.createdDate }}</div>
                </td>
                <td>
                  <div>{{ pageType === 'COMMON' ? item.lastLoginDate : item.sleepDate }}</div>
                </td>
                <td>
                  <div>{{ item.isMarketingReceive ? '동의' : '미동의' }}</div>
                </td>
                <td>
                  <div>{{ item.visitCount }}</div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </template>
    </SPageable>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import STitle from '~/components/admin/commons/STitle';
import SPageable from '~/components/admin/commons/SPageable';
import SDropdown from '~/components/admin/commons/SDropdown';
import SButton from '~/components/admin/commons/SButton';
import SSearchBar from '~/components/admin/commons/SSearchBar';
import SDatepicker from '~/components/admin/commons/SDatepicker';
import SDivLine from '~/components/admin/commons/SDivLine';
import { GENDER_TYPE, PAGE_SIZE_OPTIONS } from '~/assets/js/types';

export default {
  name: 'UserList',
  components: { SDivLine, SDatepicker, STitle, SPageable, SDropdown, SButton, SSearchBar },
  props: {
    // pageType: COMMON | NONACTIVE | HANA
    pageType: {
      type: String,
      required: false,
      default: 'COMMON'
    },
    tableData: {
      type: Object,
      required: false,
      default: () => null
    },
    queryOptions: {
      type: Object,
      required: false,
      default: () => null
    }
  },
  asyncData({ params }) {
    const { id } = params;
    return { id };
  },
  data() {
    return {
      id: null,
      titleText: '',
      baseUrl: '',
      emojiType: '',
      cloneQueryOptions: cloneDeep(this.queryOptions),
      marketingOptionList: [
        { value: null, label: '전체' },
        { value: true, label: '동의' },
        { value: false, label: '미동의' }
      ],
      optionList: [...PAGE_SIZE_OPTIONS]
    };
  },
  computed: {
    genderOptionList() {
      const genderList = Object.entries(GENDER_TYPE).map(([key, value]) => ({
        label: value,
        value: key
      }));

      genderList.unshift({ value: null, label: '전체' });

      return genderList;
    },
    dateOptionList() {
      const commonOptions = [
        { value: 'CREATED_DATE', label: '가입일시' },
        { value: 'LAST_LOGIN_DATE', label: '최근 로그인' }
      ];
      const nonactiveOptions = [
        { value: 'CREATED_DATE', label: '가입일시' },
        { value: 'SLEEP_DATE', label: '휴면 전환 일시' }
      ];

      return this.pageType === 'COMMON' ? commonOptions : nonactiveOptions;
    }
  },
  created() {
    let titleText = '';
    let baseUrl = '';

    switch (this.pageType) {
      case 'COMMON':
        titleText = '계정리스트';
        baseUrl = '/admin/user/common';
        break;
      case 'NONACTIVE':
        titleText = '휴면 계정리스트';
        baseUrl = '/admin/user/nonactive';
        break;
      case 'HANA':
        titleText = '하나1Q 계정리스트';
        baseUrl = '/admin/user/hana';
        break;
      default:
        titleText = '올바르지 않은 페이지 타입';
        break;
    }

    this.titleText = titleText;
    this.baseUrl = baseUrl;
  },
  methods: {
    getGender(gender) {
      return GENDER_TYPE[gender];
    },
    onGoDetail(id) {
      this.$router.push(`${this.baseUrl}/${id}`);
    },
    onSearch(isReset) {
      if (isReset) {
        this.cloneQueryOptions = {
          ...this.cloneQueryOptions,
          text: '',
          searchDateType: 'CREATED_DATE',
          startDate: '',
          endDate: '',
          gender: null,
          isMarketingReceive: null
        };
      }
      this.cloneQueryOptions.page = 0;
      this.$emit('search', this.cloneQueryOptions);
    },
    onSelectSizeChange() {
      this.cloneQueryOptions.page = 0;
      this.$emit('change', this.cloneQueryOptions.size);
    },
    downloadExcel() {
      const fileName = this.pageType === 'COMMON' ? '회원목록' : '휴면회원목록';
      const apiUrl = this.pageType === 'COMMON' ? '/admin/accounts/excel' : '/admin/accounts/sleepers/excel';
      const startDate = this.queryOptions.startDate
        ? this.$dayjs(this.queryOptions.startDate).format('YYYY-MM-DD 00:00:00')
        : '';
      const endDate = this.queryOptions.endDate
        ? this.$dayjs(this.queryOptions.endDate).format('YYYY-MM-DD 23:59:59')
        : '';

      this.$axios
        .$get(apiUrl, {
          responseType: 'blob',
          params: {
            ...this.cloneQueryOptions,
            fileName,
            startDate,
            endDate
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
  &.nonactive {
    th {
      &:first-of-type {
        width: 4%;
      }
      &:nth-of-type(2) {
        width: 20%;
      }
      &:nth-of-type(3) {
        width: 15%;
      }
      &:nth-of-type(4) {
        width: 15%;
      }
      &:nth-of-type(5) {
        width: 14%;
      }
      &:nth-of-type(6) {
        width: 14%;
      }
      &:nth-of-type(7) {
        width: 9%;
      }
      &:last-of-type {
        width: 9%;
      }
    }
  }
  th {
    &:first-of-type {
      width: 4%;
    }
    &:nth-of-type(2) {
      width: 20%;
    }
    &:nth-of-type(3) {
      width: 15%;
    }
    &:nth-of-type(4) {
      width: 10%;
    }
    &:nth-of-type(5) {
      width: 10%;
    }
    &:nth-of-type(6) {
      width: 9%;
    }
    &:nth-of-type(7) {
      width: 9%;
    }
    &:nth-of-type(8) {
      width: 5%;
    }
    &:nth-of-type(9) {
      width: 9%;
    }
    &:last-of-type {
      width: 9%;
    }
  }
}
</style>
