<template>
  <div>
    <div class="container">
      <h1>{{ detailData.title }}</h1>
      <h2>{{ detailData.subtitle }}</h2>
      <div class="plan">
        <div class="base-info">
          <UTag v-if="detailData.state !== 'TERMINATION'" :type="detailData.state" />
          <span class="date">
            {{ getFormattedDate(detailData.startDate, detailData.endDate) }}
          </span>
        </div>
        <div class="only-pc-flex">
          <UButton
            class="reservation-btn"
            :disabled="detailData.state !== 'BOOKING' && detailData.state !== 'PROGRESS'"
            @click="goTicketingPage"
          >
            {{ type === 'COFFEE' ? '주문하러 가기' : '예매하기' }}
          </UButton>
          <button type="button" class="share-btn" @click="modal.isShare = true">
            <i class="pc uic-share" />
          </button>
        </div>
      </div>
    </div>
    <div v-if="detailData.detailImage" class="thumb-area">
      <p v-if="detailData.state === 'SCHEDULE'" class="alert">
        <span class="container">
          <i class="pc uic-notice" />
          {{ $dayjs(detailData.bookingDate).format('YYYY년 MM월 DD일') }}부터 입장권 예매할 수 있습니다.
        </span>
      </p>
      <img :src="`${$store.state.BASE_URL}${detailData.detailImage.resizeImage?.large}`" alt="" />
    </div>
    <div v-else class="no-thumb-area" />
    <div v-if="isEnDetail" class="container" style="margin-bottom: 8rem"><ULangTab v-model="lang" /></div>
    <div v-if="detailData.contents" class="container content">
      <template v-if="lang === 'ko'">
        <h3>{{ type === 'EXHIBITION' ? '전시' : type === 'PROGRAM' ? '프로그램' : '커피' }} 소개</h3>
      </template>
      <template v-else>
        <h3>{{ type === 'EXHIBITION' ? 'Exhibition' : type === 'PROGRAM' ? 'Program' : 'Coffee' }} Introduction</h3>
      </template>
      <div v-if="isEnDetail">
        <template v-if="lang === 'ko'">
          <img src="~/assets/img/special_lang_ex/ko1.png" alt="" />
          <img src="~/assets/img/special_lang_ex/ko2.png" alt="" />
          <img src="~/assets/img/special_lang_ex/ko3.png" alt="" />
          <img src="~/assets/img/special_lang_ex/ko4.png" alt="" />
          <img src="~/assets/img/special_lang_ex/ko5.png" alt="" />
        </template>
        <template v-else>
          <img src="~/assets/img/special_lang_ex/en1.png" alt="" />
          <img src="~/assets/img/special_lang_ex/en2.png" alt="" />
          <img src="~/assets/img/special_lang_ex/en3.png" alt="" />
          <img src="~/assets/img/special_lang_ex/en4.png" alt="" />
        </template>
      </div>
      <EditorContentOutput v-else :contents="detailData.contents" />
    </div>
    <div class="container">
      <template v-for="(group, groupIndex) in detailData.writers">
        <div v-if="group.infos && group.infos[0]" :key="group.id" class="artist">
          <h3>{{ group.name }}</h3>
          <div class="artist-wrap">
            <div
              v-for="(artist, artistIndex) in group.infos"
              :key="artist.id"
              class="artist-item"
              @click="showArtistDetailModal(groupIndex, artistIndex)"
            >
              <div class="img-wrap">
                <img :src="getImage(artist.thumbnail)" alt="" />
              </div>
              <p>{{ artist.name }}</p>
            </div>
          </div>
        </div>
      </template>
      <div class="guide">
        <h3>{{ lang === 'ko' ? '이용안내' : 'Visitor Information' }}</h3>
        <div class="guide-container">
          <div class="guide-wrap">
            <h4>
              <i class="pc uic-open_hours" />
              운영시간 정보
            </h4>
            <div class="content-text"><BrConvertText :text="detailData.hour" /></div>
          </div>
          <div class="guide-wrap">
            <h4>
              <i class="pc uic-ticket" />
              {{ type === 'COFFEE' ? '메뉴 정보' : '입장권 정보' }}
            </h4>
            <div class="content-text">
              <template v-for="ticket in detailData.prices">
                <p :key="ticket.id">{{ ticket.type }} {{ ticket.price.toLocaleString() }}원</p>
              </template>
            </div>
          </div>
          <div class="guide-wrap grid-span-2">
            <h4>
              <i class="pc uic-info" />
              이용안내
            </h4>
            <ul class="content-text bullet">
              <li>미술관에는 외부 음식물을 가지고 들어가실 수 없습니다.</li>
              <li>안내견을 제외한 반려동물은 입장할 수 없습니다.</li>
              <li>상업적 용도나 플래시를 사용하는 과도한 촬영은 자제 바랍니다.</li>
              <li>14세 미만 어린이는 반드시 보호자의 손을 잡고 관람 바랍니다.</li>
              <li>
                본 전시는 안전선이 따로 구비되어있지 않습니다. 전시 작품이나 시설물이 훼손되지 않게 조심해서
                관람해주세요.
              </li>
              <li>모든 가방류는 반입 불가합니다. 개인 차량 또는 물품 보관소에 꼭 보관해주시기 바랍니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-bottom only-mobile">
      <UButton
        class="reservation-btn"
        :disabled="detailData.state !== 'BOOKING' && detailData.state !== 'PROGRESS'"
        @click="goTicketingPage"
      >
        {{ type === 'COFFEE' ? '주문하러 가기' : '예매하기' }}
      </UButton>
      <button type="button" class="share-btn" @click="modal.isShare = true">
        <i class="pc uic-share" />
      </button>
    </div>
    <UArtistModal
      :is-show="modal.isArtist"
      :group-data="detailData.writers[selectedGroupIndex]"
      :init-artist-index="selectedArtistIndex"
      @close="modal.isArtist = false"
    />
    <UShareModal
      :is-show="modal.isShare"
      :info="{
        imgUrl: getImage(detailData?.thumbnail),
        title: detailData.title,
        subTitle: detailData.subTitle,
        date: `${$dayjs(detailData.startDate).format('YYYY-MM-DD')} ~ ${$dayjs(detailData.endDate).format(
          'YYYY-MM-DD'
        )}`
      }"
      @close="modal.isShare = false"
    />
  </div>
</template>

<script>
import UTag from '~/components/user/common/UTag';
import UShareModal from '~/components/user/modal/UShareModal';
import UButton from '~/components/user/common/UButton';
import UArtistModal from '~/components/user/modal/UArtistModal';
import EditorContentOutput from '~/components/common/EditorContentOutput.vue';
import BrConvertText from '~/components/common/BrConvertText.vue';
import { getDateCommonDateOutput } from '~/assets/js/commons';
import ULangTab from '~/components/user/common/ULangTab.vue';

export default {
  name: 'IntegratedDetail',
  components: { ULangTab, BrConvertText, EditorContentOutput, UArtistModal, UButton, UShareModal, UTag },
  props: {
    // EXHIBITION | PROGRAM | COFFEE
    type: {
      type: String,
      required: false,
      default: ''
    },
    detailData: {
      type: Object,
      required: false,
      default: () => ({
        id: null,
        thumbnail: null,
        title: '',
        subtitle: '',
        state: 'PROGRESS', //  SCHEDULE | BOOKING | PROGRESS | TERMINATION
        startDate: this.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
        endDate: this.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
        bookingDate: this.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
        hour: '',
        contents: '', // html content
        prices: [
          { id: null, type: '성인', price: 0 },
          { id: null, type: '청소년', price: 0 },
          { id: null, type: '유아 및 어린이', price: 0 }
        ],
        writers: [{ id: null, name: '', infos: [] }]
      })
    }
  },
  data() {
    return {
      modal: { isShare: false, isArtist: false },
      selectedGroupIndex: 0,
      selectedArtistIndex: 0,
      lang: 'ko'
    };
  },
  computed: {
    isEnDetail() {
      const targetId = process.env.EN_EXHIBITION_ID;

      return this.type === 'EXHIBITION' && targetId === `${this.detailData.id}`;
    }
  },
  mounted() {
    this.$store.commit('setIsHasBottomMenu', true);
  },
  beforeDestroy() {
    this.$store.commit('setIsHasBottomMenu', false);
  },
  methods: {
    getFormattedDate(startDate, endDate) {
      return getDateCommonDateOutput(startDate, endDate);
    },
    getImage(image) {
      return image
        ? `${this.$store.state.BASE_URL}${image.savedFileName}`
        : require('~/assets/img/thumbnail_default.jpg');
    },
    showArtistDetailModal(groupIndex, artistIndex) {
      this.selectedGroupIndex = groupIndex;
      this.selectedArtistIndex = artistIndex;
      this.modal.isArtist = true;
    },
    goTicketingPage() {
      this.$router.push(`/ticketing/${this.type.toLowerCase()}/${this.detailData.id}`);
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  font-style: normal;
  font-weight: 700;
  font-size: 2.4rem;
  line-height: 160%;
  letter-spacing: -1px;
  margin-top: 3.2rem;
  margin-bottom: 1.2rem;
}

h2 {
  font-weight: 500;
  font-size: 1.6rem;
  line-height: 160%;
  margin-bottom: 2.8rem;
}

h3 {
  font-weight: 700;
  font-size: 2rem;
  line-height: 100%;
  border-top: 1px solid var(--color-black);
  padding-top: 2rem;
  margin-bottom: 2.8rem;
}

.plan {
  display: flex;
  align-items: center;
  margin-bottom: 2.8rem;

  .base-info {
    display: flex;
    align-items: center;
  }

  .status-tag {
    margin-right: 1.2rem;
  }

  .date {
    font-weight: 500;
    font-size: 14px;
    line-height: 100%;
  }
}

.thumb-area {
  margin-bottom: 4rem;

  .alert {
    color: var(--color-white);
    height: 5.2rem;
    width: 100%;
    background-color: var(--color-u-primary);
    font-weight: 600;
    font-size: 1.4rem;
    line-height: 100%;

    .container {
      display: flex;
      height: 100%;
      padding: 0 1.5rem;
      align-items: center;
    }

    i {
      margin-right: 1.2rem;
      font-size: 2rem;
    }
  }

  img {
    max-height: 24.5rem;
    width: 100%;
    object-fit: contain;
  }
}

.content {
  margin-bottom: 4rem;
}

.artist-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1.6rem;
  row-gap: 2rem;
  margin-bottom: 4rem;

  .artist-item {
    p {
      font-weight: 500;
      padding: 0.6rem 0;
      word-break: keep-all;
    }

    .img-wrap {
      aspect-ratio: 1/1;
      margin-bottom: 0.8rem;
      width: 100%;
    }

    img {
      aspect-ratio: 1/1;
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
}

.guide {
  margin-bottom: 12rem;

  .guide-wrap {
    margin-bottom: 2.6rem;

    h4 {
      display: flex;
      flex-direction: column;
      font-weight: 700;
      font-size: 1.6rem;
      line-height: 100%;
      margin-bottom: 1.6rem;

      i {
        font-size: 2.8rem;
        margin-bottom: 1.4rem;
      }
    }

    .content-text {
      color: var(--color-u-grey-4);
      font-weight: 500;
      line-height: 160%;

      &.bullet li {
        margin-bottom: 0.8rem;
      }

      &.bullet li:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.fixed-bottom {
  z-index: 1;
  position: fixed;
  display: flex;
  left: 0;
  bottom: 0;
  width: 100vw;
  padding: 1.4rem 2rem;
  border-top: 1px solid var(--color-u-grey-1);
  background-color: var(--color-white);
  align-items: center;
}

.reservation-btn {
  font-size: 2rem;
  flex: 1 0 0;
  margin-right: 1.6rem;

  &:disabled {
    color: var(--color-u-grey-2);
    background-color: var(--color-u-grey-1);
    border: 0;
  }
}

.share-btn {
  display: flex;
  color: var(--color-u-primary);
  border: 1px solid var(--color-u-primary);
  height: 4.4rem;
  width: 4.4rem;
  align-items: center;
  justify-content: center;

  i {
    font-size: 2.8rem;
  }
}

@media screen and (min-width: 769px) {
  h1 {
    font-weight: 600;
    font-size: 4.2rem;
    line-height: 150%;
    margin-top: 4.8rem;
    margin-bottom: 2rem;
  }

  h2 {
    font-weight: 500;
    font-size: 2.4rem;
    line-height: 150%;
    margin-bottom: 7.7rem;
  }

  h3 {
    border-top: 1px solid var(--color-black);
    padding-top: 2rem;
    margin-bottom: 2.8rem;
    font-weight: 600;
    font-size: 3.6rem;
    line-height: 150%;
  }

  .plan {
    justify-content: space-between;
    margin-bottom: 3.6rem;

    .status-tag {
      margin-right: 2rem;
    }

    .date {
      font-weight: 500;
      font-size: 1.6rem;
      line-height: 160%;
    }
  }

  .reservation-btn {
    flex: 1 0 0;
    width: 21rem !important;

    &:disabled {
      color: var(--color-u-grey-2);
      background-color: var(--color-u-grey-1);
      border: 0;
    }
  }

  .share-btn {
    height: 5.2rem;
    width: 5.2rem;

    i {
      font-size: 3.2rem;
    }
  }

  .thumb-area {
    margin-bottom: 8rem;

    .alert {
      color: var(--color-white);
      display: flex;
      height: 8rem;
      width: 100%;
      align-items: center;
      padding: 0;
      font-weight: 600;
      font-size: 1.8rem;
      line-height: 160%;
      margin: 0 auto;

      i {
        margin-right: 1.2rem;
        font-size: 2.8rem;
      }
    }

    img {
      max-height: 80rem;
      width: 100%;
      object-fit: contain;
    }
  }

  .no-thumb-area {
    height: 1px;
    background-color: var(--color-black);
    margin-bottom: 8rem;
  }

  .content {
    display: flex;
    > h3 {
      width: 34.0176%;
      padding-top: 0;
      padding-right: 3.2rem;
      margin: 0;
      border-top: 0;
    }

    > div {
      width: 65.9824%;
      margin-left: auto;
    }
  }

  .artist {
    display: flex;
    margin-bottom: 8rem;
    padding-top: 3.2rem;
    border-top: 1px solid var(--color-black);

    h3 {
      width: 34.0176%;
      padding-top: 0;
      padding-right: 3.2rem;
      margin: 0;
      border-top: 0;
    }

    .artist-wrap {
      flex: 1 0 0;
      grid-template-columns: repeat(4, 1fr);
      column-gap: 2.8rem;
      row-gap: 4rem;
      margin-bottom: 0;

      .artist-item {
        cursor: pointer;

        p {
          font-weight: 500;
          font-size: 1.6rem;
          line-height: 160%;
          padding: 0;
        }

        .img-wrap {
          margin-bottom: 1.2rem;
          overflow: hidden;
        }

        img {
          transition: 0.4s all ease-in-out;
        }

        &:hover img {
          transform: scale(1.1);
        }
      }
    }
  }

  .guide {
    display: flex;
    margin-bottom: 12rem;
    padding-top: 3.2rem;
    border-top: 1px solid var(--color-black);

    h3 {
      width: 34.0176%;
      padding-top: 0;
      padding-right: 3.2rem;
      margin: 0;
      border-top: 0;
    }

    .guide-container {
      flex: 1 0 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 3.2rem;
      row-gap: 5.2rem;

      .guide-wrap {
        margin-bottom: 2.6rem;

        h4 {
          flex-direction: row;
          font-weight: 700;
          font-size: 1.8rem;
          line-height: 160%;
          margin-bottom: 2rem;
          align-items: center;

          i {
            font-size: 3.2rem;
            margin-right: 1.1rem;
            margin-bottom: 0;
          }
        }

        .content {
          color: var(--color-u-grey-4);
          font-weight: 500;
          line-height: 160%;
          margin-bottom: 0;
          padding-left: 4.3rem;
          font-size: 1.6rem;

          &.bullet li {
            font-size: 1.6rem;
            margin-bottom: 0.8rem;
          }
        }

        &.grid-span-2 {
          grid-column: 1 / span 2;
        }
      }
    }
  }
}
</style>
