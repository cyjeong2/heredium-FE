<template>
  <div v-if="detailData">
    <h1 class="mb-17">
      <b v-if="pageType === 'NOTICE' && detailData.isNotice">{{ detailData.isNotice ? '[공지]' : '' }}</b
      >{{ detailData.title }}
    </h1>
    <div class="info-table">
      <div class="row">
        <label>게시일</label>
        <div>{{ detailData.postDate }}</div>
        <label>노출상태</label>
        <div>{{ detailData.isEnabled ? '노출' : '미노출' }}</div>
      </div>
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
    <div class="contents">
      <EditorContentOutput :contents="detailData.contents" />
    </div>
    <div v-if="detailData.files && detailData.files[0]" class="file-list">
      <div class="file-top"><h3>첨부파일</h3></div>
      <div v-for="(item, index) in detailData.files" :key="index" class="file-view">
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
      <SLink :to="baseUrl">리스트</SLink>
      <div class="right">
        <SButton class="mr-8" @click="modal.isRemove = true">삭제</SButton>
        <SButton class="mr-8" @click="showPreview">미리보기</SButton>
        <SLink :to="`${baseUrl}/edit/${$route.params.id}`" button-type="primary">수정</SLink>
      </div>
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
  </div>
</template>

<script>
import SLink from '~/components/admin/commons/SLink';
import SButton from '~/components/admin/commons/SButton';
import { createFormElement, getFileSize } from '~/assets/js/commons';
import SDialogModal from '~/components/admin/modal/SDialogModal';
import EditorContentOutput from '~/components/common/EditorContentOutput.vue';
import { noticePreview, termsPreview } from '~/assets/js/previewConverter';

export default {
  name: 'TermsDetail',
  components: { EditorContentOutput, SDialogModal, SButton, SLink },
  props: {
    pageType: {
      type: String,
      required: false,
      default: 'privacy'
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
    }
  },
  data() {
    return {
      state: false,
      titleText: '',
      baseUrl: '',
      modal: {
        isRemove: false,
        isRemoveConfirm: false
      }
    };
  },
  created() {
    let titleText = '';
    let baseUrl = '';
    let state = '';

    switch (this.pageType) {
      case 'PRIVACY':
        titleText = '개인정보처리방침';
        baseUrl = '/admin/terms/privacy';
        state = '진행';
        break;
      case 'AGREE':
        titleText = '개인정보 수집 및 이용 동의서';
        baseUrl = '/admin/terms/agree';
        state = '진행';
        break;
      case 'SERVICE':
        titleText = '서비스 이용약관';
        baseUrl = '/admin/terms/service';
        state = '진행';
        break;
      case 'REFUND':
        titleText = '취소 및 환불약관';
        baseUrl = '/admin/terms/refund';
        state = '진행';
        break;
      case 'VIDEO':
        titleText = '영상정보처리기기 운영 관리방침';
        baseUrl = '/admin/terms/video';
        state = '진행';
        break;
      case 'NOTICE':
        titleText = '공지사항';
        baseUrl = '/admin/site/notice';
        state = '공지';
        break;
      case 'MARKETING':
        titleText = '마케팅 활용 동의 및 광고 수신';
        baseUrl = '/admin/terms/marketing';
        state = '진행';
        break;
      default:
        titleText = '올바르지 않은 페이지 타입';
        break;
    }

    this.titleText = titleText;
    this.baseUrl = baseUrl;
    this.state = state;
  },
  methods: {
    convertFileSize(fileSize) {
      return getFileSize(fileSize);
    },
    onDeletePost() {
      const middleUrl = this.pageType === 'NOTICE' ? 'notices' : 'policies';

      this.$axios.$delete(`/admin/${middleUrl}/${this.id}`);
      this.modal.isRemoveConfirm = true;
    },
    showPreview() {
      let $formEl;

      if (this.pageType === 'NOTICE') {
        const convertData = { previewData: JSON.stringify(noticePreview(this.detailData)) };

        $formEl = createFormElement('/community/notice/preview', convertData, true);
      } else {
        const convertData = { previewData: JSON.stringify(termsPreview(this.detailData)) };

        $formEl = createFormElement(`/terms/${this.pageType.toLowerCase()}`, convertData, true);
      }

      document.querySelector('body').append($formEl);
      $formEl.submit();
      $formEl.remove();
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  b {
    color: var(--color-blue);
    margin-right: 2rem;
  }
}

h4 {
  display: flex;
  align-items: center;
  padding-bottom: 1.9rem;
  border-bottom: 1px solid var(--color-grey-2);
}

.contents {
  min-height: 40rem;
  background-color: var(--color-white);
  border-radius: 0.3rem;
  border: 1px solid var(--color-grey-2);
  padding: 1.6rem;
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
