<template>
  <div>
    <STitle emoji="page">단체 입장권 발급</STitle>
    <div class="search mb-28">
      <SSearchBar v-model="queryOptions.text" @search="onSearch()" />
      <SButton button-type="primary" @click="onSearch()">검색</SButton>
      <SButton @click="onSearch(true)">초기화</SButton>
    </div>
    <SPageable :table-data="tableData" @getTableData="changePage">
      <template #data="{ data }">
        <table class="admin-table">
          <thead>
            <tr>
              <th>NO</th>
              <th>아이디</th>
              <th>이름</th>
              <th>연락처</th>
              <th>가입일시</th>
              <th>최근 로그인 일시</th>
              <th>입장</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!data || !data[0]">
              <td colspan="100%"><div>리스트가 없습니다.</div></td>
            </tr>
            <tr
              v-for="(item, index) in data"
              :key="item.id"
              :class="{ 'is-selected': item.isSelected }"
              @click="selectUser(index)"
            >
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
              <td>
                <div>{{ item.visitCount }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </SPageable>
    <div class="member-price mb-36">
      <div class="info-table">
        <div class="row">
          <label>관람 인원 입력*</label>
          <div><SInput v-model="viewMemberCount" text-align="right" w-size="x-large" is-comma-num is-numeric />명</div>
          <label>총 금액</label>
          <div><SInput v-model="viewMemberPrice" text-align="right" w-size="x-large" is-comma-num is-numeric />원</div>
        </div>
      </div>
    </div>
    <div class="mb-16">
      <h3 class="mb-16">회차 선택</h3>
      <div class="info-table">
        <div class="row">
          <label>선택</label>
          <div>
            <SDropdown
              v-model="selectedKind"
              w-size="x-large"
              default-text="구분 선택"
              :option-list="exposeKindList"
              @input="getProjectData"
            />
          </div>
          <label>전시/프로그램 선택</label>
          <div>
            <SDropdown
              v-model="selectedEx"
              w-size="x-large"
              default-text="전시선택"
              :option-list="exposeExDropdownList"
              @input="getRoundData"
            />
          </div>
        </div>
      </div>
      <div></div>
    </div>
    <div class="round has-title-side-btn mb-16">
      <div class="round-inner">
        <div class="mr-28">
          <SCalendar
            :ex-start-date="startDate"
            :ex-end-date="endDate"
            :holiday-list="holidayList"
            :computed-round-data="computedRoundData"
            :selected-round-date="selectedRoundDate"
            @onSelectedDate="onSelectedDate"
          />
        </div>
        <div class="round-list">
          <template v-if="currentRoundData && currentRoundData.rounds">
            <div v-if="!currentRoundData.rounds || !currentRoundData.rounds[0]" class="round-item-empty">
              리스트가 없습니다.
            </div>
            <div
              v-for="(item, index) in currentRoundData.rounds"
              :key="item.startDate"
              class="round-item"
              :class="{ 'is-selected': item.isSelected }"
              @click="selectRoundItem(item.id)"
            >
              <p class="count">{{ index + 1 }}</p>
              <p class="time nt-3">
                {{ $dayjs(item.startTime, 'HH:mm:ss').format('HH:mm') }} ~
                {{ $dayjs(item.endTime, 'HH:mm:ss').format('HH:mm') }}
              </p>
              <div class="personnel">
                <div class="bt-1m">
                  입장
                  <span class="nt-3 ml-8">{{ item.ticketUsedCount > 999 ? '999+' : item.ticketUsedCount }}</span>
                </div>
                <SDivLine />
                <div class="bt-1m">
                  입장예정
                  <span class="nt-3 ml-8">{{ item.ticketTotalCount > 999 ? '999+' : item.ticketTotalCount }}</span>
                </div>
                <SDivLine />
                <div class="bt-1m">
                  최대인원
                  <span class="nt-3 ml-8">{{ item.maxCount > 999 ? '999+' : item.maxCount }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="bottom">
      <SButton button-type="primary" :disabled="isConfirmPending" @click="issuedTicket">발급</SButton>
    </div>
    <SDialogModal :is-show="modal.isError" @close="modal.isError = false">
      <template #content>{{ errorMsg }}</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="modal.isError = false">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isDone" @close="refreshPage">
      <template #content>단체 입장권이 발급되었습니다.</template>
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
import SCalendar from '~/components/admin/commons/SCalendar';
import SDivLine from '~/components/admin/commons/SDivLine';
import { roundsToHashTable } from '~/assets/js/converter';
import SDialogModal from '~/components/admin/modal/SDialogModal';

export default {
  name: 'GroupViewPage',
  components: { SDialogModal, SDivLine, SCalendar, SDropdown, SInput, STitle, SPageable, SButton, SSearchBar },
  layout: 'admin/default',
  data() {
    return {
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
      exposeExList: [],
      queryOptions: {
        text: this.$route.query.text || '',
        page: Number(this.$route.query.page) || 0,
        size: 5
      },
      tableData: null,
      viewMemberCount: 0,
      viewMemberPrice: 0,
      selectedUser: null,
      selectedKind: null,
      selectedEx: null,
      selectedExData: null,
      selectedRoundDate: '',
      selectedRoundItem: null,
      holidayList: [],
      startDate: '',
      endDate: '',
      modal: {
        isError: false,
        isDone: false
      },
      errorMsg: '',
      isConfirmPending: false
    };
  },
  async fetch() {
    this.tableData = await this.$axios
      .$get('/admin/accounts/ticket/group', { params: this.queryOptions })
      .then((tableData) => ({
        ...tableData,
        startCount: tableData.totalElements - tableData.number * tableData.size,
        content: tableData.content.map((item) => ({ ...item, isSelected: false }))
      }));
  },
  computed: {
    computedRoundData() {
      const rounds = this.selectedExData?.rounds ?? [];

      return roundsToHashTable(rounds, this.$dayjs);
    },
    currentRoundData() {
      return (
        this.computedRoundData[this.selectedRoundDate] || {
          targetDate: this.selectedRoundDate,
          allMaxCount: 0,
          allTicketingCount: 0,
          rounds: [],
          isHasOverbooking: false
        }
      );
    },
    exposeExDropdownList() {
      return this.exposeExList.map((item) => ({
        label: item.title,
        value: item.id
      }));
    },
    getKindUrl() {
      return this.selectedKind === 'EXHIBITION' ? 'exhibitions' : this.selectedKind === 'PROGRAM' ? 'programs' : null;
    }
  },
  methods: {
    changePage(page) {
      if (!this.$fetchState.pending) {
        this.queryOptions.page = page;
        this.selectedUser = null;
        this.$fetch();
      }
    },
    selectUser(index) {
      this.tableData.content = this.tableData.content.map((item) => ({ ...item, isSelected: false }));
      this.tableData.content[index].isSelected = true;
      this.selectedUser = this.tableData.content[index];
    },
    onSearch(isReset) {
      if (isReset) {
        this.queryOptions.text = '';
      }
      this.queryOptions.page = 0;

      if (!this.$fetchState.pending) {
        this.selectedUser = null;
        this.$fetch();
      }
    },
    async getProjectData() {
      this.exposeExList = await this.$axios.$get(`/admin/${this.getKindUrl}/expose/title`);
      this.selectedEx = null;
      this.selectedRoundItem = null;
      this.selectedExData = null;
      this.startDate = '';
      this.endDate = '';
      this.holidayList = [];
    },
    async getRoundData() {
      const selectedExData = await this.$axios.$get(`/admin/${this.getKindUrl}/${this.selectedEx}`).then((exData) => ({
        ...exData,
        rounds: exData.rounds.map((item) => ({
          ...item,
          isSelected: true
        }))
      }));
      const holidayList = await this.$axios.$get('/admin/holidays', {
        params: {
          startDate: '',
          endDate: ''
        }
      });

      this.selectedRoundItem = null;
      this.selectedExData = selectedExData;
      this.startDate = selectedExData?.startDate ?? '';
      this.endDate = selectedExData?.endDate ?? '';
      this.holidayList = holidayList;
    },
    onSelectedDate(selectedDate) {
      if (this.computedRoundData[this.selectedRoundDate]) {
        this.computedRoundData[this.selectedRoundDate].rounds.forEach((value) => {
          value.isSelected = false;
        });
      }

      this.selectedRoundItem = null;
      this.selectedRoundDate = selectedDate;
    },
    selectRoundItem(id) {
      this.currentRoundData.rounds = this.currentRoundData.rounds.map((item) => ({ ...item, isSelected: false }));
      this.currentRoundData.rounds.find((round) => round.id === id).isSelected = true;
      this.selectedRoundItem = this.currentRoundData.rounds.find((round) => round.id === id);
      this.$forceUpdate();
    },
    isValidate() {
      let isVerify = false;

      if (!this.selectedUser) {
        this.errorMsg = '회원을 선택해주세요';
      } else if (this.viewMemberCount <= 0) {
        this.errorMsg = '관람 인원을 입력해주세요.';
      } else if (!this.selectedRoundItem) {
        this.errorMsg = '전시 회차를 선택해주세요';
      } else {
        isVerify = true;
      }

      if (!isVerify) {
        this.modal.isError = true;
      }

      return isVerify;
    },
    async issuedTicket() {
      this.isConfirmPending = true;
      if (this.isValidate()) {
        await this.$axios
          .$post('/admin/tickets/group', {
            kind: this.selectedKind,
            accountId: this.selectedUser.id,
            roundId: this.selectedRoundItem.id,
            number: this.viewMemberCount,
            price: this.viewMemberPrice
          })
          .then(() => {
            this.modal.isDone = true;
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

.is-selected {
  background-color: #ebf7ff !important;
}

.member-price {
  margin-top: 3.3rem;

  input {
    margin-right: 0.8rem;
  }
}

.round {
  .round-inner {
    display: flex;
  }

  .round-list {
    flex: 1 1 0;
    background-color: var(--color-white);
    overflow-y: auto;
    border-radius: 0.3rem;
    border: 1px solid var(--color-grey-2);
  }

  .round-item-empty {
    color: var(--color-grey-3);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    font-size: 1.6rem;
    font-weight: 500;
  }

  .round-item {
    display: flex;
    border-bottom: 1px solid var(--color-grey-2);
    padding-right: 6.2rem;
    align-items: center;
    cursor: pointer;

    &:hover {
      background-color: #ebf7ff;
    }

    &.is-selected {
      background-color: #ebf7ff;
    }

    .count {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-grey-4);
      min-height: 5.5rem;
      width: 5.5rem;
      background-color: #fafafa;
      border-right: 1px solid var(--color-grey-2);
    }

    .time {
      flex: 1 1 0;
      padding: 0 2rem;
    }

    .personnel {
      display: flex;
      align-items: center;

      .bt-1m {
        width: 9.6rem;
      }

      .nt-3 {
        color: var(--color-blue);
      }
    }
  }
}

.bottom {
  display: flex;
  justify-content: flex-end;
}

.admin-table {
  th {
    &:first-of-type {
      width: 5%;
    }
    &:nth-of-type(2) {
      width: 20%;
    }
    &:nth-of-type(3) {
      width: 20%;
    }
    &:nth-of-type(4) {
      width: 10%;
    }
    &:nth-of-type(5) {
      width: 15%;
    }
    &:nth-of-type(6) {
      width: 15%;
    }
    &:nth-of-type(7) {
      width: 15%;
    }
  }
}
</style>
