<template>
  <div>
    <div class="top-menu mb-17">
      <div class="title-area">
        <h1>
          {{ detailData?.title }}
        </h1>
        <h2>{{ detailData?.subtitle }}</h2>
      </div>
      <div class="bottom-menus">
        <SLink :to="baseUrl" class="mr-8">리스트</SLink>
        <SButton class="mr-8" @click="modal.isRemove = true">삭제</SButton>
        <SLink :to="`${baseUrl}/edit/${$route.params.id}`" button-type="primary">수정</SLink>
      </div>
    </div>
    <div class="info-table">
      <div class="row">
        <label>최초 등록일시</label>
        <div>{{ $dayjs(detailData?.createdDate).format('YYYY-MM-DD HH:mm') }}</div>
        <label>등록자</label>
        <div>{{ detailData?.createdName }}</div>
      </div>
      <div class="row">
        <label>최종 수정일시</label>
        <div>{{ $dayjs(detailData?.lastModifiedDate).format('YYYY-MM-DD HH:mm') }}</div>
        <label>수정자</label>
        <div>{{ detailData?.lastModifiedName }}</div>
      </div>
    </div>
    <div class="contents-info mb-36">
      <div class="representative-img mr-28">
        <img :src="getThumbnailImage(detailData?.thumbnail)" alt="테스트" />
      </div>
      <div class="info-table">
        <div class="row">
          <label>일정</label>
          <div>
            <span>{{ $dayjs(detailData?.startDate).format('YYYY-MM-DD') }}</span> ~
            <span> {{ $dayjs(detailData?.endDate).format('YYYY-MM-DD') }}</span>
          </div>
        </div>
        <div class="row">
          <label>전시홀</label>
          <div>{{ getHalls(detailData?.halls) }}</div>
        </div>
        <div class="row">
          <label>노출 여부</label>
          <div>{{ detailData?.isEnabled ? '노출' : '미노출' }}</div>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="list-top mb-16">
        <h3>도슨트</h3>
        <SDropdown v-model="queryOptions.size" :option-list="optionList" @change="onSelectSizeChange"
          >리스트 수:</SDropdown
        >
      </div>
      <SPageable :table-data="docentData">
        <template #data="{ data }">
          <table class="admin-table">
            <thead>
              <tr>
                <th>No</th>
                <th>썸네일</th>
                <th>작품명</th>
                <th>작가명</th>
                <th>소개글</th>
                <th>오디오</th>
                <th>지도</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!data || !data[0]">
                <td colspan="100%"><div>리스트가 없습니다.</div></td>
              </tr>
              <tr v-for="(item, index) in data" :key="item.id" @click="openDocentModal(index)">
                <td>
                  <div>{{ docentData.startCount - index }}</div>
                </td>
                <td>
                  <div class="img">
                    <img :src="getImage(item.thumbnail?.resizeImage?.small)" alt="테스트" />
                  </div>
                </td>
                <td>
                  <div class="text-left">{{ item.title }}</div>
                </td>
                <td>
                  <div class="text-left">{{ item.writer }}</div>
                </td>
                <td>
                  <div class="intro text-left">{{ item.intro }}</div>
                </td>
                <td>
                  <div>{{ item.audio ? 'Y' : 'N' }}</div>
                </td>
                <td>
                  <div>{{ item.map ? 'Y' : 'N' }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </SPageable>
    </div>
    <SDialogModal :is-show="modal.isRemove" @close="modal.isRemove = false">
      <template #content>콘텐츠를 삭제하시겠습니까?</template>
      <template #modal-btn1>
        <SButton @click="modal.isRemove = false">취소</SButton>
      </template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="onDeletePost">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isRemoveConfirm" @close="$router.push(`${baseUrl}`)">
      <template #content>콘텐츠가 삭제되었습니다.</template>
      <template #modal-btn1>
        <SLink button-type="primary" :to="baseUrl">확인</SLink>
      </template>
    </SDialogModal>
    <DocentModal :is-show="modal.isDocent" :docent-data="selectedDocentData" @close="modal.isDocent = false" />
  </div>
</template>

<script>
import SButton from '~/components/admin/commons/SButton';
import SLink from '~/components/admin/commons/SLink';
import SDropdown from '~/components/admin/commons/SDropdown';
import SPageable from '~/components/admin/commons/SPageable';
import SDialogModal from '~/components/admin/modal/SDialogModal';
import DocentModal from '~/components/admin/modal/DocentModal';

export default {
  name: 'DetailPage',
  components: { DocentModal, SDialogModal, SPageable, SDropdown, SLink, SButton },
  layout: 'admin/default',
  asyncData({ params }) {
    const { id } = params;

    return { id };
  },
  data() {
    return {
      id: null,
      detailData: null,
      docentData: null,
      baseUrl: '/admin/common/docent',
      modal: {
        isRemove: false,
        isDocent: false,
        isRemoveConfirm: false
      },
      selectedDocentIndex: null,
      optionList: [
        { value: 20, label: '20개' },
        { value: 30, label: '30개' },
        { value: 50, label: '50개' }
      ],
      queryOptions: {
        page: this.$route.query.page || 0,
        size: Number(this.$route.query.size) || 20
      }
    };
  },
  async fetch() {
    this.$router
      .replace({
        path: this.$route.path,
        query: this.queryOptions
      })
      .catch(() => {});
    this.detailData = await this.$axios.$get(`/admin/docents/${this.id}`);
    this.docentData = await this.$axios.$get(`/admin/docents/${this.id}/infos`, { params: this.queryOptions });

    this.docentData.startCount = this.docentData.totalElements - this.docentData.number * this.docentData.size;
  },
  computed: {
    selectedDocentData() {
      const selectedDocentIndex = this.selectedDocentIndex;
      return selectedDocentIndex != null ? this.docentData.content[selectedDocentIndex] : null;
    }
  },
  methods: {
    getThumbnailImage(image) {
      return image?.resizeImage?.small
        ? `${this.$store.state.BASE_URL}${image.resizeImage?.small}`
        : require('~/assets/img/thumbnail_default.jpg');
    },
    getImage(imageUrl) {
      return imageUrl ? this.$store.state.BASE_URL + imageUrl : require('~/assets/img/thumbnail_default.jpg');
    },
    openDocentModal(index) {
      this.selectedDocentIndex = index;
      this.modal.isDocent = true;
    },
    getHalls(hall) {
      return hall ? hall.map((item) => `${item}홀`).join(', ') : null;
    },
    onSelectSizeChange() {
      if (!this.$fetchState.pending) {
        this.$fetch();
      }
    },
    onDeletePost() {
      this.$axios.$delete(`/admin/docents/${this.id}`);
      this.modal.isRemoveConfirm = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.top-menu {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .title-area {
    width: 100%;
    h1 {
      span {
        display: block;
      }
    }
  }
  .bottom-menus {
    display: flex;
    align-items: center;
    margin-left: auto;
  }
}

.contents-info {
  display: flex;
  align-items: flex-start;

  .representative-img {
    flex: 1 1 56rem;
    img {
      width: 100%;
      height: 35.8rem;
      border-radius: 0.3rem;
      object-fit: cover;
      object-position: center;
      background-color: #d9d9d9;
    }
  }

  .info-table {
    flex: 1 1 calc(100% - 58.8rem);
  }
}

.list {
  .list-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .admin-table {
    th {
      &:first-of-type {
        width: 4%;
      }
      &:nth-of-type(2) {
        width: 11%;
      }
      &:nth-of-type(3) {
        width: 20%;
      }
      &:nth-of-type(4) {
        width: 15%;
      }
      &:nth-of-type(5) {
        width: 40%;
      }
      &:nth-of-type(6) {
        width: 5%;
      }
      &:last-of-type {
        width: 5%;
      }
    }
    td {
      div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &.intro {
          display: -webkit-box;
          padding: 0 1.2rem;
          white-space: unset;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
}
</style>
