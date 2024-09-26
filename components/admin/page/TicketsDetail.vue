<template>
  <div>
    <h1 class="mb-17">
      <span class="blue">{{ detailData.title }}</span> {{ TICKET_TYPE[detailData.type] }}
      <span class="blue">{{ getThreeCommaNum(detailData.number) }}</span
      >매
    </h1>
    <div class="top">
      <SButton v-if="pageType === 'coffee'" class="mr-8" @click="sendCoffeeDoneMail(pageId)">제작완료</SButton>
      <SLink v-if="pageType === 'coffee'" button-type="transport-b" to="/admin/coffee/order">리스트</SLink>
      <SLink v-else button-type="transport-b" :to="`/admin/ticket/tickets/${pageType}`">리스트</SLink>
    </div>
    <h3 class="mb-12">입장권 정보</h3>
    <div class="info-table">
      <div class="row">
        <label>입장권 아이디</label>
        <div>{{ detailData.uuid }}</div>
        <label>티켓구분</label>
        <div>{{ TICKET_TYPE[detailData.type] }}</div>
      </div>
      <div class="row">
        <label>구분</label>
        <div>{{ TICKET_KIND_TYPE[detailData.kind] }}</div>
        <label>전시·프로그램 명</label>
        <div>{{ detailData.title }}</div>
      </div>
      <div class="row">
        <label>회차</label>
        <div>
          {{ roundDate }}
        </div>
      </div>
    </div>
    <div class="info-table">
      <div class="row">
        <label>상태</label>
        <div class="col-row">
          <div>
            <div>
              <span :class="{ red: detailData.state === 'USER_REFUND' || detailData.state === 'ADMIN_REFUND' }"
                >{{ TICKET_STATE_TYPE[detailData.state] }}&nbsp;
              </span>
              {{ detailData.logs[0] ? `- ${$dayjs(detailData.logs[0].createdDate).format('YYYY-MM-DD HH:mm')}` : '' }}
            </div>
            <div>
              <SButton
                v-if="detailData.state === 'PAYMENT' || detailData.state === 'ISSUANCE'"
                button-type="primary"
                @click="modal.isTickedUsed = true"
                >사용 완료</SButton
              >
              <SButton
                v-if="
                  detailData.state !== 'USER_REFUND' &&
                  detailData.state !== 'ADMIN_REFUND' &&
                  pageType !== 'invitation' &&
                  detailData.state !== 'ISSUANCE'
                "
                class="ml-8"
                @click="modal.isRefund = true"
                >환불</SButton
              >
            </div>
          </div>
          <div>
            <p v-for="item in detailData.logs" :key="item.createdDate">
              <span :class="{ red: item.state === 'USER_REFUND' || item.state === 'ADMIN_REFUND' }">{{
                TICKET_STATE_TYPE[item.state]
              }}</span>
              - {{ item.name }} -
              {{ $dayjs(item.createdDate).format('YYYY-MM-DD HH:mm') }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="info-table mb-24">
      <div class="row">
        <label>아이디</label>
        <div>
          <div>{{ detailData.email }}</div>
        </div>
      </div>
      <div class="row">
        <label>이름</label>
        <div>
          <div>{{ detailData.name }}</div>
        </div>
        <label>핸드폰 번호</label>
        <div>
          <div>{{ detailData.phone }}</div>
        </div>
      </div>
    </div>
    <h3 class="mb-12">결제 정보</h3>
    <div class="info-table">
      <div v-if="pageType !== 'group' && pageType !== 'invitation'" class="row">
        <label>결제아이디</label>
        <div>
          <div>{{ detailData.pgId }}</div>
        </div>
      </div>
      <div class="row">
        <label>총 수량</label>
        <div>
          <div>총 {{ detailData.number.toLocaleString() }}매</div>
        </div>
        <template v-if="pageType !== 'invitation'">
          <label>총 금액</label>
          <div>
            <div>
              총 {{ detailData.price.toLocaleString() }}원
              <template v-if="detailData.price !== detailData.originPrice">
                <br />
                <del>{{ detailData.originPrice.toLocaleString() }}</del
                >원
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div v-if="pageType !== 'group' && pageType !== 'invitation'" class="info-table">
      <div class="row all-title">
        <label>구분</label>
        <div>개별 단가</div>
        <label>수량</label>
        <div>합계</div>
      </div>
      <div v-for="(item, index) in detailData.prices" :key="index" class="row all-contents">
        <label>{{ item.type }}</label>
        <div>
          <div>
            {{ getThreeCommaNum(item.price) }}원
            <div v-if="item.price !== item.originPrice">
              <del>{{ item.originPrice.toLocaleString() }}</del
              >원
              {{ item.note }}
            </div>
          </div>
        </div>
        <label>{{ getThreeCommaNum(item.number) }}매</label>
        <div>
          <div>{{ getThreeCommaNum(item.price * item.number) }}원</div>
        </div>
      </div>
    </div>
    <SDialogModal :is-show="modal.isTickedUsed" @close="modal.isTickedUsed = false">
      <template #content>입장권을 사용완료 상태로 변경하겠습니까?</template>
      <template #modal-btn1>
        <SButton @click="modal.isTickedUsed = false">취소</SButton>
      </template>
      <template #modal-btn2>
        <SButton button-type="primary" :disabled="isConfirmPending" @click="setState('USED')">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isRefund" @close="modal.isRefund = false">
      <template #content>입장권을 환불하겠습니까?</template>
      <template #modal-btn1>
        <SButton @click="modal.isRefund = false">취소</SButton>
      </template>
      <template #modal-btn2>
        <SButton button-type="primary" :disabled="isConfirmPending" @click="setState('ADMIN_REFUND')">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isStateChange" @close="refreshPage">
      <template #content>상태가 변경되었습니다.</template>
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
import SLink from '~/components/admin/commons/SLink';
import { TICKET_STATE_TYPE, TICKET_TYPE, TICKET_KIND_TYPE } from '~/assets/js/types';
import { threeCommaNum } from '~/assets/js/commons';
import SButton from '~/components/admin/commons/SButton';
import SDialogModal from '~/components/admin/modal/SDialogModal';

export default {
  name: 'TicketsDetail',
  components: { SDialogModal, SButton, SLink },
  props: {
    pageType: {
      // all | exhibition | program | group | invitation | coffee
      type: String,
      required: false,
      default: 'all'
    },
    pageId: {
      type: [String, Number],
      required: false,
      default: null
    },
    fetchDetailData: {
      type: Object,
      required: false,
      default: () => null
    }
  },
  data() {
    return {
      TICKET_STATE_TYPE,
      TICKET_TYPE,
      TICKET_KIND_TYPE,
      modal: {
        isTickedUsed: false,
        isRefund: false,
        isStateChange: false,
        isCoffeeDone: false
      },
      isConfirmPending: false
    };
  },
  computed: {
    detailData() {
      return this.fetchDetailData;
    },
    roundDate() {
      const startDay = this.$dayjs(this.detailData.startDate);
      const endDay = this.$dayjs(this.detailData.endDate);
      return (
        startDay.format('YYYY-MM-DD HH:mm') +
        ' ~ ' +
        endDay.format(
          startDay.format('YYYY-MM-DD') === endDay.format('YYYY-MM-DD')
            ? 'HH:mm'
            : startDay.year() === endDay.year()
            ? 'MM-DD HH:mm'
            : 'YYYY-MM-DD HH:mm'
        )
      );
    }
  },
  methods: {
    getThreeCommaNum(num) {
      return threeCommaNum(num);
    },
    async setState(type) {
      this.isConfirmPending = true;
      await this.$axios
        .$put(`/admin/tickets/${this.pageId}?state=${type}`)
        .then(() => {
          this.modal.isTickedUsed = false;
          this.modal.isRefund = false;
          this.modal.isStateChange = true;
        })
        .catch((err) => {
          console.log(err);
        });
      this.isConfirmPending = false;
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
h1 .blue {
  color: var(--color-blue);
}

.top {
  display: flex;
  align-items: center;
  justify-content: right;
  border-bottom: 1px solid var(--color-grey-2);
  padding-bottom: 1.6rem;
  margin-bottom: 3.6rem;
}

.red {
  color: var(--color-red);
}

.top-div {
  border-top: 1px solid var(--color-grey-2);
  padding-top: 1.2rem;
}

.info-table .row {
  &.all-title {
    height: 4.4rem;

    > * {
      color: var(--color-grey-4);
      background-color: #fafafa;
      justify-content: center;
      font-size: 1.4rem;
      font-weight: 500;
      min-height: auto;
    }
  }

  &.all-contents * {
    color: var(--color-black);
    background-color: var(--color-white);
    font-size: 1.4rem;
    font-weight: 500;
    justify-content: flex-end;
    text-align: right;

    &:first-child {
      justify-content: center;
    }
  }

  div.col {
    flex-direction: column;
    flex: auto;
    min-height: auto;
    padding: 0.8rem 0;
    align-items: flex-start;
  }

  .col-row {
    display: block;
    padding: 0;

    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.8rem 1.9rem;
      min-height: 6rem;

      &:not(:first-child) {
        align-items: flex-start;
        flex-direction: column;
        justify-content: center;
      }

      &:first-child {
        border-bottom: 1px solid var(--color-grey-2);
      }

      > div {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
