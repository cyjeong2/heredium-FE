<template>
  <div>
    <STitle emoji="frame">전시</STitle>
    <div class="search mb-28">
      <div class="mb-24">
        <SDropdown v-model="queryOptions.searchDateType" :option-list="dateOptionList" class="mr-16" />
        <SDatepicker v-model="queryOptions.startDate" :max="queryOptions.endDate" />
        <span class="ml-8 mr-8">~</span>
        <SDatepicker v-model="queryOptions.endDate" :min="queryOptions.startDate" />
      </div>
      <div class="mb-24">
        <label>상태</label>
        <SCheckboxGroup v-model="queryOptions.paymentStatus" :group-list="stateList">예정</SCheckboxGroup>
      </div>
      <div>
        <SSearchBar v-model="queryOptions.text" @search="onSearch()" />
        <SButton button-type="primary" @click="onSearch()">검색</SButton>
        <SButton @click="onSearch(true)">초기화</SButton>
      </div>
    </div>
    <div class="top-menus mb-16">
      <SButton class="mr-16" @click="modal.isShowCreateCouponCompany = true">법인회원 등록 </SButton>
      <SButton class="mr-16" @click="modal.isUploadData = true">업로드하다 </SButton>
      <SButton class="mr-16" @click="downloadTemplateExcel">양식 다운로드 </SButton>
      <SButton class="mr-16" @click="downloadExcel">엑셀 다운로드 </SButton>

      <SDropdown v-model="queryOptions.size" :option-list="sizeOptionList" @change="onSelectSizeChange"
        >리스트 수:</SDropdown
      >
    </div>
    <SPageable :table-data="tableData" @getTableData="setCurrentPage">
      <template #data="{ data }">
        <table class="admin-table">
          <thead :class="{ 'data-none': !data || !data[0] }">
            <tr>
              <th>
                <SCheckbox v-model="isCheckedAll" @input="setCheckedAll" />
              </th>
              <th>NO</th>
              <th>멤버십</th>
              <th>제목</th>
              <th>상태</th>
              <th>결제일시</th>
              <th>시작일시</th>
              <th>종료일시</th>
              <th>쿠폰 수</th>
              <th>금액</th>
              <th>계정</th>
              <th>이름</th>
              <th>연락처</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!data || !data[0]">
              <td colspan="14"><div>리스트가 없습니다.</div></td>
            </tr>
            <tr v-for="(item, index) in data" :key="item.id">
              <td>
                <div>
                  <SCheckbox v-model="item.isChecked" />
                </div>
              </td>
              <td>
                <div>{{ tableData.startCount - index }}</div>
              </td>
              <td>
                <div class="text-left">{{ item?.membership_name }}</div>
              </td>
              <td>
                <div class="text-left">{{ item?.title }}</div>
              </td>
              <td>
                <div>{{ item?.payment_status }}</div>
              </td>
              <td>
                <div>
                  {{ item?.payment_date && $dayjs(item?.payment_date).format('YYYY-MM-DD  HH:mm') }}
                </div>
              </td>
              <td>
                <div>
                  {{ item?.start_date && $dayjs(item?.start_date).format('YYYY-MM-DD  HH:mm') }}
                </div>
              </td>
              <td>
                <div>
                  {{ item?.end_date && $dayjs(item?.end_date).format('YYYY-MM-DD  HH:mm') }}
                </div>
              </td>
              <td>
                <div>{{ item?.number_of_coupons }}</div>
              </td>
              <td>
                <div>{{ item?.amount }}</div>
              </td>
              <td>
                <div>{{ item?.email }}</div>
              </td>
              <td>
                <div>{{ item?.name }}</div>
              </td>
              <td>
                <div>{{ item?.phone }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </SPageable>

    <CouponCorporate
      v-if="modal.isShowCreateCouponCompany"
      @close="modal.isShowCreateCouponCompany = false"
    ></CouponCorporate>
    <UploadCorporateUser v-if="modal.isUploadData" @close="modal.isUploadData = false"></UploadCorporateUser>
  </div>
</template>

<script>
import STitle from '~/components/admin/commons/STitle';
import SPageable from '~/components/admin/commons/SPageable';
import SDropdown from '~/components/admin/commons/SDropdown';
import SButton from '~/components/admin/commons/SButton';
import SSearchBar from '~/components/admin/commons/SSearchBar';
import SDatepicker from '~/components/admin/commons/SDatepicker';
import SCheckboxGroup from '~/components/admin/commons/SCheckboxGroup';
import { TICKET_MEMBERSHIP_STATE_TYPE } from '~/assets/js/types';
import SCheckbox from '~/components/admin/commons/SCheckbox.vue';
import CouponCorporate from '~/components/admin/modal/CouponCorporate.vue';
import UploadCorporateUser from '~/components/admin/modal/UploadCorporateUser.vue';

export default {
  name: 'MembershipTicketPage',
  components: {
    SCheckbox,
    SCheckboxGroup,
    SDatepicker,
    STitle,
    SPageable,
    SDropdown,
    SButton,
    SSearchBar,
    CouponCorporate,
    UploadCorporateUser
  },
  layout: 'admin/default',
  data() {
    return {
      dateOptionList: [{ value: 'PAYMENT_DATE', label: '결제일시' }],
      sizeOptionList: [
        { value: 20, label: '20개' },
        { value: 30, label: '30개' },
        { value: 50, label: '50개' }
      ],
      queryOptions: {
        searchDateType: 'PAYMENT_DATE',
        paymentDateFrom: this.$route.query.startDate || '',
        paymentDateTo: this.$route.query.endDate || '',
        paymentStatus:
          typeof this.$route.query.paymentStatus === 'string'
            ? [this.$route.query.paymentStatus]
            : this.$route.query.paymentStatus || [],
        text: this.$route.query.text || '',
        size: Number(this.$route.query.size) || 20
      },
      tableData: null,
      isCheckedAll: false,
      modal: {
        isShowCreateCouponCompany: false,
        isUploadData: false
      }
    };
  },
  computed: {
    stateList() {
      return Object.entries(TICKET_MEMBERSHIP_STATE_TYPE).map(([key, value]) => ({
        label: value,
        value: key
      }));
    }
  },

  mounted() {
    this.fetch();
  },
  methods: {
    downloadTemplateExcel() {
      const fileName = 'company_upload_membership_template';

      this.$axios
        .$get('file/template/company-membership/download', {
          method: 'GET',
          responseType: 'blob'
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
    downloadExcel() {
      const paymentDateFrom = this.queryOptions.paymentDateFrom
        ? this.$dayjs(this.queryOptions.startDate).format('YYYY-MM-DD 00:00:00')
        : '';
      const paymentDateTo = this.queryOptions.paymentDateTo
        ? this.$dayjs(this.queryOptions.paymentDateTo).format('YYYY-MM-DD 23:59:59')
        : '';
      const fileName = '계정 목록';

      this.$axios
        .$get('/admin/accounts/with-membership-info/excel', {
          method: 'GET',
          responseType: 'blob',
          params: {
            ...this.queryOptions,
            paymentDateFrom,
            paymentDateTo,
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
    setCheckedAll(newValue) {
      this.tableData.content = this.tableData.content.map((info) => ({
        ...info,
        isChecked: newValue
      }));
    },
    async fetch() {
      await this.$router
        .replace({
          path: this.$route.path,
          query: this.queryOptions
        })
        .catch(() => {});

      this.tableData = await this.$axios.$get('/admin/accounts/with-membership-info', {
        params: {
          ...this.queryOptions,
          paymentDateFrom: this.queryOptions.paymentDateFrom ? `${this.queryOptions.paymentDateFrom} 00:00:00` : '',
          paymentDateTo: this.queryOptions.paymentDateTo ? `${this.queryOptions.paymentDateTo} 23:59:59` : ''
        }
      });
      this.tableData.startCount = this.tableData.totalElements - this.tableData.number * this.tableData.size;
    },
    getImage(imageUrl) {
      return imageUrl ? this.$store.state.BASE_URL + imageUrl : require('~/assets/img/thumbnail_default.jpg');
    },
    setCurrentPage(currentPage) {
      this.queryOptions.page = currentPage;
      this.fetch();
    },
    onSelectSizeChange() {
      this.queryOptions.page = 0;
      this.fetch();
    },
    onSearch(isReset) {
      if (isReset) {
        this.queryOptions.searchDateType = 'PAYMENT_DATE';
        this.queryOptions.paymentDateFrom = '';
        this.queryOptions.paymentDateTo = '';
        this.queryOptions.paymentStatus = [];
        this.queryOptions.text = '';
      }
      this.queryOptions.page = 0;
      this.fetch();
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
      width: 6%;
    }
    &:nth-of-type(3) {
      width: 15%;
    }
    &:nth-of-type(4) {
      width: 16%;
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
    &:nth-of-type(8) {
      width: 10%;
    }
    &:nth-of-type(9) {
      width: 7%;
    }
    &:nth-of-type(10) {
      width: 8%;
    }
    &:nth-of-type(11) {
      width: 17%;
    }
    &:nth-of-type(12) {
      width: 9%;
    }
    &:nth-of-type(13) {
      width: 5%;
    }
    &:last-of-type {
      width: 15%;
    }
  }
}
</style>
