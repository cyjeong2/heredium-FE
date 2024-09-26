<template>
  <div>
    <h1 class="mb-17">{{ detailData.title }}</h1>
    <div class="info-table">
      <div class="row">
        <label>등록일시</label>
        <div>{{ $dayjs(detailData.createdDate).format('YYYY-MM-DD HH:mm') }}</div>
        <label>등록자</label>
        <div>{{ detailData.createdName }}</div>
      </div>
      <div class="row">
        <label>수정일시</label>
        <div>{{ $dayjs(detailData.lastModifiedDate).format('YYYY-MM-DD HH:mm') }}</div>
        <label>수정자</label>
        <div>{{ detailData.lastModifiedName }}</div>
      </div>
    </div>
    <div class="contents-info mb-36">
      <div class="representative-img mr-28">
        <img :src="getThumbnailImage(detailData?.thumbnail)" alt="테스트" />
      </div>
      <div class="info-table">
        <div class="row">
          <label>진행기간</label>
          <div>
            <span>{{ $dayjs(detailData.startDate).format('YYYY-MM-DD') }}</span> ~
            <span>{{ $dayjs(detailData.endDate).format('YYYY-MM-DD') }}</span>
          </div>
        </div>
        <div class="row">
          <label>노출상태</label>
          <div>{{ detailData.isEnabled ? '노출' : '미노출' }}</div>
        </div>
      </div>
    </div>
    <div class="contents">
      <EditorContentOutput :contents="detailData.contents" />
    </div>
    <div v-if="detailData.files && detailData.files[0]" class="file-list">
      <div class="file-top"><h3>첨부파일</h3></div>
      <div v-for="item in detailData.files" :key="item" class="file-view">
        <a
          :href="`${$axios.defaults.baseURL}/file/download?path=${item.savedFileName}&fileName=${item.originalFileName}`"
          download
          class="file"
        >
          <i class="ic-download" />
          <span class="nt-4">{{ item.originalFileName }}</span>
        </a>
        <p class="nt-4">{{ convertFileSize(item.fileSize) }}</p>
      </div>
    </div>
    <div class="bottom-menus">
      <SButton @click="$router.go(-1)">리스트</SButton>
      <div class="right">
        <SButton class="mr-8" @click="modal.isLegacy = true">삭제</SButton>
        <SButton class="mr-8" @click="showPreview">미리보기</SButton>
        <SLink :to="`${baseUrl}/edit/${$route.params.id}`" button-type="primary">수정</SLink>
      </div>
    </div>
    <SDialogModal :is-show="modal.isLegacy" @close="modal.isLegacy = false">
      <template #content>콘텐츠를 삭제하시겠습니까?</template>
      <template #modal-btn1>
        <SButton @click="modal.isLegacy = false">취소</SButton>
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
  </div>
</template>

<script>
import SButton from '~/components/admin/commons/SButton';
import SLink from '~/components/admin/commons/SLink';
import SDialogModal from '~/components/admin/modal/SDialogModal';
import { createFormElement, getFileSize } from '~/assets/js/commons';
import EditorContentOutput from '~/components/common/EditorContentOutput.vue';
import { eventPreview } from '~/assets/js/previewConverter';
export default {
  name: 'EditPage',
  components: { EditorContentOutput, SLink, SButton, SDialogModal },
  layout: 'admin/default',
  async asyncData({ params, $axios }) {
    const { id } = params;
    const detailData = await $axios.$get(`/admin/events/${id}`);
    return { id, detailData };
  },
  data() {
    return {
      baseUrl: '/admin/site/event',
      id: null,
      modal: {
        isLegacy: false,
        isRemoveConfirm: false
      },
      detailData: {}
    };
  },
  methods: {
    getThumbnailImage(image) {
      return image?.resizeImage?.small
        ? `${this.$store.state.BASE_URL}${image.resizeImage?.small}`
        : require('~/assets/img/thumbnail_default.jpg');
    },
    convertFileSize(fileSize) {
      return getFileSize(fileSize);
    },
    onDeletePost() {
      this.$axios.$delete(`/admin/events/${this.id}`);
      this.modal.isRemoveConfirm = true;
    },
    showPreview() {
      const convertData = { previewData: JSON.stringify(eventPreview(this.detailData)) };
      const $formEl = createFormElement('/event/preview', convertData, true);

      document.querySelector('body').append($formEl);
      $formEl.submit();
      $formEl.remove();
    }
  }
};
</script>

<style lang="scss" scoped>
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

.contents {
  min-height: 40rem;
  background-color: var(--color-white);
  border-radius: 0.3rem;
  border: 1px solid var(--color-grey-2);
  padding: 1.2rem 1.6rem;
}

.file-list {
  margin-top: 3.6rem;
  border: 0.1rem solid var(--color-grey-2);
  background-color: var(--color-white);
  .file-top {
    display: flex;
    align-items: center;
    height: 6.2rem;
    padding: 1.75rem 2.4rem;
    background: var(--color-black);
    border-radius: 0.3rem 0.3rem 0 0;

    h3 {
      color: var(--color-white);
    }
  }

  .file-view {
    display: flex;
    justify-content: space-between;
    height: 5.2rem;
    padding: 1.2rem 2.4rem;

    & + .file-view {
      border-top: 0.1rem solid var(--color-grey-2);
    }

    .file {
      display: flex;
      align-items: center;
      i {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.8rem;
        height: 2.8rem;
        margin-right: 1.2rem;
        background: #ffffff;
        border: 0.1rem solid #ababab;
        border-radius: 0.3rem;
        font-size: 2.4rem;
      }
    }

    p.nt-4 {
      color: var(--color-grey-3);
    }
  }
}

.bottom-menus {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2.4rem;
  padding-top: 2.4rem;
  border-top: 1px solid var(--color-grey-2);

  .right {
    display: flex;
  }
}
</style>
