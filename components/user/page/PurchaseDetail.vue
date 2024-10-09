<template>
  <main class="container">
    <div class="only-pc">
      <h1>Mypage</h1>
      <section class="tab-sec">
        <div class="pc-tabs">
          <h2>구매내역</h2>
          <NuxtLink to="/mypage/purchase/all" class="tab">전시·프로그램</NuxtLink>
          <NuxtLink to="/mypage/purchase/coffee" class="tab">커피</NuxtLink>
          <NuxtLink to="/mypage/purchase/membership" class="tab">멤버십·쿠폰함</NuxtLink>
          <NuxtLink to="/mypage/info" class="big-tab">내 정보 수정</NuxtLink>
        </div>
      </section>
    </div>
    <section v-if="detailData">
      <section class="info-sec">
        <h2 class="only-pc-flex" @click="$router.go(-1)"><i class="pc uic-arrow_pre" />이전</h2>
        <div class="info-wrap">
          <div class="img-area">
            <img :src="getImage(detailData.thumbnail?.savedFileName)" alt="" />
          </div>
          <div class="info-content">
            <h1>{{ detailData.title }}</h1>
            <div class="list-info grid col-xxl-6">
              <div class="grid col-xs-1">
                <div class="grid col-xs-3">
                  <p>입장 일시</p>
                  <p class="col-xs-span-2">{{ getDate(detailData) }}</p>
                </div>
              </div>
              <div class="grid col-xs-1">
                <div class="grid col-xs-3">
                  <p>상태</p>
                  <p
                    :class="{
                      payment: detailData.state === 'PAYMENT',
                      used: detailData.state === 'USED',
                      expired: detailData.state === 'EXPIRED',
                      refund: detailData.state === 'USER_REFUND' || 'ADMIN_REFUND'
                    }"
                    class="col-xs-span-2"
                  >
                    {{ getState(detailData.state) }}
                  </p>
                </div>
              </div>
              <div class="grid col-xs-1">
                <div class="grid col-xs-3">
                  <p>{{ list }}</p>
                  <p class="col-xs-span-2">
                    <template v-for="(item, index) in detailData.prices">
                      {{ item.type }} <b :key="index">{{ item.number }}</b
                      >{{ index === detailData.prices.length - 1 ? '' : ', ' }}
                    </template>
                  </p>
                </div>
              </div>
              <div class="grid col-xs-1">
                <div class="grid col-xs-3">
                  <p>입장권 아이디</p>
                  <p class="col-xs-span-2">{{ detailData.uuid }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="detailData.state === 'PAYMENT' || detailData.state === 'ISSUANCE'" class="btn">
          <ULink button-type="secondary" w-size="common1" :to="`/ticket-qr?code=${detailData.uuid}`" target="_blank">
            입장 QR 확인
          </ULink>
          <UButton @click="sendGift(detailData)">선물하기</UButton>
        </div>
      </section>
      <section v-if="detailData.type !== 'INVITE'" class="payment-sec">
        <h2>결제안내</h2>
        <div class="payment-head">
          <div>
            <i class="pc uic-info" />
            <p>
              <span>{{ purchaseInfo }}</span>
            </p>
          </div>
          <p class="pay-date only-pc"><b>결제 일시</b>{{ detailData.createdDate }}</p>
        </div>
        <div class="payment-body">
          <div class="date-area only-mobile">
            <h3>결제 일시</h3>
            <p>{{ detailData.createdDate }}</p>
          </div>
          <div class="payment-area">
            <div class="list-info grid" :class="[detailData.type !== 'NORMAL' ? 'col-md-4' : 'col-md-6']">
              <div class="grid col-sm-1 col-md-2 col-md-span-2">
                <div class="grid col-xs-2 col-md-span-6">
                  <p>총 수량</p>
                  <p>
                    <span>{{ detailData.number }}</span> 매
                  </p>
                </div>
              </div>
              <div class="grid col-sm-1 col-md-2 col-md-span-2">
                <div class="grid col-xs-2 col-md-span-6">
                  <p>총 금액</p>
                  <p>
                    <span>{{ getThreeCommaNum(detailData.price) }}</span> 원
                  </p>
                </div>
              </div>
              <div v-if="detailData.type === 'NORMAL'" class="grid col-sm-1 col-md-2 col-md-span-2">
                <div class="grid col-xs-2 col-md-span-6">
                  <p>결제 수단</p>
                  <p>{{ detailData.payMethod }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="payment-foot">
          <div class="table-area">
            <table>
              <thead>
                <tr>
                  <th>구분</th>
                  <th>금액</th>
                  <th>수량</th>
                  <th>합계</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in detailData.prices" :key="index">
                  <td>
                    {{ item.type }}
                  </td>
                  <td>
                    {{ getThreeCommaNum(item.price) }}
                  </td>
                  <td>
                    {{ item.number }}
                  </td>
                  <td>
                    {{ `${getThreeCommaNum(item.price * item.number)}` }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <UButton
            v-if="detailData.type === 'NORMAL' && detailData.state === 'PAYMENT' && isHideRefundButton"
            w-size="100"
            @click="modal.isRefund = true"
          >
            환불
          </UButton>
        </div>
      </section>
      <section v-if="pageType === 'ALL'" class="precautions-sec" :class="{ mt: detailData.type === 'INVITE' }">
        <h2>관람 유의사항</h2>
        <div class="list-area">
          <ul>
            <li>미술관에는 외부 음식 반입이 불가합니다.</li>
            <li>안내견을 제외한 반려동물 입장이 불가합니다.</li>
            <li>상업적 용도나 과도한 플래시를 사용하는 촬영은 삼가 해주시기 바랍니다.</li>
            <li>14세 미만의 아동은 반드시 보호자의 손을 잡고 관람해 주시기 바랍니다.</li>
            <li>
              본 전시는 안전선이 따로 구비되어있지 않습니다. 전시 작품이나 시설물이 훼손되지 않게 조심해서 관람해주세요.
            </li>
            <li>모든 가방류는 반입 불가합니다. 개인 차량 또는 물품 보관소에 꼭 보관해주시기 바랍니다.</li>
          </ul>
        </div>
      </section>
      <section v-else class="precautions-sec">
        <h2>유의사항</h2>
        <div class="list-area">
          <ul>
            <li>커피 주문은 헤레디움 앱 QR코드로 커피를 주문할 수 있습니다.</li>
            <li>커피 제작이 완료되면 카카오톡 알림톡으로 메세지가 발송됩니다.</li>
            <li>카페 음료는 헤레디움 전시 공간에 반입이 불가합니다.</li>
          </ul>
        </div>
      </section>
      <URefundModal :is-show="modal.isRefund" @close="modal.isRefund = false">
        <template #title>취소 및 환불 정책</template>
        <template #content>
          <CommonEditorContentOutput :contents="termsData?.contents" />
        </template>
        <template #modal-btn1>
          <UButton button-type="secondary" @click="modal.isRefund = false">닫기</UButton>
        </template>
        <template #modal-btn2>
          <UButton @click="onTicketsRefund">환불</UButton>
        </template>
        <template #etc>
          <UDialogModal no-scroll-lock :is-show="modal.isSave">
            <template #content>환불되었어요.</template>
            <template #modal-btn2>
              <UButton button-type="primary" @click="$router.push('/mypage/purchase/all')">확인</UButton>
            </template>
          </UDialogModal>
        </template>
      </URefundModal>
    </section>
  </main>
</template>

<script>
import { USER_PAYMENT_TYPE } from '~/assets/js/types';
import { threeCommaNum } from '~/assets/js/commons';
import UButton from '~/components/user/common/UButton';
import UDialogModal from '~/components/user/modal/UDialogModal';
import URefundModal from '~/components/user/modal/URefundModal';
import ULink from '~/components/user/common/ULink.vue';
import { dayOfWeekNumberToKoName } from '~/assets/js/converter';

export default {
  name: 'PurchaseDetailPage',
  components: { ULink, URefundModal, UDialogModal, UButton },
  props: {
    // pageType: ALL | COFFEE
    pageType: {
      type: String,
      required: false,
      default: 'ALL'
    },
    detailData: {
      type: Object,
      required: false,
      default: null
    },
    id: {
      type: [String, Number],
      required: false,
      default: null
    },
    termsData: {
      type: Object,
      required: false,
      default: () => null
    }
  },
  data() {
    return {
      list: '',
      purchaseInfo: '',
      modal: {
        isRefund: false,
        isSave: false
      }
    };
  },
  computed: {
    isHideRefundButton() {
      const today = this.$dayjs();
      const beforeStartOneDay = this.$dayjs(this.detailData.startDate).add(-1, 'day');

      return beforeStartOneDay.isAfter(today);
    }
  },
  created() {
    let list = '';
    let purchaseInfo = '';
    switch (this.pageType) {
      case 'ALL':
        list = '예매 내역';
        purchaseInfo = '당일 주문 결제 시, 환불 되지 않습니다.';
        break;
      case 'COFFEE':
        list = '주문 내역';
        purchaseInfo = '당일 주문은 환불되지 않아요.';
        break;
      default:
        list = '잘못된 리스트 입니다.';
        break;
    }
    this.list = list;
    this.purchaseInfo = purchaseInfo;
  },
  methods: {
    async onTicketsRefund() {
      await this.$axios.$put(`/user/account/tickets/${this.id}/refund`);
      this.modal.isSave = true;
    },
    getState(item) {
      return USER_PAYMENT_TYPE[item];
    },
    getImage(imageUrl) {
      return imageUrl ? this.$store.state.BASE_URL + imageUrl : require('~/assets/img/thumbnail_default.jpg');
    },
    getDate(item) {
      return item.prices.some((prices) => prices.type === '초대')
        ? `${this.$dayjs(item.endDate).format('YYYY-MM-DD')} 까지`
        : `${this.$dayjs(item.startDate).format('YYYY-MM-DD (dd) HH:mm')} - ${this.$dayjs(item.endDate).format(
            'HH:mm'
          )}`;
    },
    getThreeCommaNum(num) {
      return threeCommaNum(num);
    },
    sendGift(item) {
      const shareUrl = 'https://' + location.host + `/ticket-qr?code=${item.uuid}`;
      const userInfo = this.$store.getters['service/auth/getUserInfo'];
      const userName = userInfo?.name || '';
      const targetName = item.title;
      const ticketDate = this.getTicketDateFormat(item.startDate);
      const ticketItem = item.prices.map((ticket) => `${ticket.type} ${ticket.number}매`).join(', ');
      const text = `
헤레디움 티켓 선물\n
${userName}님께서 ${targetName} 티켓을 선물하셨습니다.

예매 내역: ${targetName}
입장(수령)일시: ${ticketDate}
예매 항목: ${ticketItem}
`;

      // eslint-disable-next-line no-undef
      Kakao.Share.sendDefault({
        objectType: 'text',
        text,
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl
        }
      });
    },
    getTicketDateFormat(startDate) {
      const targetDate = this.$dayjs(startDate).format('YYYY.MM.DD');
      const weekOfDay = dayOfWeekNumberToKoName(this.$dayjs(startDate).day());
      const startTime = this.$dayjs(startDate).format('HH:mm');

      return `${targetDate} (${weekOfDay}) ${startTime}`;
    }
  }
};
</script>

<style scoped lang="scss">
section + section {
  margin-top: 4rem;
}

.img-area {
  margin-bottom: 2rem;
  border-radius: 0.8rem;

  img {
    width: 100%;
    aspect-ratio: 16/11;
    border-radius: 0.8rem;
    object-fit: cover;
  }
}

.container {
  margin-bottom: 12rem;
}

h1 {
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 3.84rem;
}

h2 {
  padding-bottom: 1.4rem;
  border-bottom: 0.1rem solid var(--color-black);
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.8rem;
}

h3 {
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.6rem;
}

.info-sec {
  .list-info {
    margin-top: 2rem;
    padding: 2.4rem 0;
    border-top: 0.1rem solid var(--color-grey-2);
    border-bottom: 0.1rem solid var(--color-grey-2);
    > .grid + .grid {
      margin-top: 2rem;
    }

    .grid {
      p {
        font-size: 1.4rem;
        font-weight: 700;
        line-height: 1.4rem;

        &:nth-of-type(2) {
          font-weight: 500;

          &.payment {
            font-weight: 700;
            color: var(--color-u-primary);
          }
          &.used {
            font-weight: 700;
            color: var(--color-grey-3);
          }
          &.expired {
            font-weight: 700;
            color: var(--color-grey-3);
          }
          &.refund {
            font-weight: 700;
            color: var(--color-u-secondary);
          }

          b {
            font-weight: 600;
            color: var(--color-u-primary);
          }
        }
      }
    }
  }

  .btn {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1.6rem;
    margin-top: 2.4rem;
  }
}

.payment-sec {
  .payment-head {
    display: flex;
    align-items: center;
    padding: 1.6rem 1.6rem 1.8rem;
    background: rgba(235, 235, 235, 0.4);

    > div {
      display: flex;
      align-items: center;
    }

    p {
      font-size: 1.2rem;
      font-weight: 500;
      line-height: 1.2rem;
    }

    i {
      margin-right: 0.8rem;
    }
  }

  .payment-body {
    margin-top: 2.4rem;
    .date-area {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 2rem;
      border-bottom: 0.1rem solid var(--color-black);

      p {
        font-size: 1.6rem;
        font-weight: 400;
        line-height: 2.24rem;
      }
    }

    .payment-area {
      .list-info {
        > .grid {
          padding: 1.9rem 0;
          border-bottom: 0.1rem solid rgba(190, 190, 190, 0.4);

          p {
            font-size: 1.4rem;
            font-weight: 700;
            line-height: 1.4rem;

            &:last-of-type {
              font-weight: 500;
              text-align: right;

              span {
                font-size: 1.4rem;
                font-weight: 500;
                line-height: 1.4rem;
              }
            }
          }
        }
      }
    }
  }

  .payment-foot {
    width: 100%;

    .table-area {
      overflow-x: scroll;
      margin: 2rem -2rem;
      padding: 0 2rem;

      table {
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
        border-spacing: 0;
        border-top: 1px solid var(--color-black);

        th {
          font-weight: 700;
        }

        td {
          word-break: keep-all;
          font-weight: 500;
        }

        th + th,
        td + td {
          border-left: 0.1rem solid var(--color-black);
        }

        th,
        td {
          padding: 1.6rem 0.9rem 1.1rem 1.1rem;
          border-bottom: 0.1rem solid rgba(190, 190, 190, 0.4);
          font-size: 1.4rem;
          line-height: 150%;

          &:first-of-type {
            width: 12.8rem;
            text-align: left;
          }

          &:nth-of-type(2) {
            width: 15.8rem;
            text-align: right;
          }

          &:nth-of-type(3) {
            width: 12rem;
            text-align: right;
          }

          &:last-of-type {
            width: 15.8rem;
            text-align: right;
          }
        }
      }
    }
  }
}

.precautions-sec {
  .list-area {
    margin-top: 1.6rem;

    ul {
      li + li {
        margin-top: 0.8rem;
      }

      li {
        position: relative;
        padding-left: 0.9rem;

        &::before {
          content: '';
          position: absolute;
          top: 0.9rem;
          left: 0;
          width: 0.3rem;
          height: 0.3rem;
          background-color: var(--color-grey-2);
          border-radius: 50%;
        }
      }
    }
  }

  &.mt {
    margin-top: 4rem;
  }
}

@media screen and (min-width: 769px) {
  h1 {
    font-size: 2.4rem;
    font-weight: 700;
    line-height: 3.84rem;
  }

  h2 {
    padding-bottom: 1.4rem;
    border-bottom: 0.1rem solid var(--color-black);
    font-size: 1.8rem;
    font-weight: 700;
    line-height: 1.8rem;
  }

  h3 {
    font-size: 1.6rem;
    font-weight: 700;
    line-height: 1.6rem;
  }

  .container {
    display: flex;
    margin-bottom: 12.6rem;
    margin-top: 4.8rem;

    > div {
      width: 34.8rem;
      padding-right: 14.8rem;
    }

    > section {
      flex: 1 0 0;
    }

    .only-pc {
      h1 {
        margin: 0 0 4.7rem;
        font-size: 4.2rem;
        line-height: 150%;
      }
    }

    .pc-tabs {
      h1 {
        margin: 0 0 4.7rem;
        font-size: 4.2rem;
        line-height: 150%;
      }

      h2 {
        font-size: 1.8rem;
        font-weight: 700;
        line-height: 160%;
        letter-spacing: 0.25px;
        border-bottom: 1px solid var(--color-black);
        padding-bottom: 1rem;
        margin-bottom: 1.3rem;
      }

      a {
        display: block;
        font-size: 1.6rem;
        font-weight: 500;
        line-height: 160%;
        letter-spacing: 0.25px;
        margin-bottom: 2.6rem;

        &.nuxt-link-active {
          color: var(--color-u-primary);
          font-weight: 700;
        }

        &.big-tab {
          font-size: 1.8rem;
          font-weight: 700;
          line-height: 160%;
          letter-spacing: 0.25px;
        }
      }
    }
  }

  section + section {
    margin-top: 5.2rem;
  }

  .img-area {
    margin-bottom: 0;
    margin-right: 2.8rem;
    border-radius: 0.8rem;

    img {
      width: 32rem;
      aspect-ratio: 16/11;
      border-radius: 0.8rem;
      object-fit: cover;
    }
  }

  .info-sec {
    .btn {
      justify-content: flex-end;
    }

    h2.only-pc-flex {
      font-size: 3.2rem;
      font-weight: 500;
      line-height: 150%;
      align-items: center;
      cursor: pointer;
      margin-bottom: 2rem;

      i {
        font-size: 3.2rem;
        margin-right: 1.2rem;
      }
    }

    .info-wrap {
      display: flex;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--color-u-grey-2);

      .info-content {
        flex: 1 0 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }

    .list-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 2.4rem;
      row-gap: 2.4rem;
      padding: 0;
      border: 0;

      > .grid + .grid {
        margin-top: 0;
      }

      .grid {
        p {
          font-size: 1.6rem;
          font-weight: 700;
          line-height: 160%;

          &:nth-of-type(2) {
            font-weight: 500;
            grid-column: auto / span 2;
          }
        }
      }
    }
  }

  .payment-sec {
    h2 {
      font-size: 2.4rem;
      font-weight: 700;
      line-height: 150%;
      letter-spacing: 0.25px;
      border: 0;
      padding-bottom: 0;
      margin-bottom: 1.9rem;
    }

    .payment-head {
      padding: 1.6rem 2rem;
      display: flex;
      justify-content: space-between;

      > div {
        display: flex;
        align-items: center;
      }

      p {
        font-size: 1.4rem;
        line-height: 160%;
      }

      .pay-date {
        font-weight: 400;

        b {
          font-weight: 500;
          margin-right: 0.8rem;
        }
      }
    }

    .payment-body {
      margin-top: 2.4rem;

      .date-area {
        display: flex;
        justify-content: unset;
        align-items: center;
        padding-bottom: 2rem;
        border-bottom: 0.1rem solid var(--color-black);

        h3 {
          line-height: 150%;
        }

        p {
          margin-left: 2rem;
          line-height: 150%;
        }
      }

      .payment-area {
        border-top: 2px solid var(--color-black);

        .list-info {
          > .grid {
            padding: 1.6rem 2.4rem 1.4rem;
            border-bottom: 0.1rem solid rgba(190, 190, 190, 0.4);

            p {
              font-size: 1.6rem;
              line-height: 160%;

              &:last-of-type {
                font-weight: 500;
                text-align: right;
                line-height: 160%;

                span {
                  font-size: 1.6rem;
                  line-height: 160%;
                }
              }
            }
          }

          .grid + .grid {
            border-left: 1px solid var(--color-black);
          }
        }
      }
    }

    .payment-foot {
      width: 100%;

      .table-area {
        overflow-x: scroll;
        margin: 2rem -2rem;
        padding: 0 2rem;

        table {
          width: 100%;
          table-layout: fixed;
          border-collapse: collapse;
          border-spacing: 0;
          border-top: 1px solid var(--color-black);

          th {
            font-weight: 700;
          }

          td {
            font-weight: 500;
          }

          th,
          td {
            padding: 1.6rem 2.4rem;
            font-size: 1.6rem;
            line-height: 160%;

            &:first-of-type {
              width: 17.8rem;
            }

            &:nth-of-type(2) {
              width: auto;
            }

            &:nth-of-type(3) {
              width: 15.8rem;
            }

            &:last-of-type {
              width: auto;
            }
          }
        }
      }

      > button {
        width: 15.2rem !important;
        margin-left: auto;
      }
    }
  }

  .precautions-sec {
    margin-top: 2.4rem;

    h2 {
      font-size: 2.4rem;
      line-height: 150%;
      padding-bottom: 1.8rem;
    }

    .list-area {
      margin-top: 2rem;

      ul {
        li + li {
          margin-top: 0.4rem;
        }

        li {
          font-size: 1.6rem;
          padding-left: 1.5rem;
          line-height: 160%;

          &::before {
            top: 1rem;
          }
        }
      }
    }

    &.mt {
      margin-top: 5.2rem;
    }
  }
}
</style>
