<template>
  <div>
    <STitle emoji="page">초대권 발급</STitle>
    <div class="mb-36">
      <h3 class="mb-16">전시/프로그램 선택</h3>
      <div class="info-table">
        <div class="row">
          <label>구분 선택</label>
          <div>
            <SDropdown v-model="selectedKind" w-size="x-large" default-text="구분 선택" :option-list="exposeKindList" />
          </div>
          <label>전시/프로그램 선택</label>
          <div>
            <SDropdown
              v-model="selectedEx"
              w-size="x-large"
              default-text="전시/프로그램 선택"
              :option-list="exposeExDropdownList"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="mb-36">
      <h3 class="mb-16">계정 선택</h3>
      <div class="search">
        <div class="mb-24">
          <SDropdown v-model="queryOptions.searchDateType" :option-list="userOptionList" class="mr-16" />
          <SDatepicker v-model="queryOptions.startDate" :max="queryOptions.endDate" />
          <span class="ml-8 mr-8">~</span>
          <SDatepicker v-model="queryOptions.endDate" :min="queryOptions.startDate" />
          <!--          <SDivLine is-big />-->
          <!--          <SDropdown v-model="queryOptions.gender" :option-list="genderOptionList">성별</SDropdown>-->
          <SDivLine is-big />
          <SDropdown v-model="queryOptions.isLocalResident" :option-list="localOptionList">지역주민</SDropdown>
        </div>
        <div class="mb-24">
          관람 수:
          <SInput v-model="queryOptions.minVisit" class="view-count" w-size="x-small" />~<SInput
            v-model="queryOptions.maxVisit"
            class="view-count"
            w-size="x-small"
          />
          <SDivLine is-big />
          초대권 수령 수:
          <SInput v-model="queryOptions.minInvite" class="view-count" w-size="x-small" />~<SInput
            v-model="queryOptions.maxInvite"
            class="view-count"
            w-size="x-small"
          />
        </div>
        <div>
          <SSearchBar v-model="queryOptions.text" @search="onUserSearch()" />
          <SButton button-type="primary" @click="onUserSearch()">검색</SButton>
          <SButton @click="onUserSearch(true)">초기화</SButton>
        </div>
      </div>
    </div>
    <div class="bottom-div">
      <div class="title-menu">
        <div class="left">
          <h3>계정 리스트</h3>
        </div>
        <div class="right">
          <SButton class="mr-16" button-type="transport-b" @click="addUser">추가</SButton>
          <SDropdown v-model="queryOptions.size" :option-list="optionList" @change="onSizeChange">리스트 수:</SDropdown>
        </div>
      </div>
      <SPageable :table-data="tableData" @getTableData="changePage">
        <template #data="{ data }">
          <table class="admin-table">
            <thead>
              <tr>
                <th>
                  <SCheckbox v-model="isCheckedAll" @input="setCheckedAll" />
                </th>
                <th>NO</th>
                <th>계정</th>
                <th>이름</th>
                <th>연락처</th>
                <th>가입일시</th>
                <th>최근 로그인 일시</th>
                <!--                <th>생년월일</th>-->
                <!--                <th>성별</th>-->
                <th>지역주민</th>
                <th>입장</th>
                <th>초대권 수령</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!data || !data[0]">
                <td colspan="100%"><div>리스트가 없습니다.</div></td>
              </tr>
              <tr v-for="(item, index) in data" :key="item.id" @click="item.isChecked = !item.isChecked">
                <td>
                  <div>
                    <SCheckbox v-model="item.isChecked" />
                  </div>
                </td>
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
                  <div>{{ item.lastLoginDate }}</div>
                </td>
                <!--                <td>-->
                <!--                  <div>{{ item.birthday }}</div>-->
                <!--                </td>-->
                <!--                <td>-->
                <!--                  <div>{{ item.gender === 'MAN' ? '남' : '여' }}</div>-->
                <!--                </td>-->
                <td>
                  <div>{{ item.isLocalResident ? 'Y' : 'N' }}</div>
                </td>
                <td>
                  <div>{{ getThreeCommaNum(item.visitCount) }}</div>
                </td>
                <td>
                  <div>{{ getThreeCommaNum(item.inviteCount) }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </SPageable>
    </div>
    <div class="search-b mb-28">
      <SSearchBar v-model="selectedData.searchText" @search="onSelectSearch()" />
      <SButton button-type="primary" @click="onSelectSearch()">검색</SButton>
      <SButton @click="onSelectSearch(true)">초기화</SButton>
    </div>
    <div class="mb-36">
      <div class="title-menu">
        <div class="left">
          <h3>선택 계정 리스트</h3>
          <span class="ml-8">({{ selectedData.userList.length }}/{{ selectedData.maxCount }})</span>
        </div>
        <div class="right">
          <SButton button-type="transport-b" class="mr-8" @click="removeSelectedUser(true)">전체 삭제</SButton>
          <SButton button-type="transport-b" class="mr-16" @click="removeSelectedUser()">삭제</SButton>
          <SDropdown v-model="selectedData.pageSize" :option-list="optionList" @change="onSelectSizeChange"
            >리스트 수:</SDropdown
          >
        </div>
      </div>
      <SPagination
        :table-data="selectedUserList"
        :table-option="{ currentPage: selectedData.tablePage, pageSize: selectedData.pageSize }"
        @onPageChange="onPageChange"
      >
        <template #data="{ data }">
          <table class="admin-table">
            <thead>
              <tr>
                <th>
                  <SCheckbox v-model="selectedData.isCheckedAll" @input="setSelectedCheckedAll" />
                </th>
                <th>NO</th>
                <th>계정</th>
                <th>이름</th>
                <th>연락처</th>
                <th>가입일시</th>
                <th>최근 로그인 일시</th>
                <th>지역주민</th>
                <th>입장</th>
                <th>초대권 수령</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!data || !data[0]">
                <td colspan="100%"><div>리스트가 없습니다.</div></td>
              </tr>
              <tr v-for="item in data" :key="item.id" @click="onSelectedCheck(item.id)">
                <td>
                  <div>
                    <SCheckbox v-model="item.isChecked" />
                  </div>
                </td>
                <td>
                  <div>{{ item.index }}</div>
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
                  <div>{{ item.lastLoginDate }}</div>
                </td>
                <td>
                  <div>{{ item.isLocalResident ? 'Y' : 'N' }}</div>
                </td>
                <td>
                  <div>{{ getThreeCommaNum(item.visitCount) }}</div>
                </td>
                <td>
                  <div>{{ getThreeCommaNum(item.inviteCount) }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </SPagination>
    </div>
    <div class="member-price mb-36">
      <div class="info-table">
        <div class="row">
          <label>관람 인원 입력*</label>
          <div><SInput v-model="viewMemberCount" text-align="right" w-size="x-large" is-numeric />명</div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <SButton button-type="primary" :disabled="isConfirmPending" @click="issuedTicket">발급</SButton>
    </div>
    <SDialogModal :is-show="isShowErrorModal" @close="isShowErrorModal = false">
      <template #content>{{ errorMsg }}</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="isShowErrorModal = false">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="isShowDoneModal" @close="refreshPage">
      <template #content>초대권이 발급되었습니다.</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="refreshPage">확인</SButton>
      </template>
    </SDialogModal>
  </div>
</template>

<script>
import STitle from '~/components/admin/commons/STitle';
import SPageable from '~/components/admin/commons/SPageable';
import SButton from '~/components/admin/commons/SButton';
import SSearchBar from '~/components/admin/commons/SSearchBar';
import SInput from '~/components/admin/commons/SInput';
import SDropdown from '~/components/admin/commons/SDropdown';
import SDatepicker from '~/components/admin/commons/SDatepicker';
import SDivLine from '~/components/admin/commons/SDivLine';
import { SEARCH_USER_TYPE, GENDER_TYPE } from '~/assets/js/types';
import SCheckbox from '~/components/admin/commons/SCheckbox';
import { threeCommaNum } from '~/assets/js/commons';
import SPagination from '~/components/admin/commons/SPagination';
import SDialogModal from '~/components/admin/modal/SDialogModal';

export default {
  name: 'InvitationPage',
  components: {
    SDialogModal,
    SPagination,
    SCheckbox,
    SDivLine,
    SDatepicker,
    SDropdown,
    SInput,
    STitle,
    SPageable,
    SButton,
    SSearchBar
  },
  layout: 'admin/default',
  async asyncData({ $axios }) {
    const exposeExList = await $axios.$get('/admin/exhibitions/expose/title');
    const exposeProList = await $axios.$get('/admin/programs/expose/title');

    return { exposeExList, exposeProList };
  },
  data() {
    return {
      selectedKind: null,
      exposeKindList: [
        {
          label: '전시',
          value: 'EXHIBITION'
        },
        {
          label: '프로그램',
          value: 'PROGRAM'
        }
      ],
      selectedEx: null,
      exposeExList: [],
      exposeProList: [],
      queryOptions: {
        page: 0,
        size: 5,
        startDate: '',
        endDate: '',
        gender: null,
        isLocalResident: null,
        minVisit: 0,
        maxVisit: 50,
        minInvite: 0,
        maxInvite: 50,
        text: '',
        searchDateType: 'CREATED_DATE',
        excludeIds: []
      },
      tableData: null,
      isCheckedAll: false,
      optionList: [
        { value: 5, label: '5개' },
        { value: 20, label: '20개' },
        { value: 50, label: '50개' }
      ],
      selectedData: {
        maxCount: 500,
        searchText: '',
        isCheckedAll: false,
        tablePage: 0,
        pageSize: 5,
        userList: []
      },
      isSelectedUserCheckedAll: false,
      selectedItemMaxCount: 500,
      searchSelectText: '',
      viewMemberCount: 0,
      errorMsg: '',
      isShowErrorModal: false,
      isShowDoneModal: false,
      isConfirmPending: false
    };
  },
  async fetch() {
    const startDate = this.queryOptions.startDate
      ? this.$dayjs(this.queryOptions.startDate).format('YYYY-MM-DD 00:00:00')
      : '';
    const endDate = this.queryOptions.endDate
      ? this.$dayjs(this.queryOptions.endDate).format('YYYY-MM-DD 23:59:59')
      : '';

    this.tableData = await this.$axios
      .$get('/admin/accounts/ticket/invite', {
        params: {
          ...this.queryOptions,
          startDate,
          endDate
        }
      })
      .then((tableData) => ({
        ...tableData,
        startCount: tableData.totalElements - tableData.number * tableData.size,
        content: tableData.content.map((item) => ({ ...item, isChecked: false }))
      }));
  },
  computed: {
    exposeExDropdownList() {
      const list =
        this.selectedKind === 'EXHIBITION'
          ? this.exposeExList
          : this.selectedKind === 'PROGRAM'
          ? this.exposeProList
          : [];
      return list.map((item) => ({
        label: item.title,
        value: item.id
      }));
    },
    userOptionList() {
      return Object.entries(SEARCH_USER_TYPE).map(([key, value]) => ({
        value: key,
        label: value
      }));
    },
    genderOptionList() {
      const optionList = Object.entries(GENDER_TYPE).map(([key, value]) => ({
        value: key,
        label: value
      }));

      optionList.unshift({ value: null, label: '전체' });

      return optionList;
    },
    localOptionList() {
      return [
        { value: null, label: '전체' },
        { value: true, label: 'Y' },
        { value: false, label: 'N' }
      ];
    },
    selectedUserList() {
      const searchText = this.searchSelectText;
      let userList = this.selectedData.userList;

      if (searchText) {
        userList = userList.filter(
          (user) => user.email.includes(searchText) || user.name.includes(searchText) || user.phone.includes(searchText)
        );
      }

      return userList.map((user, index) => ({
        ...user,
        index: index + 1
      }));
    }
  },
  watch: {
    'tableData.content': {
      deep: true,
      handler(newValue) {
        this.isCheckedAll = newValue.length > 0 ? newValue.every((item) => item.isChecked) : false;
      }
    },
    selectedUserList: {
      deep: true,
      handler(newValue) {
        const startIndex = this.selectedData.pageSize * this.selectedData.tablePage;
        const targetList = newValue.slice(startIndex, this.selectedData.pageSize);

        this.selectedData.isCheckedAll = targetList.length > 0 ? targetList.every((item) => item.isChecked) : false;
      }
    }
  },
  methods: {
    setCheckedAll(newValue) {
      this.tableData.content = this.tableData.content.map((info) => ({
        ...info,
        isChecked: newValue
      }));
    },
    setSelectedCheckedAll(newValue) {
      this.selectedData.userList = this.selectedData.userList.map((info) => ({
        ...info,
        isChecked: newValue
      }));
    },
    getThreeCommaNum(num) {
      return threeCommaNum(num);
    },
    changePage(page) {
      if (!this.$fetchState.pending) {
        this.queryOptions.page = page;
        this.$fetch();
      }
    },
    onUserSearch(isReset) {
      if (!this.$fetchState.pending) {
        if (isReset) {
          this.queryOptions = {
            page: 0,
            size: 5,
            startDate: '',
            endDate: '',
            gender: null,
            isLocalResident: null,
            minVisit: 0,
            maxVisit: 50,
            minInvite: 0,
            maxInvite: 50,
            text: '',
            searchDateType: 'CREATED_DATE',
            excludeIds: []
          };
        }
        this.queryOptions.page = 0;
        this.$fetch();
      }
    },
    addUser() {
      if (!this.$fetchState.pending) {
        const targetUserList = this.tableData.content.filter((item) => item.isChecked);

        targetUserList.forEach((value) => {
          this.queryOptions.excludeIds.push(value.id);
          this.selectedData.userList.push({
            ...value,
            isChecked: false
          });
        });
        this.selectedData.userList = this.selectedData.userList.map((item, index) => ({ ...item, index: index + 1 }));
        this.$fetch();
      }
    },
    removeSelectedUser(isAll) {
      if (!this.$fetchState.pending) {
        const selectedUserList = [...this.selectedData.userList].filter((user) => user.isChecked);

        if (isAll) {
          this.queryOptions.excludeIds = [];
          this.selectedData.userList = [];
        } else {
          selectedUserList.forEach((user) => {
            const { id } = user;
            const excludeTargetIndex = this.queryOptions.excludeIds.findIndex((item) => item.id === id);
            const selectedTargetIndex = this.selectedData.userList.findIndex((item) => item.id === id);

            this.queryOptions.excludeIds.splice(excludeTargetIndex, 1);
            this.selectedData.userList.splice(selectedTargetIndex, 1);
          });
        }
        this.selectedData.tablePage = 0;
        this.$fetch();
      }
    },
    onSelectedCheck(id) {
      const target = this.selectedData.userList.find((item) => item.id === id);

      target.isChecked = !target.isChecked;
    },
    onPageChange(page) {
      this.selectedData.tablePage = page;
      this.selectedData.isCheckedAll = false;
    },
    onSizeChange() {
      if (!this.$fetchState.pending) {
        this.selectedData.tablePage = 0;
        this.$fetch();
      }
    },
    onSelectSizeChange() {
      this.selectedData.tablePage = 0;
      this.selectedData.isCheckedAll = false;
    },
    onSelectSearch(isReset) {
      if (isReset) {
        this.selectedData.searchText = '';
      }
      this.selectedData.tablePage = 0;

      this.searchSelectText = this.selectedData.searchText;
    },
    isValidate() {
      let isValid = false;
      let msg = '';

      if (this.selectedKind === null) {
        msg = '구분을를 선택해 주세요.';
      } else if (this.selectedEx === null) {
        msg = '전시/프로그램을 선택해 주세요.';
      } else if (this.queryOptions.excludeIds.length === 0) {
        msg = '계정를 선택해 주세요.';
      } else if (this.queryOptions.excludeIds.length > 500) {
        msg = '초대권은 한번에 최대 500명에게 발급 가능합니다.';
      } else if (this.viewMemberCount <= 0) {
        // eslint-disable-next-line no-unused-vars
        msg = '관람 인원을 입력해 주세요.';
      } else {
        isValid = true;
      }

      if (!isValid) {
        this.errorMsg = msg;
        this.isShowErrorModal = true;
      }

      return isValid;
    },
    async issuedTicket() {
      this.isConfirmPending = true;
      if (this.isValidate()) {
        await this.$axios
          .$post('/admin/tickets/invite', {
            accountIds: this.queryOptions.excludeIds,
            kind: this.selectedKind,
            id: this.selectedEx,
            number: this.viewMemberCount
          })
          .then(() => {
            this.isShowDoneModal = true;
          });
      }
      this.isConfirmPending = false;
    },
    refreshPage() {
      window.location.reload();
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

  .view-count {
    margin-left: 1.2rem;
    margin-right: 0.8rem;
  }
}

.search-b {
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

.title-menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.6rem;

  .left {
    display: flex;
    align-items: center;
  }

  .right {
    display: flex;
  }
}

.member-price {
  margin-top: 3.3rem;

  input {
    margin-right: 0.8rem;
  }
}

.bottom-div {
  border-bottom: 1px solid var(--color-grey-2);
  padding-bottom: 3.2rem;
  margin-bottom: 3.2rem;
}

.bottom {
  display: flex;
  justify-content: flex-end;
}

.admin-table {
  th {
    &:first-of-type {
      width: 4%;
    }
    &:nth-of-type(2) {
      width: 4%;
    }
    &:nth-of-type(3) {
      width: 33%;
    }
    &:nth-of-type(4) {
      width: 10%;
    }
    &:nth-of-type(5) {
      width: 9%;
    }
    &:nth-of-type(6) {
      width: 12%;
    }
    &:nth-of-type(7) {
      width: 12%;
    }
    &:nth-of-type(8) {
      width: 5%;
    }
    &:nth-of-type(9) {
      width: 5%;
    }
    &:last-of-type {
      width: 6%;
    }
  }
}
</style>
