<template>
  <div>
    <div class="top-banner mb-28">
      <div>
        <STag :type="detailData.state" />
      </div>
      <div class="bottom">
        <div class="info">
          <h2>{{ detailData.title }}</h2>
          <h3>{{ detailData.subtitle }}</h3>
        </div>
        <div class="btn-area">
          <SLink to="/admin/coffee/manage" class="mr-8" button-type="transport-b">리스트</SLink>
          <SButton class="mr-8" button-type="transport-b" @click="showPreview">미리보기</SButton>
          <SLink :to="`/admin/coffee/manage/edit/${id}`" button-type="primary">수정</SLink>
        </div>
      </div>
    </div>
    <div class="basic-info mb-36">
      <div class="mr-28">
        <img :src="getImage(detailData.thumbnail)" alt="" />
      </div>
      <div class="info-table">
        <div class="row">
          <label>최초 등록일시</label>
          <div>{{ $dayjs(detailData.createdDate).format('YYYY-MM-DD HH:mm') }}</div>
          <label>등록자</label>
          <div>{{ detailData.createdName }}</div>
        </div>
        <div class="row">
          <label>최종 수정일시</label>
          <div>{{ $dayjs(detailData.lastModifiedDate).format('YYYY-MM-DD HH:mm') }}</div>
          <label>수정자</label>
          <div>{{ detailData.lastModifiedName }}</div>
        </div>
        <div class="row">
          <label>판매기간</label>
          <div>
            {{ $dayjs(detailData.startDate).format('YYYY-MM-DD') }} ~
            {{ $dayjs(detailData.endDate).format('YYYY-MM-DD') }}
          </div>
          <label>예매오픈</label>
          <div>{{ $dayjs(detailData.bookingDate).format('YYYY-MM-DD') }}</div>
        </div>
        <div class="row">
          <label>전시홀</label>
          <div>{{ detailData.halls.map((hall) => `${hall}홀`).join(', ') }}</div>
          <label>노출상태</label>
          <div>{{ detailData.isEnabled ? '노출' : '미노출' }}</div>
        </div>
      </div>
    </div>
    <div class="edit-area">
      <div class="left">
        <div v-scroll-spy="{ allowNoActive: true }">
          <section data-index="0" class="round mb-36">
            <div>
              <h3 class="mb-16">회차</h3>
            </div>
            <div class="round-inner">
              <div class="mr-28">
                <SCalendar
                  :ex-start-date="detailData.startDate"
                  :ex-end-date="detailData.endDate"
                  :holiday-list="holidayList"
                  :computed-round-data="computedRoundData"
                  :selected-round-date="selectedRoundDate"
                  @onSelectedDate="onSelectedDate"
                />
              </div>
              <div class="round-wrap">
                <p class="h4">
                  {{ $dayjs(selectedRoundDate).format('YYYY년 MM월 DD일') }}
                  <span v-if="currentRoundData" class="ml-8 bt-2r">총 {{ currentRoundData.rounds.length }}회차</span>
                </p>
                <div class="round-list">
                  <template v-if="currentRoundData && currentRoundData.rounds">
                    <div v-if="!currentRoundData.rounds || !currentRoundData.rounds[0]" class="round-item-empty">
                      리스트가 없습니다.
                    </div>
                    <div v-for="(item, index) in currentRoundData.rounds" :key="item.startDate" class="round-item">
                      <p class="count">{{ index + 1 }}</p>
                      <p class="time nt-3">
                        {{ $dayjs(item.startTime, 'HH:mm:ss').format('HH:mm') }} ~
                        {{ $dayjs(item.endTime, 'HH:mm:ss').format('HH:mm') }}
                      </p>
                      <div class="personnel">
                        <div class="bt-1m">
                          수령<span class="nt-3 ml-8">{{
                            item.ticketUsedCount > 999 ? '999+' : item.ticketUsedCount
                          }}</span>
                        </div>
                        <SDivLine />
                        <div class="bt-1m">
                          판매<span class="nt-3 ml-8">{{
                            item.ticketTotalCount > 999 ? '999+' : item.ticketTotalCount
                          }}</span>
                        </div>
                        <SDivLine />
                        <div class="bt-1m">
                          판매제한<span class="nt-3 ml-8">{{ item.maxCount > 999 ? '999+' : item.maxCount }}</span>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </section>
          <section data-index="1" class="statistics mb-36">
            <h3 class="mb-24">
              판매 통계
              <SLink :to="`/admin/coffee/manage/${id}/chart`" button-type="transport-b">더보기</SLink>
            </h3>
            <SStatisticsCard
              :statistics-list="statisticsList"
              :is-loading="isStatisticsLoading"
              :is-error="isStatisticsError"
            />
          </section>
          <section data-index="2" class="note mb-36">
            <h3 class="mb-24">
              비고
              <SButton button-type="primary" @click="updateNote">수정</SButton>
            </h3>
            <STextarea v-model="detailData.note" class="mb-24" />
            <h3 class="mb-24">하나1Q정보</h3>
            <div class="info-table">
              <div class="row">
                <label>하나1Q 할인</label>
                <div>{{ isHanaDiscount ? '사용' : '미사용' }}</div>
              </div>
              <div class="row">
                <label>결제 페이지 링크</label>
                <div>{{ isHanaDiscount ? `/hana/hana-pay-entry?id=${detailData.id}&type=coffee` : '-' }}</div>
              </div>
              <div class="row">
                <label>예매 확인 페이지 링크</label>
                <div>{{ isHanaDiscount ? `/hana/hana-list-entry` : '-' }}</div>
              </div>
            </div>
          </section>
          <section data-index="3" class="info mb-36">
            <div>
              <h3 class="mb-16">운영시간 정보</h3>
              <div class="table">
                <label class="bt-1m">운영시간</label>
                <p class="nt-3"><BrConvertText :text="detailData.hour" /></p>
              </div>
            </div>
            <div>
              <h3 class="mb-16">입장권 정보</h3>
              <div class="table">
                <label class="bt-1m">금액</label>
                <p class="nt-3">
                  <span v-for="(item, index) in detailData.prices" :key="item.id">
                    <template v-if="item.discounts && item.discounts[0] && item.discounts[0].enabled">
                      {{ item.type }}: (원가) {{ item.price.toLocaleString() }}원 / (할인가)
                      {{ item.discounts[0].price.toLocaleString() }}원 / (할인비고) {{ item.discounts[0].note }}
                      <br v-if="index + 1 !== detailData.prices.length" />
                    </template>
                    <template v-else-if="item.isEnabled">
                      {{ item.type }}: {{ item.price.toLocaleString() }}원
                      <br v-if="index + 1 !== detailData.prices.length" />
                    </template>
                  </span>
                </p>
              </div>
            </div>
          </section>
          <section data-index="4" class="contents mb-36">
            <h3 class="mb-16">메뉴 콘텐츠</h3>
            <div class="contents-wrap bt-1r">
              <client-only>
                <EditorContentOutput :contents="detailData.contents" />
              </client-only>
            </div>
          </section>
          <section data-index="5">
            <div v-for="group in detailData.writers" :key="group.id" class="artist">
              <h3 class="mb-16">{{ group.name }}</h3>
              <div class="artist-list">
                <div
                  v-for="artist in group.infos"
                  :key="artist.id"
                  class="artist-item"
                  @click="showArtistViewModal(artist)"
                >
                  <img class="mb-12" :src="getImage(artist.thumbnail)" alt="" />
                  <p class="bt-1m">{{ artist.name }}</p>
                </div>
              </div>
            </div>
          </section>
          <section data-index="6">
            <h3 class="mb-16">추가 버튼</h3>
            <div class="info-table">
              <div class="row">
                <label>버튼 명</label>
                <div>{{ detailData.buttonTitle}}</div>
              </div>
              <div class="row">
                <label>버튼 노출 여부</label>
                <div>{{ detailData.isUseButton ? 'Y' : 'N' }}</div>
              </div>
              <div class="row">
                <label>버튼 링크</label>
                <div>{{ detailData.buttonLink }}</div>
              </div>
              <div class="row">
                <label>새창 열기 여부</label>
                <div>{{ detailData.isNewTab ? 'Y' : 'N' }}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div class="right ml-28">
        <nav v-scroll-spy-active v-scroll-spy-link class="side-menu">
          <a class="bt-1b active">회차</a>
          <a class="bt-1b">통계</a>
          <a class="bt-1b">비고</a>
          <a class="bt-1b">운영시간 / 가격</a>
          <a class="bt-1b">메뉴 콘텐츠</a>
          <a v-if="detailData.writers && detailData.writers[0]" class="bt-1b">인원 소개</a>
        </nav>
      </div>
    </div>
    <ArtistViewModal :is-show="isShowViewArtistModal" :selected-artist="selectedArtist" @close="closeArtistViewModal" />
  </div>
</template>

<script>
import SButton from '~/components/admin/commons/SButton.vue';
import SLink from '~/components/admin/commons/SLink.vue';
import STag from '~/components/admin/commons/STag.vue';
import SCalendar from '~/components/admin/commons/SCalendar.vue';
import SDivLine from '~/components/admin/commons/SDivLine.vue';
import SStatisticsCard from '~/components/admin/commons/SStatisticsCard.vue';
import STextarea from '~/components/admin/commons/STextarea.vue';
import { roundsToHashTable } from '~/assets/js/converter';
import ArtistViewModal from '~/components/admin/modal/ArtistViewModal.vue';
import EditorContentOutput from '~/components/common/EditorContentOutput.vue';
import BrConvertText from '~/components/common/BrConvertText.vue';
import { exhibitionPreview } from '~/assets/js/previewConverter';
import { createFormElement } from '~/assets/js/commons';

export default {
  name: 'ExhibitionDetailPage',
  components: {
    BrConvertText,
    EditorContentOutput,
    ArtistViewModal,
    STextarea,
    SStatisticsCard,
    SDivLine,
    SCalendar,
    STag,
    SLink,
    SButton
  },
  layout: 'admin/default',
  async asyncData({ $axios, params, $dayjs }) {
    const { id } = params;
    const detailData = await $axios.$get(`/admin/coffees/${id}`);
    const holidayList = await $axios.$get(`/admin/holidays`, {
      params: {
        startDate: $dayjs(detailData.startDate).format('YYYY-MM-DD'),
        endDate: $dayjs(detailData.endDate).format('YYYY-MM-DD')
      }
    });

    return { id, detailData, holidayList };
  },
  data() {
    return {
      id: null,
      detailData: null,
      holidayList: null,
      selectedRoundDate: this.$dayjs().format('YYYY-MM-DD'),
      statisticsList: [],
      isStatisticsLoading: false,
      isStatisticsError: false,
      selectedArtist: null,
      isShowViewArtistModal: false
    };
  },
  fetchOnServer: false,
  fetch() {
    this.isStatisticsLoading = true;
    this.$axios
      .$get(`/admin/tickets/statistics/dashboard?kind=COFFEE&id=${this.id}`)
      .then((statisticsList) => {
        this.isStatisticsLoading = false;
        this.statisticsList = statisticsList;
      })
      .catch(() => {
        this.isStatisticsError = true;
      });
  },
  computed: {
    computedRoundData() {
      const rounds = this.detailData.rounds;

      return roundsToHashTable(rounds, this.$dayjs);
    },
    isHanaDiscount() {
      let isDiscount = false;

      this.detailData.prices.forEach((price) => {
        if (price.discounts && price.discounts[0] && price.discounts[0].enabled) {
          isDiscount = true;
        }
      });

      return isDiscount;
    },
    currentRoundData() {
      const defaultData = {
        targetDate: this.selectedRoundDate,
        allMaxCount: 0,
        allTicketingCount: 0,
        rounds: [],
        isHasOverbooking: false
      };

      return this.computedRoundData[this.selectedRoundDate] || defaultData;
    }
  },
  created() {
    if (this.detailData.state === 'SCHEDULE' || this.detailData.state === 'BOOKING') {
      this.selectedRoundDate = this.$dayjs(this.detailData.startDate).format('YYYY-MM-DD');
    }
  },
  methods: {
    getImage(image) {
      return image?.resizeImage?.small
        ? `${this.$store.state.BASE_URL}${image.resizeImage?.small}`
        : require('~/assets/img/thumbnail_default.jpg');
    },
    async updateNote() {
      await this.$axios.$put(`/admin/coffees/${this.id}/note`, { data: this.detailData.note });
    },
    onSelectedDate(selectedDate) {
      this.selectedRoundDate = selectedDate;
    },
    showArtistViewModal(artist) {
      this.selectedArtist = artist;
      this.isShowViewArtistModal = true;
    },
    closeArtistViewModal() {
      this.isShowViewArtistModal = false;
      this.selectedArtist = null;
    },
    showPreview() {
      const convertData = { previewData: JSON.stringify(exhibitionPreview(this.detailData)) };
      const $formEl = createFormElement('/coffee/preview', convertData, true);

      document.querySelector('body').append($formEl);
      $formEl.submit();
      $formEl.remove();
    }
  }
};
</script>

<style lang="scss" scoped>
.top-banner {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  border-radius: 0.3rem;
  border-bottom: 1px solid var(--color-grey-2);
  padding-bottom: 2.4rem;

  .bottom {
    display: flex;
    margin-top: 2rem;
  }

  .info {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    padding-right: 4rem;
  }

  .btn-area {
    display: flex;
    align-items: flex-end;
  }

  .nt-4 {
    margin-top: 1.9rem;
  }
}

.basic-info {
  display: flex;

  img {
    height: 24.5rem;
    width: 37.5rem;
    min-width: 37.5rem;
    border-radius: 0.3rem;
    object-fit: cover;
  }

  .info-table {
    flex: 1 1 auto;
    margin-bottom: 0;
  }
}

.round {
  .round-inner {
    display: flex;
    align-items: flex-end;
  }

  .round-wrap {
    flex: 1 1 0;

    > p {
      > span {
        color: rgba(0, 0, 0, 0.4);
      }
    }
  }

  .round-list {
    height: 55.1rem;
    background-color: var(--color-white);
    overflow-y: auto;
    margin-top: 1rem;
    border-radius: 0.3rem;
    border: 1px solid var(--color-grey-2);
  }

  .round-item-empty {
    color: var(--color-grey-3);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 53.7rem;
    width: 100%;
    font-size: 1.6rem;
    font-weight: 500;
  }

  .round-item {
    display: flex;
    border-bottom: 1px solid var(--color-grey-2);
    padding-right: 6.2rem;
    align-items: center;

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

.edit-area {
  display: flex;

  .left {
    flex: 1 1 auto;
  }

  .right {
    position: relative;

    .side-menu {
      display: flex;
      position: sticky;
      flex-direction: column;
      top: 0;
      padding-top: 4.4rem;

      > a {
        display: flex;
        height: 6rem;
        width: 18rem;
        align-items: center;
        justify-content: center;
        background-color: var(--color-white);
        border: 1px solid var(--color-grey-2);
        border-bottom: 0;
        cursor: pointer;

        &.active {
          color: var(--color-white);
          background-color: var(--color-black);
        }

        &:last-child {
          border-bottom: 1px solid var(--color-grey-2);
        }
      }
    }
  }
}

.statistics,
.note {
  h3 {
    position: relative;

    > a,
    > button {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
    }
  }
}

.info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2.8rem;

  > div {
    height: 100%;
    display: flex;
    flex-direction: column;

    .table {
      display: flex;
      flex: 1 1 auto;
      border: 1px solid var(--color-grey-2);
      border-radius: 0.3rem;

      label {
        color: var(--color-grey-4);
        flex: 1 0 10rem;
        display: flex;
        justify-content: center;
        min-height: 10.2rem;
        max-width: 10rem;
        padding-top: 1.8rem;
        background-color: #fafafa;
        border-right: 1px solid var(--color-grey-2);
      }

      p {
        flex: 1 1 0;
        background-color: var(--color-white);
        padding: 1.8rem 2rem;
      }
    }
  }
}

.contents {
  .contents-wrap {
    width: 100%;
    border-radius: 0.3rem;
    padding: 1.2rem 1.6rem;
    border: 1px solid var(--color-grey-2);
    background-color: var(--color-white);
    min-height: 25.6rem;

    > p.bt-1r {
      max-width: 100%;
    }
  }
}

.artist {
  margin-bottom: 3.6rem;

  .artist-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: 2rem;
    row-gap: 3rem;

    .artist-item {
      cursor: pointer;
      transition: 0.1s all ease-in-out;

      &:hover {
        transform: scale(0.97);
      }
    }

    img {
      aspect-ratio: 309 / 197;
      width: 100%;
      border-radius: 0.3rem;
      object-fit: cover;
    }
  }
}
</style>
