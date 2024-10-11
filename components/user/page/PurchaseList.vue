<template>
  <main class="container">
    <SideBarMyPage />
    <section>
      <div class="ticketing-head">
        <h2>{{ recentlyList }}</h2>
        <NuxtLink :to="`${baseUrl}/list`" class="only-mobile">
          <span>{{ allList }}</span> <i class="m umic-arrow_forward" />
        </NuxtLink>
      </div>
      <div class="ticketing-body">
        <div class="ticketing-info">
          <div class="left">
            <i class="pc uic-info" />
            <p>지난 <strong>1개월</strong> 동안의 {{ type }} 내역입니다.</p>
          </div>
          <NuxtLink :to="`${baseUrl}/list`" class="only-pc-flex">
            <span>{{ allList }}</span> <i class="pc uic-arrow_next" />
          </NuxtLink>
        </div>
        <UPageable
          :list-data="listData"
          :is-hide-pagination="listData?.content.length === 0"
          @getListData="
            (page) => {
              $emit('changePage', page);
            }
          "
        >
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
                <p>{{ noneText }}</p>
                <ULink :to="`${linkUrl}`" w-size="100">{{ linkText }}</ULink>
              </div>
              <div v-else>
                <a
                  v-for="item in data"
                  :key="item.id"
                  class="ticketing-item grid col-xs-1 col-xxl-9 gap-xxl-col-32"
                  @click="goDetail(`${baseUrl}/${item.id}`)"
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
                          >{{ getState(item.state) }}</span
                        >
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
    </section>
  </main>
</template>

<script>
import SideBarMyPage from './SideBarMyPage.vue';
import UPageable from '~/components/user/common/UPageable';
import { USER_PAYMENT_TYPE } from '~/assets/js/types';
import 'dayjs/locale/ko';
import ULink from '~/components/user/common/ULink';
import { dayOfWeekNumberToKoName } from '~/assets/js/converter';
import UButton from '~/components/user/common/UButton.vue';

export default {
  name: 'PurchaseListPage',
  components: { UButton, ULink, UPageable, SideBarMyPage },
  props: {
    // pageType: ALL | COFFEE
    pageType: {
      type: String,
      required: false,
      default: 'ALL'
    },
    listData: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      baseUrl: '',
      linkText: '',
      noneText: '',
      linkUrl: '',
      allList: '',
      recentlyList: '',
      type: ''
    };
  },
  computed: {
    isCoffeePurchase() {
      const pathElementList = this.$route.path.split('/');

      return pathElementList.includes('purchase') && pathElementList.includes('coffee');
    }
  },
  created() {
    let baseUrl = '';
    let linkText = '';
    let noneText = '';
    let linkUrl = '';
    let allList = '';
    let recentlyList = '';
    let type = '';
    switch (this.pageType) {
      case 'ALL':
        baseUrl = '/mypage/purchase/all';
        linkText = '전시·프로그램 둘러보기';
        linkUrl = '/exhibition';
        noneText = '지난 1개월 동안은 예매 내역이 없네요.';
        allList = '전체 예매 내역';
        recentlyList = '최근 예매 내역';
        type = '예매';
        break;
      case 'COFFEE':
        baseUrl = '/mypage/purchase/coffee';
        linkText = '커피 주문하러 가기';
        linkUrl = '/coffee';
        noneText = '지난 1개월 동안은 주문 내역이 없네요.';
        allList = '전체 주문 내역';
        recentlyList = '최근 주문 내역';
        type = '주문';
        break;
      default:
        baseUrl = '/';
        break;
    }
    this.baseUrl = baseUrl;
    this.linkText = linkText;
    this.noneText = noneText;
    this.linkUrl = linkUrl;
    this.allList = allList;
    this.recentlyList = recentlyList;
    this.type = type;
  },
  methods: {
    getState(item) {
      return USER_PAYMENT_TYPE[item];
    },
    getDate(item) {
      return item.info.some((info) => info.type === '초대')
        ? `${this.$dayjs(item.endDate).format('YYYY.MM.DD')}까지`
        : `${this.$dayjs(item.startDate).format('YYYY.MM.DD (dd) HH:mm')} - ${this.$dayjs(item.endDate).format(
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
    sendGift(item) {
      const shareUrl = 'https://' + location.host + `/ticket-qr?code=${item.uuid}`;
      const userInfo = this.$store.getters['service/auth/getUserInfo'];
      const userName = userInfo?.name || '';
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
h1 {
  margin: 3.2rem 0 4rem;
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 2.8rem;
}

.container {
  margin-bottom: 12rem;
}

.tabs {
  &.page {
    display: flex;
    margin-bottom: 2rem;

    .tab + .tab {
      margin-left: 2.4rem;
    }

    .tab {
      font-size: 1.8rem;
      font-weight: 500;
      line-height: 1.8rem;
      color: var(--color-grey-4);

      &.nuxt-link-active {
        color: var(--color-u-primary);
        font-weight: 700;
      }
    }
  }

  &.grid {
    margin-bottom: 4rem;

    .tab + .tab {
      border-left: none;
    }

    .tab {
      padding: 1.3rem 1.6rem;
      border: 0.1rem solid var(--color-grey-2);
      font-size: 1.4rem;
      font-weight: 700;
      line-height: 1.4rem;
      text-align: center;
      color: var(--color-grey-3);

      &.nuxt-link-active {
        background-color: var(--color-u-primary);
        color: var(--color-white);
      }
    }
  }
}

.ticketing-head {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    line-height: 1.8rem;
  }

  a {
    display: flex;
    align-items: center;

    span {
      font-size: 1.2rem;
      font-weight: 500;
      line-height: 1.2rem;
    }

    i {
      margin-left: 0.8rem;
      font-size: 1.6rem;
    }
  }
}

.ticketing-body {
  margin-top: 1.3rem;
  border-top: 0.1rem solid var(--color-black);

  .ticketing-info {
    display: flex;
    align-items: center;
    margin-bottom: 4rem;
    padding: 1.6rem 1.6rem 1.7rem;
    background: rgba(235, 235, 235, 0.4);

    .left {
      display: flex;
      align-items: center;
    }

    i {
      margin-right: 0.8rem;
      font-size: 2rem;
    }

    p {
      font-size: 1.2rem;
      font-weight: 500;
      line-height: 1.2rem;

      strong {
        display: inline-flex;
        transform: translateY(0.1rem);
        font-weight: 700;
      }
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
  .ticketing-none {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 4rem;
    border-bottom: 0.1rem solid var(--color-black);

    div {
      margin-bottom: 1.2rem;
    }

    p {
      margin-bottom: 4rem;
      font-size: 1.4rem;
      font-weight: 400;
      line-height: 1.4rem;
    }
  }
}

@media screen and (min-width: 769px) {
  h1 {
    margin: 0 0 4.7rem;
    font-size: 4.2rem;
    line-height: 150%;
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
  }

  .pc-tabs {
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

  .ticketing-head {
    h2 {
      font-size: 3.2rem;
      font-weight: 500;
      line-height: 150%;
    }

    a {
      span {
        font-size: 1.4rem;
        font-weight: 500;
        line-height: 160%;
      }

      i {
        margin-left: 0.4rem;
        font-size: 2.4rem;
      }
    }
  }

  .ticketing-body {
    margin-top: 2.6rem;
    border-top: 0.1rem solid var(--color-black);

    .ticketing-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
      padding: 1.6rem 2rem;

      i {
        font-size: 2.4rem;
      }

      p {
        font-size: 1.4rem;
        font-weight: 500;
        line-height: 160%;
      }

      a {
        font-size: 1.4rem;
        line-height: 160%;

        i {
          margin-left: 0.4rem;
          margin-right: 0;
          font-size: 2.4rem;
        }
      }
    }

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

    .ticketing-none {
      padding-top: 3rem;
      padding-bottom: 6.2rem;

      div {
        margin-bottom: 2.6rem;
      }

      p {
        margin-bottom: 3.2rem;
        font-size: 1.6rem;
        font-weight: 500;
        line-height: 160%;
      }

      a {
        width: 21rem !important;
      }
    }
  }
}
</style>
