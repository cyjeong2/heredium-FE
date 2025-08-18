<template>
  <div>
    <STitle emoji="page">쿠폰 설정</STitle>
    <div class="mb-36">
      <h3 class="mb-16">쿠폰 설정</h3>
      <div class="setting-coupon">
        <CouponEditor
          v-if="couponData"
          :coupon="couponData"
          :is-issuance="true"
          :error="feedback"
          :refresh-time="syncCouponDataTime"
          :coupon-list="couponList"
          :mode="mode"
          :selected-coupon-id="selectedCouponId"
          :disabled="mode !== 'add' && mode !== 'edit'"
          @update-coupon="(e) => handleUpdateCoupon(e)"
          @update:selectedCouponId="val => selectedCouponId = val"
        />
        <div class="box-button">
          <!-- mode가 없을 때만: 추가/수정/삭제 -->
          <div v-if="!mode && isAdmin" class="action-buttons">
            <SButton @click="enterAddMode">추가</SButton>
            <SButton v-if="couponData.coupon_id" @click="enterEditMode">수정</SButton>
            <SButton v-if="couponData.coupon_id" button-type="standard" @click="confirmDelete">
              삭제
            </SButton>
          </div>

          <!-- add 혹은 edit 모드일 때만: 저장/취소 -->
          <div v-if="(mode === 'add' || mode === 'edit') && isAdmin" class="edit-form">
            <SButton button-type="primary" @click="confirmSave">저장</SButton>
            <SButton @click="cancelEdit">취소</SButton>
          </div>
          <!-- <SButton @click="resetCoupon">초기화</SButton> -->
        </div>
      </div>
    </div>
    <div class="mb-28">
      <h3 class="mb-16">계정 리스트</h3>
      <div class="search mb-24">
        <div class="mb-24">
          <SDropdown v-model="queryOptions.searchDateType" :option-list="dateOptionList" class="mr-16" />
          <SDatepicker v-model="queryOptions.signUpDateFrom" :max="queryOptions.signUpDateTo" :show-clean-icon="true" />
          <span class="ml-8 mr-8">~</span>
          <SDatepicker v-model="queryOptions.signUpDateTo" :min="queryOptions.signUpDateFrom" :show-clean-icon="true" />
        </div>
        <div class="mb-24">
          <label>상태</label>
          <SCheckbox v-model="queryOptions.hasNumberOfEntries">입장횟수</SCheckbox>
          <SCheckbox v-model="queryOptions.hasMembership">멤버십</SCheckbox>
          <SCheckbox v-model="queryOptions.alreadyDeliveredAdminSiteCoupon">쿠폰 발급 여부</SCheckbox>
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
          <SButton button-type="primary" @click="addUser"> + 선택추가</SButton>
        </div>
        <div class="right">
          <SButton class="mr-16" @click="exportMemberTable">엑셀 다운로드</SButton>
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
                <th>멤버십</th>
                <th>계정</th>
                <th>이름</th>
                <th>연락처</th>
                <th>최근로그인</th>
                <th>입장횟수</th>
                <th>생성일시</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!data || !data[0]">
                <td colspan="9"><div>리스트가 없습니다.</div></td>
              </tr>
              <tr v-for="(item, index) in data" :key="item.id">
                <td>
                  <div>
                    <SCheckbox v-model="item.isChecked" @click="item.isChecked = !item.isChecked" />
                  </div>
                </td>
                <td>
                  <div>{{ exportParams.page * exportParams.size + index + 1 }}</div>
                </td>
                <td>
                  <div>{{ item.membershipName }}</div>
                </td>
                <td>
                  <div>{{ item.email }}</div>
                </td>
                <td>
                  <div>{{ item.name }}</div>
                </td>
                <td>
                  <div>{{ item.phone }}</div>
                </td>
                <td>
                  <div>
                    <p>
                      {{ item?.lastLoginDate && $dayjs(item?.lastLoginDate).format('YYYY-MM-DD') }}
                    </p>
                    <p>
                      {{ item?.lastLoginDate && $dayjs(item?.lastLoginDate).format('HH:mm:ss') }}
                    </p>
                  </div>
                </td>
                <td>
                  <div>{{ item.numberOfEntries }}</div>
                </td>
                <td>
                  <div>
                    <p>
                      {{ item?.createdDate && $dayjs(item?.createdDate).format('YYYY-MM-DD') }}
                    </p>
                    <p>
                      {{ item?.createdDate && $dayjs(item?.createdDate).format('HH:mm:ss') }}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </SPageable>
    </div>
    <div class="mb-36">
      <div class="title-menu">
        <div class="left">
          <h3>선택 계정 리스트</h3>
        </div>
        <div class="right">
          <SButton button-type="transport-b" class="mr-8" @click="removeSelectedUser(true)">전체 삭제</SButton>
          <SButton button-type="transport-b" class="mr-8" @click="removeSelectedUser()">삭제</SButton>
          <input
            ref="accountFile"
            type="file"
            accept=".xlsx, .XLSX"
            class="is-blind"
            @change="uploadAccountFile($event)"
          />
          <SButton button-type="transport-b" class="mr-8" @click="$refs.accountFile.click()">엑셀 파일 업로드</SButton>
          <SDownloadExcelTemplate
            button-type="transport-b"
            class="mr-16"
            file-name="쿠폰 발급"
            url="/file/template/coupon-issuance/download"
          />
          <SDropdown v-model="selectedData.pageSize" :option-list="optionList" @change="onSelectSizeChange"
            >리스트 수:</SDropdown
          >
        </div>
      </div>
      <SPagination
        :table-wrap-class="'admin-table-wrap'"
        :table-data="selectedData.userList"
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
                <th>멤버십</th>
                <th>계정</th>
                <th>이름</th>
                <th>연락처</th>
                <th>최근로그인</th>
                <th>입장횟수</th>
                <th>생성일시</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!data || !data[0]">
                <td colspan="9"><div>리스트가 없습니다.</div></td>
              </tr>
              <tr v-for="(item, index) in data" :key="item.id">
                <td>
                  <div>
                    <SCheckbox v-model="item.isChecked" />
                  </div>
                </td>
                <td>
                  <div>{{ selectedData.tablePage * selectedData.pageSize + index + 1 }}</div>
                </td>
                <td>
                  <div>{{ item.membershipName }}</div>
                </td>
                <td>
                  <div>{{ item.email }}</div>
                </td>
                <td>
                  <div>{{ item.name }}</div>
                </td>
                <td>
                  <div>{{ item.phone }}</div>
                </td>
                <td>
                  <div>{{ item.lastLoginDate }}</div>
                </td>
                <td>
                  <div>{{ item.numberOfEntries }}</div>
                </td>
                <td>
                  <div>{{ item.createdDate }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </SPagination>
    </div>
    <div class="bottom">
      <SButton button-type="primary" :disabled="isConfirmPending" @click="handleOpenModalConfirm">발급</SButton>
    </div>
    <SDialogModal :is-show="isShowErrorModal" @close="isShowErrorModal = false">
      <template #content>{{ errorMsg }}</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="isShowErrorModal = false">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="isShowDoneModal" @close="onDone">
      <template #content>쿠폰이 발급되었습니다.</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="onDone">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="isConfirmSave" @close="isConfirmSave = false">
      <template #content>쿠폰 발송을 하시겠습니까?</template>
      <template #modal-btn1>
        <SButton button-type="primary" @click="issuedTicket()">확인</SButton>
      </template>
    </SDialogModal>
    <!-- 저장/삭제 확인 모달 -->
    <SDialogModal :is-show="showConfirmModal" @close="onConfirmModalClose">
      <template #content>{{ confirmMsg }}</template>
      <template #modal-btn1>
        <SButton @click="onConfirm()">확인</SButton>
      </template>
      <template #modal-btn2>
        <SButton @click="onConfirmModalClose()">취소</SButton>
      </template>
    </SDialogModal>

    <!-- 완료 모달 -->
    <SDialogModal :is-show="showDoneModal" @close="onDoneModalClose">
      <template #content>{{ doneMsg }}</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="onDoneModalClose()">확인</SButton>
      </template>
    </SDialogModal>
    <UploadAccountIssuance
      v-if="uploadResult"
      :success-cases="uploadResult.success_cases"
      :failed-cases="uploadResult.failed_cases"
      @close="uploadResult = null"
    />
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
// import { omit } from 'lodash';
import STitle from '~/components/admin/commons/STitle';
import SPageable from '~/components/admin/commons/SPageable';
import SButton from '~/components/admin/commons/SButton';
import SSearchBar from '~/components/admin/commons/SSearchBar';
import SDropdown from '~/components/admin/commons/SDropdown';
import SDatepicker from '~/components/admin/commons/SDatepicker';
import SCheckbox from '~/components/admin/commons/SCheckbox';
import { fileValid, threeCommaNum } from '~/assets/js/commons';
import SPagination from '~/components/admin/commons/SPagination';
import SDialogModal from '~/components/admin/modal/SDialogModal';
import CouponEditor from '~/components/admin/page/membership/CouponEditorNew.vue';
import { API_ERROR } from '~/utils/message';
import { COUPON_DEFAULT } from '~/assets/js/types';
import { downloadMixin } from '~/mixins/donloadMixin';
import SDownloadExcelTemplate from '~/components/admin/commons/SDownloadExcelTemplate.vue';
import UploadAccountIssuance from '~/components/admin/modal/UploadAccountIssuance.vue';

const INIT_GET_ACCOUNT_PARAMS = {
  page: 0,
  size: 5,
  searchDateType: 'CREATED_DATE',
  signUpDateFrom: '',
  signUpDateTo: '',
  hasNumberOfEntries: false,
  alreadyLoginedBefore: false,
  alreadyDeliveredAdminSiteCoupon: false,
  hasMembership: false,
  text: '',
  excludeIds: []
};

export default {
  name: 'CouponPage',
  components: {
    SDialogModal,
    SPagination,
    SCheckbox,
    SDatepicker,
    SDropdown,
    STitle,
    SPageable,
    SButton,
    SSearchBar,
    CouponEditor,
    SDownloadExcelTemplate,
    UploadAccountIssuance
  },
  mixins: [downloadMixin],
  layout: 'admin/default',
  data() {
    return {
      couponData: cloneDeep(COUPON_DEFAULT),
      syncCouponDataTime: 0,
      couponUsingId: null,
      couponSaved: null,
      feedback: {},
      dateOptionList: [{ value: 'CREATED_DATE', label: '생성일시' }],
      queryOptions: cloneDeep(INIT_GET_ACCOUNT_PARAMS),
      exportParams: cloneDeep(INIT_GET_ACCOUNT_PARAMS),
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
      searchSelectText: '',
      errorMsg: '',
      isShowErrorModal: false,
      isShowDoneModal: false,
      isConfirmPending: false,
      isConfirmSave: false,
      uploadResult: null,
      couponList: [],

      mode: null,                // null | 'add' | 'edit'
      showConfirmModal: false,   // 저장/삭제 확인 모달
      confirmMsg: '',            // 모달에 보여줄 메시지
      onConfirm: null,           // 모달 확인 시 실행할 콜백
      showDoneModal: false,      // 완료 모달
      doneMsg: '',               // 완료 메시지
      selectedCouponId: null,
    };
  },
  computed: {
    adminInfo() {
      return this.$store.getters['service/auth/getAdminUserInfo'];
    },
    isAdmin() {
      // ADMIN 권한만 true
      return this.isShowByAuthLevel(['ADMIN']);
    }
  },
  watch: {
    'tableData.content': {
      deep: true,
      handler(newValue) {
        this.isCheckedAll = newValue.length > 0 ? newValue.every((item) => item.isChecked) : false;
      }
    }
  },
  async mounted() {
    this.couponData = cloneDeep(COUPON_DEFAULT);
    await this.getCouponList();
  },
  created() {
    this.fetch();
  },
  methods: {
    async getCouponList() {
      try {
        const { data } = await this.$axios.get('/admin/coupons/all');
        this.couponList = Array.isArray(data) ? data : [];

        if (this.couponList.length > 0) {
          // ① 첫 번째 쿠폰을 기본 선택
          const first = this.couponList[0];
          this.selectedCouponId = first.coupon_id;

          this.couponData = {
            ...cloneDeep(first),
            // SDatepicker가 Date 객체를 기대한다면 toDate()
            start_date: first.start_date
              ? this.$dayjs(first.start_date).format('YYYY-MM-DD')
              : '',
            end_date: first.end_date
              ? this.$dayjs(first.end_date).format('YYYY-MM-DD')
              : '',
            // 만약 문자열 포맷으로 바인딩해야 한다면:
            // start_date: first.start_date ? this.$dayjs(first.start_date).format('YYYY-MM-DD') : '',
            // end_date:   first.end_date   ? this.$dayjs(first.end_date).format('YYYY-MM-DD')   : '',
          };

          this.couponSaved = cloneDeep(this.couponData);
        }
      } catch (e) {
        console.error('쿠폰 목록 조회 실패', e);
      }
    },
    validateCouponItem(couponItem) {
      const feedback = {};
      const today = this.$dayjs().startOf('day');
      const startDate = this.$dayjs(couponItem.start_date, 'YYYY-MM-DD', true);
      const endDate = this.$dayjs(couponItem.end_date, 'YYYY-MM-DD', true);

      // 쿠폰명
      if (!couponItem?.name) {
        feedback.name = true;
      }
      // 쿠폰종류
      if (!couponItem?.coupon_type) {
        feedback.couponType = true;
      }
      // 할인율
      if (!couponItem?.discount_percent || isNaN(Number(couponItem?.discount_percent))) {
        feedback.discountPercent = true;
      } else if (Number(couponItem?.discount_percent) > 100) {
        feedback.discountPercent = true;
      }
      // 이미지
      if (!couponItem?.image_url) {
        feedback.imageUrl = true;
      }

      // 정기 발송일 경우
      if (couponItem.is_recurring) {
        if (!couponItem?.period_in_days || isNaN(Number(couponItem?.period_in_days))) {
          feedback.periodInDays = true;
        }

        if (couponItem.is_recurring) {
          // ▼ 배열 길이 체크

          if (
            !Array.isArray(couponItem.recipient_type) ||
            couponItem.recipient_type.length === 0
          ) {
            feedback.recipient_type = true;
          }
        }

        if (!couponItem.send_day_of_month || isNaN(Number(couponItem.send_day_of_month))) {
          feedback.send_day_of_month = true;
        }
      } else if (couponItem.marketing_consent_benefit){
        if (!couponItem?.period_in_days || isNaN(Number(couponItem?.period_in_days))) {
          feedback.periodInDays = true;
        }
      }else {
        // 수동 발송일 경우
        if (!couponItem?.start_date || !startDate.isValid()) {
          feedback.start_date = true;
        } else if (startDate.isBefore(today)) {
          feedback.start_date = true;
        }

        if (!couponItem?.end_date || !endDate.isValid()) {
          feedback.end_date = true;
        } else if (endDate.isBefore(today)) {
          feedback.end_date = true;
        }

        if (couponItem.start_date && couponItem.end_date && endDate.isBefore(startDate)) {
          feedback.start_date = true;
          feedback.end_date = true;
        }
      }

      // 공통: 유효기간 제한이 있을 경우 횟수도 확인
      if (!couponItem?.is_permanent) {
        if (!couponItem?.number_of_uses || isNaN(Number(couponItem?.number_of_uses))) {
          feedback.numberOfUses = true;
        }
      }
      return isEmpty(feedback) ? null : feedback;
    },
    handleUpdateCoupon(newCouponData) {
      this.couponData = cloneDeep(newCouponData);
    },
    // 1) payload 생성 공통 함수
    buildPayload() {
      const payload = { ...this.couponData };
      // 신규/수정 공통: coupon_id 제외
      delete payload.coupon_id;


      // couponData에서 바로 꺼내기
      const {
        is_recurring: isRecurring,
        marketing_consent_benefit: marketingConsentBenefit,
        period_in_days: periodInDays,
        recipient_type: recipientType,
        send_day_of_month: sendDayOfMonth,
        start_date: startDate,
        end_date: endDate
      } = this.couponData;

      if (isRecurring || marketingConsentBenefit) {
        // camelCase 변수 사용
        payload.period_in_days    = periodInDays;
        payload.start_date        = null;
        payload.end_date          = null;
        payload.recipient_type    = isRecurring ? recipientType : null;
        payload.send_day_of_month = isRecurring ? sendDayOfMonth : null;
      } else {
        // 날짜 기반 모드
        payload.start_date = startDate
          ? this.$dayjs(startDate).format('YYYY-MM-DD 00:00:00')
          : null;
        payload.end_date   = endDate
          ? this.$dayjs(endDate).format('YYYY-MM-DD 23:59:59')
          : null;
        payload.period_in_days    = null;
        payload.recipient_type    = null;
        payload.send_day_of_month = null;
      }

      return payload;
    },
    async handleAddCoupon() {

      const payload = this.buildPayload();

      try {
        const { data } = await this.$axios.post(
          '/admin/coupons/non-membership',
          payload
        );
        this.feedback = {};
        return data;
      } catch (e) {
        alert(API_ERROR);
        return false;
      }
    },
    async handleUpdateCouponApi() {
      const payload = this.buildPayload();
      try {
        // PUT 엔드포인트가 payload 동일하게 받는다고 가정
        const { data } = await this.$axios.put(
          `/admin/coupons/${this.couponData.coupon_id}`,
          payload
        );
        return data;
      } catch (e) {
        alert(API_ERROR);
        return false;
      }
    },
    async fetch() {
      const signUpDateFrom = this.queryOptions.signUpDateFrom
        ? this.$dayjs(this.queryOptions.signUpDateFrom).format('YYYY-MM-DD 00:00:00')
        : '';
      const signUpDateTo = this.queryOptions.signUpDateTo
        ? this.$dayjs(this.queryOptions.signUpDateTo).format('YYYY-MM-DD 23:59:59')
        : '';

      try {
        this.tableData = await this.$axios.$get('/admin/accounts/with-membership', {
          params: {
            ...this.queryOptions,
            signUpDateFrom,
            signUpDateTo
          }
        });
        this.tableData = {
          ...this.tableData,
          startCount: this.tableData.totalElements - this.tableData.number * this.tableData.size,
          content: this.tableData.content.map((item) => ({ ...item, isChecked: false }))
        };
        this.updateExportParams();
      } catch (error) {
        alert(API_ERROR);
      }
    },
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
      this.queryOptions.page = page;
      this.fetch();
    },
    onUserSearch(isReset) {
      if (isReset) {
        this.queryOptions = {
          page: 0,
          size: 5,
          signUpDateFrom: '',
          signUpDateTo: '',
          hasNumberOfEntries: false,
          alreadyLoginedBefore: false,
          alreadyDeliveredAdminSiteCoupon: false,
          hasMembership: false,
          text: '',
          excludeIds: []
        };
        this.updateExportParams();
      }
      this.queryOptions.page = 0;
      this.fetch();
    },
    addUser() {
      const targetUserList = this.tableData.content.filter((item) => item.isChecked);

      targetUserList.forEach((value) => {
        this.queryOptions.excludeIds.push(value.id);
        this.updateExportParams();
        this.selectedData.userList.push({
          ...value,
          isChecked: false
        });
      });
      this.selectedData.userList = this.selectedData.userList.map((item, index) => ({ ...item, index: index + 1 }));
      const isLastPage = this.tableData?.totalPages === this.queryOptions?.page + 1;
      const isCheckedAllRecord = targetUserList.length && targetUserList.length === this.tableData?.content?.length;
      if (isLastPage && isCheckedAllRecord) {
        this.queryOptions.page = Math.max(0, this.queryOptions.page - 1);
      }
      this.fetch();
    },
    removeSelectedUser(isAll) {
      if (isAll) {
        this.queryOptions.excludeIds = [];
        this.updateExportParams();
        this.selectedData.userList = [];
      } else {
        const selectedUserRemain = [...this.selectedData.userList].filter((user) => !user.isChecked);

        this.selectedData.userList = selectedUserRemain;
        this.queryOptions.excludeIds = selectedUserRemain.map((item) => item.id);
        this.updateExportParams();
      }
      this.selectedData.tablePage = 0;
      this.fetch();
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
      this.selectedData.tablePage = 0;
      this.fetch();
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
      if (!this.selectedData?.userList?.length) {
        msg = '계정을 선택해 주세요.';
      } else {
        isValid = true;
      }

      if (!isValid) {
        this.errorMsg = msg;
        this.isShowErrorModal = true;
      }

      return isValid;
    },
    handleOpenModalConfirm() {

      // ① 추가/수정 모드일 때는 발급 금지
      if (this.mode === 'add' || this.mode === 'edit') {
        this.errorMsg = '쿠폰 설정을 저장하거나 취소한 후 발급을 진행해주세요.';
        this.isShowErrorModal = true;
        return;
      }

      if (!this.isValidate()) {
        return;
      }
      // IF COUPON IS EDITED THEN CALL API SAVE COUPON
      // if (!this.isEqualCouponSaved()) {
      //   const isAddedCoupon = !!(await this.handleAddCoupon());
      //   if (!isAddedCoupon) {
      //     return;
      //   }
      // }

      this.isConfirmSave = true;
    },
    async issuedTicket() {
      this.isConfirmPending = true;

      if (!this.isValidate()) {
        this.isConfirmPending = false;
        return;
      }

      try {
        const accountIds = this.selectedData.userList.map(item => item.id);
        await this.$axios.$post('/admin/coupons/assign', {
          account_ids: accountIds,
          coupon_id: this.selectedCouponId
        });

        this.isConfirmSave = false;
        this.isShowDoneModal = true;
      } catch (error) {
        alert(API_ERROR);
      } finally {
        this.isConfirmPending = false;
      }
    },
    refreshPage() {
      window.location.reload();
    },
    onDone() {
      this.isShowDoneModal = false;
      // 필요하다면 테이블만 리로드하거나, 선택된 계정 리스트 초기화
      this.selectedData.userList = [];
      this.queryOptions.excludeIds = [];
      this.fetch();              // 계정 리스트만 다시 불러오기
    },
    updateExportParams() {
      this.exportParams = cloneDeep(this.queryOptions);
    },
    exportMemberTable() {
      const params = cloneDeep(this.exportParams);
      params.signUpDateFrom = params.signUpDateFrom
        ? this.$dayjs(params.signUpDateFrom).format('YYYY-MM-DD 00:00:00')
        : '';
      params.signUpDateTo = params.signUpDateTo ? this.$dayjs(params.signUpDateTo).format('YYYY-MM-DD 23:59:59') : '';
      delete params.page;
      delete params.size;
      params.fileName = '계정리스트';
      this.downloadExcel(params.fileName, '/admin/accounts/with-membership/excel', params);
    },
    resetCoupon() {
      this.couponData = cloneDeep(COUPON_DEFAULT);
      this.syncCouponDataTime = Date.now();
    },
    async handleSaveCouponIssuancePage() {

      // if (isEqual(omit(this.couponData, ['tempId']), omit(COUPON_DEFAULT, ['tempId']))) {
      //   removeCouponIssuanceStorage();
      //   return;
      // }
      if (this.isEqualCouponSaved()) {
        return;
      }
      const couponSaved = await this.handleAddCoupon();
      if (couponSaved) {
        // setCouponIssuanceStorage(couponSaved.coupon_id);
        this.couponUsingId = couponSaved.coupon_id;
        couponSaved.start_date = this.$dayjs(couponSaved.start_date).format('YYYY-MM-DD');
        couponSaved.end_date = this.$dayjs(couponSaved.end_date).format('YYYY-MM-DD');
        this.couponData = cloneDeep(couponSaved);
        this.couponSaved = cloneDeep(couponSaved);
        this.syncCouponDataTime = Date.now();
      }
    },
    async getPageDataSaved(couponIdStored) {
      if (!couponIdStored) return false;
      // TODO: get coupon data
      this.couponUsingId = couponIdStored;
      try {
        const couponResponse = await this.$axios.get(`/admin/coupons/${couponIdStored}`);
        const couponData = couponResponse?.data;
        if (!couponData) {
          return false;
        }

        couponData.start_date = this.$dayjs(couponData.start_date).format('YYYY-MM-DD');
        couponData.end_date = this.$dayjs(couponData.end_date).format('YYYY-MM-DD');
        this.couponData = cloneDeep(couponData);
        this.couponSaved = cloneDeep(couponData);

        return true;
      } catch (error) {
        return false;
      }
    },
    async uploadAccountFile(e) {
      const file = e.target.files?.[0];
      if (!file) {
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      const extension = e.target.accept.split(',');
      const isValid = fileValid.check(e.target.files[0], maxSize, extension) !== null;

      if (!isValid) {
        this.isFileError = true;
        return null;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await this.$axios.$post(`/admin/accounts/coupon-issuance/upload`, formData);
        this.uploadResult = cloneDeep(res);
        const successCases = res.success_cases || [];
        if (!Array.isArray(successCases)) {
          return;
        }
        for (const account of successCases) {
          if (this.selectedData.userList.some((item) => item.id === account.id)) {
            continue;
          }
          this.selectedData.userList.push(account);
          this.queryOptions.excludeIds.push(account.id);
        }
        this.fetch();
      } catch (error) {
        const errorMessage = error.response.data?.MESSAGE || '';
        switch (errorMessage) {
          case 'INVALID_EXCEL_FILE':
            alert('xlsx 파일을 선택해주세요.');
            break;
          case 'INVALID_EXCEL_COLUMNS':
            alert('업로드된 엑셀 파일의 열이 지정된 템플릿과 일치하지 않습니다.');
            break;
          default:
            alert(API_ERROR);
            break;
        }
      }
      e.target.value = null;
      e.target.files = null;
    },
    isEqualCouponSaved() {
      if (!this.couponSaved || !this.couponData) {
        return false;
      }
      const couponSaved = cloneDeep(this.couponSaved);
      delete couponSaved.coupon_id;
      const currentCoupon = cloneDeep(this.couponData);
      delete currentCoupon.coupon_id;
      return isEqual(couponSaved, currentCoupon);
    },
    // 1) 추가 모드 진입
    enterAddMode() {
      this.backupSelectedCouponId = this.selectedCouponId
      this.backupCouponData       = cloneDeep(this.couponData)

      this.mode = 'add';
      // 기존 쿠폰 선택 초기화
      this.selectedCouponId = null;
      // 에디터 초기값으로 되돌리기
      this.couponData = cloneDeep(COUPON_DEFAULT);

      this.syncCouponDataTime = Date.now()
    },

    // 2) 수정 모드 진입
    enterEditMode() {
      this.backupSelectedCouponId = this.selectedCouponId
      this.backupCouponData       = cloneDeep(this.couponData)
      this.mode = 'edit';
    },

    // 3) 저장 전 확인 모달 띄우기
    confirmSave() {
      // 1) 전체 항목 검증
      const feedback = this.validateCouponItem(this.couponData)
      if (feedback) {
        this.feedback = feedback
        this.errorMsg = '필수 입력 항목을 모두 채워주세요.'
        this.isShowErrorModal = true
        return
      }

      // ▼ 추가: 수정 모드에서 저장하면 마케팅동의 쿠폰이 0개가 되는지 체크
      if (this.willMarketingCountBecomeZeroOnEditSave()) {
        this.confirmMsg = '저장 시 마케팅 동의 혜택 쿠폰이 없습니다. 계속하시겠습니까?';
        this.onConfirm = this.saveCoupon;
        this.showConfirmModal = true;
        return;
      }

      this.confirmMsg =
        this.mode === 'add'
          ? '신규 쿠폰을 저장하시겠습니까?'
          : '쿠폰을 저장하시겠습니까?';
      this.onConfirm = this.saveCoupon;
      this.showConfirmModal = true;
    },
     // 4) 실제 저장 API 호출
    async saveCoupon() {
      this.showConfirmModal = false;

      try {
        let saved;
        if (this.mode === 'add') {
          saved = await this.handleAddCoupon();
          this.doneMsg = '저장이 완료되었습니다.';
        } else {
          saved = await this.handleUpdateCouponApi();
          this.doneMsg = '수정이 완료되었습니다.';
        }

        if (saved && saved.coupon_id) {
          // 1) 선택 아이디 동기화
          this.selectedCouponId = saved.coupon_id;
          // 2) couponData 동기화
          this.couponData = cloneDeep(saved);
          this.couponSaved = cloneDeep(saved);
        }

        this.feedback = {};

        this.showDoneModal = true;
        await this.fetchCouponList();

        this.mode = null;
        this.selectedCouponId = saved.coupon_id;

      } catch (e) {
        alert('저장 중 오류가 발생했습니다.');
      }
    },
    // 5) 삭제 확인
    confirmDelete() {

      // ▼ 추가: 삭제하면 0개 되는지 체크
      if (this.willMarketingCountBecomeZeroOnDelete()) {

        // 또는 사용자 확인 후 진행:
        this.confirmMsg = '삭제 시 마케팅 동의 혜택 쿠폰이 없습니다. 계속하시겠습니까?';
        this.onConfirm = this.deleteCoupon;
        this.showConfirmModal = true;
        return;
      }

      this.confirmMsg = '쿠폰을 정말 삭제 하시겠습니까?';
      this.onConfirm = this.deleteCoupon;
      this.showConfirmModal = true;
    },
    // 6) 실제 삭제 API 호출
    async deleteCoupon() {
      this.showConfirmModal = false;
      try {
        await this.$axios.delete(`/admin/coupons/${this.couponData.coupon_id}`);
        this.doneMsg = '삭제가 완료되었습니다.';
        this.showDoneModal = true;
        this.fetchCouponList();
        this.mode = null;

        // 3) 첫 번째 쿠폰 자동 선택
        if (this.couponList.length > 0) {
          const first = this.couponList[0];
          this.selectedCouponId = first.coupon_id;
          this.couponData       = cloneDeep(first);
        } else {
          // 남은 쿠폰이 없으면 초기 상태로
          this.selectedCouponId = null;
          this.couponData       = cloneDeep(COUPON_DEFAULT);
        }
      } catch (e) {
        alert('삭제 중 오류가 발생했습니다.');
      }
    },

    // 취소
    cancelEdit() {
      this.mode = null;
      // 부모의 상태 복원
      this.selectedCouponId  = this.backupSelectedCouponId
      this.couponData        = cloneDeep(this.backupCouponData)

      // 그리고 child 가 prop 변경을 감지하도록 refreshTime 을 갱신
      // (CouponEditor 의 `watch: { refreshTime }` 가 동작합니다)
      this.syncCouponDataTime = Date.now()

      this.feedback = {}
    },
    // 모달 닫기 핸들러
    onConfirmModalClose() {
      this.showConfirmModal = false;
    },
    onDoneModalClose() {
      this.showDoneModal = false;
    },

    // 쿠폰 목록 다시 불러오기
    async fetchCouponList() {
      const { data } = await this.$axios.get('/admin/coupons/all');
      this.couponList = data.map(c => ({
        ...c,
        start_date: c.start_date ? this.$dayjs(c.start_date).format('YYYY-MM-DD') : '',
        end_date: c.end_date ? this.$dayjs(c.end_date).format('YYYY-MM-DD') : '',
        recipient_type: Array.isArray(c.recipient_type)
          ? c.recipient_type
          : c.recipient_type != null
          ? [c.recipient_type]
          : []
      }));
    },
    isShowByAuthLevel(allowAuthTypes) {
      return allowAuthTypes.includes(this.adminInfo?.auth);
    },
    // 현재 목록(서버 기준)에서 마케팅동의 쿠폰 개수
    getMarketingCount(list) {
      if (!Array.isArray(list)) return 0;
      return list.filter(c => !!c.marketing_consent_benefit).length;
    },

    // [수정 저장] 시, 수정 적용 후 개수 시뮬레이션
    willMarketingCountBecomeZeroOnEditSave() {
      if (this.mode !== 'edit') return false;
      // 서버에서 받은 전체 목록 복사
      const afterList = this.couponList.map(c => ({ ...c }));
      const idx = afterList.findIndex(c => c.coupon_id === this.couponData.coupon_id);
      if (idx >= 0) {
        // 현재 에디터 값으로 치환 (최소 필요한 필드만)
        afterList[idx].marketing_consent_benefit = !!this.couponData.marketing_consent_benefit;
      }
      const beforeCnt = this.getMarketingCount(this.couponList);
      const afterCnt  = this.getMarketingCount(afterList);
      return beforeCnt > 0 && afterCnt === 0;
    },

    // [삭제] 시, 삭제 적용 후 개수 시뮬레이션
    willMarketingCountBecomeZeroOnDelete() {
      if (!this.couponData?.coupon_id) return false;
      const beforeCnt = this.getMarketingCount(this.couponList);
      // 삭제 대상이 마케팅동의 쿠폰이고, 현재 개수가 1개뿐이라면 → 삭제 후 0개
      const targetIsMarketing = !!this.couponData.marketing_consent_benefit;
      return beforeCnt === 1 && targetIsMarketing === true;
    },
  }
};
</script>

<style lang="scss" scoped>
.setting-coupon {
  background-color: white;
  padding: 2.8rem 3.2rem;

  .box-button {
    margin-top: 2rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    column-gap: 8px;

    .action-buttons, .edit-form {
      display: flex;
      gap: 8px;       /* 버튼 사이 간격 */
      align-items: center;
    }
  }
}
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
      width: 6%;
    }
    &:nth-of-type(3) {
      width: 207px;
      min-width: 207px;
    }
    &:nth-of-type(4) {
      width: 14%;
    }
    &:nth-of-type(5) {
      width: 9%;
    }
    &:nth-of-type(6) {
      width: 10%;
    }
    &:nth-of-type(7) {
      width: 12%;
    }
    &:nth-of-type(8) {
      width: 6%;
    }
    &:last-of-type {
      width: 15%;
    }
  }
}
</style>
