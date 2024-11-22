<template>
  <div>
    <STitle emoji="page">{{ pageTitle }}</STitle>
    <div class="search mb-28">
      <div class="mb-24">
        <SDropdown v-model="queryOptions.searchDateType" :option-list="dateOptionList" class="mr-16" />
        <SDatepicker v-model="queryOptions.startDate" :max="queryOptions.endDate" />
        <span class="ml-8 mr-8">~</span>
        <SDatepicker v-model="queryOptions.endDate" :min="queryOptions.startDate" />
        <template v-if="pageType === 'all'">
          <SDivLine is-big />
          <SDropdown v-model="queryOptions.type" :option-list="ticketOptionList" class="mr-16">티켓 구분:</SDropdown>
        </template>
      </div>
      <div class="mb-24">
        <label>상태</label>
        <SCheckboxGroup v-model="queryOptions.state" :group-list="stateList">예정</SCheckboxGroup>
        <SCheckbox v-model="queryOptions.hasMembership">멤버십</SCheckbox>
      </div>
      <div>
        <SSearchBar v-model="queryOptions.text" @search="onSearch()" />
        <SButton button-type="primary" @click="onSearch()">검색</SButton>
        <SButton @click="onSearch(true)">초기화</SButton>
      </div>
    </div>
    <div class="top-menus mb-16">
      <div>
        <SButton v-if="pageType !== 'invitation'" class="mr-8" :disabled="!isCheckedSome" @click="modal.isRefund = true"
          >선택 환불</SButton
        >
      </div>
      <div>
        <SButton class="mr-16" @click="downloadExcel">엑셀 다운로드</SButton>
        <SDropdown v-model="queryOptions.size" :option-list="sizeOptionList" @change="onSelectSizeChange"
          >리스트 수:</SDropdown
        >
      </div>
    </div>
    <SPageable v-if="tableData" :table-data="tableData" @getTableData="changePage">
      <template #data="{ data }">
        <table
          class="admin-table"
          :class="[
            { exhibition: pageType === 'exhibition' },
            { group: pageType === 'group' },
            { invitation: pageType === 'invitation' },
            { coffee: pageType === 'coffee' }
          ]"
        >
          <thead :class="{ 'data-none': !data || !data[0] }">
            <tr>
              <th v-if="pageType !== 'invitation'">
                <SCheckbox v-model="isCheckedAll" @input="setCheckedAll" />
              </th>
              <th>NO</th>
              <th v-if="pageType === 'all'">구분</th>
              <th v-if="pageType === 'all'">티켓구분</th>
              <th>제목</th>
              <th v-if="pageType !== 'invitation'">회차</th>
              <th>구매 수</th>
              <th v-if="pageType !== 'group' && pageType !== 'invitation'">금액</th>
              <th class="membership-column">멤버십</th>
              <th>계정</th>
              <th>이름</th>
              <th>연락처</th>
              <th>상태</th>
              <th>입장권아이디</th>
              <th v-if="pageType !== 'group' && pageType !== 'invitation'">결제아이디</th>
              <th>생성일시</th>
              <th v-if="pageType === 'coffee'">제작완료</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!data || !data[0]">
              <td
                :colspan="
                  pageType === 'all'
                    ? '16'
                    : pageType === 'exhibition'
                    ? '14'
                    : pageType === 'group'
                    ? '12'
                    : pageType === 'coffee'
                    ? '15'
                    : '10'
                "
              >
                <div>리스트가 없습니다.</div>
              </td>
            </tr>
            <tr
              v-for="(item, index) in data"
              :key="item.id"
              @click="
                pageType === 'coffee'
                  ? $router.push(`/admin/coffee/order/${item.id}`)
                  : $router.push(`/admin/ticket/tickets/${pageType}/${item.id}`)
              "
            >
              <td v-if="pageType !== 'invitation'" @click.stop>
                <div>
                  <SCheckbox v-if="!item.isDisabled" v-model="item.isChecked" />
                  <SCheckbox v-else disabled />
                </div>
              </td>
              <td>
                <div>{{ tableData.startCount - index }}</div>
              </td>
              <td v-if="pageType === 'all'">
                <div>{{ TICKET_KIND_TYPE[item.kind] || '' }}</div>
              </td>
              <td v-if="pageType === 'all'">
                <div>{{ TICKET_TYPE[item.type] || '' }}</div>
              </td>
              <td>
                <div class="text-left">{{ item.title }}</div>
              </td>
              <td v-if="pageType !== 'invitation'">
                <div>
                  <p>{{ $dayjs(item.startDate).format('YYYY-MM-DD') }}</p>
                  <p>{{ $dayjs(item.startDate).format('HH:mm') }} ~ {{ $dayjs(item.endDate).format('HH:mm') }}</p>
                </div>
              </td>
              <td>
                <div class="text-right">{{ item.number.toLocaleString() }}</div>
              </td>
              <td v-if="pageType !== 'group' && pageType !== 'invitation'">
                <div class="text-right">{{ getThreeCommaNum(item.price) }}</div>
              </td>
              <td>
                <div>{{ item.membershipRegistrationInfo?.name || '-' }}</div>
              </td>
              <td>
                <div>{{ item.email || '-' }}</div>
              </td>
              <td>
                <div>{{ item.name }}</div>
              </td>
              <td>
                <div>{{ item.phone }}</div>
              </td>
              <td>
                <div>{{ TICKET_STATE_TYPE[item.state] || '' }}</div>
              </td>
              <td>
                <div>{{ item.uuid }}</div>
              </td>
              <td v-if="pageType !== 'group' && pageType !== 'invitation'">
                <div>{{ item.pgId }}</div>
              </td>
              <td>
                <div>{{ item.createdDate }}</div>
              </td>
              <td v-if="pageType === 'coffee'" @click.stop>
                <div><SButton @click="sendCoffeeDoneMail(item.id)">제작완료</SButton></div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </SPageable>
    <SDialogModal :is-show="modal.isRefund" @close="modal.isRefund = false">
      <template #content>선택한 리스트를 환불 하시겠습니까?</template>
      <template #modal-btn1>
        <SButton @click="modal.isRefund = false">취소</SButton>
      </template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="refundTickets">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isRefundDone" @close="refreshPage">
      <template #content>환불 되었습니다.</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="refreshPage">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isCoffeeDone" @close="modal.isCoffeeDone = false">
      <template #content>제작 완료 알람을 발송하였습니다.</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="modal.isCoffeeDone = false">확인</SButton>
      </template>
    </SDialogModal>
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
import { TICKET_STATE_TYPE, TICKET_TYPE, TICKET_KIND_TYPE } from '~/assets/js/types';
import SCheckbox from '~/components/admin/commons/SCheckbox';
import { threeCommaNum } from '~/assets/js/commons';
import SDialogModal from '~/components/admin/modal/SDialogModal';

export default {
  name: 'TicketsPage',
  components: {
    SDialogModal,
    SCheckbox,
    SCheckboxGroup,
    SDivLine,
    SDatepicker,
    STitle,
    SPageable,
    SDropdown,
    SButton,
    SSearchBar
  },
  props: {
    pageTitle: {
      type: String,
      required: false,
      default: ''
    },
    pageType: {
      // all | exhibition | group | invitation
      type: String,
      required: false,
      default: 'all'
    },
    ignoreStateList: {
      type: Array,
      required: false,
      default: () => []
    },
    fetchQueryOptions: {
      type: Object,
      required: false,
      default: () => null
    },
    fetchTableData: {
      type: Object,
      required: false,
      default: () => null
    }
  },
  data() {
    return {
      TICKET_STATE_TYPE,
      TICKET_KIND_TYPE,
      TICKET_TYPE,
      dateOptionList: [
        { value: 'CREATED_DATE', label: '결제일시' },
        { value: 'USED_DATE', label: '사용일시' },
        { value: 'START_DATE', label: '회차시작' }
      ],
      sizeOptionList: [
        { value: 20, label: '20개' },
        { value: 30, label: '30개' },
        { value: 50, label: '50개' }
      ],
      modal: {
        isRefund: false,
        isRefundDone: false,
        isCoffeeDone: false
      },
      isCheckedAll: false
    };
  },
  computed: {
    stateList() {
      return Object.entries(TICKET_STATE_TYPE)
        .filter(([key]) => !this.ignoreStateList.includes(key))
        .map(([key, value]) => ({
          label: value,
          value: key
        }));
    },
    ticketOptionList() {
      const list = Object.entries(this.TICKET_TYPE).map(([key, value]) => ({
        label: value,
        value: key
      }));
      list.unshift({ label: '전체', value: null });
      return list;
    },
    tableData() {
      return this.fetchTableData;
    },
    queryOptions() {
      return this.fetchQueryOptions;
    },
    isCheckedSome() {
      return this.tableData?.content.some((info) => !!info.isChecked);
    }
  },
  watch: {
    'tableData.content': {
      deep: true,
      handler(newValue) {
        const enabledItem = newValue.filter((item) => !item.isDisabled);
        this.isCheckedAll = enabledItem.length > 0 ? enabledItem.every((item) => item.isChecked) : false;
      }
    }
  },
  methods: {
    changePage(page) {
      this.$emit('page', page);
    },
    setCheckedAll(newValue) {
      this.tableData.content = this.tableData.content.map((info) => ({
        ...info,
        isChecked: newValue
      }));
    },
    onSelectSizeChange() {
      this.queryOptions.page = 0;
      this.$emit('search');
    },
    onSearch(isReset) {
      if (isReset) {
        this.queryOptions.searchDateType = 'CREATED_DATE';
        this.queryOptions.startDate = '';
        this.queryOptions.endDate = '';
        this.queryOptions.state = [];
        this.queryOptions.hasMembership = false;
        this.queryOptions.text = '';
        if (this.pageType === 'all') {
          this.queryOptions.type = null;
        }
      }
      this.queryOptions.page = 0;
      this.$emit('search');
    },
    getStateLabel(state) {
      return TICKET_STATE_TYPE[state] || '';
    },
    getThreeCommaNum(num) {
      return threeCommaNum(num);
    },
    downloadExcel() {
      const startDate = this.queryOptions.startDate
        ? this.$dayjs(this.queryOptions.startDate).format('YYYY-MM-DD 00:00:00')
        : '';
      const endDate = this.queryOptions.endDate
        ? this.$dayjs(this.queryOptions.endDate).format('YYYY-MM-DD 23:59:59')
        : '';
      const fileName = '티켓전체내역';

      this.$axios
        .$get('/admin/tickets/excel', {
          method: 'GET',
          responseType: 'blob',
          params: {
            ...this.queryOptions,
            startDate,
            endDate,
            fileName
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
    getIsCanRefund(item) {
      const isInviteTicket = item.type === 'INVITE';
      const isCanNotRefundState =
        item.state === 'USER_REFUND' || item.state === 'ADMIN_REFUND' || item.state === 'USED';

      return !(isInviteTicket || isCanNotRefundState);
    },
    async refundTickets() {
      const ticketIdJoined = this.tableData.content
        .reduce((prev, cur) => {
          if (!cur.isDisabled && cur.isChecked) {
            prev.push(cur.id);
          }
          return prev;
        }, [])
        .join(',');

      await this.$axios.$put(`/admin/tickets/${ticketIdJoined}/refund`).then(() => {
        this.modal.isRefund = false;
        this.modal.isRefundDone = true;
      });
    },
    refreshPage() {
      window.location.reload();
    },
    async sendCoffeeDoneMail(id) {
      await this.$axios.$post(`/admin/tickets/${id}/coffee/complete`).then(() => {
        this.modal.isCoffeeDone = true;
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
  justify-content: space-between;

  > div {
    display: flex;
    align-items: center;
  }
}
.membership-column {
  width: 26rem !important;
}

.admin-table {
  &.exhibition {
    th {
      &:first-of-type {
        width: 5rem;
      }
      &:nth-of-type(2) {
        width: 8rem;
      }
      &:nth-of-type(3) {
        width: 30rem;
      }
      &:nth-of-type(4) {
        width: 13rem;
      }
      &:nth-of-type(5) {
        width: 10rem;
      }
      &:nth-of-type(6) {
        width: 11rem;
      }
      &:nth-of-type(7) {
        width: 26rem;
      }
      &:nth-of-type(8) {
        width: 26rem;
      }
      &:nth-of-type(9) {
        width: 14rem;
      }
      &:nth-of-type(10) {
        width: 10rem;
      }
      &:nth-of-type(11) {
        width: 18rem;
      }
      &:nth-of-type(12) {
        width: 18rem;
      }
      &:nth-of-type(13) {
        width: 45rem;
      }
      &:last-of-type {
        width: 10rem;
      }
    }
  }
  &.group {
    th {
      &:first-of-type {
        width: 4%;
      }
      &:nth-of-type(2) {
        width: 6%;
      }
      &:nth-of-type(3) {
        width: 20%;
      }
      &:nth-of-type(4) {
        width: 10%;
      }
      &:nth-of-type(5) {
        width: 8%;
      }
      &:nth-of-type(6) {
        width: 20%;
      }
      &:nth-of-type(7) {
        width: 17%;
      }
      &:nth-of-type(8) {
        width: 9%;
      }
      &:nth-of-type(9) {
        width: 10%;
      }
      &:nth-of-type(10) {
        width: 8%;
      }
      &:nth-of-type(11) {
        width: 12%;
      }
      &:last-of-type {
        width: 10%;
      }
    }
  }
  &.invitation {
    th {
      &:first-of-type {
        width: 5%;
      }
      &:nth-of-type(2) {
        width: 30%;
      }
      &:nth-of-type(3) {
        width: 6%;
      }
      &:nth-of-type(4) {
        width: 20%;
      }
      &:nth-of-type(5) {
        width: 20%;
      }
      &:nth-of-type(6) {
        width: 9%;
      }
      &:nth-of-type(7) {
        width: 12%;
      }
      &:nth-of-type(8) {
        width: 12%;
      }
      &:nth-of-type(9) {
        width: 12%;
      }
      &:last-of-type {
        width: 12%;
      }
    }
  }
  &.coffee {
    th {
      &:nth-of-type(1) {
        width: 4%;
      }
      &:nth-of-type(2) {
        width: 4%;
      }
      &:nth-of-type(3) {
        width: 17.5%;
      }
      &:nth-of-type(4) {
        width: 8%;
      }
      &:nth-of-type(5) {
        width: 5%;
      }
      &:nth-of-type(6) {
        width: 6%;
      }
      &:nth-of-type(7) {
        width: 11%;
      }
      &:nth-of-type(8) {
        width: 4%;
      }
      &:nth-of-type(9) {
        width: 6%;
      }
      &:nth-of-type(10) {
        width: 7%;
      }
      &:nth-of-type(11) {
        width: 13%;
      }
      &:nth-of-type(12) {
        width: 7%;
      }
      &:nth-of-type(13) {
        width: 7.5%;
      }
      &:nth-of-type(13) {
        width: 7.5%;
      }
    }
  }
  th {
    &:first-of-type {
      width: 5rem;
    }
    &:nth-of-type(2) {
      width: 6rem;
    }
    &:nth-of-type(3) {
      width: 8rem;
    }
    &:nth-of-type(4) {
      width: 10rem;
    }
    &:nth-of-type(5) {
      width: 30rem;
    }
    &:nth-of-type(6) {
      width: 13rem;
    }
    &:nth-of-type(7) {
      width: 10rem;
    }
    &:nth-of-type(8) {
      width: 11rem;
    }
    &:nth-of-type(9) {
      width: 30rem;
    }
    &:nth-of-type(10) {
      width: 14rem;
    }
    &:nth-of-type(11) {
      width: 14rem;
    }
    &:nth-of-type(12) {
      width: 10rem;
    }
    &:nth-of-type(13) {
      width: 18rem;
    }
    &:nth-of-type(14) {
      width: 18rem;
    }
    &:nth-of-type(15) {
      width: 45rem;
    }
    &:last-of-type {
      width: 10rem;
    }
  }
}
</style>
