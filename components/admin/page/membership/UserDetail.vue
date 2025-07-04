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
              <th>카테고리</th>
              <th>제목</th>
              <th>결제일시</th>
              <th>결제금액</th>
              <th>적립마일리지</th>
              <th>적립방법</th>
              <th>작성자</th>
              <th>작성일시</th>
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
              <!-- 카테고리 -->
              <td>
                <div class="text-left">{{ item.title }}</div>
              </td>
              <!-- 제목 -->
              <td>
                <div class="text-left">{{ item.title }}</div>
              </td>
              <!-- 결제일시 -->
              <td>
                <div>{{ $dayjs(item.createdDate).format('YYYY-MM-DD HH:mm:ss') }}</div>
              </td>
              <!-- 결제금액 -->
              <td>
                <div class="text-right">{{ item.price.toLocaleString() }}</div>
              </td>
              <!-- 적립마일리지 -->
              <td>
                <div class="text-right">{{ item.number.toLocaleString() }}</div>
              </td>
              <!-- 적립방법 -->
              <td>
                <div>{{ item.name }}</div>
              </td>
              <!-- 작성자 -->
              <td>
                <div>{{ getState(item.state) }}</div>
              </td>
              <!-- 작성일시 -->
              <td>
                <div>{{ $dayjs(item.createdDate).format('YYYY-MM-DD HH:mm:ss') }}</div>
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
import { GENDER_TYPE, TICKET_KIND_TYPE, TICKET_STATE_TYPE, TICKET_TYPE } from '~/assets/js/types';
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
      isOverlapId: false,
      originEmail: this.detailData.email,
      cloneDetailData: cloneDeep(this.detailData),
      feedback: {
        email: {
          success: true,
          isValid: true,
          text: ''
        }
      },
      modal: {
        isSave: false,
        isMileageModal: false
      },
      isConfirmPending: false
    };
  },
  methods: {
    onPointRegister(){
      this.modal.isMileageModal = true;
    },
    async handleSaveMileage(payload) {
      // payload = { accountId, category, type, paymentMethod, serialNumber, mileage }
      await this.$axios.$post('/admin/membership/mileage', payload);
      this.modal.isMileageModal = false;
      // 필요하면 리스트 리로딩...
    },
    updateDetailData() {
      const newValue = this.cloneDetailData.email;
      const originValue = this.originEmail;
      const email = this.feedback.email;

      if ((this.isOverlapId = newValue !== originValue)) {
        email.isValid = false;
        email.success = true;
        email.text = '이메일 중복확인을 해주세요.';
      } else {
        email.isValid = true;
        email.success = true;
        email.text = '';
      }
    },
    getGender(gender) {
      return GENDER_TYPE[gender];
    },
    getKind(kind) {
      return TICKET_KIND_TYPE[kind];
    },
    getType(type) {
      return TICKET_TYPE[type];
    },
    getState(state) {
      return TICKET_STATE_TYPE[state];
    },
    async checkRedundancy() {
      if (this.isValidate()) {
        const isOverlap = await this.$axios.$get(`/admin/accounts/duplicate`, {
          params: {
            email: this.cloneDetailData.email
          }
        });

        if (!isOverlap) {
          this.feedback.email.isValid = true;
          this.feedback.email.success = false;
          this.feedback.email.text = '사용가능한 이메일 입니다.';
          this.isOverlapId = false;
        } else {
          this.feedback.email.isValid = false;
          this.feedback.email.success = true;
          this.feedback.email.text = '가입된 이메일 입니다';
        }

        this.modal.isError = true;
      }
    },
    isValidate() {
      const clearValid = () => {
        Object.values(this.feedback).forEach((value) => {
          value.isValid = true;
        });
      };

      const emailPattern =
        /^([\w._-])*[a-zA-Z0-9]+([\w._-])*([a-zA-Z0-9])+([\w._-])+@([\w_-])*([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/;
      const isClearForm = () => !Object.values(this.feedback).find((value) => value.isValid === false);
      const emailFeedback = this.feedback.email;
      const { email } = this.cloneDetailData;

      clearValid();
      if (!email) {
        emailFeedback.isValid = false;
        emailFeedback.success = true;
        emailFeedback.text = '이메일을 입력해 주세요.';
      }

      if (!emailPattern.test(email)) {
        emailFeedback.isValid = false;
        emailFeedback.success = true;
        emailFeedback.text = '잘못된 이메일 양식입니다.';
      }
      return isClearForm();
    },
    providerTextConverter(type) {
      return type === 'KAKAO'
        ? '카카오'
        : type === 'GOOGLE'
        ? '구글'
        : type === 'NAVER'
        ? '네이버'
        : type === 'APPLE'
        ? '애플'
        : '이메일';
    }
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
        width: 20rem;
      }
      &:nth-of-type(3) {
        width: 30rem;
      }
      &:nth-of-type(4) {
        width: 10rem;
      }
      &:nth-of-type(5) {
        width: 10rem;
      }
      &:nth-of-type(6) {
        width: 10rem;
      }
      &:nth-of-type(7) {
        width: 8rem;
      }
      &:nth-of-type(8) {
        width: 30rem;
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
