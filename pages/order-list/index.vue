<template>
  <div class="container">
    <h1>
      <template v-if="kind === 'NON_MEMBER'">
        <span>{{ userData.name }}</span
        >님 예매 내역
      </template>
      <template v-else-if="hanaDecryptData && hanaDecryptData.name">
        <span>{{ hanaDecryptData.name }}</span
        >님 예매 내역
      </template>
    </h1>
    <UPageable :list-data="listData" :is-hide-pagination="listData?.content.length === 0" @getListData="changePage">
      <template #data="{ data }">
        <div class="ticketing-list">
          <div v-if="!data || !data[0]" class="ticketing-none">
            <div>
              <picture>
                <source srcset="~/assets/img/mobile/noresult.png" media="(max-width: 768px)" />
                <source srcset="~/assets/img/pc/noresult.png" media="(min-width: 769px)" />
                <img src="~/assets/img/mobile/noresult.png" alt="" />
              </picture>
            </div>
            <p>예매내역이 없습니다.</p>
            <ULink to="/" w-size="100">메인으로 돌아가기</ULink>
          </div>
          <div v-else>
            <a
              v-for="item in data"
              :key="item.id"
              class="ticketing-item grid col-xs-1 col-xxl-9 gap-xxl-col-32"
              @click="goDetail(`order-list/${item.id}`)"
            >
              <div class="col-xxl-span-3">
                <img :src="getImage(item.thumbnail?.savedFileName)" alt="" />
              </div>
              <div class="col-xxl-span-6">
                <div>
                  <div class="info">
                    <span
                      :class="{
                        payment: item.state === 'PAYMENT',
                        used: item.state === 'USED',
                        expired: item.state === 'EXPIRED',
                        refund: item.state === 'USER_REFUND' || item.state === 'ADMIN_REFUND'
                      }"
                    >
                      {{ getState(item.state) }}
                    </span>
                    <h3>{{ item.title }}</h3>
                  </div>
                  <p>{{ getDate(item) }}</p>
                </div>
                <div class="differentiate">
                  <p>
                    <template v-for="(infoItem, index) in item.info">
                      {{ infoItem.type }} <b :key="index">{{ infoItem.number }}</b
                      >{{ index === item.info.length - 1 ? '' : ', ' }}
                    </template>
                  </p>
                  <div v-if="item.state === 'PAYMENT' || item.state === 'ISSUANCE'" class="btn" @click.stop>
                    <ULink
                      button-type="secondary"
                      w-size="common1"
                      :to="`/ticket-qr?code=${item.uuid}`"
                      target="_blank"
                    >
                      입장 QR 확인
                    </ULink>
                    <UButton @click="sendGift(item)">선물하기</UButton>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </template>
    </UPageable>
  </div>
</template>
<script>
import UPageable from '~/components/user/common/UPageable.vue';
import UButton from '~/components/user/common/UButton.vue';
import ULink from '~/components/user/common/ULink.vue';
import { USER_PAYMENT_TYPE } from '~/assets/js/types';
import { dayOfWeekNumberToKoName } from '~/assets/js/converter';

export default {
  name: 'OrderList',
  components: { ULink, UButton, UPageable },
  asyncData({ store, redirect }) {
    const kind = store.getters['service/non-member-list/getKind'];
    const userData = store.getters['service/non-member-list/getUserData'];
    const hanaQueryData = store.getters['service/non-member-list/getHanaQueryData'];
    const hanaDecryptData = store.getters['service/non-member-list/getHanaDecryptData'];

    if (!kind) {
      redirect('/');
    } else if (kind === 'HANA' && (!hanaQueryData || !hanaDecryptData)) {
      redirect('/');
    } else if (kind === 'NON_MEMBER' && !userData) {
      redirect('/');
    }
    return { userData, kind, hanaQueryData, hanaDecryptData };
  },
  data() {
    return {
      userData: null,
      kind: null,
      hanaQueryData: null,
      hanaDecryptData: null,
      listData: null,
      queryOptions: {
        page: this.$route.query.page || '0'
      }
    };
  },
  async fetch() {
    await this.$router
      .replace({
        path: this.$route.path,
        query: this.queryOptions
      })
      .catch(() => {});
    if (this.kind === 'NON_MEMBER') {
      this.listData = await this.$axios.$post('/user/non-user/tickets', {
        size: 10,
        ...this.userData,
        ...this.queryOptions
      });
    } else if (this.kind === 'HANA') {
      this.listData = await this.$axios
        .$post('/user/hana-bank/tickets', {
          size: 10,
          ...this.hanaQueryData,
          ...this.queryOptions
        })
        .catch(() => {});
    }
  },
  mounted() {
    window.addEventListener('beforeunload', this.beforeUnloadEvent);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.beforeUnloadEvent);
  },
  methods: {
    beforeUnloadEvent(e) {
      e.returnValue = '';
      return '';
    },
    changePage(page) {
      this.queryOptions.page = page;
      this.$fetch();
    },
    getState(item) {
      return USER_PAYMENT_TYPE[item];
    },
    getDate(item) {
      return item.info.some((info) => info.type === '초대')
        ? `${this.$dayjs(item.endDate).format('YYYY-MM-DD')}까지`
        : `${this.$dayjs(item.startDate).format('YYYY-MM-DD (dd) HH:mm')} - ${this.$dayjs(item.endDate).format(
            'HH:mm'
          )}`;
    },
    getImage(imageUrl) {
      return imageUrl ? this.$store.state.BASE_URL + imageUrl : require('~/assets/img/thumbnail_default.jpg');
    },
    goDetail(linkUrl) {
      this.$emit('goDetail');
      this.$router.push(linkUrl);
    },
    goBack() {
      this.$router.push('/mypage/purchase/all');
    },
    sendGift(item) {
      window.removeEventListener('beforeunload', this.beforeUnloadEvent);
      const shareUrl = 'https://' + location.host + `/ticket-qr?code=${item.uuid}`;
      const userInfo = this.$store.getters['service/auth/getUserInfo'];
      const userName = userInfo?.name || this.hanaDecryptData?.name;
      const targetName = item.title;
      const ticketDate = this.getTicketDateFormat(item.startDate);
      const ticketItem = item.info.map((ticket) => `${ticket.type} ${ticket.number}매`).join(', ');
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

      setTimeout(() => {
        window.addEventListener('beforeunload', this.beforeUnloadEvent);
      }, 200);
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
<style lang="scss" scoped>
.container {
  margin-top: 5.5rem;
  margin-bottom: 12rem;
  max-width: 104.4rem;
}

h1 {
  font-size: 3.2rem;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: -0.05rem;
  padding-bottom: 2.64rem;
  border-bottom: 1px solid var(--color-default);
  margin-bottom: 2rem;

  span {
    color: var(--color-u-primary);
  }
}

.ticketing-list {
  .ticketing-item + .ticketing-item {
    margin-top: 4rem;
  }

  .ticketing-item {
    padding-bottom: 4rem;
    border-bottom: 0.1rem solid var(--color-grey-2);
    cursor: pointer;

    img {
      width: 100%;
      aspect-ratio: 16/11;
      border-radius: 0.8rem;
      object-fit: cover;
    }
    .info {
      margin-top: 2rem;

      span {
        display: block;
        margin-bottom: 1rem;
        font-size: 1.4rem;
        font-weight: 700;
        line-height: 1.4rem;

        &.payment {
          color: var(--color-u-primary);
        }
        &.used {
          color: var(--color-grey-3);
        }
        &.expired {
          color: var(--color-grey-3);
        }
        &.refund {
          color: var(--color-u-secondary);
        }
      }

      h3 {
        margin-bottom: 0.8rem;
        font-size: 1.8rem;
        font-weight: 600;
        line-height: 2.9rem;
      }
    }

    p {
      margin-bottom: 3.2rem;
      font-size: 1.4rem;
      font-weight: 400;
      line-height: 1.4rem;
    }

    .differentiate {
      display: flex;
      justify-content: space-between;
      flex-direction: column;

      p {
        margin-bottom: 1rem;
        font-size: 1.6rem;
        font-weight: 500;
        line-height: 1.6rem;

        b {
          font-weight: 600;
          color: var(--color-u-primary);
        }
      }

      .btn {
        display: flex;
        gap: 1.6rem;
        flex-wrap: wrap;
      }
    }
  }
}

@media screen and (min-width: 769px) {
  .ticketing-list {
    .ticketing-item + .ticketing-item {
      margin-top: 2rem;
    }

    .ticketing-item {
      display: flex;
      padding-bottom: 2rem;

      > div:first-child {
        margin-right: 2.8rem;
      }

      > div:last-child {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        flex: 1 0 0;
      }

      img {
        width: 32rem;
        aspect-ratio: 320/220;
        object-fit: cover;
      }

      .info {
        position: relative;
        display: flex;
        justify-content: space-between;
        margin-top: 0;

        span {
          position: absolute;
          height: 6rem;
          right: 0;
          margin-bottom: 0;
          font-size: 1.6rem;
          font-weight: 700;
          line-height: 160%;

          &.payment {
            color: var(--color-u-primary);
          }
          &.used {
            color: var(--color-grey-3);
          }
          &.expired {
            color: var(--color-grey-3);
          }
          &.refund {
            color: var(--color-u-secondary);
          }
        }

        h3 {
          margin-bottom: 1.2rem;
          font-size: 2rem;
          font-weight: 600;
          line-height: 150%;
          padding-right: 8rem;
          max-width: 100%;
        }
      }

      p {
        font-size: 1.4rem;
        line-height: 160%;
      }

      .differentiate {
        align-items: center;
        flex-direction: row;

        p {
          line-height: 160%;
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
