<template>
  <div class="edit">
    <h1 class="mb-17">{{ titleText }}</h1>
    <div class="info-table">
      <div class="row">
        <label>이메일</label>
        <div>{{ cloneDetailData.email }}</div>
      </div>
      <div class="row">
        <label>이름</label>
        <div>{{ cloneDetailData.name }}</div>
      </div>
      <div class="row">
        <label>연락처</label>
        <div>{{ cloneDetailData.phone }}</div>
      </div>
      <div class="row">
        <label>생년월일</label>
        <div>{{ cloneDetailData.birthDate }}</div>
        <label>성별</label>
        <div>{{
                cloneDetailData.gender === 'M' ? '남'
                : cloneDetailData.gender === 'W' ? '여'
                : ''
            }}
      </div>
      </div>
      <div class="row">
        <label>가입일시</label>
        <div>{{ cloneDetailData.createdDate }}</div>
        <label>최근 로그인 일시</label>
        <div>{{ cloneDetailData.lastLoginDate }}</div>
      </div>
      <div class="row">
        <label>마케팅 수신 동의 여부</label>
        <div>{{ cloneDetailData.isMarketingReceive ? '동의' : '미동의' }}</div>
      </div>
    </div>
    <div class="bottom-menus mb-36">
      <SLink :to="baseUrl">리스트</SLink>
    </div>
    <div class="history-header mb-24">
      <SProgressTab :label="['마일리지 내역']" class="single-tab"/>
      <SButton button-type="primary" @click="onPointRegister">마일리지 등록</SButton>
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
          <thead :class="{ 'data-none': !data || !data[0] }">
            <tr>
              <th>NO</th>
              <th>구분</th>
              <th>카테고리</th>
              <th>제목</th>
              <th>적립일시</th>
              <th>일련번호</th>
              <th>결제금액</th>
              <th>적립마일리지</th>
              <th>결제방법</th>
              <th>작성자</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!data || !data[0]">
              <td colspan="100%"><div>리스트가 없습니다.</div></td>
            </tr>
            <tr v-for="(item, index) in data" :key="item.id">
              <!-- NO -->
              <td>
                <div>{{ tableData.startCount - index }}</div>
              </td>
              <!-- 구분 -->
              <td>
                <div class="text-center">{{ getTypeText(item.type) }}</div>
              </td>
              <!-- 카테고리 -->
              <td>
                <div class="text-center">{{ getCategoryText(item.category) }}</div>
              </td>
              <!-- 제목 -->
              <td>
                <div class="text-left">{{ item.title }}</div>
              </td>
              <!-- 적립일시 -->
              <td>
                <div>{{ $dayjs(item.createdDate).format('YYYY-MM-DD HH:mm:ss') }}</div>
              </td>
              <!-- 일련번호 -->
              <td>
                <div class="text-center">{{ item.serialNumber }}</div>
              </td>
              <!-- 결제금액 -->
              <td>
                <div class="text-right">{{ item.paymentAmount.toLocaleString() }}</div>
              </td>
              <!-- 적립마일리지 -->
              <td>
                <div class="text-right">{{ item.mileageAmount.toLocaleString() }}</div>
              </td>
              <!-- 결제방법 -->
              <td>
                <div>{{ getPaymentMethodText(item.paymentMethod) }}</div>
              </td>
              <!-- 작성자 -->
              <td>
                <div>{{ item.createdName }}</div>
              </td>
              <td>
                <div class="flex justify-center" style="margin-left: 5px;">
                  <SButton
                    v-if="item.type === 0"
                    button-type="standard"
                    size="small"
                    @click="handleBeforeRefund(item)"
                  >
                    취소
                  </SButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </SPageable>
    <SDialogModal :is-show="modal.isSave" @close="$router.push(baseUrl)">
      <template #content>회원정보가 수정되었습니다.</template>
      <template #modal-btn2>
        <SLink button-type="primary" :to="baseUrl">확인</SLink>
      </template>
    </SDialogModal>
     <SDialogModal :is-show="modal.isConfirmSave" @close="modal.isConfirmSave = false">
      <template #content>취소 하시겠습니까?</template>
      <template #modal-btn1>
        <SButton button-type="primary" @click="handleRefund">확인</SButton>
      </template>
    </SDialogModal>
    <MileageForm
      :account-id="id"
      :is-show="modal.isMileageModal"
      @close="modal.isMileageModal = false"
      @save="handleSaveMileage"
    />
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
// import SInput from '~/components/admin/commons/SInput';
// import SCheckbox from '~/components/admin/commons/SCheckbox';
import SLink from '~/components/admin/commons/SLink';
import SButton from '~/components/admin/commons/SButton';
import SPageable from '~/components/admin/commons/SPageable';
import SProgressTab from '~/components/admin/commons/SProgressTab';
import { CATEGORY_TYPE, PAYMENT_METHOD_TYPE, MILEAGE_EVENT_TYPE } from '~/assets/js/types';
import SDialogModal from '~/components/admin/modal/SDialogModal';
import MileageForm from '~/components/admin/page/membership/MileageForm.vue';

export default {
  name: 'UserDetail',
  components: { SDialogModal, SProgressTab, SPageable, SLink, SButton, MileageForm },
  props: {
    detailData: {
      type: Object,
      required: false,
      default: () => null
    },
    tableData: {
      type: Object,
      required: false,
      default: () => null
    }
  },
  data() {
    return {
      id: this.$route.params.id,
      titleText: '계정 정보',
      baseUrl: '',
      cloneDetailData: cloneDeep(this.detailData),
      modal: {
        isSave: false,
        isMileageModal: false,
        isConfirmSave: false
      },
      isConfirmPending: false,
      pendingRefundItem: null,
    };
  },
  methods: {
    onPointRegister(){
      this.modal.isMileageModal = true;
    },
    async handleSaveMileage(payload) {
      try {
        await this.$axios.$post('/admin/membershipMileage', payload);
        this.modal.isMileageModal = false;

        const currentPage = this.tableData.pageable.pageNumber;
        this.$emit('changePage', currentPage);

      } catch (err) {
        console.error(err);
        alert('저장에 실패했습니다.');
      }
    },
    getCategoryText(code) {
      return CATEGORY_TYPE[code] || '-';
    },
    getPaymentMethodText(code) {
      // PAYMENT_METHOD_TYPE 이 undefined 면 빈 객체로 대체
      const map = PAYMENT_METHOD_TYPE || {};
      return map[code] ?? '-';
    },
    getTypeText(code) {
      return MILEAGE_EVENT_TYPE[code] ?? '-';
    },
    handleBeforeRefund(item) {
      this.pendingRefundItem = item;
      this.modal.isConfirmSave = true;
    },
    async handleRefund() {
      try {
        const recordId = this.pendingRefundItem.id;
        this.modal.isConfirmSave = false;
        // 백엔드에 취소 API 엔드포인트가 있다면 호출
        await this.$axios.$post(`/admin/membershipMileage/${recordId}/refund`);

        // 성공 후 테이블 새로고침
        const currentPage = this.tableData.pageable.pageNumber;
        this.$emit('changePage', currentPage);
      } catch (err) {
        console.error(err);
        alert('취소 처리에 실패했습니다.');
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.edit {
  > h1 {
    b {
      color: var(--color-blue);
      margin-right: 2rem;
    }
  }
  > h4 {
    display: flex;
    align-items: center;
    padding-bottom: 1.9rem;
    border-bottom: 1px solid var(--color-grey-2);
  }

  .contents-title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    b {
      color: var(--color-blue);
      margin-right: 2rem;
    }
  }

  .contents {
    background-color: var(--color-white);
    border-radius: 0.3rem;
    overflow: hidden;
  }

  .bottom-menus {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2.4rem;
    padding-top: 2.4rem;
    border-top: 1px solid var(--color-grey-2);
  }

  .has-feedback > div {
    display: flex;
  }

  .admin-table {
    th {
      &:first-of-type {
        width: 5rem;
      }
      &:nth-of-type(2) {
        width: 10rem;
      }
      &:nth-of-type(3) {
        width: 10rem;
      }
      &:nth-of-type(4) {
        width: 30rem;
      }
      &:nth-of-type(5) {
        width: 10rem;
      }
      &:nth-of-type(6) {
        width: 10rem;
      }
      &:nth-of-type(7) {
        width: 10rem;
      }
      &:nth-of-type(8) {
        width: 8rem;
      }
      &:nth-of-type(9) {
        width: 10rem;
      }
      &:nth-of-type(10) {
        width: 10rem;
      }
      &:last-of-type {
        width: 10rem;
      }
    }
  }
  .history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.single-tab ::v-deep .tab:nth-child(2) {
  display: none !important;
}
</style>
